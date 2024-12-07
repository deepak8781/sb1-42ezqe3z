import { supabase } from '../supabase/client';
import { StorageError } from './types';

export async function uploadFile(file: File, userId: string): Promise<string> {
  try {
    const path = `${userId}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(path, file);

    if (error) throw new StorageError('Upload failed', error.message);
    if (!data) throw new StorageError('Upload failed', 'No data returned');

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Storage error:', error);
    throw error instanceof StorageError ? error : new StorageError('Upload failed');
  }
}

export async function deleteFile(path: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('resumes')
      .remove([path]);

    if (error) throw new StorageError('Delete failed', error.message);
  } catch (error) {
    console.error('Storage error:', error);
    throw error instanceof StorageError ? error : new StorageError('Delete failed');
  }
}

export async function listFiles(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from('resumes')
      .list(userId);

    if (error) throw new StorageError('List failed', error.message);
    if (!data) return [];

    return data.map(file => {
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(`${userId}/${file.name}`);
      return urlData.publicUrl;
    });
  } catch (error) {
    console.error('Storage error:', error);
    throw error instanceof StorageError ? error : new StorageError('List failed');
  }
}