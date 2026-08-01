import { api } from '@/lib/api';
import type { TaHelpRequest, TaHelpType } from '@/data/ta-help';

export type TaHelpCreatePayload = {
  title: string;
  type: TaHelpType;
  problem: string;
  topic: string;
  language: string;
  description: string;
  preferredSlot?: string;
  source?: 'web' | 'companion';
};

export async function createTaHelpRequestApi(payload: TaHelpCreatePayload) {
  const data = await api.post<{ request: TaHelpRequest }>('/ta-help', payload);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ta-help:updated'));
  }
  return data.request;
}

export async function fetchMyTaHelpRequests() {
  return api.get<{ requests: TaHelpRequest[]; waitingVideo: number }>('/ta-help/mine');
}

export async function fetchTaQueue() {
  return api.get<{ requests: TaHelpRequest[] }>('/ta-help/queue');
}

export async function fetchTaHelpRequest(id: string) {
  return api.get<{ request: TaHelpRequest }>('/ta-help/' + encodeURIComponent(id));
}

export async function claimTaHelpRequest(id: string) {
  const data = await api.post<{ request: TaHelpRequest }>(
    `/ta-help/${encodeURIComponent(id)}/claim`,
    {},
  );
  window.dispatchEvent(new CustomEvent('ta-help:updated'));
  return data.request;
}

export async function replyTaHelpRequest(id: string, body: string) {
  const data = await api.post<{ request: TaHelpRequest }>(
    `/ta-help/${encodeURIComponent(id)}/reply`,
    { body },
  );
  window.dispatchEvent(new CustomEvent('ta-help:updated'));
  return data.request;
}

export async function updateTaHelpStatusApi(
  id: string,
  status: 'OPEN_POOL' | 'RESOLVED' | 'WAITING',
) {
  const data = await api.post<{ request: TaHelpRequest }>(
    `/ta-help/${encodeURIComponent(id)}/status`,
    { status },
  );
  window.dispatchEvent(new CustomEvent('ta-help:updated'));
  return data.request;
}

export async function submitTaHelpFeedbackApi(
  id: string,
  payload: { satisfied?: boolean; rating?: number },
) {
  const data = await api.post<{ request: TaHelpRequest }>(
    `/ta-help/${encodeURIComponent(id)}/feedback`,
    payload,
  );
  window.dispatchEvent(new CustomEvent('ta-help:updated'));
  return data.request;
}
