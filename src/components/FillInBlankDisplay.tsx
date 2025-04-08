
import React from 'react';
import { FillInBlankQuestion } from '../models/QuestionTypes';

interface FillInBlankDisplayProps {
  question: FillInBlankQuestion;
  showAnswer: boolean;
}

const FillInBlankDisplay: React.FC<FillInBlankDisplayProps> = ({ question, showAnswer }) => {
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
      
      {showAnswer && (
        <div className="mt-4 p-4 bg-purple-100 border border-purple-300 rounded-lg">
          <div className="font-medium text-lg text-purple-900">Answer:</div>
          <div className="text-xl mt-2">{question.answer}</div>
        </div>
      )}
    </div>
  );
};

export default FillInBlankDisplay;
