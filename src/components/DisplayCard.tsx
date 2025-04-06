import React, { useEffect, useState } from 'react';
import { DisplayData } from '@/lib/sampleData';
import { getAnimationForType } from '@/lib/animationUtils';
import { Check, Clock, Award, HelpCircle, Image, Video, Info, CreditCard, QrCode, Calendar, MessageCircle, Users, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';
import CountdownTimer from './CountdownTimer';

interface DisplayCardProps {
  data: DisplayData;
  isVisible: boolean;
  isPortrait: boolean;
  duration?: number;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ data, isVisible, isPortrait, duration }) => {
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
        return <HelpCircle className="h-6 w-6 text-yellow-300" />;
      case 'image':
        return <Image className="h-6 w-6 text-yellow-300" />;
      case 'video':
        return <Video className="h-6 w-6 text-yellow-300" />;
      case 'answer':
        return <Check className="h-6 w-6 text-green-400" />;
      case 'credits':
        return <CreditCard className="h-6 w-6 text-yellow-300" />;
      case 'disclaimer':
        return <QrCode className="h-6 w-6 text-yellow-300" />;
      case 'upcomingSchedule':
        return <Calendar className="h-6 w-6 text-yellow-300" />;
      default:
        return <Info className="h-6 w-6 text-yellow-300" />;
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
        {question.text && <h2 className="text-xl md:text-3xl font-bold mb-4">{question.text}</h2>}
        
        <div className="flex flex-col md:flex-row w-full gap-6 justify-center">
          {question.image && (
            <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
              <img 
                src={question.image} 
                alt="Question" 
                className="w-full h-auto object-contain rounded-lg" 
              />
            </div>
          )}
          
          {question.choices && (
            <div className="grid grid-cols-1 gap-2 w-full md:w-1/2">
              {question.choices.map((choice: string, index: number) => (
                <div 
                  key={index} 
                  className={`p-3 bg-white/20 rounded-lg text-white font-medium text-lg transform transition-all duration-300 ${
                    animatedItems.includes(index) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                  }`}
                >
                  <span className="font-bold mr-2">{optionIdentifiers[index]})</span> {choice}
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
      <div className="flex flex-col items-center w-full h-full">
        {image.name && <h2 className="text-xl md:text-3xl font-bold mb-4">{image.name}</h2>}

        {image.url && (
          <div className="w-full max-w-4xl overflow-hidden rounded-lg animate-scale-in">
            <img 
              src={image.url} 
              alt={image.name || 'Image'} 
              className="w-full h-auto object-contain rounded-lg" 
            />
          </div>
        )}
        {image.description && <p className="text-base opacity-80 mt-4">{image.description}</p>}
      </div>
    );
  };

  const renderVideo = () => {
    const video = data.data as any;
    return (
      <div className="flex flex-col items-center w-full h-full">
        {video.name && <h2 className="text-xl md:text-3xl font-bold mb-4">{video.name}</h2>}

        {video.url && (
          <div className="w-full max-w-4xl aspect-video bg-black/30 rounded-lg flex items-center justify-center animate-scale-in overflow-hidden">
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
        {video.description && <p className="text-base opacity-80 mt-4">{video.description}</p>}
      </div>
    );
  };

  const renderAnswer = () => {
    const answer = data.data as any;
    return (
      <div className="flex flex-col items-center w-full h-full">
        {/* Question text and image */}
        {answer.questionText && <h2 className="text-xl md:text-2xl font-bold mb-2">{answer.questionText}</h2>}
        
        {answer.questionImage && (
          <div className="w-full max-w-lg overflow-hidden rounded-lg mb-6">
            <img 
              src={answer.questionImage} 
              alt="Question" 
              className="w-full h-auto object-contain rounded-lg" 
            />
          </div>
        )}
        
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-center">
              <PartyPopper className="h-20 w-20 text-yellow-300 animate-bounce" />
            </div>
          </div>
        )}
        
        {/* Answer */}
        <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-2">Correct Answer</h3>
        {answer.text && (
          <div className="text-2xl md:text-4xl font-bold text-white animate-scale-in mb-4">{answer.text}</div>
        )}
        {answer.description && (
          <p className="text-base md:text-lg opacity-80 max-w-2xl text-center">{answer.description}</p>
        )}
      </div>
    );
  };

  const renderUpcomingSchedule = () => {
    const upcomingSchedule = data.data as any;
    return (
      <div className="flex flex-col items-center w-full h-full">
        <h2 className="text-xl md:text-3xl font-bold mb-6">Upcoming Schedule</h2>
        
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
        <h2 className="text-xl md:text-3xl font-bold mb-6">Quiz Credits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {credits.curator && (
            <div className="bg-white/10 rounded-lg p-4 animate-scale-in">
              <h3 className="text-lg font-bold mb-2">Quiz Curated By</h3>
              <div className="flex items-center gap-4">
                {credits.curator.image && (
                  <img 
                    src={credits.curator.image} 
                    alt={credits.curator.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{credits.curator.name}</h4>
                  <p className="text-sm opacity-80">{credits.curator.bio}</p>
                </div>
              </div>
            </div>
          )}
          
          {credits.sponsor && (
            <div className="bg-white/10 rounded-lg p-4 animate-scale-in" style={{ animationDelay: "200ms" }}>
              <h3 className="text-lg font-bold mb-2">Quiz Sponsored By</h3>
              <div className="flex items-center gap-4">
                {credits.sponsor.image && (
                  <img 
                    src={credits.sponsor.image} 
                    alt={credits.sponsor.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{credits.sponsor.name}</h4>
                  <p className="text-sm opacity-80">{credits.sponsor.bio}</p>
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
      <div className="flex flex-col items-center w-full h-full">
        <h2 className="text-xl md:text-3xl font-bold mb-6">Disclaimer</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          {disclaimer.qrCode && (
            <div className="w-48 h-48 bg-white p-3 rounded-lg">
              <img 
                src={disclaimer.qrCode} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          {disclaimer.text && (
            <p className="text-base md:text-lg opacity-80 text-center max-w-xl">
              {disclaimer.text}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`glass-card p-4 ${animationClass} ${animation.background} w-full h-full`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        minHeight: '70vh',
        position: 'relative'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {renderIcon()}
          <h3 className="text-lg md:text-xl font-semibold capitalize">{displayType}</h3>
        </div>
        
        {(type === 'question') && duration && (
          <div className="w-32 md:w-48">
            <CountdownTimer duration={duration} isQuestion={true} />
          </div>
        )}
        {(type === 'answer') && duration && (
          <div className="w-32 md:w-48">
            <CountdownTimer duration={duration} />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default DisplayCard;
