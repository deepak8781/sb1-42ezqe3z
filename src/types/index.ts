export interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  accept: Record<string, string[]>;
  maxSize?: number;
}

export interface Assessment {
  candidateName: string;
  position: string;
  overallMatch: number;
  totalExperience: number;
  relevantExperience: number;
  skillsAnalysis: {
    present: string[];
    missing: string[];
    score: number;
  };
  experienceMatch: {
    score: number;
    feedback: string;
    gaps: string[];
  };
  educationFit: {
    score: number;
    feedback: string;
    gaps: string[];
  };
  recommendations: string[];
  interviewQuestions: string[];
}