
import { io, Socket } from 'socket.io-client';

// The URL of the backend server
export const SOCKET_SERVER_URL = 'http://localhost:5001';

// Create a singleton socket instance
export const socket: Socket = io(SOCKET_SERVER_URL);

// Audio players for different game states
const questionAudioPlayer = new Audio('/audio/question-timer.mp3');
const answerAudioPlayer = new Audio('/audio/answer-reveal.mp3');
const creditsMusicPlayer = new Audio('/audio/credits-music.mp3');

// Configure audio players
questionAudioPlayer.loop = true;
questionAudioPlayer.volume = 0.5;
answerAudioPlayer.volume = 0.7;
creditsMusicPlayer.loop = true;
creditsMusicPlayer.volume = 0.3;

// Create placeholder mp3 files with default content
const createPlaceholderAudioFile = (fileName: string) => {
  // Check if audio files exist or create placeholder content
  const audioFile = new Audio(fileName);
  
  // Handle errors silently
  audioFile.onerror = () => {
    console.warn(`Audio file ${fileName} not found. Please add it to the public/audio directory.`);
  };
  
  return audioFile;
};

// Verify audio files or create placeholders if needed
const verifyAudioFiles = () => {
  // Check questionAudioPlayer
  questionAudioPlayer.onerror = () => {
    console.warn('Question audio file not found. Please add question-timer.mp3 to the public/audio directory.');
  };
  
  // Check answerAudioPlayer
  answerAudioPlayer.onerror = () => {
    console.warn('Answer audio file not found. Please add answer-reveal.mp3 to the public/audio directory.');
  };
  
  // Check creditsMusicPlayer
  creditsMusicPlayer.onerror = () => {
    console.warn('Credits music file not found. Please add credits-music.mp3 to the public/audio directory.');
  };
};

// Call verify function immediately
verifyAudioFiles();

// Add global event handlers
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
  stopAllAudio();
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Handle display updates to control audio
socket.on('display_update', (data) => {
  // Stop all audio first
  stopAllAudio();
  
  // Play the appropriate audio based on the display type
  if (data.primary?.type === 'question') {
    playQuestionAudio();
  } else if (data.primary?.type === 'answer') {
    playAnswerAudio();
  } else if (data.primary?.type === 'credits') {
    playCreditsMusic();
  }
});

// Audio control functions
export const playQuestionAudio = () => {
  try {
    questionAudioPlayer.currentTime = 0;
    const playPromise = questionAudioPlayer.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Error playing question audio:', e);
        // If autoplay is blocked, we can show a UI element to let the user enable audio manually
      });
    }
  } catch (e) {
    console.log('Error playing question audio:', e);
  }
};

export const playAnswerAudio = () => {
  try {
    answerAudioPlayer.currentTime = 0;
    const playPromise = answerAudioPlayer.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Error playing answer audio:', e);
      });
    }
  } catch (e) {
    console.log('Error playing answer audio:', e);
  }
};

export const playCreditsMusic = () => {
  try {
    creditsMusicPlayer.currentTime = 0;
    const playPromise = creditsMusicPlayer.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        console.log('Error playing credits music:', e);
      });
    }
  } catch (e) {
    console.log('Error playing credits music:', e);
  }
};

export const stopAllAudio = () => {
  questionAudioPlayer.pause();
  answerAudioPlayer.pause();
  creditsMusicPlayer.pause();
};

// Export the audio control functions
export const audioControls = {
  playQuestionAudio,
  playAnswerAudio,
  playCreditsMusic,
  stopAllAudio
};
