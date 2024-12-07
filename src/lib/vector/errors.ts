export class VectorStoreError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'VectorStoreError';
  }
}

export class EmbeddingError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'EmbeddingError';
  }
}