import { DashboardShell } from '@/components/DashboardShell';
import { HomeLanding } from '@/components/home/HomeLanding';

export default function Home() {
  return (
    <DashboardShell navClassName="sticky top-0 z-50" mainClassName="min-h-0 overflow-y-auto">
      <HomeLanding />
    </DashboardShell>
  );
}
