import React from 'react';
import { FileUpload } from './FileUpload';
import { SUPPORTED_TYPES } from '../lib/parser';

interface UploadSectionProps {
  onJobDescriptionUpload: (file: File) => void;
  onResumeUpload: (file: File) => void;
}

export function UploadSection({ onJobDescriptionUpload, onResumeUpload }: UploadSectionProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold mb-4">Job Description</h2>
        <FileUpload
          onFileAccepted={onJobDescriptionUpload}
          accept={SUPPORTED_TYPES}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Resume</h2>
        <FileUpload
          onFileAccepted={onResumeUpload}
          accept={SUPPORTED_TYPES}
        />
      </div>
    </div>
  );
}