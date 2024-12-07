export class PineconeError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'PineconeError';
  }
}

export class DocumentIndexError extends PineconeError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'DocumentIndexError';
  }
}

export class SearchError extends PineconeError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'SearchError';
  }
}