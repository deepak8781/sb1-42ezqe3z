import { StorageError } from './errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function validateFile(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new StorageError(
      'File size exceeds 10MB limit',
      'storage/file-too-large'
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new StorageError(
      'Only PDF and DOCX files are allowed',
      'storage/invalid-file-type'
    );
  }
}

export function validateUserId(userId: string | undefined): asserts userId is string {
  if (!userId) {
    throw new StorageError(
      'User ID is required for storage operations',
      'storage/invalid-user'
    );
  }
}

export function validateStoragePath(path: string): void {
  if (!path.startsWith('resumes/')) {
    throw new StorageError(
      'Invalid storage path',
      'storage/invalid-path'
    );
  }
}