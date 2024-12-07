import { generateEmbedding } from './embeddings';
import { cosineSimilarity } from './similarity';
import { SIMILARITY_THRESHOLD } from './config';
import type { CVDocument, SearchResult, VectorSearchOptions } from './types';

export class VectorStore {
  private documents: Map<string, CVDocument>;
  private vectors: Map<string, number[]>;

  constructor() {
    this.documents = new Map();
    this.vectors = new Map();
  }

  async addDocument(document: CVDocument): Promise<void> {
    try {
      const vector = await generateEmbedding(document.content);
      this.documents.set(document.id, document);
      this.vectors.set(document.id, vector);
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Failed to add document to vector store');
    }
  }

  async searchSimilar(
    query: string,
    userId: string,
    options: VectorSearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
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
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const document = this.documents.get(documentId);
    if (document?.metadata.userId === userId) {
      this.documents.delete(documentId);
      this.vectors.delete(documentId);
    }
  }

  async deleteUserDocuments(userId: string): Promise<void> {
    for (const [docId, doc] of this.documents.entries()) {
      if (doc.metadata.userId === userId) {
        this.documents.delete(docId);
        this.vectors.delete(docId);
      }
    }
  }
}