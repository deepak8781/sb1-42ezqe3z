export interface StorageMetadata {
  userId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
}

export interface UploadResponse {
  path: string;
  url: string;
}

export interface StorageFile {
  name: string;
  size: number;
  type: string;
  path: string;
  url: string;
  metadata: StorageMetadata;
}