import mammoth from 'mammoth';

export async function parseDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    
    if (!text) {
      throw new Error('No text content found in DOCX file');
    }
    
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`DOCX parsing failed: ${error.message}`);
    }
    throw new Error('DOCX parsing failed. Please check the file and try again.');
  }
}