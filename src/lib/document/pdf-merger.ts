import { PDFDocument } from 'pdf-lib';

export async function mergePDFWithCover(coverPage: Blob, originalPdf: Blob): Promise<Uint8Array> {
  const [coverPageBytes, originalBytes] = await Promise.all([
    coverPage.arrayBuffer(),
    originalPdf.arrayBuffer()
  ]);

  const mergedPdf = await PDFDocument.create();
  const [coverDoc, originalDoc] = await Promise.all([
    PDFDocument.load(coverPageBytes),
    PDFDocument.load(originalBytes)
  ]);

  const coverPages = await mergedPdf.copyPages(coverDoc, coverDoc.getPageIndices());
  const originalPages = await mergedPdf.copyPages(originalDoc, originalDoc.getPageIndices());

  [...coverPages, ...originalPages].forEach(page => mergedPdf.addPage(page));

  return mergedPdf.save();
}