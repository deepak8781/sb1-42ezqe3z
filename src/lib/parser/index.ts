import { parsePDF } from '../pdf/parser';
import { parseDocx } from '../docx/parser';
import { cleanupWorker } from '../pdf/worker';

export type SupportedMimeTypes = 
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const SUPPORTED_TYPES: Record<SupportedMimeTypes, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

export async function parseFile(file: File): Promise<string> {
  try {
    if (!Object.keys(SUPPORTED_TYPES).includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    const content = await (file.type === 'application/pdf' ? parsePDF(file) : parseDocx(file));
    
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`File parsing failed: ${error.message}`);
    }
    throw new Error('File parsing failed. Please try again.');
  } finally {
    // Clean up PDF worker if it was used
    if (file.type === 'application/pdf') {
      cleanupWorker();
    }
  }
}