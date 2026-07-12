import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/** ~A4 width at 96dpi — keeps preview/PDF proportions consistent */
export const RESUME_EXPORT_WIDTH_PX = 794;

/** Empty edge space (mm): first-page bottom + page-2+ top */
export const PAGE_EDGE_GAP_MM = 18;

/** @deprecated use PAGE_EDGE_GAP_MM */
export const CONTINUATION_TOP_GAP_MM = PAGE_EDGE_GAP_MM;

export function pageEdgeGapPx(pageHeightPx: number): number {
  return Math.round(pageHeightPx * (PAGE_EDGE_GAP_MM / 297));
}

/** Alias kept for existing imports */
export function continuationTopGapPx(pageHeightPx: number): number {
  return pageEdgeGapPx(pageHeightPx);
}

/**
 * Content Y offset for a preview/PDF page.
 * Page 1 uses a bottom gap; later pages use a top gap.
 */
export function resumeContentOffset(
  pageIndex: number,
  pageHeightPx: number,
  topGapPx: number,
  bottomGapPx: number = topGapPx,
): number {
  if (pageIndex <= 0) return 0;
  const firstPageContent = Math.max(1, pageHeightPx - bottomGapPx);
  const continuationContent = Math.max(1, pageHeightPx - topGapPx);
  return firstPageContent + (pageIndex - 1) * continuationContent;
}

export function resumePageCount(
  totalHeightPx: number,
  pageHeightPx: number,
  topGapPx: number,
  bottomGapPx: number = topGapPx,
): number {
  if (pageHeightPx <= 0) return 1;
  const firstPageContent = Math.max(1, pageHeightPx - bottomGapPx);
  if (totalHeightPx <= firstPageContent) return 1;
  const continuation = Math.max(1, pageHeightPx - topGapPx);
  return 1 + Math.ceil((totalHeightPx - firstPageContent) / continuation);
}

function safeFileName(name: string): string {
  const base = name.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') || 'resume';
  return `${base}-resume.pdf`;
}

/**
 * Prefer a nearly-white row near the ideal break so glyphs are not sliced mid-line.
 */
function findQuietBreakY(canvas: HTMLCanvasElement, idealY: number, searchRadius: number): number {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return idealY;

  const start = Math.max(1, idealY - searchRadius);
  const end = Math.min(canvas.height - 1, idealY);
  let bestY = idealY;
  let bestScore = -1;

  for (let y = end; y >= start; y -= 1) {
    const row = ctx.getImageData(0, y, canvas.width, 1).data;
    let white = 0;
    const step = 16; // sample every 4th pixel (RGBA)
    for (let i = 0; i < row.length; i += step) {
      if (row[i] > 248 && row[i + 1] > 248 && row[i + 2] > 248) white += 1;
    }
    const samples = Math.ceil(row.length / step) || 1;
    const score = white / samples;
    if (score > bestScore) {
      bestScore = score;
      bestY = y;
    }
    if (score >= 0.995) break;
  }

  return bestScore >= 0.92 ? bestY : idealY;
}

function canvasSlice(source: HTMLCanvasElement, y: number, height: number): HTMLCanvasElement {
  const slice = document.createElement('canvas');
  slice.width = source.width;
  slice.height = Math.max(1, Math.floor(height));
  const ctx = slice.getContext('2d');
  if (!ctx) return slice;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, slice.width, slice.height);
  ctx.drawImage(source, 0, y, source.width, height, 0, 0, slice.width, height);
  return slice;
}

/**
 * Capture resume DOM and save an A4 PDF.
 * Page 2+ keep an empty top band so continuation content is not flush/cluttered.
 */
