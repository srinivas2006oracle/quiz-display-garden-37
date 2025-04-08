
export type QuestionType = "multiple-choice" | "fill-in-blank";

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  imageSrc?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface FillInBlankQuestion extends BaseQuestion {
  type: "fill-in-blank";
  answer: string;
}

export type Question = MultipleChoiceQuestion | FillInBlankQuestion;

export interface QuestionDisplayProps {
  question: Question;
  showAnswer?: boolean;
}
