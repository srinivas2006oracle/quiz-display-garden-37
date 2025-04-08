
import React from 'react';
import { Question, QuestionDisplayProps } from '../models/QuestionTypes';
import MultipleChoiceDisplay from './MultipleChoiceDisplay';
import FillInBlankDisplay from './FillInBlankDisplay';

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, showAnswer = false }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {question.type === 'multiple-choice' && (
        <MultipleChoiceDisplay 
          question={question} 
          showAnswer={showAnswer} 
        />
      )}
      
      {question.type === 'fill-in-blank' && (
        <FillInBlankDisplay 
          question={question} 
          showAnswer={showAnswer} 
        />
      )}
    </div>
  );
};

export default QuestionDisplay;
