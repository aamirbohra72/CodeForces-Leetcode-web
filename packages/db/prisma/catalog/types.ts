export type JudgeMode = 'STDIN' | 'JS_FUNCTION' | 'REACT_COMPONENT';

export type CatalogTestCase = {
  name: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  isHidden: boolean;
  order: number;
  specJson?: string;
};

export type CatalogChallenge = {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  practiceLanguage: 'JavaScript' | 'React.js';
  companies: string[];
  estimatedTime: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  judgeMode: JudgeMode;
  allowedLanguages: string[];
  starterCode: string;
  judgeReady: boolean;
  testCases: CatalogTestCase[];
};
