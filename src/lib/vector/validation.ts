import type { CVDocument } from './types';

export function validateDocument(document: CVDocument): void {
  if (!document.id) {
    throw new Error('Document ID is required');
  }
  if (!document.content) {
    throw new Error('Document content is required');
  }
  if (!document.metadata.userId) {
    throw new Error('User ID is required in document metadata');
  }
}

export function validateSearchParams(userId: string, query: string): void {
  if (!userId) {
    throw new Error('User ID is required for search');
  }
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }
}