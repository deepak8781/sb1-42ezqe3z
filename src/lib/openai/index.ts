import OpenAI from 'openai';
import type { Assessment } from '../../types';

const SYSTEM_PROMPT = `You are an expert ATS and recruitment specialist. Analyze the provided resume against the job description using the following criteria:

Resume Evaluation: [Candidate Name] for [Position] - Match [X%]
Total Years of Experience: [X] years
Relevant Years of Experience: [X] years

1. Experience
Direct Matches:
[List specific experience matching JD requirements, including roles, responsibilities, and years of experience]

Gaps:
[List the missing or partially fulfilled experience requirements with reasoning]

2. Skills and Technologies
Direct Matches:
[List confirmed technical skills/tools explicitly mentioned in the resume that align with the JD]

Gaps:
[List missing or unclear skills based on JD requirements]

3. Certifications and Education
Direct Matches:
[List relevant certifications, degrees, or courses from the resume that match the JD]

Gaps:
[List required qualifications missing from the resume]

Generated Questions for Assessment:

Experience Verification (3 Questions):
1. [Write first targeted question to verify critical experience claims]
2. [Write second targeted question to verify critical experience claims]
3. [Write third targeted question to verify critical experience claims]

Technical Deep-Dive (3 Questions):
1. [Write first technical question based on JD requirements absent in the resume]
2. [Write second technical question based on JD requirements absent in the resume]
3. [Write third technical question based on JD requirements absent in the resume]

Skills Assessment (2 Questions):
1. [Write first question to assess expertise in missing or unclear skills]
2. [Write second question to assess expertise in missing or unclear skills]

Recommendation:
Provide one of the following:
- Fit: Candidate meets the JD requirements adequately with minimal gaps. Proceed to the next round.
- Partial Fit: Candidate meets most JD requirements but has significant gaps. Needs further clarification.
- Not Fit: Candidate lacks essential qualifications or skills and should not be considered further.

[Brief explanation of recommendation with specific reasons]`;

export async function analyzeResume(
  resume: string,
  jobDescription: string,
  apiKey: string
): Promise<Assessment> {
  const openai = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Resume:\n${resume}\n\nJob Description:\n${jobDescription}\n\nProvide a detailed evaluation following the exact format specified.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const analysis = response.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error('Failed to get analysis from OpenAI');
    }

    return parseFormattedAnalysis(analysis);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to analyze resume. Please try again.');
  }
}

function parseFormattedAnalysis(analysis: string): Assessment {
  try {
    // Extract candidate name, position, and match percentage
    const titleMatch = analysis.match(/Resume Evaluation:\s*(.*?)\s*for\s*(.*?)\s*-\s*Match\s*(\d+)%/i);
    if (!titleMatch) {
      throw new Error('Failed to parse basic assessment information');
    }

    const candidateName = titleMatch[1].trim();
    const position = titleMatch[2].trim();
    const overallMatch = parseInt(titleMatch[3], 10);

    // Extract experience years
    const totalExpMatch = analysis.match(/Total Years of Experience:\s*(\d+)/i);
    const relevantExpMatch = analysis.match(/Relevant Years of Experience:\s*(\d+)/i);
    const totalExperience = parseInt(totalExpMatch?.[1] || '0', 10);
    const relevantExperience = parseInt(relevantExpMatch?.[1] || '0', 10);

    // Extract sections
    const experienceSection = extractSection(analysis, '1\\. Experience', '2\\. Skills');
    const skillsSection = extractSection(analysis, '2\\. Skills', '3\\. Certifications');
    const educationSection = extractSection(analysis, '3\\. Certifications', 'Generated Questions');
    const questionsSection = extractSection(analysis, 'Generated Questions', 'Recommendation');
    const recommendationSection = extractSection(analysis, 'Recommendation', '$');

    // Parse sections
    const experienceMatches = extractListItems(extractSubSection(experienceSection, 'Direct Matches'));
    const experienceGaps = extractListItems(extractSubSection(experienceSection, 'Gaps'));
    const skillsMatches = extractListItems(extractSubSection(skillsSection, 'Direct Matches'));
    const skillsGaps = extractListItems(extractSubSection(skillsSection, 'Gaps'));
    const educationMatches = extractListItems(extractSubSection(educationSection, 'Direct Matches'));
    const educationGaps = extractListItems(extractSubSection(educationSection, 'Gaps'));

    // Extract questions using numbered format
    const experienceQuestions = extractNumberedQuestions(questionsSection, 'Experience Verification');
    const technicalQuestions = extractNumberedQuestions(questionsSection, 'Technical Deep-Dive');
    const skillsQuestions = extractNumberedQuestions(questionsSection, 'Skills Assessment');
    
    const allQuestions = [
      ...experienceQuestions,
      ...technicalQuestions,
      ...skillsQuestions
    ];

    // Extract recommendation
    const recommendation = recommendationSection
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join('\n');

    return {
      candidateName,
      position,
      overallMatch,
      totalExperience,
      relevantExperience,
      skillsAnalysis: {
        present: skillsMatches,
        missing: skillsGaps,
        score: calculateSectionScore(skillsMatches, skillsGaps)
      },
      experienceMatch: {
        score: calculateSectionScore(experienceMatches, experienceGaps),
        feedback: experienceMatches.join('. '),
        gaps: experienceGaps
      },
      educationFit: {
        score: calculateSectionScore(educationMatches, educationGaps),
        feedback: educationMatches.join('. '),
        gaps: educationGaps
      },
      recommendations: [recommendation],
      interviewQuestions: allQuestions
    };
  } catch (error) {
    console.error('Error parsing analysis:', error);
    throw new Error('Failed to parse analysis results');
  }
}

function extractSection(text: string, startSection: string, endSection: string): string {
  const pattern = new RegExp(`${startSection}([\\s\\S]*?)(?=${endSection}|$)`);
  return text.match(pattern)?.[1]?.trim() || '';
}

function extractSubSection(section: string, subSectionName: string): string {
  const pattern = new RegExp(`${subSectionName}:[\\s\\S]*?(?=(?:Direct Matches:|Gaps:|Experience Verification|Technical Deep-Dive|Skills Assessment|$))`);
  return section.match(pattern)?.[0]?.trim() || '';
}

function extractListItems(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.replace(/^[•\-\d.\s]+/, '').trim())
    .filter(Boolean);
}

function extractNumberedQuestions(text: string, sectionName: string): string[] {
  const sectionPattern = new RegExp(`${sectionName}[^:]*:\\s*([\\s\\S]*?)(?=(?:Technical Deep-Dive|Skills Assessment|Recommendation|$))`, 'i');
  const sectionMatch = text.match(sectionPattern);
  
  if (!sectionMatch?.[1]) return [];
  
  return sectionMatch[1]
    .split('\n')
    .map(line => {
      const questionMatch = line.match(/^\d+\.\s*(.+)/);
      return questionMatch?.[1]?.trim();
    })
    .filter((q): q is string => Boolean(q));
}

function calculateSectionScore(matches: string[], gaps: string[]): number {
  const totalItems = matches.length + gaps.length;
  if (totalItems === 0) return 0;
  return Math.round((matches.length / totalItems) * 100);
}