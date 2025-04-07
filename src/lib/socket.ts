
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
  questionAudioPlayer.currentTime = 0;
  questionAudioPlayer.play().catch(e => console.log('Error playing audio:', e));
};

export const playAnswerAudio = () => {
  answerAudioPlayer.currentTime = 0;
  answerAudioPlayer.play().catch(e => console.log('Error playing audio:', e));
};

export const playCreditsMusic = () => {
  creditsMusicPlayer.currentTime = 0;
  creditsMusicPlayer.play().catch(e => console.log('Error playing audio:', e));
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
