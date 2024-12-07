import React from 'react';
import { Download } from 'lucide-react';
import JSZip from 'jszip';
import { 
  generateCoverPage, 
  mergePDFWithCover, 
  createDownloadLink 
} from '../lib/document';
import { useStore } from '../store/useStore';
import type { Assessment } from '../types';

interface AssessButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
  assessment: Assessment | null;
}

export function AssessButton({ onClick, disabled, isLoading, assessment }: AssessButtonProps) {
  const { resume } = useStore();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDownload = async () => {
    if (!assessment || !resume.file) return;

    try {
      setIsProcessing(true);
      const fileName = `${assessment.candidateName.replace(/\s+/g, '_')}_Resume_Assessment`;
      const coverPage = await generateCoverPage(assessment, '/neev-logo.svg');

      if (resume.file.type === 'application/pdf') {
        const mergedPdf = await mergePDFWithCover(coverPage, resume.file);
        createDownloadLink(mergedPdf, {
          filename: `${fileName}.pdf`,
          type: 'application/pdf'
        });
      } else {
        const zip = new JSZip();
        zip.file('01_Assessment_Summary.pdf', coverPage);
        zip.file(`02_${fileName}.${resume.file.name.split('.').pop()}`, resume.file);
        
        const zipContent = await zip.generateAsync({ type: 'blob' });
        createDownloadLink(zipContent, {
          filename: `${fileName}.zip`,
          type: 'application/zip'
        });
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      alert('Failed to process documents. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex-1 py-3 px-4 rounded-lg font-medium text-white
          ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {isLoading ? 'Analyzing...' : 'Assess Match'}
      </button>
      
      {assessment && (
        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className={`py-3 px-4 rounded-lg font-medium text-white 
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'} 
            flex items-center gap-2`}
        >
          <Download className="w-5 h-5" />
          {isProcessing ? 'Processing...' : 'Download Assessment'}
        </button>
      )}
    </div>
  );
}