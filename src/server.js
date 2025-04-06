
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory after build
app.use(express.static(path.join(__dirname, 'dist')));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import sample data generator functions
const sampleData = require('./sampleData');

// Define timing constants (in milliseconds)
const TIMING = {
  INTRO_IMAGE: 10000,
  DISCLAIMER: 10000,
  INTRO_VIDEO: 10000,
  QUESTION: 30000,
  ANSWER: 10000,
  CREDITS: 20000
};

// MongoDB Connection setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/QuizDbv2')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schemas
const { Schema } = mongoose;

// Answer Schema for responses 
const answerSchema = new mongoose.Schema({
  ytChannelId: String,
  ytProfilePicUrl: String,
  userName: String,
  firstName: String,
  lastName: String,
  questionIndex: Number,
  responseTime: Number, // questionStartedAt - ytPubTimeStamp
  isCorrectAnswer: Boolean,
  quizGameId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizGame' },
});

const ResponseSchema = new Schema({
  ytChannelId: String,
  ytProfilePicUrl: String,
  userName: String,
  firstName: String,
  lastName: String,
  ytTimeStamp: { type: Date, default: Date.now },
  systemTimeStamp: { type: Date, default: Date.now },
  responseTime: Number,
});

const ChoiceSchema = new Schema({
  choiceIndex: Number,
  choiceText: String,
  choiceImageurl: String,
  isCorrectChoice: Boolean
});

const QuestionSchema = new Schema({
  questionText: String,
  questionImageUrl: String,
  questionTopicsList: [String],
  choices: [ChoiceSchema],
  answerExplanation: String,
  templateCategory: String,
  difficultyLevel: String,
  questionLanguage: String,
  validatedManually: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String
});

const QuizSchema = new Schema({
  quizTitle: String,
  quizDescription: String,
  quizTopicsList: [String],
  quizLanguage: String,
  templateCategory: String,
  youtubeChannel: String,
  questions: [QuestionSchema],
  readyForLive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String
});

const QuizGameSchema = new Schema({
  gameTitle: String,
  gameScheduledStart: Date,
  gameScheduledEnd: Date,
  gameStartedAt: Date,
  gameEndedAt: Date,
  activeQuestionIndex: { type: Number, min: -1, default: -1 },
  questionStartedAt: Date,
  isQuestionOpen: { type: Boolean, default: false },
  correctChoiceIndex: { type: Number, min: -1, default: -1 },
  liveIDs: [String],
  liveChatdIDs: [String],
  isGameOpen: { type: Boolean, default: false },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  questions: [QuestionSchema],
  gameMode: { type: String, enum: ['automatic', 'manual'], default: 'automatic' }
});

// Define MongoDB Models
const Question = mongoose.model('Question', QuestionSchema);
const Quiz = mongoose.model('Quiz', QuizSchema);
const QuizGame = mongoose.model('QuizGame', QuizGameSchema);
const Answer = mongoose.model('Answer', answerSchema);

// Store active connections and game state
const activeConnections = new Set();
let activeGame = null;
let currentGameSequence = [];
let currentSequenceIndex = 0;
let autoGameTimer = null;

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected, ID:', socket.id);
  activeConnections.add(socket.id);
  
  // Send welcome message
  socket.emit('connection_established', { message: 'Connected to quiz server' });
  
  // Send current game state if there's an active game
  if (activeGame && activeGame.isGameOpen) {
    // In automatic mode, send current sequence item
    if (activeGame.gameMode === 'automatic') {
      if (currentSequenceIndex < currentGameSequence.length) {
        socket.emit('display_update', currentGameSequence[currentSequenceIndex]);
      }
    } else {
      // In manual mode, send last displayed item or initial item
      if (currentGameSequence.length > 0) {
        socket.emit('display_update', currentGameSequence[0]); // Send first item as default
      }
    }
  } else {
    // Start the quiz sequence for this connection if no active game
    startQuizSequence(socket);
  }
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected, ID:', socket.id);
    activeConnections.delete(socket.id);
  });
});

// Function to run the quiz sequence for a connected client when no active game exists
function startQuizSequence(socket) {
  const sequence = createDisplaySequence();
  let sequenceIndex = 0;
  
  const displayNextItem = () => {
    if (sequenceIndex >= sequence.length) {
      // Reset sequence when it completes
      sequenceIndex = 0;
    }
    
    const currentItem = sequence[sequenceIndex];
    socket.emit('display_update', currentItem);
    
    // Move to next sequence item after duration
    sequenceIndex++;
    setTimeout(displayNextItem, currentItem.duration);
  };

  // Start the sequence with a short delay
  setTimeout(displayNextItem, 1000);
}

