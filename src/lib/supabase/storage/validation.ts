import { ValidationError } from './errors';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export function validateFile(file: File): void {
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError('File size exceeds 10MB limit');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ValidationError('Only PDF and DOCX files are allowed');
  }
}

export function validateUserId(userId: string | undefined): asserts userId is string {
  if (!userId) {
    throw new ValidationError('User ID is required for storage operations');
  }
}