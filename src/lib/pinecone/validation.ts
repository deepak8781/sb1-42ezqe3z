import type { PineconeMetadata, SearchOptions } from './types';

export function validateMetadata(metadata: PineconeMetadata): void {
  if (!metadata.userId) throw new Error('userId is required');
  if (!metadata.fileName) throw new Error('fileName is required');
  if (!metadata.fileType) throw new Error('fileType is required');
  if (!metadata.uploadDate) throw new Error('uploadDate is required');
}

export function validateSearchOptions(options: SearchOptions): void {
  if (options.limit && options.limit < 1) {
    throw new Error('limit must be greater than 0');
  }
  if (options.threshold && (options.threshold < 0 || options.threshold > 1)) {
    throw new Error('threshold must be between 0 and 1');
  }
}