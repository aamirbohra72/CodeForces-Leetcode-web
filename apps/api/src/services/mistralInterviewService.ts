import { z } from 'zod';

const MISTRAL_API_BASE = 'https://api.mistral.ai/v1';

const turnGradeSchema = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string(),
  keyPointsMissing: z.array(z.string()).optional(),
});

const adaptiveTurnSchema = turnGradeSchema.extend({
  nextQuestion: z.string().min(1).nullable(),
});

const finalReportSchema = z.object({
  verdict: z.enum(['SELECT', 'REJECT', 'BORDERLINE']),
  overallScore: z.number().min(0).max(100),
  dimensions: z.record(z.string(), z.number()).optional(),
  weakTopics: z.array(z.string()),
  improvementPlan: z.array(z.string()),
  strengths: z.array(z.string()),
  detailedMarkdown: z.string(),
});

export type TurnGrade = z.infer<typeof turnGradeSchema>;
export type AdaptiveTurn = z.infer<typeof adaptiveTurnSchema>;
export type FinalReport = z.infer<typeof finalReportSchema>;

function getApiKey(): string {
  const key = process.env.MISTRAL_API_KEY?.trim();
  if (!key) {
    throw new Error('MISTRAL_API_KEY is not configured');
  }
  return key;
}

function chatModel(): string {
  return process.env.MISTRAL_CHAT_MODEL?.trim() || 'mistral-small-latest';
}

function transcribeModel(): string {
  return process.env.MISTRAL_TRANSCRIBE_MODEL?.trim() || 'voxtral-mini-latest';
}

function extractJsonObject(raw: string): string {
  const t = raw.trim();
  const m = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (m) return m[1].trim();
  return t;
}

function parseJson<T>(raw: string, schema: z.ZodType<T>): T {
  const text = extractJsonObject(raw);
  const parsed: unknown = JSON.parse(text);
  return schema.parse(parsed);
}

type MistralChatResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
  message?: string;
};

export async function mistralChatJson(system: string, user: string): Promise<string> {
  const apiKey = getApiKey();
  const body: Record<string, unknown> = {
    model: chatModel(),
    temperature: 0.3,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    response_format: { type: 'json_object' },
  };

  let res = await fetch(`${MISTRAL_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  let data = (await res.json()) as MistralChatResponse & { error?: { message?: string } };

  if (!res.ok && data.error?.message?.toLowerCase().includes('response_format')) {
    delete body.response_format;
    res = await fetch(`${MISTRAL_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    data = (await res.json()) as MistralChatResponse & { error?: { message?: string } };
  }

  if (!res.ok) {
    throw new Error(data.error?.message || data.message || `Mistral chat error (${res.status})`);
  }

  const raw = data.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== 'string') {
    throw new Error('Empty chat response from Mistral');
  }
  return raw;
}

export async function transcribeAudio(buffer: Buffer, filename: string): Promise<string> {
  const apiKey = getApiKey();
  const form = new FormData();
  form.append('model', transcribeModel());
  form.append('language', 'en');
  const uint8 = new Uint8Array(buffer);
  const blob = new Blob([uint8], { type: 'audio/webm' });
  form.append('file', blob, filename || 'recording.webm');

  const res = await fetch(`${MISTRAL_API_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const data = (await res.json()) as { text?: string; error?: { message?: string } };

  if (!res.ok) {
    throw new Error(data.error?.message || `Mistral transcription error (${res.status})`);
  }

  return (data.text ?? '').trim();
}

export async function gradeTurn(question: string, transcript: string): Promise<TurnGrade> {
  const system =
    'You are an expert JavaScript interviewer. Score spoken interview answers fairly: 0=irrelevant or wrong, 5=partially correct, 8-10=strong. Respond with JSON only matching: {"score":number 0-10,"feedback":string,"keyPointsMissing":string[] optional}.';
  const user = JSON.stringify({
    question,
    candidateAnswerTranscript: transcript,
  });
  const raw = await mistralChatJson(system, user);
  return parseJson(raw, turnGradeSchema);
}

export async function gradeTurnAndGenerateNext(
  question: string,
  transcript: string,
  previousTurns: Array<{ questionText: string; transcript: string; score: number }>,
  shouldGenerateNext: boolean,
): Promise<AdaptiveTurn> {
  const system = `You run a short, spoken JavaScript problem-solving interview.
Evaluate the candidate's latest answer fairly, then ${shouldGenerateNext ? 'write the next question' : 'end the session'}.
When writing the next question:
- Adapt it to the latest answer: probe an unclear claim, test a missing concept, or increase difficulty after a strong answer.
- Keep continuity with the conversation, but do not repeat a previous question.
- Ask exactly one concise question that is natural when read aloud.
- Do not include markdown, code blocks, answer hints, or more than 45 words.
Respond with JSON only matching:
{"score":number 0-10,"feedback":string,"keyPointsMissing":string[],"nextQuestion":${shouldGenerateNext ? 'string' : 'null'}}.`;
  const user = JSON.stringify({
    previousTurns,
    latestTurn: {
      question,
      candidateAnswerTranscript: transcript,
    },
  });
  const raw = await mistralChatJson(system, user);
  const result = parseJson(raw, adaptiveTurnSchema);

  if (!shouldGenerateNext) {
    return { ...result, nextQuestion: null };
  }
  if (!result.nextQuestion) {
    throw new Error('Mistral did not generate the next interview question');
  }
  return result;
}

export async function generateFinalReport(
  turns: Array<{ questionText: string; transcript: string; score: number }>
): Promise<FinalReport> {
  const system = `You synthesize a JavaScript engineer interview into a hiring-style report.
Respond with JSON only, keys:
- verdict: "SELECT" | "REJECT" | "BORDERLINE" (SELECT = strong hire, REJECT = not recommended, BORDERLINE = needs another round)
- overallScore: 0-100
- dimensions: object mapping skill area names to 0-100 (e.g. languageFundamentals, asyncRuntime, modulesTooling)
- weakTopics: string[] concepts to study
- improvementPlan: string[] concrete next steps
- strengths: string[] what went well
- detailedMarkdown: string, markdown with sections: Summary, Per-area feedback, Gaps, Recommendations`;
  const user = JSON.stringify({ interviewTurns: turns });
  const raw = await mistralChatJson(system, user);
  return parseJson(raw, finalReportSchema);
}
