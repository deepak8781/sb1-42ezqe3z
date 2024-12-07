export interface Assessment {
  overallMatch: number;
  skillsAnalysis: {
    present: string[];
    missing: string[];
    score: number;
  };
  experienceMatch: {
    score: number;
    feedback: string;
  };
  educationFit: {
    score: number;
    feedback: string;
  };
  recommendations: string[];
  interviewQuestions: string[];
}