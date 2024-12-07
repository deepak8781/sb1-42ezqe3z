export interface CVDocument {
  id: string;
  content: string;
  metadata: {
    userId: string;
    fileName: string;
    uploadDate: string;
    fileType: string;
    vector?: number[];
  };
}

export interface SearchResult {
  document: CVDocument;
  score: number;
}

export interface VectorSearchOptions {
  limit?: number;
  threshold?: number;
}