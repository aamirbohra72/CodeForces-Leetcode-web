import type { Metadata } from 'next';
import { TaHelpDashboard } from '@/components/ta-help/TaHelpDashboard';

export const metadata: Metadata = {
  title: 'TA Help | Codeforces Platform',
  description: 'Ask Teaching Assistants for help and track your help requests.',
};

export default function TaHelpPage() {
  return <TaHelpDashboard />;
}
