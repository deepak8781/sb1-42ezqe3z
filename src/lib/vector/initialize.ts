import { Pinecone } from '@pinecone-database/pinecone';
import { VECTOR_CONFIG } from './config';

let pineconeInstance: Pinecone | null = null;

export async function initializePinecone(): Promise<Pinecone> {
  if (!pineconeInstance) {
    if (!VECTOR_CONFIG.pinecone.apiKey) {
      throw new Error('Pinecone API key is not configured');
    }

    try {
      pineconeInstance = new Pinecone({
        apiKey: VECTOR_CONFIG.pinecone.apiKey
      });

      // Verify connection and index
      const indexList = await pineconeInstance.listIndexes();
      
      if (!indexList.includes(VECTOR_CONFIG.pinecone.indexName)) {
        console.error('Available indexes:', indexList);
        throw new Error(`Index "${VECTOR_CONFIG.pinecone.indexName}" not found in Pinecone`);
      }

      console.log('Pinecone initialized successfully');
    } catch (error) {
      console.error('Pinecone initialization error:', error);
      throw new Error('Failed to initialize Pinecone connection');
    }
  }

  return pineconeInstance;
}

export function getPineconeInstance(): Pinecone {
  if (!pineconeInstance) {
    throw new Error('Pinecone not initialized. Call initializePinecone() first.');
  }
  return pineconeInstance;
}