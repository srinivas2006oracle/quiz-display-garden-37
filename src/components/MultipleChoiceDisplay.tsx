
import React from 'react';
import { MultipleChoiceQuestion } from '../models/QuestionTypes';
import { cn } from '../lib/utils';

interface MultipleChoiceDisplayProps {
  question: MultipleChoiceQuestion;
  showAnswer: boolean;
}

const MultipleChoiceDisplay: React.FC<MultipleChoiceDisplayProps> = ({ question, showAnswer }) => {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="text-xl font-medium">{question.text}</div>
      
      {question.imageSrc && (
        <div className="my-4">
          <img 
            src={question.imageSrc} 
            alt="Question image" 
            className="max-w-full rounded-lg max-h-48 object-contain mx-auto"
          />
        </div>
      )}
      
      <div className="flex flex-col gap-3 mt-2">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200",
              showAnswer && option.isCorrect 
                ? "bg-purple-100 border-purple-500 text-purple-900" 
                : showAnswer && !option.isCorrect
                  ? "bg-gray-100 border-gray-300 text-gray-500 opacity-70" 
                  : "bg-white border-gray-200 hover:border-purple-300"
            )}
          >
            {option.text}
            {showAnswer && option.isCorrect && (
              <span className="ml-2 inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoiceDisplay;
