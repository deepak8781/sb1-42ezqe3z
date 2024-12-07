import React from 'react';
import { Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateCoverPage, mergePDFWithCover, createDownloadLink } from '../lib/document';
import { QuestionSection } from './assessment/QuestionSection';
import JSZip from 'jszip';
import type { Assessment } from '../types';

interface Props {
  assessment: Assessment | null;
  isLoading: boolean;
}

export function AssessmentResult({ assessment, isLoading }: Props) {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!assessment) return null;

  const experienceQuestions = assessment.interviewQuestions.slice(0, 3);
  const technicalQuestions = assessment.interviewQuestions.slice(3, 6);
  const skillsQuestions = assessment.interviewQuestions.slice(6, 8);

  return (
    <div className="prose max-w-none p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold m-0">
            Resume Evaluation: {assessment.candidateName} for {assessment.position} - {assessment.overallMatch}% Match
          </h1>
          <div className="flex gap-4 text-gray-600">
            <span>Total Experience: {assessment.totalExperience} years</span>
            <span>Relevant Experience: {assessment.relevantExperience} years</span>
          </div>
        </div>
        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className={`py-2 px-4 rounded-lg font-medium text-white 
            ${isProcessing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'} 
            flex items-center gap-2 ml-4 h-10`}
        >
          <Download className="w-5 h-5" />
          {isProcessing ? 'Processing...' : 'Download Assessment'}
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Experience</h2>
        <h3 className="text-lg font-medium mb-2">Direct Matches:</h3>
        <ul>
          {assessment.experienceMatch.feedback.split('. ').map((match, index) => (
            <li key={index}>{match}</li>
          ))}
        </ul>
        
        <h3 className="text-lg font-medium mb-2 mt-4">Gaps:</h3>
        <ul>
          {assessment.experienceMatch.gaps.map((gap, index) => (
            <li key={index}>{gap}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Skills and Technologies</h2>
        <h3 className="text-lg font-medium mb-2">Direct Matches:</h3>
        <ul>
          {assessment.skillsAnalysis.present.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
        
        <h3 className="text-lg font-medium mb-2 mt-4">Gaps:</h3>
        <ul>
          {assessment.skillsAnalysis.missing.map((gap, index) => (
            <li key={index}>{gap}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Certifications and Education</h2>
        <h3 className="text-lg font-medium mb-2">Direct Matches:</h3>
        <ul>
          {assessment.educationFit.feedback.split('. ').map((match, index) => (
            <li key={index}>{match}</li>
          ))}
        </ul>
        
        <h3 className="text-lg font-medium mb-2 mt-4">Gaps:</h3>
        <ul>
          {assessment.educationFit.gaps.map((gap, index) => (
            <li key={index}>{gap}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Generated Questions for Assessment</h2>
        
        <QuestionSection
          title="Experience Verification"
          questions={experienceQuestions}
          count={3}
          description="Write targeted questions to verify critical experience claims"
        />

        <QuestionSection
          title="Technical Deep-Dive"
          questions={technicalQuestions}
          count={3}
          description="Create technical questions based on JD requirements absent in the resume"
        />

        <QuestionSection
          title="Skills Assessment"
          questions={skillsQuestions}
          count={2}
          description="Craft questions to assess the candidate's expertise in missing or unclear skills"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recommendation</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {assessment.recommendations.map((rec, index) => (
            <p key={index} className="mb-2">{rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
}