import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uploadFile, deleteFile, getUserFiles, StorageError } from '../lib/firebase/storage';
import { PineconeService } from '../lib/pinecone';
import { parseFile } from '../lib/parser';

interface Document {
  id: string;
  url: string;
  metadata: {
    userId: string;
    fileName: string;
    uploadDate: string;
    fileType: string;
    isVectorized: boolean;
  };
}

interface UploadDocument {
  userId: string;
  file: File;
  metadata: {
    fileName: string;
    fileType: string;
    uploadDate: string;
  };
}

interface CVPotState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  addDocument: (doc: UploadDocument) => Promise<void>;
  deleteDocument: (documentId: string, userId: string) => Promise<void>;
  loadUserDocuments: (userId: string) => Promise<void>;
}

export const useCVPotStore = create<CVPotState>()(
  persist(
    (set, get) => ({
      documents: [],
      isLoading: false,
      error: null,

      addDocument: async ({ userId, file, metadata }) => {
        set({ isLoading: true, error: null });
        try {
          const url = await uploadFile(file, userId);
          const content = await parseFile(file);
          
          const document: Document = {
            id: crypto.randomUUID(),
            url,
            metadata: {
              userId,
              fileName: metadata.fileName,
              uploadDate: metadata.uploadDate,
              fileType: metadata.fileType,
              isVectorized: false
            }
          };

          const pineconeService = await PineconeService.getInstance(process.env.VITE_OPENAI_API_KEY!);
          await pineconeService.indexDocument(
            document.id,
            content,
            document.metadata
          );

          document.metadata.isVectorized = true;

          set(state => ({
            documents: [...state.documents, document],
            isLoading: false
          }));
        } catch (error) {
          console.error('Error adding document:', error);
          const message = error instanceof StorageError ? error.message : 'Failed to upload document';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      deleteDocument: async (documentId: string, userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const document = get().documents.find(doc => doc.id === documentId);
          if (!document) throw new Error('Document not found');

          await deleteFile(document.url, userId);

          const pineconeService = await PineconeService.getInstance(process.env.VITE_OPENAI_API_KEY!);
          await pineconeService.deleteDocument(documentId);

          set(state => ({
            documents: state.documents.filter(doc => doc.id !== documentId),
            isLoading: false
          }));
        } catch (error) {
          console.error('Error deleting document:', error);
          const message = error instanceof StorageError ? error.message : 'Failed to delete document';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      loadUserDocuments: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const urls = await getUserFiles(userId);
          const documents = urls.map(url => ({
            id: crypto.randomUUID(),
            url,
            metadata: {
              userId,
              fileName: url.split('/').pop() || 'Unknown',
              uploadDate: new Date().toISOString(),
              fileType: 'application/pdf',
              isVectorized: true
            }
          }));

          set({ documents, isLoading: false });
        } catch (error) {
          console.error('Error loading documents:', error);
          const message = error instanceof StorageError ? error.message : 'Failed to load documents';
          set({ error: message, isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'cvpot-storage',
      partialize: (state) => ({
        documents: state.documents
      })
    }
  )
);