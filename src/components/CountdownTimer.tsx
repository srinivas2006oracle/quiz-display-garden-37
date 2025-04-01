import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface CountdownTimerProps {
  duration: number; // duration in milliseconds
  onComplete?: () => void;
  isQuestion?: boolean; // Add this prop to determine if it's a question or answer
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ duration, onComplete, isQuestion = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Reset timer when duration changes
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 100;
        const newProgress = (newTime / duration) * 100;
        setProgress(Math.max(0, newProgress));
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [timeLeft, duration, onComplete]);

  // Format time to show seconds
  const secondsLeft = Math.ceil(timeLeft / 1000);

  // Determine the title based on isQuestion prop
  const timerTitle = isQuestion ? 'Answer in...' : 'Next Question in...';

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs text-white/70">
        <span>{timerTitle}</span>
        <span>{secondsLeft}s</span>
      </div>
      <Progress value={progress} className="h-1.5 bg-white/10" />
    </div>
  );
};

export default CountdownTimer;
