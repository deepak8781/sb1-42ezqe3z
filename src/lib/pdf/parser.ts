import * as pdfjsLib from 'pdfjs-dist';
import { initializeWorker } from './worker';

export async function parsePDF(file: File): Promise<string> {
  try {
    await initializeWorker();
    
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
    
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    
    if (numPages === 0) {
      throw new Error('PDF file is empty');
    }
    
    const textContents = await Promise.all(
      Array.from({ length: numPages }, (_, i) => extractPageText(pdf, i + 1))
    );
    
    const fullText = textContents.join('\n').trim();
    
    if (!fullText) {
      throw new Error('No text content found in PDF');
    }
    
    return fullText;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
    throw new Error('PDF parsing failed. Please check the file and try again.');
  }
}

async function extractPageText(pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number): Promise<string> {
  try {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    
    return textContent.items
      .map((item: any) => item.str)
      .join(' ');
  } catch (error) {
    console.error(`Error extracting text from page ${pageNumber}:`, error);
    throw new Error(`Failed to extract text from page ${pageNumber}`);
  }
}