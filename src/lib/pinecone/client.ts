import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_CONFIG } from './config';
import { PineconeError } from './errors';

let pineconeInstance: Pinecone | null = null;

export async function initializePinecone(): Promise<Pinecone> {
  if (!pineconeInstance) {
    try {
      pineconeInstance = new Pinecone({
        apiKey: PINECONE_CONFIG.apiKey,
        environment: PINECONE_CONFIG.environment,
        projectId: PINECONE_CONFIG.indexName
      });

      // Verify connection by listing indexes
      await pineconeInstance.describeIndex({
        indexName: PINECONE_CONFIG.indexName
      });

      console.log('Pinecone initialized successfully');
    } catch (error) {
      console.error('Pinecone initialization error:', error);
      throw new PineconeError('Failed to initialize Pinecone connection', error);
    }
  }
  return pineconeInstance;
}

export function getPineconeIndex(pinecone: Pinecone) {
  return pinecone.index(PINECONE_CONFIG.indexName);
}