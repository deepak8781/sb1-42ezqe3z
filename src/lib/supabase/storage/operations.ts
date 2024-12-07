import { supabase } from '../client';
import { StorageError } from './errors';
import { validateFile, validateUserId } from './validation';
import { generateStoragePath } from './utils';
import type { UploadResponse } from './types';

export async function uploadFile(file: File, userId: string): Promise<string> {
  try {
    validateUserId(userId);
    validateFile(file);

    const path = generateStoragePath(userId, file.name);
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(path, file);

    if (error) throw new StorageError(error.message);
    if (!data) throw new StorageError('Upload failed with no error');

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error instanceof StorageError ? error : new StorageError('Upload failed');
  }
}

export async function deleteFile(path: string, userId: string): Promise<void> {
  try {
    validateUserId(userId);
    const { error } = await supabase.storage
      .from('resumes')
      .remove([path]);

    if (error) throw new StorageError(error.message);
  } catch (error) {
    console.error('Delete error:', error);
    throw error instanceof StorageError ? error : new StorageError('Delete failed');
  }
}

export async function getUserFiles(userId: string): Promise<string[]> {
  try {
    validateUserId(userId);
    const { data, error } = await supabase.storage
      .from('resumes')
      .list(`${userId}`);

    if (error) throw new StorageError(error.message);
    if (!data) return [];

    return data.map(file => {
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(`${userId}/${file.name}`);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error('List files error:', error);
    throw error instanceof StorageError ? error : new StorageError('Failed to list files');
  }
}