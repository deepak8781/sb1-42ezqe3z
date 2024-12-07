export interface PineconeMetadata {
  userId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  filter?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: PineconeMetadata;
}