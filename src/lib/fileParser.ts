import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Use a specific version of pdf.js worker that matches our package version
const PDFJS_WORKER_URL = '/pdf.worker.min.js';

// Initialize pdf.js worker
const loadWorker = async () => {
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const workerBlob = await fetch(PDFJS_WORKER_URL).then(res => res.blob());
    const workerUrl = URL.createObjectURL(workerBlob);
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  }
};

export async function parseFile(file: File): Promise<string> {
  try {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      await loadWorker();
      return await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await parseDocx(file);
    }
    
    throw new Error(`Unsupported file type: ${fileType}`);
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse file. Please ensure the file is not corrupted and try again.');
  }
}

async function parsePDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    const trimmedText = fullText.trim();
    if (!trimmedText) {
      throw new Error('No text content found in PDF');
    }
    
    return trimmedText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted and try again.');
  }
}

async function parseDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const trimmedText = result.value.trim();
    
    if (!trimmedText) {
      throw new Error('No text content found in DOCX');
    }
    
    return trimmedText;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file. Please ensure the file is not corrupted and try again.');
  }
}