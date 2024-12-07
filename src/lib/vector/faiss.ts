import { pipeline } from '@xenova/transformers';
import type { CVDocument, SearchResult } from './types';
import { EMBEDDING_CONFIG } from './config';

export class VectorStore {
  private model: any;
  private vectors: Float32Array[];
  private documents: CVDocument[];

  constructor() {
    this.vectors = [];
    this.documents = [];
  }

  async initialize() {
    if (!this.model) {
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
  }

  private async generateEmbedding(text: string): Promise<Float32Array> {
    await this.initialize();
    const output = await this.model(text, { pooling: 'mean', normalize: true });
    return output.data;
  }

  private cosineSimilarity(a: Float32Array, b: Float32Array): number {
    let dotProduct = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
    }
    return dotProduct; // Vectors are already normalized
  }

  async addDocument(document: CVDocument): Promise<void> {
    const vector = await this.generateEmbedding(document.content);
    this.vectors.push(vector);
    this.documents.push(document);
  }

  async searchSimilar(
    query: string,
    userId: string,
    { limit = 5, threshold = 0.7 } = {}
  ): Promise<SearchResult[]> {
    const queryVector = await this.generateEmbedding(query);

    const scores = this.vectors.map((vector, index) => ({
      score: this.cosineSimilarity(queryVector, vector),
      index
    }));

    return scores
      .filter(item => 
        item.score >= threshold && 
        this.documents[item.index].metadata.userId === userId
      )
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => ({
        document: this.documents[item.index],
        score: item.score
      }));
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const index = this.documents.findIndex(
      doc => doc.id === documentId && doc.metadata.userId === userId
    );
    
    if (index !== -1) {
      this.documents.splice(index, 1);
      this.vectors.splice(index, 1);
    }
  }

  async deleteUserDocuments(userId: string): Promise<void> {
    const indices = this.documents
      .map((doc, index) => doc.metadata.userId === userId ? index : -1)
      .filter(index => index !== -1)
      .sort((a, b) => b - a);

    for (const index of indices) {
      this.documents.splice(index, 1);
      this.vectors.splice(index, 1);
    }
  }

  async bulkAddDocuments(documents: CVDocument[]): Promise<void> {
    const embeddings = await Promise.all(
      documents.map(doc => this.generateEmbedding(doc.content))
    );

    this.vectors.push(...embeddings);
    this.documents.push(...documents);
  }
}