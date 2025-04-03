import React, { useEffect, useState } from 'react';
import { DisplayData } from '@/lib/sampleData';
import { getAnimationForType } from '@/lib/animationUtils';
import { Check, Clock, Award, HelpCircle, Image, Video, MessageCircle, Users, Calendar, Info, CreditCard, QrCode } from 'lucide-react';
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
  const animation = getAnimationForType(type);
  const animationClass = isVisible ? animation.enter : animation.exit;
  
  // For sequential animations of list items
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);
  
  useEffect(() => {
    if (isVisible) {
      const itemTypes = ['response', 'fastestAnswers', 'leaderboard'];
      if (itemTypes.includes(type)) {
        setAnimatedItems([]);
        const items = type === 'response' ? 
            Math.min(((data.data as any) || []).length, 6) :
            type === 'fastestAnswers' ? 
              Math.min(((data.data as any).responses || []).length, 5) :
              type === 'leaderboard' ? 
                Math.min(((data.data as any).users || []).length, 10) : 0;
        
        // Stagger the animations
        for (let i = 0; i < items; i++) {
          setTimeout(() => {
            setAnimatedItems(prev => [...prev, i]);
          }, i * 150); // 150ms delay between each item
        }
      } else if (type === 'question') {
        // For question, animate all choices immediately without staggering
        const choices = ((data.data as any).choices || []).length;
        const allIndexes = Array.from({ length: choices }, (_, i) => i);
        setAnimatedItems(allIndexes);
      }
    } else {
      setAnimatedItems([]);
    }
  }, [isVisible, data, type]);
  
  const renderIcon = () => {
    switch (type) {
      case 'question':
        return <HelpCircle className="h-6 w-6" />;
      case 'response':
        return <MessageCircle className="h-6 w-6" />;
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'answer':
        return <Check className="h-6 w-6 text-green-400" />;
      case 'fastestAnswers':
        return <Clock className="h-6 w-6" />;
      case 'leaderboard':
        return <Award className="h-6 w-6" />;
      case 'upcomingSchedule':
        return <Calendar className="h-6 w-6" />;
      case 'credits':
        return <CreditCard className="h-6 w-6" />;
      case 'disclaimer':
        return <QrCode className="h-6 w-6" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'question':
        return renderQuestion();
      case 'response':
        return renderResponses();
      case 'image':
        return renderImage();
      case 'video':
        return renderVideo();
      case 'answer':
        return renderAnswer();
      case 'fastestAnswers':
        return renderFastestAnswers();
      case 'leaderboard':
        return renderLeaderboard();
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
      <div className="flex flex-col items-center gap-1">
        {question.text && <h2 className="text-xl md:text-2xl font-bold">{question.text}</h2>}
        {question.image && (
          <div className="w-full max-w-4xl overflow-hidden rounded-lg aspect-video mb-2">
            <img 
              src={question.image} 
              alt="Question" 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        {question.choices && (
          <div className="grid grid-cols-1 gap-1 w-full max-w-md">
            {question.choices.map((choice: string, index: number) => (
              <div 
                key={index} 
                className={`p-2 bg-white/10 rounded-lg text-white font-medium transform transition-all duration-300 ${
                  animatedItems.includes(index) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
              >
                <span className="font-bold mr-2">{optionIdentifiers[index]})</span> {choice}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderResponses = () => {
    const responses = data.data as any;
    // Increase to displaying 6 responses (2 columns of 3)
    const displayedResponses = responses.slice(0, 6);
    
    return (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-2 gap-1">
          {displayedResponses.map((response: any, index: number) => {
            // Extract first name for display
            const firstName = response.name ? response.name.split(' ')[0] : '';
            
            return (
              <div 
                key={index} 
                className={`p-1 bg-white/10 rounded-lg flex items-center gap-1 transform transition-all duration-300 ${
                  animatedItems.includes(index) ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
                }`}
              >
                {response.picture && (
                  <img 
                    src={response.picture} 
                    alt={response.name || 'User'} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <div className="overflow-hidden">
                  {firstName && <p className="font-medium text-xs truncate">{firstName}</p>}
                  {response.responseTime !== undefined && (
                    <p className="text-xs opacity-75">{response.responseTime}s</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderImage = () => {
    const image = data.data as any;
    return (
      <div className="flex flex-col items-center gap-1">
        {image.name && <h2 className="text-xl md:text-2xl font-bold">{image.name}</h2>}

        {image.url && (
          <div className="w-full max-w-4xl overflow-hidden rounded-lg aspect-video animate-scale-in">
            <img 
              src={image.url} 
              alt={image.name || 'Image'} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        {image.description && <p className="text-base opacity-80">{image.description}</p>}
      </div>
    );
  };

  const renderVideo = () => {
    const video = data.data as any;
    return (
      <div className="flex flex-col items-center gap-1">
        {video.name && <h2 className="text-xl md:text-2xl font-bold">{video.name}</h2>}

        {video.url && (
          <div className="w-full max-w-4xl aspect-video bg-black/30 rounded-lg flex items-center justify-center animate-scale-in">
            <Video className="h-12 w-12 text-white/70" />
          </div>
        )}
        {video.description && <p className="text-base opacity-80">{video.description}</p>}
      </div>
    );
  };

  const renderAnswer = () => {
    const answer = data.data as any;
    return (
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl md:text-2xl font-bold">Correct Answer</h2>
        {answer.text && (
          <div className="text-3xl md:text-4xl font-bold text-white animate-scale-in">{answer.text}</div>
        )}
        {answer.description && (
          <p className="text-base opacity-80 max-w-xl text-center">{answer.description}</p>
        )}
      </div>
    );
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Award className="h-4 w-4 text-yellow-300" />; // Gold
    if (index === 1) return <Award className="h-4 w-4 text-gray-300" />; // Silver
    if (index === 2) return <Award className="h-4 w-4 text-amber-600" />; // Bronze
    return null;
  };

  const renderFastestAnswers = () => {
    const fastestAnswers = data.data as any;
    // Limit to displaying 5 fastest answers
    const displayedResponses = fastestAnswers.responses ? fastestAnswers.responses.slice(0, 6) : [];
    
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-col gap-1 w-full max-w-md">
          {displayedResponses.map((response: any, index: number) => (
            <div 
              key={index} 
              className={`p-1 rounded-lg flex items-center gap-2 transform transition-all duration-300 ${
                index === 0 ? 'bg-yellow-500/30' : 
                index === 1 ? 'bg-gray-400/30' : 
                index === 2 ? 'bg-amber-700/30' : 'bg-white/10'
              } ${
                animatedItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {getMedalIcon(index)}
              {response.picture && (
                <img 
                  src={response.picture} 
                  alt={response.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                {response.name && <p className="font-medium text-sm">{response.name}</p>}
                {response.responseTime !== undefined && (
                  <p className="text-xs opacity-75">{response.responseTime}s</p>
                )}
              </div>
              <div className="text-lg font-bold">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    const leaderboard = data.data as any;
    // Limit to displaying 10 leaderboard entries
    const displayedUsers = leaderboard.users ? leaderboard.users.slice(0, 10) : [];
    
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-col gap-1 w-full max-w-md">
          {displayedUsers.map((user: any, index: number) => (
            <div 
              key={index} 
              className={`p-1 rounded-lg flex items-center gap-2 transform transition-all duration-300 ${
                index === 0 ? 'bg-yellow-500/30' : 
                index === 1 ? 'bg-gray-400/30' : 
                index === 2 ? 'bg-amber-700/30' : 'bg-white/10'
              } ${
                animatedItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {getMedalIcon(index)}
              <div className="w-6 h-6 flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                {user.name && <p className="font-medium text-sm">{user.name}</p>}
              </div>
              {user.score !== undefined && (
                <div className="text-lg font-bold">{user.score}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUpcomingSchedule = () => {
    const upcomingSchedule = data.data as any;
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-white/70">Program</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-white/70 hidden md:table-cell">Description</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-white/70">Date & Time</th>
                <th className="px-2 py-1 text-left text-xs font-medium text-white/70">Starts In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {upcomingSchedule.schedule && upcomingSchedule.schedule.map((item: any, index: number) => (
                <tr key={index} className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <td className="px-2 py-1 whitespace-nowrap">
                    {item.programName && <div className="font-medium text-sm">{item.programName}</div>}
                  </td>
                  <td className="px-2 py-1 hidden md:table-cell">
                    {item.description && <div className="text-xs opacity-70">{item.description}</div>}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap">
                    {item.startDateTime && (
                      <div className="text-xs">
                        {format(new Date(item.startDateTime), 'MMM d, h:mm a')}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap">
                    {item.startsIn && <div className="text-xs font-medium">{item.startsIn}</div>}
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
      <div className="flex flex-col gap-3">
        {credits.curator && (
          <div className="bg-white/10 rounded-lg p-2 animate-scale-in">
            <h3 className="text-lg font-bold mb-1">Quiz Curated By</h3>
            <div className="flex items-center gap-3">
              {credits.curator.image && (
                <img 
                  src={credits.curator.image} 
                  alt={credits.curator.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{credits.curator.name}</h4>
                <p className="text-sm opacity-80">{credits.curator.bio}</p>
              </div>
            </div>
          </div>
        )}
        
        {credits.sponsor && (
          <div className="bg-white/10 rounded-lg p-2 animate-scale-in" style={{ animationDelay: "200ms" }}>
            <h3 className="text-lg font-bold mb-1">Quiz Sponsored By</h3>
            <div className="flex items-center gap-3">
              {credits.sponsor.image && (
                <img 
                  src={credits.sponsor.image} 
                  alt={credits.sponsor.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium">{credits.sponsor.name}</h4>
                <p className="text-sm opacity-80">{credits.sponsor.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDisclaimer = () => {
    const disclaimer = data.data as any;
    return (
      <div className="flex flex-col items-center gap-3">
        {disclaimer.qrCode && (
          <div className="w-40 h-40 bg-white p-2 rounded-lg">
            <img 
              src={disclaimer.qrCode} 
              alt="QR Code" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {disclaimer.text && (
          <p className="text-sm opacity-80 text-center max-w-xl">
            {disclaimer.text}
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className={`glass-card p-2 ${animationClass} ${animation.background} w-full h-full`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        display: isVisible ? 'block' : 'none',
        maxHeight: isPortrait ? 'auto' : '70vh',
        overflow: 'auto'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {renderIcon()}
          <h3 className="text-lg font-semibold capitalize">{type}</h3>
        </div>
        
        {/* Show countdown timer for question and answer cards */}
        {(type === 'question' ) && duration && (
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
      
      <div className="overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default DisplayCard;
