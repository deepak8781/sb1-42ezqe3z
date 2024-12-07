import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import type { CVDocument, SearchResult, VectorSearchOptions } from './types';
import { VECTOR_CONFIG, SIMILARITY_THRESHOLD, OPENAI_CONFIG } from './config';

export class VectorStore {
  private client: Pinecone;
  private embeddings: OpenAIEmbeddings;
  private index: any;

  constructor(pineconeApiKey: string, openAIApiKey: string) {
    if (!pineconeApiKey) {
      throw new Error('Pinecone API key is required');
    }
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new Pinecone({ 
      apiKey: pineconeApiKey
    });
    
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey,
      modelName: OPENAI_CONFIG.model
    });

    this.index = this.client.index(VECTOR_CONFIG.pinecone.indexName);
  }

  async addDocument(document: CVDocument): Promise<void> {
    try {
      const vector = await this.embeddings.embedQuery(document.content);
      
      await this.index.upsert({
        id: document.id,
        values: vector,
        metadata: {
          ...document.metadata,
          content: document.content.slice(0, 1000) // Store truncated content for preview
        }
      });
    } catch (error) {
      console.error('Error adding document:', error);
      throw new Error('Failed to add document to vector store');
    }
  }

  async searchSimilar(
    query: string, 
    userId: string,
    options: VectorSearchOptions = {}
  ): Promise<SearchResult[]> {
    try {
      const { 
        limit = 5, 
        threshold = SIMILARITY_THRESHOLD 
      } = options;

      const queryVector = await this.embeddings.embedQuery(query);

      const results = await this.index.query({
        vector: queryVector,
        topK: limit,
        filter: { userId: { $eq: userId } },
        includeMetadata: true,
        includeValues: false
      });

      return results.matches
        .filter(match => match.score >= threshold)
        .map(match => ({
          document: {
            id: match.id,
            content: match.metadata.content,
            metadata: {
              userId: match.metadata.userId,
              fileName: match.metadata.fileName,
              uploadDate: match.metadata.uploadDate,
              fileType: match.metadata.fileType
            }
          },
          score: match.score
        }));
    } catch (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  async deleteDocument(documentId: string, userId: string): Promise<void> {
    try {
      await this.index.deleteOne(documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }
}