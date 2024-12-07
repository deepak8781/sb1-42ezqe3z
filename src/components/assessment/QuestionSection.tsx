import React from 'react';

interface QuestionSectionProps {
  title: string;
  questions: string[];
  count: number;
  description: string;
}

export function QuestionSection({ title, questions, count, description }: QuestionSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2 text-gray-800">
        {title} ({count} Questions)
      </h3>
      <p className="text-sm text-gray-600 mb-3 italic">{description}</p>
      <ol className="list-decimal list-inside space-y-2">
        {questions.map((question, index) => (
          <li key={index} className="text-gray-700">{question}</li>
        ))}
      </ol>
    </div>
  );
}