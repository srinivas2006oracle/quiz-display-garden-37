
export const animationVariants = {
  question: {
    enter: "animate-fade-in",
    exit: "animate-fade-out",
    background: "bg-gradient-to-r from-quiz-purple to-quiz-blue",
  },
  response: {
    enter: "animate-slide-in-right",
    exit: "animate-slide-out-right",
    background: "bg-gradient-to-r from-quiz-blue to-quiz-purple",
  },
  image: {
    enter: "animate-scale-in",
    exit: "animate-scale-out",
    background: "bg-gradient-to-r from-quiz-purple to-quiz-blue",
  },
  video: {
    enter: "animate-fade-in",
    exit: "animate-fade-out",
    background: "bg-gradient-to-r from-quiz-purple to-quiz-blue",
  },
  answer: {
    enter: "animate-scale-in",
    exit: "animate-scale-out",
    background: "bg-gradient-to-r from-quiz-blue to-quiz-purple",
  },
  fastestAnswers: {
    enter: "animate-fade-in",
    exit: "animate-fade-out",
    background: "bg-gradient-to-r from-quiz-purple to-quiz-blue",
  },
  leaderboard: {
    enter: "animate-slide-in-right",
    exit: "animate-slide-out-right",
    background: "bg-gradient-to-r from-quiz-blue to-quiz-purple",
  },
  upcomingSchedule: {
    enter: "animate-fade-in",
    exit: "animate-fade-out",
    background: "bg-gradient-to-r from-quiz-purple to-quiz-blue",
  },
};

export const getAnimationForType = (type: string) => {
  return animationVariants[type as keyof typeof animationVariants] || animationVariants.question;
};
