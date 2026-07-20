/**
 * Frees local dev ports (3000–3003) by stopping listeners before `npm run dev`.
 * Windows-only (uses Get-NetTCPConnection + taskkill).
 */
import { execSync } from 'node:child_process';

const PORTS = [3000, 3001, 3002, 3003];

function getListenerPids(port) {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess"`,
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    if (!out) return [];
    return [...new Set(out.split(/\s+/).map((s) => Number(s)).filter((n) => n > 0))];
  } catch {
    return [];
  }
}

let freed = 0;
for (const port of PORTS) {
  for (const pid of getListenerPids(port)) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`[free-dev-ports] Stopped PID ${pid} on port ${port}`);
      freed += 1;
    } catch {
      /* already gone */
    }
  }
}

if (freed === 0) {
  console.log('[free-dev-ports] Ports 3000–3003 are clear');
}
