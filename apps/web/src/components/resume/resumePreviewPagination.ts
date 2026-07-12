/**
 * Preview pagination that snaps page breaks to block boundaries
 * so text is never partially sliced at the top/bottom of a page frame.
 */

export type ResumePageWindow = {
  /** Content Y start (inclusive), relative to resume root */
  start: number;
  /** Content Y end (exclusive), relative to resume root */
  end: number;
};

function relativeBounds(el: HTMLElement, root: HTMLElement): { top: number; bottom: number } {
  const rootRect = root.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const top = rect.top - rootRect.top;
  return { top, bottom: top + rect.height };
}

/** Safe Y positions where we can cut without slicing through a line/box */
export function collectSafeBreakYs(root: HTMLElement): number[] {
  const total = Math.ceil(root.scrollHeight);
  const breaks = new Set<number>([0, total]);

  const nodes = root.querySelectorAll('h1, h2, p, li, section, ul, div');
  nodes.forEach((node) => {
    if (!(node instanceof HTMLElement) || node === root) return;
    const { top, bottom } = relativeBounds(node, root);
    if (Number.isFinite(top) && top > 0.5) breaks.add(Math.round(top));
    if (Number.isFinite(bottom) && bottom > 0.5) breaks.add(Math.round(bottom));
  });

  return Array.from(breaks).sort((a, b) => a - b);
}

function snapEndDown(idealEnd: number, breaks: number[], start: number): number {
  let best = start;
  for (const y of breaks) {
    if (y > start && y <= idealEnd && y > best) best = y;
  }
  if (best > start) return best;

  // No boundary inside the budget — jump to the next safe boundary (keeps text whole).
  for (const y of breaks) {
    if (y > start) return y;
  }
  return idealEnd;
}

/**
 * Build page content windows for the live preview.
 * Each window ends on a block boundary so clipped pages never show half-lines.
 */
export function computePreviewPageWindows(
  root: HTMLElement,
  pageHeightPx: number,
  edgeGapPx: number,
): ResumePageWindow[] {
  const total = Math.ceil(root.scrollHeight);
  if (pageHeightPx <= 0 || total <= 0) {
    return [{ start: 0, end: Math.max(total, 1) }];
  }

  const budget = Math.max(48, pageHeightPx - edgeGapPx);
  if (total <= budget) {
    return [{ start: 0, end: total }];
  }

  const breaks = collectSafeBreakYs(root);
  const windows: ResumePageWindow[] = [];
  let start = 0;

  while (start < total - 0.5) {
    const idealEnd = Math.min(total, start + budget);
    if (idealEnd >= total) {
      windows.push({ start, end: total });
      break;
    }

    const end = Math.min(total, snapEndDown(idealEnd, breaks, start));
    windows.push({ start, end });
    start = end;

    if (windows.length > 20) {
      if (start < total) windows.push({ start, end: total });
      break;
    }
  }

  return windows.length ? windows : [{ start: 0, end: total }];
}