// Create the display sequence based on requirements (for sample mode without active game)
function createDisplaySequence() {
  const questionData1 = sampleData.getRandomQuestion();
  const questionData2 = sampleData.getRandomQuestion();
  
  // Find answer data for sample questions
  const answerData1 = {
    type: 'answer',
    data: {
      text: "Sample Answer",
      description: "This is a sample answer explanation",
      questionText: questionData1.data.text,
      questionImage: questionData1.data.image
    }
  };
  
  const answerData2 = {
    type: 'answer',
    data: {
      text: "Sample Answer",
      description: "This is a sample answer explanation",
      questionText: questionData2.data.text,
      questionImage: questionData2.data.image
    }
  };
  
  return [
    { primary: sampleData.getRandomImage(), duration: TIMING.INTRO_IMAGE },
    { primary: sampleData.getDisclaimer(), duration: TIMING.DISCLAIMER },
    { primary: sampleData.getRandomVideo(), duration: TIMING.INTRO_VIDEO },
    { primary: questionData1, duration: TIMING.QUESTION },
    { primary: answerData1, duration: TIMING.ANSWER },
    { primary: questionData2, duration: TIMING.QUESTION },
    { primary: answerData2, duration: TIMING.ANSWER },
    { primary: sampleData.getCredits(), duration: TIMING.CREDITS }
  ];
}

// Function to run the automatic sequence for a game
async function startAutomaticSequence(game) {
  if (!game || !game.isGameOpen || currentGameSequence.length === 0) {
    console.log('No active game or sequence to display');
    return;
  }
  
  // Start from the beginning
  currentSequenceIndex = 0;
  
  const advanceSequence = async () => {
    if (currentSequenceIndex < currentGameSequence.length) {
      const currentItem = currentGameSequence[currentSequenceIndex];
      
      // If this is a question, update game's active question index and set correct choice index
      if (currentItem.primary?.type === 'question' && currentItem.questionIndex !== undefined) {
        game.activeQuestionIndex = currentItem.questionIndex;
        game.questionStartedAt = new Date();
        game.isQuestionOpen = true;
        
        // Find the correct choice index for this question
        const correctChoice = game.questions[currentItem.questionIndex].choices.find(choice => choice.isCorrectChoice);
        if (correctChoice) {
          game.correctChoiceIndex = correctChoice.choiceIndex;
          console.log(`Setting correctChoiceIndex to ${correctChoice.choiceIndex} for question ${currentItem.questionIndex}`);
        } else {
          game.correctChoiceIndex = -1;
          console.log(`No correct choice found for question ${currentItem.questionIndex}`);
        }
        
        await game.save().catch(err => console.error('Error saving game state:', err));
      }
      
      // If this is an answer, close the question
      if (currentItem.primary?.type === 'answer') {
        game.isQuestionOpen = false;
        await game.save().catch(err => console.error('Error saving game state:', err));
      }
      
      // Send the current item to all clients
      io.emit('display_update', currentItem);
      
      // Move to the next item after the specified duration
      currentSequenceIndex++;
      
      // Don't advance beyond the last item
      if (currentSequenceIndex < currentGameSequence.length) {
        autoGameTimer = setTimeout(() => advanceSequence(), currentItem.duration);
      } else {
        console.log('Sequence completed, staying on last screen');
        
        // If this is the end of the game, update game status
        if (game.isGameOpen) {
          game.isGameOpen = false;
          game.gameEndedAt = new Date();
          await game.save().catch(err => console.error('Error saving game state:', err));
        }
      }
    }
  };
  
  // Start the sequence
  advanceSequence();
}

// Function to create the display sequence for a game
async function createGameSequence(game) {
  if (!game || !game.questions || game.questions.length === 0) {
    console.error('No questions found in the game');
    return [];
  }
  
  currentSequenceIndex = 0;
  currentGameSequence = [];
  
  // Add intro items from sample data (randomly)
  currentGameSequence.push({ primary: sampleData.getRandomImage(), duration: TIMING.INTRO_IMAGE });
  currentGameSequence.push({ primary: sampleData.getDisclaimer(), duration: TIMING.DISCLAIMER });
  currentGameSequence.push({ primary: sampleData.getRandomVideo(), duration: TIMING.INTRO_VIDEO });
  
  // Add each question and answer from the QuizGame database
  game.questions.forEach((question, index) => {
    // Find the correct choice index for this question
    const correctChoice = question.choices.find(choice => choice.isCorrectChoice);
    const correctChoiceIndex = correctChoice ? correctChoice.choiceIndex : -1;
    
    console.log(`Question ${index}: correctChoiceIndex = ${correctChoiceIndex}`);
    
    // Convert question format to display format (from actual game data)
    const questionData = {
      type: 'question',
      data: {
        text: question.questionText,
        image: question.questionImageUrl,
        choices: question.choices.map(choice => choice.choiceText)
      }
    };
    
    // Add question item
    currentGameSequence.push({ 
      primary: questionData, 
      duration: TIMING.QUESTION,
      questionIndex: index
    });
    
    // Answer data from the game
    const answerData = {
      type: 'answer',
      data: {
        text: correctChoiceIndex >= 0 ? question.choices[correctChoiceIndex].choiceText : "Not specified",
        description: question.answerExplanation,
        questionText: question.questionText,
        questionImage: question.questionImageUrl
      }
    };
    
    // Add answer
    currentGameSequence.push({ 
      primary: answerData, 
      duration: TIMING.ANSWER,
      questionIndex: index
    });
  });
  
  // Add outro items from sample data
  currentGameSequence.push({ 
    primary: sampleData.getCredits(), 
    duration: TIMING.CREDITS 
  });
  
  return currentGameSequence;
}

// Define the port
const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
