import { generateEmbedding } from './embeddings';
import { cosineSimilarity } from './similarity';
import { SIMILARITY_THRESHOLD } from './config';
import { validateDocument, validateSearchParams } from './validation';
import { VectorStoreError } from './errors';
import type { CVDocument, SearchResult, VectorSearchOptions } from './types';

export class VectorStore {
  private documents: Map<string, CVDocument>;
  private vectors: Map<string, number[]>;
  private initialized: boolean;

  constructor() {
    this.documents = new Map();
    this.vectors = new Map();
    this.initialized = false;
  }

  private async initialize(): Promise<void> {
    if (!this.initialized) {
      // Verify API connection on first use
      try {
        await generateEmbedding('test');
        this.initialized = true;
      } catch (error) {
        throw new VectorStoreError('Failed to initialize vector store', error);
      }
    }
  }

  async addDocument(document: CVDocument): Promise<void> {
    try {
      await this.initialize();
      validateDocument(document);

      const vector = await generateEmbedding(document.content);
      this.documents.set(document.id, document);
      this.vectors.set(document.id, vector);
    } catch (error) {
      if (error instanceof VectorStoreError) {
        throw error;
      }
      throw new VectorStoreError('Failed to add document to vector store', error);
    }
  }

  async searchSimilar(
    query: string,
    userId: string,
    options: VectorSearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      await this.initialize();
      validateSearchParams(userId, query);

      const { limit = 5, threshold = SIMILARITY_THRESHOLD } = options;
      const queryVector = await generateEmbedding(query);
      const results: SearchResult[] = [];

      for (const [docId, docVector] of this.vectors.entries()) {
        const document = this.documents.get(docId);
        if (!document || document.metadata.userId !== userId) continue;

        const score = cosineSimilarity(queryVector, docVector);
        if (score >= threshold) {
          results.push({ document, score });
        }
      }

      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      throw new VectorStoreError('Failed to search documents', error);
    }
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      const document = this.documents.get(documentId);
      if (document?.metadata.userId === userId) {
        this.documents.delete(documentId);
        this.vectors.delete(documentId);
      }
    } catch (error) {
      throw new VectorStoreError('Failed to delete document', error);
    }
  }

  async deleteUserDocuments(userId: string): Promise<void> {
    try {
      for (const [docId, doc] of this.documents.entries()) {
        if (doc.metadata.userId === userId) {
          this.documents.delete(docId);
          this.vectors.delete(docId);
        }
      }
    } catch (error) {
      throw new VectorStoreError('Failed to delete user documents', error);
    }
  }

  getDocumentCount(userId: string): number {
    return Array.from(this.documents.values())
      .filter(doc => doc.metadata.userId === userId)
      .length;
  }
}