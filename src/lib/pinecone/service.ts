import { initializePinecone, getPineconeIndex } from './client';
import { validateMetadata, validateSearchOptions } from './validation';
import { SEARCH_DEFAULTS } from './config';
import { DocumentIndexError, SearchError } from './errors';
import { generateEmbedding } from './embeddings';
import type { PineconeMetadata, SearchOptions, SearchResult } from './types';

export class PineconeService {
  private static instance: PineconeService;
  private openAIKey: string;

  private constructor(openAIKey: string) {
    this.openAIKey = openAIKey;
  }

  static async getInstance(openAIKey: string): Promise<PineconeService> {
    if (!PineconeService.instance) {
      PineconeService.instance = new PineconeService(openAIKey);
      await initializePinecone();
    }
    return PineconeService.instance;
  }

  async indexDocument(
    id: string,
    text: string,
    metadata: PineconeMetadata
  ): Promise<void> {
    try {
      validateMetadata(metadata);
      const pinecone = await initializePinecone();
      const index = getPineconeIndex(pinecone);

      const vector = await generateEmbedding(text, this.openAIKey);

      await index.upsert({
        vectors: [{
          id,
          values: vector,
          metadata
        }]
      });
    } catch (error) {
      throw new DocumentIndexError('Failed to index document', error);
    }
  }

  async searchSimilar(
    query: string,
    userId: string,
    options: SearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      validateSearchOptions(options);
      const pinecone = await initializePinecone();
      const index = getPineconeIndex(pinecone);

      const { limit = SEARCH_DEFAULTS.limit } = options;
      const queryVector = await generateEmbedding(query, this.openAIKey);

      const results = await index.query({
        vector: queryVector,
        topK: limit,
        filter: { userId: { $eq: userId } },
        includeMetadata: true
      });

      return results.matches.map(match => ({
        id: match.id,
        score: match.score,
        metadata: match.metadata as PineconeMetadata
      }));
    } catch (error) {
      throw new SearchError('Failed to search documents', error);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    try {
      const pinecone = await initializePinecone();
      const index = getPineconeIndex(pinecone);
      await index.deleteOne(id);
    } catch (error) {
      throw new DocumentIndexError('Failed to delete document', error);
    }
  }

  async deleteUserDocuments(userId: string): Promise<void> {
    try {
      const pinecone = await initializePinecone();
      const index = getPineconeIndex(pinecone);
      await index.deleteMany({
        filter: { userId: { $eq: userId } }
      });
    } catch (error) {
      throw new DocumentIndexError('Failed to delete user documents', error);
    }
  }
}