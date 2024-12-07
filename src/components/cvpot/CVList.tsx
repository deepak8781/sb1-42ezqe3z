import React from 'react';
import { FileText, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { useCVPotStore } from '../../store/useCVPotStore';
import { formatDate } from '../../lib/utils';

export function CVList() {
  const { documents, deleteDocument, isLoading, error } = useCVPotStore();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No CVs uploaded yet
      </div>
    );
  }

  const handleDownload = (url: string, fileName: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{doc.metadata.fileName}</p>
                <CheckCircle2 
                  className="w-4 h-4 text-green-500" 
                  title="Document vectorized and searchable"
                />
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(doc.metadata.uploadDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownload(doc.url, doc.metadata.fileName)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              aria-label="Download CV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteDocument(doc.id, doc.metadata.userId)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete CV"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}