import { sanitizeFileName } from '../../utils';

export function generateStoragePath(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = sanitizeFileName(fileName);
  return `${userId}/${timestamp}_${sanitized}`;
}

export function extractFileNameFromPath(path: string): string {
  return path.split('/').pop() || '';
}

export function extractUserIdFromPath(path: string): string {
  return path.split('/')[0] || '';
}