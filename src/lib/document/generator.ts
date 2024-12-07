import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import { PDFDocument as PDFLib } from 'pdf-lib';
import type { Assessment } from '../../types';

export async function generateCoverPage(
  assessment: Assessment,
  logoUrl: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    const stream = doc.pipe(blobStream());

    // Add logo
    doc.image(logoUrl, 50, 50, { width: 100 });

    // Add title
    doc.moveDown(4);
    doc.fontSize(24).text('Resume Assessment Summary', { align: 'center' });
    doc.moveDown(2);

    // Add candidate info
    doc.fontSize(14).text(`Agency Name: Neev`, { align: 'left' });
    doc.moveDown();
    doc.text(`Candidate Name: ${assessment.candidateName}`, { align: 'left' });
    doc.moveDown();
    doc.text(`Position: ${assessment.position}`, { align: 'left' });
    doc.moveDown(2);

    // Add match percentage
    doc.fontSize(16).text(`Overall Match: ${assessment.overallMatch}%`, { align: 'left' });
    doc.moveDown(2);

    // Add skills section
    doc.fontSize(16).text('Key Skills Match:', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    
    // Present skills
    doc.text('Matching Skills:', { continued: true });
    doc.moveDown();
    assessment.skillsAnalysis.present.forEach(skill => {
      doc.text(`• ${skill}`);
    });
    doc.moveDown();

    // Missing skills
    doc.text('Skills to Develop:', { continued: true });
    doc.moveDown();
    assessment.skillsAnalysis.missing.forEach(skill => {
      doc.text(`• ${skill}`);
    });
    doc.moveDown(2);

    // Add recommendations
    doc.fontSize(16).text('Key Recommendations:', { underline: true });
    doc.moveDown();
    doc.fontSize(12);
    assessment.recommendations.forEach(rec => {
      doc.text(`• ${rec}`);
    });

    // Finalize the PDF
    doc.end();

    stream.on('finish', () => {
      resolve(stream.toBlob('application/pdf'));
    });

    stream.on('error', reject);
  });
}

export async function mergePDFWithCover(coverPage: Blob, resumePdf: Blob): Promise<Uint8Array> {
  const coverPageBytes = await coverPage.arrayBuffer();
  const resumeBytes = await resumePdf.arrayBuffer();

  const mergedPdf = await PDFLib.create();
  const coverPdf = await PDFLib.load(coverPageBytes);
  const resumePdf = await PDFLib.load(resumeBytes);

  // Copy pages from cover page
  const coverPages = await mergedPdf.copyPages(coverPdf, coverPdf.getPageIndices());
  coverPages.forEach(page => mergedPdf.addPage(page));

  // Copy pages from resume
  const resumePages = await mergedPdf.copyPages(resumePdf, resumePdf.getPageIndices());
  resumePages.forEach(page => mergedPdf.addPage(page));

  return mergedPdf.save();
}

export function createDownloadLink(data: Blob | Uint8Array, filename: string, type: string): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}