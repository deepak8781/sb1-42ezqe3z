import { jsPDF } from 'jspdf';
import type { Assessment } from '../../types';
import type { DocumentGeneratorOptions } from './types';
import { useStore } from '../../store/useStore';

export async function generateCoverPage(
  assessment: Assessment,
  _logoUrl: string,
  options: DocumentGeneratorOptions = {}
): Promise<Blob> {
  const store = useStore.getState();
  const { agencyName, logoText } = store;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: options.size || 'a4'
  });

  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const labelWidth = 45; // Width for labels
  let yPos = 20; // Starting position

  // Add logo text
  doc.setTextColor('#fcba5a');
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(logoText, margin, yPos);

  // Add header information with proper spacing
  yPos += 25; // Increased space after logo
  doc.setTextColor('#000000');
  doc.setFontSize(12);
  
  // Agency Name
  doc.setFont('helvetica', 'bold');
  doc.text('Agency Name:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(agencyName, margin + labelWidth, yPos);
  
  // Candidate Name
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Candidate Name:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.candidateName, margin + labelWidth, yPos);
  
  // Position
  yPos += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Position:', margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(assessment.position, margin + labelWidth, yPos);

  // Overall match percentage
  yPos += 25;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall Match: ${assessment.overallMatch}%`, pageWidth / 2, yPos, {
    align: 'center'
  });

  // Experience section
  yPos += 25;
  doc.setTextColor('#075e54');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Experience Match:', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const experiences = assessment.experienceMatch.feedback
    .split('. ')
    .filter(exp => exp.trim() && !exp.toLowerCase().includes('missing') && !exp.toLowerCase().includes('gap'));
  
  experiences.forEach(exp => {
    if (exp.trim()) {
      const lines = doc.splitTextToSize(`• ${exp}`, pageWidth - (margin * 2));
      lines.forEach(line => {
        doc.text(line, margin + 5, yPos);
        yPos += 6;
      });
    }
  });

  // Skills section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Skills and Technologies Match:', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  assessment.skillsAnalysis.present.forEach(skill => {
    if (skill.trim()) {
      const lines = doc.splitTextToSize(`• ${skill}`, pageWidth - (margin * 2));
      lines.forEach(line => {
        doc.text(line, margin + 5, yPos);
        yPos += 6;
      });
    }
  });

  // Education section
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Education and Certifications Match:', margin, yPos);
  yPos += 8;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const educationMatches = assessment.educationFit.feedback
    .split('. ')
    .filter(edu => edu.trim() && !edu.toLowerCase().includes('missing') && !edu.toLowerCase().includes('gap'));
  
  educationMatches.forEach(point => {
    if (point.trim()) {
      const lines = doc.splitTextToSize(`• ${point}`, pageWidth - (margin * 2));
      lines.forEach(line => {
        doc.text(line, margin + 5, yPos);
        yPos += 6;
      });
    }
  });

  return new Blob([doc.output('blob')], { type: 'application/pdf' });
}