export async function downloadResumePdf(element: HTMLElement, fullName: string): Promise<void> {
  const prev = {
    width: element.style.width,
    maxWidth: element.style.maxWidth,
    minHeight: element.style.minHeight,
    height: element.style.height,
    margin: element.style.margin,
    boxShadow: element.style.boxShadow,
    borderRadius: element.style.borderRadius,
  };

  element.style.width = `${RESUME_EXPORT_WIDTH_PX}px`;
  element.style.maxWidth = `${RESUME_EXPORT_WIDTH_PX}px`;
  element.style.minHeight = '0';
  element.style.height = 'auto';
  element.style.margin = '0';
  element.style.boxShadow = 'none';
  element.style.borderRadius = '0';

  const host = element.parentElement;
  const prevHost = host
    ? {
        visibility: host.style.visibility,
        position: host.style.position,
        left: host.style.left,
        top: host.style.top,
        opacity: host.style.opacity,
        zIndex: host.style.zIndex,
        height: host.style.height,
        overflow: host.style.overflow,
      }
    : null;

  if (host) {
    host.style.visibility = 'visible';
    host.style.position = 'fixed';
    host.style.left = '-10000px';
    host.style.top = '0';
    host.style.opacity = '1';
    host.style.zIndex = '-1';
    host.style.height = 'auto';
    host.style.overflow = 'visible';
  }

  try {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      width: RESUME_EXPORT_WIDTH_PX,
      windowWidth: RESUME_EXPORT_WIDTH_PX,
      windowHeight: element.scrollHeight,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const marginX = 8;
    const marginY = 8;
    const usableWidth = pageWidth - marginX * 2;
    const usableHeight = pageHeight - marginY * 2;

    const pxPerMm = canvas.width / usableWidth;
    const fullPageBudgetPx = Math.floor(usableHeight * pxPerMm);
    const edgeGapPx = Math.floor(PAGE_EDGE_GAP_MM * pxPerMm);
    const searchRadius = Math.floor(36 * (canvas.width / RESUME_EXPORT_WIDTH_PX));

    let y = 0;
    let pageIndex = 0;

    while (y < canvas.height) {
      const remaining = canvas.height - y;
      if (remaining <= 1) break;

      // Page 1: reserve bottom empty space. Page 2+: reserve top empty space.
      const topInsetMm = pageIndex === 0 ? 0 : PAGE_EDGE_GAP_MM;
      const bottomInsetPx = pageIndex === 0 ? edgeGapPx : 0;
      const topInsetPx = Math.floor(topInsetMm * pxPerMm);
      const budgetPx = Math.max(48, fullPageBudgetPx - topInsetPx - bottomInsetPx);

      let sliceEnd = Math.min(y + budgetPx, canvas.height);
      if (sliceEnd < canvas.height) {
        sliceEnd = findQuietBreakY(canvas, sliceEnd, searchRadius);
        if (sliceEnd <= y + 8) {
          sliceEnd = Math.min(y + budgetPx, canvas.height);
        }
      }

      const sliceHeight = sliceEnd - y;
      const pageCanvas = canvasSlice(canvas, y, sliceHeight);
      const imgData = pageCanvas.toDataURL('image/png');
      const sliceHeightMm = sliceHeight / pxPerMm;

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(
        imgData,
        'PNG',
        marginX,
        marginY + topInsetMm,
        usableWidth,
        sliceHeightMm,
        undefined,
        'FAST',
      );

      y = sliceEnd;
      pageIndex += 1;
      if (pageIndex > 20) break;
    }

    pdf.save(safeFileName(fullName));
  } finally {
    element.style.width = prev.width;
    element.style.maxWidth = prev.maxWidth;
    element.style.minHeight = prev.minHeight;
    element.style.height = prev.height;
    element.style.margin = prev.margin;
    element.style.boxShadow = prev.boxShadow;
    element.style.borderRadius = prev.borderRadius;
    if (host && prevHost) {
      host.style.visibility = prevHost.visibility;
      host.style.position = prevHost.position;
      host.style.left = prevHost.left;
      host.style.top = prevHost.top;
      host.style.opacity = prevHost.opacity;
      host.style.zIndex = prevHost.zIndex;
      host.style.height = prevHost.height;
      host.style.overflow = prevHost.overflow;
    }
  }
}
