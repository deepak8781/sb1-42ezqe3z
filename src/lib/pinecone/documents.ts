import { index } from './client';
import type { CVDocument } from '../types';

export async function indexDocument(document: CVDocument, embedding: number[]): Promise<void> {
  try {
    await index.upsert([{
      id: document.id,
      values: embedding,
      metadata: {
        userId: document.metadata.userId,
        fileName: document.metadata.fileName,
        fileType: document.metadata.fileType,
        uploadDate: document.metadata.uploadDate
      }
    }]);
  } catch (error) {
    console.error('Error indexing document:', error);
    throw new Error('Failed to index document in Pinecone');
  }
}

export async function deleteDocument(documentId: string): Promise<void> {
  try {
    await index.deleteOne(documentId);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document from Pinecone');
  }
}

export async function searchSimilarDocuments(
  embedding: number[],
  userId: string,
  limit: number = 5
): Promise<any[]> {
  try {
    const results = await index.query({
      vector: embedding,
      topK: limit,
      filter: { userId: { $eq: userId } },
      includeMetadata: true
    });

    return results.matches;
  } catch (error) {
    console.error('Error searching documents:', error);
    throw new Error('Failed to search documents in Pinecone');
  }
}