import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../config';
import { StorageError } from './errors';
import { validateFile, validateUserId, validateStoragePath } from './validation';
import { createStorageMetadata } from './metadata';
import { generateStoragePath, extractPathFromUrl } from './paths';

export async function uploadFile(file: File, userId: string): Promise<string> {
  try {
    validateUserId(userId);
    validateFile(file);

    const path = generateStoragePath(userId, file.name);
    const metadata = createStorageMetadata(file, userId);
    const storageRef = ref(storage, path);

    const snapshot = await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Upload error:', error);
    throw StorageError.fromFirebaseError(error);
  }
}

export async function deleteFile(urlOrPath: string, userId: string): Promise<void> {
  try {
    validateUserId(userId);
    
    // Convert URL to path if needed
    const path = urlOrPath.startsWith('http') 
      ? extractPathFromUrl(urlOrPath)
      : urlOrPath;
      
    validateStoragePath(path);
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Delete error:', error);
    throw StorageError.fromFirebaseError(error);
  }
}

export async function getUserFiles(userId: string): Promise<string[]> {
  try {
    validateUserId(userId);
    
    const listRef = ref(storage, `resumes/${userId}`);
    const result = await listAll(listRef);
    return await Promise.all(result.items.map(item => getDownloadURL(item)));
  } catch (error) {
    console.error('List files error:', error);
    throw StorageError.fromFirebaseError(error);
  }
}