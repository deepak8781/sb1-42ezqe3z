export interface StorageMetadata {
  contentType: string;
  customMetadata?: {
    userId?: string;
    originalName?: string;
    uploadTimestamp?: string;
    [key: string]: string | undefined;
  };
}

export interface StorageError extends Error {
  code?: string;
  name: string;
  serverResponse?: string;
}