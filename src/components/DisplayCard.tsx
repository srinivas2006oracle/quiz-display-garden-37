
import React, { useEffect, useState } from 'react';
import { DisplayData } from '@/lib/sampleData';
import { getAnimationForType } from '@/lib/animationUtils';
import { Check, HelpCircle, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';

interface DisplayCardProps {
  data: DisplayData;
  isVisible: boolean;
  isPortrait: boolean;
  duration?: number;
  questionIndex?: number;
  totalQuestions?: number;
}

const DisplayCard: React.FC<DisplayCardProps> = ({
  data,
  isVisible,
  isPortrait,
  duration,
  questionIndex,
  totalQuestions
}) => {
  const { type } = data;
  const displayType = type === 'response' ? 'responses' : type === 'fastestAnswers' ? 'superSix' : type;
  const animation = getAnimationForType(type);
  const animationClass = isVisible ? animation.enter : animation.exit;

  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Show confetti for answers
      if (type === 'answer') {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
      }

      const itemTypes = ['question'];
      if (itemTypes.includes(type)) {
        setAnimatedItems([]);
        const items = type === 'question' ?
          ((data.data as any).choices || []).length : 0;

        for (let i = 0; i < items; i++) {
          setTimeout(() => {
            setAnimatedItems(prev => [...prev, i]);
          }, i * 150);
        }
      }
    } else {
      setAnimatedItems([]);
    }
  }, [isVisible, data, type]);

  const renderIcon = () => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-7 w-7 text-yellow-300" />;
      case 'answer':
        return <Check className="h-7 w-7 text-green-400" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'question':
        return renderQuestion();
      case 'image':
        return renderImage();
      case 'video':
        return renderVideo();
      case 'answer':
        return renderAnswer();
      case 'upcomingSchedule':
        return renderUpcomingSchedule();
      case 'credits':
        return renderCredits();
      case 'disclaimer':
        return renderDisclaimer();
      default:
        return <div>Unknown type</div>;
    }
  };

  const renderQuestion = () => {
    const question = data.data as any;
    const optionIdentifiers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    return (
      <div className="flex flex-col items-center w-full h-full">

        {question.text && (
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">
            {question.text}

          </h2>
        )}

        <div className="flex flex-col md:flex-row w-full gap-8 justify-center items-center">
          {question.image && (
            <div className="w-full md:w-2/5 flex justify-center">
              <img
                src={question.image}
                alt="Question"
                className="max-w-full h-auto object-contain rounded-lg max-h-[30vh]"
              />
            </div>
          )}

          {question.choices && (
            <div className="grid grid-cols-1 gap-4 w-full md:w-1/2">
              {question.choices.map((choice: string, index: number) => (
                <div
                  key={index}
                  className={`p-4 bg-white/20 rounded-lg text-white font-bold text-xl md:text-2xl transform transition-all duration-300 text-left ${animatedItems.includes(index) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                    }`}
                >
                  <span className="font-bold mr-3 text-yellow-300">{optionIdentifiers[index]})</span> {choice}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    );
  };

  const renderImage = () => {
    const image = data.data as any;
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {image.url && (
          <div className="w-full flex justify-center items-center">
            <img
              src={image.url}
              alt={image.name || 'Image'}
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
            />
          </div>
        )}
        {image.description && <p className="text-xl font-bold opacity-80 mt-4 text-center">{image.description}</p>}
      </div>
    );
  };

  const renderVideo = () => {
    const video = data.data as any;
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {video.url && (
          <div className="w-full aspect-video bg-black/30 rounded-lg flex items-center justify-center max-h-[60vh] overflow-hidden">
            <video
              src={video.url}
              controls
              autoPlay
              muted
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        {video.description && <p className="text-xl font-bold opacity-80 mt-4 text-center">{video.description}</p>}
      </div>
    );
  };

  const renderAnswer = () => {
    const answer = data.data as any;
  
    const hasImage = !!answer.questionImage;
  
    return (
      <div
        className={`flex ${
          hasImage ? 'flex-col md:flex-row gap-8' : 'flex-col'
        } items-center justify-center w-full h-full relative`}
      >
        {/* Question image (if exists) */}
        {hasImage && (
          <div className="w-full md:w-2/5 flex justify-center">
            <img
              src={answer.questionImage}
              alt="Question"
              className="max-h-[40vh] object-contain rounded-lg"
            />
          </div>
        )}
  
        {/* Answer content */}
        <div
          className={`${
            hasImage ? 'w-full md:w-3/5 items-start md:items-center text-left md:text-center' : 'w-full items-center text-center'
          } flex flex-col`}
        >
          {/* Confetti effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <PartyPopper className="h-20 w-20 text-yellow-300 animate-bounce" />
            </div>
          )}
  
          {/* Question text */}
          {answer.questionText && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{answer.questionText}</h2>
          )}
  
          {/* Answer header */}
          <h3 className="text-2xl md:text-3xl font-bold text-green-400 mb-4">
            Correct Answer
          </h3>
  
          {/* Answer itself */}
          {answer.text && (
            <div className="text-3xl md:text-5xl font-bold text-white animate-scale-in mb-4">
              {answer.text}
            </div>
          )}
  
          {/* Explanation / Description */}
          {answer.description && (
            <p className="text-xl md:text-2xl font-bold opacity-80 max-w-3xl">
              {answer.description}
            </p>
          )}
        </div>
      </div>
    );
  };
  

  const renderUpcomingSchedule = () => {
    const upcomingSchedule = data.data as any;
    return (
      <div className="flex flex-col items-center w-full h-full">
        <h2 className="text-xl md:text-3xl font-bold mb-6 text-center">Upcoming Schedule</h2>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-white/70">Program</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-white/70 hidden md:table-cell">Description</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-white/70">Date & Time</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-white/70">Starts In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {upcomingSchedule.schedule && upcomingSchedule.schedule.map((item: any, index: number) => (
                <tr key={index} className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {item.programName && <div className="font-medium text-sm">{item.programName}</div>}
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    {item.description && <div className="text-xs opacity-70">{item.description}</div>}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {item.startDateTime && (
                      <div className="text-sm">
                        {format(new Date(item.startDateTime), 'MMM d, h:mm a')}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {item.startsIn && <div className="text-sm font-medium">{item.startsIn}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCredits = () => {
    const credits = data.data as any;
    return (
      <div className="flex flex-col items-center w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {credits.curator && (
            <div className="bg-white/10 rounded-lg p-6 animate-scale-in flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4 text-center">Quiz Curated By</h3>
              <div className="flex flex-col items-center gap-4">
                {credits.curator.image && (
                  <img
                    src={credits.curator.image}
                    alt={credits.curator.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="text-center">
                  <h4 className="font-bold text-2xl">{credits.curator.name}</h4>
                  <p className="text-lg font-bold opacity-80">{credits.curator.bio}</p>
                </div>
              </div>
            </div>
          )}

          {credits.sponsor && (
            <div className="bg-white/10 rounded-lg p-6 animate-scale-in flex flex-col items-center" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-bold mb-4 text-center">Quiz Sponsored By</h3>
              <div className="flex flex-col items-center gap-4">
                {credits.sponsor.image && (
                  <img
                    src={credits.sponsor.image}
                    alt={credits.sponsor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="text-center">
                  <h4 className="font-bold text-2xl">{credits.sponsor.name}</h4>
                  <p className="text-lg font-bold opacity-80">{credits.sponsor.bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDisclaimer = () => {
    const disclaimer = data.data as any;
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Disclaimer</h2>
        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          {disclaimer.qrCode && (
            <div className="w-60 h-60 bg-white p-4 rounded-lg">
              <img
                src={disclaimer.qrCode}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          {disclaimer.text && (
            <p className="text-xl md:text-2xl font-bold opacity-80 text-center max-w-2xl">
              {disclaimer.text}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`glass-card p-6 ${animationClass} ${animation.background} w-full h-full`}
      style={{
        opacity: isVisible ? 1 : 0,
        height: '70vh',
        position: 'relative'
      }}
    >
      <div className="flex flex-col w-full h-full">
        {/* Only show headers for question and answer cards */}
        {(type === 'question' || type === 'answer') && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {renderIcon()}
              <h3 className="text-xl md:text-2xl font-bold capitalize flex items-center gap-2">
                {displayType}
                {type === 'question' && questionIndex !== undefined && totalQuestions !== undefined && (
                  <span >
                    ({` ${questionIndex + 1} of ${totalQuestions}`} )
                  </span>
                )}
              </h3>
            </div>
          </div>
        )}

        {/* Full-width timer 
        {(type === 'question' || type === 'answer') && duration && (
          <div className="w-full mb-4">
            <CountdownTimer duration={duration} isQuestion={type === 'question'} />
          </div>
        )}
*/}
        <div className="flex-1 flex items-center justify-center overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DisplayCard;
