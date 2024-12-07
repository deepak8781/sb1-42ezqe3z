import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FileUpload } from '../FileUpload';
import { CVList } from './CVList';
import { useCVPotStore } from '../../store/useCVPotStore';
import { SUPPORTED_TYPES } from '../../lib/parser';
import { useAuthStore } from '../../store/useAuthStore';

export function CVPotModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuthStore();
  const { addDocument } = useCVPotStore();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      if (!user?.id) {
        throw new Error('Please sign in to upload documents');
      }

      const document = {
        userId: user.id,
        file,
        metadata: {
          fileName: file.name,
          fileType: file.type,
          uploadDate: new Date().toISOString()
        }
      };

      await addDocument(document);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      console.error('Upload error:', errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">CV Storage</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Upload New CV</h3>
            <FileUpload
              onFileAccepted={handleFileUpload}
              accept={SUPPORTED_TYPES}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Your CVs</h3>
            <CVList />
          </div>
        </div>
      </div>
    </div>
  );
}