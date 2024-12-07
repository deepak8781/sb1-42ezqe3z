export function generateStoragePath(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFileName(fileName);
  return `resumes/${userId}/${timestamp}_${sanitizedName}`;
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

export function extractPathFromUrl(url: string): string {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/o\/(.+?)\?/);
    if (!match) {
      throw new Error('Invalid storage URL format');
    }
    return match[1];
  } catch (error) {
    console.error('Error extracting path from URL:', error);
    throw new Error('Failed to extract storage path from URL');
  }
}

export function extractFileNameFromPath(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

export function extractUserIdFromPath(path: string): string {
  const parts = path.split('/');
  return parts[1] || '';
}