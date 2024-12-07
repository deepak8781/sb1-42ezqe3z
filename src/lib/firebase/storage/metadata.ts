import { StorageMetadata } from './types';

export const defaultStorageMetadata: StorageMetadata = {
  contentType: 'application/octet-stream',
  customMetadata: {
    uploadTimestamp: new Date().toISOString()
  }
};

export function createStorageMetadata(
  file: File,
  userId: string,
  additionalMetadata: Record<string, string> = {}
): StorageMetadata {
  return {
    contentType: file.type,
    customMetadata: {
      ...defaultStorageMetadata.customMetadata,
      userId,
      originalName: file.name,
      ...additionalMetadata
    }
  };
}