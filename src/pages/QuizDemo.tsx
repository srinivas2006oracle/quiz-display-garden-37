
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import QuestionDisplay from '../components/QuestionDisplay';
import { Question } from '../models/QuestionTypes';

// Sample questions for demonstration
const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    text: 'What is the capital of France?',
    options: [
      { id: 'a', text: 'London', isCorrect: false },
      { id: 'b', text: 'Paris', isCorrect: true },
      { id: 'c', text: 'Berlin', isCorrect: false },
      { id: 'd', text: 'Madrid', isCorrect: false }
    ]
  },
  {
    id: '2',
    type: 'fill-in-blank',
    text: 'Who wrote the play "Romeo and Juliet"?',
    answer: 'William Shakespeare'
  },
  {
    id: '3',
    type: 'multiple-choice',
    text: 'Which planet is known as the Red Planet?',
    imageSrc: '/placeholder.svg',
    options: [
      { id: 'a', text: 'Venus', isCorrect: false },
      { id: 'b', text: 'Mars', isCorrect: true },
      { id: 'c', text: 'Jupiter', isCorrect: false },
      { id: 'd', text: 'Saturn', isCorrect: false }
    ]
  }
];

const QuizDemo = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  
  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleNextQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => 
      (prev + 1) % sampleQuestions.length
    );
  };
  
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Quiz Demo</h1>
      <p className="mb-6 text-gray-600">
        This demo shows how both question types are displayed, with and without answers.
      </p>
      
      <div className="mb-8">
        <div className="mb-2 text-sm font-medium text-gray-500">
          Question {currentQuestionIndex + 1} of {sampleQuestions.length} 
          ({currentQuestion.type})
        </div>
        
        <QuestionDisplay 
          question={currentQuestion}
          showAnswer={showAnswer}
        />
      </div>
      
      <div className="flex justify-center gap-4">
        {!showAnswer ? (
          <Button onClick={handleRevealAnswer} className="bg-purple-600 hover:bg-purple-700">
            Reveal Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizDemo;
