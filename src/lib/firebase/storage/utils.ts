export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

export function generateStoragePath(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFileName(fileName);
  return `resumes/${userId}/${timestamp}_${sanitizedName}`;
}

export function validateUserId(userId: string | undefined): asserts userId is string {
  if (!userId) {
    throw new Error('User ID is required for storage operations');
  }
}