import OpenAI from 'openai';
import { EMBEDDING_CONFIG } from './config';

let openaiInstance: OpenAI | null = null;

function getOpenAIInstance(apiKey: string): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openaiInstance;
}

export async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  try {
    const openai = getOpenAIInstance(apiKey);
    
    const response = await openai.embeddings.create({
      model: EMBEDDING_CONFIG.model,
      input: text,
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}