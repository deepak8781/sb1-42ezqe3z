import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import type { FileUploadProps } from '../types';

export function FileUpload({ onFileAccepted, accept, maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles?.[0]) {
      try {
        await onFileAccepted(acceptedFiles[0]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to process file');
        console.error('Error processing file:', error);
      }
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  const file = acceptedFiles?.[0];

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${error ? 'border-red-300 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-600">
          {file && !error ? (
            <>
              <FileText className="w-8 h-8 mb-2 text-blue-500" />
              <p className="text-sm font-medium text-center text-blue-500">
                {file.name}
              </p>
            </>
          ) : (
            <>
              {error ? (
                <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
              ) : (
                <Upload className="w-8 h-8 mb-2" />
              )}
              <p className="text-sm text-center">
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag and drop a file here, or click to select'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOCX (Max 5MB)
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}