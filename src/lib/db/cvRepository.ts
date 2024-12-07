import { db } from './client';
import { generateEmbedding } from '../vector/embeddings';
import type { CVDocument } from '../vector/types';

export class CVRepository {
  async addCV(document: CVDocument): Promise<void> {
    const embedding = await generateEmbedding(document.content);
    
    await db.execute({
      sql: `INSERT INTO cv_documents (id, user_id, file_name, content, file_type, upload_date, embedding)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        document.id,
        document.metadata.userId,
        document.metadata.fileName,
        document.content,
        document.metadata.fileType,
        document.metadata.uploadDate,
        Buffer.from(embedding.buffer)
      ]
    });
  }

  async findSimilarCVs(query: string, userId: string, limit: number = 5): Promise<CVDocument[]> {
    const queryEmbedding = await generateEmbedding(query);
    
    // Cosine similarity search using dot product (since vectors are normalized)
    const results = await db.execute({
      sql: `WITH similarity_scores AS (
              SELECT 
                id,
                user_id,
                file_name,
                content,
                file_type,
                upload_date,
                (embedding * ?) as similarity
              FROM cv_documents
              WHERE user_id = ?
              ORDER BY similarity DESC
              LIMIT ?
            )
            SELECT * FROM similarity_scores`,
      args: [
        Buffer.from(queryEmbedding.buffer),
        userId,
        limit
      ]
    });

    return results.rows.map(row => ({
      id: row.id,
      content: row.content,
      metadata: {
        userId: row.user_id,
        fileName: row.file_name,
        fileType: row.file_type,
        uploadDate: row.upload_date
      }
    }));
  }

  async deleteCV(id: string, userId: string): Promise<void> {
    await db.execute({
      sql: 'DELETE FROM cv_documents WHERE id = ? AND user_id = ?',
      args: [id, userId]
    });
  }

  async getUserCVs(userId: string): Promise<CVDocument[]> {
    const results = await db.execute({
      sql: `SELECT * FROM cv_documents WHERE user_id = ? ORDER BY upload_date DESC`,
      args: [userId]
    });

    return results.rows.map(row => ({
      id: row.id,
      content: row.content,
      metadata: {
        userId: row.user_id,
        fileName: row.file_name,
        fileType: row.file_type,
        uploadDate: row.upload_date
      }
    }));
  }
}