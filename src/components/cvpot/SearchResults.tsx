import React from 'react';
import { FileText } from 'lucide-react';
import { useCVPotStore } from '../../store/useCVPotStore';
import { formatDate } from '../../lib/utils';

export function SearchResults() {
  const { searchResults, isLoading } = useCVPotStore();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!searchResults.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No matching CVs found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchResults.map(({ document, score }) => (
        <div
          key={document.id}
          className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">{document.metadata.fileName}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(document.metadata.uploadDate)}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {Math.round(score * 100)}% match
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {document.content.slice(0, 200)}...
          </p>
        </div>
      ))}
    </div>
  );
}