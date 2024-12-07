export class StorageError extends Error {
  constructor(message: string, public details?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

export interface StorageFile {
  name: string;
  url: string;
  size: number;
  type: string;
}