export const MOCK_ASSESSMENT = {
  overallMatch: 85,
  skillsAnalysis: {
    present: ['React', 'TypeScript', 'Node.js'],
    missing: ['Python', 'AWS'],
    score: 80
  },
  experienceMatch: {
    score: 90,
    feedback: 'Strong relevant experience in software development'
  },
  educationFit: {
    score: 85,
    feedback: 'Meets educational requirements'
  },
  recommendations: [
    'Add more detail about AWS experience',
    'Highlight Python projects',
    'Include more quantitative results'
  ],
  interviewQuestions: [
    'Describe a challenging project where you used React and TypeScript',
    'How do you approach learning new technologies?',
    'Tell me about your experience with cloud platforms',
    'How do you handle technical disagreements in a team?',
    'How do you approach code review?'
  ]
};