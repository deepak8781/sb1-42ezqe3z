export class StorageError extends Error {
  constructor(
    message: string,
    public code?: string,
    public serverResponse?: string
  ) {
    super(message);
    this.name = 'StorageError';
  }

  static fromFirebaseError(error: any): StorageError {
    const code = error.code || 'storage/unknown';
    const message = this.getErrorMessage(code);
    return new StorageError(message, code, error.serverResponse);
  }

  private static getErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      'storage/unauthorized': 'You do not have permission to perform this action',
      'storage/canceled': 'Operation was cancelled',
      'storage/unknown': 'An unknown error occurred',
      'storage/object-not-found': 'File does not exist',
      'storage/quota-exceeded': 'Storage quota exceeded',
      'storage/invalid-checksum': 'File is corrupted',
      'storage/retry-limit-exceeded': 'Maximum retry attempts exceeded'
    };

    return messages[code] || 'An error occurred with the storage operation';
  }
}