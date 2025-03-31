
import React from 'react';
import { DisplayData } from '@/lib/sampleData';
import { getAnimationForType } from '@/lib/animationUtils';
import { ArrowRight, Clock, Award, Info, Image, Video, MessageCircle, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DisplayCardProps {
  data: DisplayData;
  isVisible: boolean;
  isPortrait: boolean;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ data, isVisible, isPortrait }) => {
  const { type } = data;
  const animation = getAnimationForType(type);
  const animationClass = isVisible ? animation.enter : animation.exit;
  
  const renderIcon = () => {
    switch (type) {
      case 'question':
        return <Info className="h-6 w-6" />;
      case 'response':
        return <MessageCircle className="h-6 w-6" />;
      case 'image':
        return <Image className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'answer':
        return <ArrowRight className="h-6 w-6" />;
      case 'fastestAnswers':
        return <Clock className="h-6 w-6" />;
      case 'leaderboard':
        return <Award className="h-6 w-6" />;
      case 'upcomingSchedule':
        return <Calendar className="h-6 w-6" />;
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
      default:
        return <div>Unknown type</div>;
    }
  };

  const renderQuestion = () => {
    const question = data.data as any;
    return (
      <div className="flex flex-col items-center gap-4">
        {question.text && <h2 className="text-xl md:text-2xl font-bold">{question.text}</h2>}
        {question.image && (
          <div className="w-full max-w-md overflow-hidden rounded-lg">
            <img src={question.image} alt="Question" className="w-full h-auto object-cover" />
          </div>
        )}
        {question.choices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
            {question.choices.map((choice: string, index: number) => (
              <div key={index} className="p-3 bg-white/10 rounded-lg text-white font-medium">
                {choice}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderResponses = () => {
    const responses = data.data as any;
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Responses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {responses.map((response: any, index: number) => (
            <div key={index} className="p-4 bg-white/10 rounded-lg flex items-center gap-3">
              {response.picture && (
                <img 
                  src={response.picture} 
                  alt={response.name || 'User'} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                {response.name && <p className="font-medium">{response.name}</p>}
                {response.responseTime !== undefined && (
                  <p className="text-sm opacity-75">{response.responseTime}s</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderImage = () => {
    const image = data.data as any;
    return (
      <div className="flex flex-col items-center gap-4">
        {image.name && <h2 className="text-xl md:text-2xl font-bold">{image.name}</h2>}
        {image.url && (
          <div className="w-full max-w-xl overflow-hidden rounded-lg">
            <img src={image.url} alt={image.name || 'Image'} className="w-full h-auto object-cover" />
          </div>
        )}
        {image.description && <p className="text-lg opacity-80">{image.description}</p>}
      </div>
    );
  };

  const renderVideo = () => {
    const video = data.data as any;
    return (
      <div className="flex flex-col items-center gap-4">
        {video.name && <h2 className="text-xl md:text-2xl font-bold">{video.name}</h2>}
        {video.url && (
          <div className="w-full max-w-xl bg-black/30 rounded-lg flex items-center justify-center p-8">
            <Video className="h-16 w-16 text-white/70" />
            <p className="text-white/70">Video would play here</p>
          </div>
        )}
        {video.description && <p className="text-lg opacity-80">{video.description}</p>}
      </div>
    );
  };

  const renderAnswer = () => {
    const answer = data.data as any;
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Correct Answer</h2>
        {answer.text && (
          <div className="text-3xl md:text-4xl font-bold text-white">{answer.text}</div>
        )}
        {answer.description && (
          <p className="text-lg opacity-80 max-w-xl text-center">{answer.description}</p>
        )}
      </div>
    );
  };

  const renderFastestAnswers = () => {
    const fastestAnswers = data.data as any;
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Fastest Answers</h2>
        <div className="flex flex-col gap-3 w-full max-w-md">
          {fastestAnswers.responses && fastestAnswers.responses.map((response: any, index: number) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg flex items-center gap-3 ${
                index === 0 ? 'bg-yellow-500/30' : 
                index === 1 ? 'bg-gray-400/30' : 
                index === 2 ? 'bg-amber-700/30' : 'bg-white/10'
              }`}
            >
              {index === 0 && <Award className="h-5 w-5 text-yellow-300" />}
              {response.picture && (
                <img 
                  src={response.picture} 
                  alt={response.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                {response.name && <p className="font-medium">{response.name}</p>}
                {response.responseTime !== undefined && (
                  <p className="text-sm opacity-75">{response.responseTime}s</p>
                )}
              </div>
              <div className="text-2xl font-bold">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLeaderboard = () => {
    const leaderboard = data.data as any;
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Leaderboard</h2>
        <div className="flex flex-col gap-3 w-full max-w-md">
          {leaderboard.users && leaderboard.users.map((user: any, index: number) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg flex items-center gap-3 ${
                index === 0 ? 'bg-yellow-500/30' : 
                index === 1 ? 'bg-gray-400/30' : 
                index === 2 ? 'bg-amber-700/30' : 'bg-white/10'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center font-bold">
                {index + 1}
              </div>
              {user.picture && (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                {user.name && <p className="font-medium">{user.name}</p>}
              </div>
              {user.score !== undefined && (
                <div className="text-xl font-bold">{user.score}</div>
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
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Upcoming Schedule</h2>
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-white/20">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Program</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/70 hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Date & Time</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Starts In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {upcomingSchedule.schedule && upcomingSchedule.schedule.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.programName && <div className="font-medium">{item.programName}</div>}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {item.description && <div className="text-sm opacity-70">{item.description}</div>}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.startDateTime && (
                      <div className="text-sm">
                        {format(new Date(item.startDateTime), 'MMM d, h:mm a')}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
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

  return (
    <div
      className={`glass-card p-6 m-4 ${animationClass} ${animation.background} ${
        isPortrait ? 'w-[90vw]' : 'w-[80vw]'
      }`}
      style={{ 
        opacity: isVisible ? 1 : 0,
        display: isVisible ? 'block' : 'none'
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        {renderIcon()}
        <h3 className="text-lg font-semibold capitalize">{type}</h3>
      </div>
      {renderContent()}
    </div>
  );
};

export default DisplayCard;
