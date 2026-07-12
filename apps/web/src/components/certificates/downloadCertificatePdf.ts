import { jsPDF } from 'jspdf';

export type CertificatePdfInput = {
  recipientName: string;
  courseTitle: string;
  issuedAt?: Date;
  platformName?: string;
};

function safeFileName(courseTitle: string): string {
  const base =
    courseTitle.trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').toLowerCase() || 'course';
  return `${base}-certificate.pdf`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate a landscape A4 certificate of completion and trigger download.
 */
export function downloadCertificatePdf({
  recipientName,
  courseTitle,
  issuedAt = new Date(),
  platformName = 'Codeforces Platform',
}: CertificatePdfInput): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const cx = pageWidth / 2;

  // Soft cream background
  doc.setFillColor(252, 250, 245);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner accent border
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner ornaments
  const orn = 8;
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.6);
  [
    [18, 18],
    [pageWidth - 18, 18],
    [18, pageHeight - 18],
    [pageWidth - 18, pageHeight - 18],
  ].forEach(([x, y]) => {
    const dx = x === 18 ? 1 : -1;
    const dy = y === 18 ? 1 : -1;
    doc.line(x, y, x + dx * orn, y);
    doc.line(x, y, x, y + dy * orn);
  });

  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(platformName.toUpperCase(), cx, 32, { align: 'center' });

  doc.setFontSize(28);
  doc.setTextColor(15, 23, 42);
  doc.text('Certificate of Completion', cx, 52, { align: 'center' });

  // Accent line under title
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.line(cx - 45, 58, cx + 45, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('This is to certify that', cx, 78, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(15, 23, 42);
  doc.text(recipientName || 'Learner', cx, 96, { align: 'center' });

  // Underline name
  const nameWidth = doc.getTextWidth(recipientName || 'Learner');
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(cx - nameWidth / 2 - 4, 100, cx + nameWidth / 2 + 4, 100);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(71, 85, 105);
  doc.text('has successfully completed the course', cx, 116, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  const courseLines = doc.splitTextToSize(courseTitle, pageWidth - 60);
  doc.text(courseLines, cx, 132, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued on ${formatDate(issuedAt)}`, cx, 158, { align: 'center' });

  // Signature area
  const sigY = pageHeight - 38;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(40, sigY, 110, sigY);
  doc.line(pageWidth - 110, sigY, pageWidth - 40, sigY);

  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Instructor', 75, sigY + 7, { align: 'center' });
  doc.text(platformName, pageWidth - 75, sigY + 7, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Verify this certificate in your Certificates dashboard.', cx, pageHeight - 18, {
    align: 'center',
  });

  doc.save(safeFileName(courseTitle));
}
