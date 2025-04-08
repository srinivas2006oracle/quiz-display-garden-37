
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { ObjectId } = mongoose.Types;

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Import sample data generator functions for static content
const sampleData = require('./sampleData');

// Define timing constants (in milliseconds)
const TIMING = {
  INTRO_IMAGE: 5000,
  DISCLAIMER: 5000,
  INTRO_VIDEO: 5000,
  QUESTION: 30000,
  ANSWER: 20000,
  CREDITS: 20000
};

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/QuizDbv3';

mongoose.connect(MONGODB_URI)
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
  questionType: { type: String, enum: ['multiple-choice', 'fill-in-blank'], default: 'multiple-choice' },
  answerText: String,
  answerImageUrl: String,
  answerExplanation: String,
  templateCode: { 
    type: String, 
    enum: [
      '1QP4C', '1Q4C', '1QP3C', '1Q3C', '1QP2CP', '1Q2CP', 
      '1QP1AP', '1Q1A', '1QP1A', '1Q1AP', '1Q2OP', 'Other',
      'multiple-choice', 'fill-in-blank', 'Other'
    ], 
    default: 'multiple-choice' 
  },
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
  templateCode: { 
    type: String, 
    enum: [
      '1QP4C', '1Q4C', '1QP3C', '1Q3C', '1QP2CP', '1Q2CP', 
      '1QP1AP', '1Q1A', '1QP1A', '1Q1AP', '1Q2OP', 'Other',
      'multiple-choice', 'fill-in-blank'
    ], 
    default: '1QP3C' 
  },
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
  gameDescription: { type: String, default: "" },
  gameScheduledStart: Date,
  gameScheduledEnd: Date,
  gameStartedAt: Date,
  gameEndedAt: Date,
  activeQuestionIndex: { type: Number, min: -1, default: -1 },
  questionStartedAt: Date,
  isQuestionOpen: { type: Boolean, default: false },
  correctChoiceIndex: { type: Number, min: -1, default: -1 },
  isGameOpen: { type: Boolean, default: false },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  questions: [QuestionSchema],
  introImage: { type: String, default: '' },
  gameMode: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
  topics: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String
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

// API Routes for Quiz Games
app.get('/api/quizgames', async (req, res) => {
  try {
    const { search, startDateFrom, startDateTo } = req.query;
    
    // Build the query object
    let query = {};
    
    // Add search criteria if provided
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { gameTitle: searchRegex },
        { gameDescription: searchRegex },
        { topics: searchRegex }
      ];
    }
    
    // Add date range filter if provided
    if (startDateFrom || startDateTo) {
      query.gameScheduledStart = {};
      
      if (startDateFrom) {
        query.gameScheduledStart.$gte = new Date(startDateFrom);
      }
      
      if (startDateTo) {
        query.gameScheduledStart.$lte = new Date(startDateTo);
      }
    }
    
    const quizGames = await QuizGame.find(query)
      .sort({ gameScheduledStart: -1 })
      .limit(20)
      .select('gameTitle gameDescription gameScheduledStart topics questions');
    
    res.json({
      success: true,
      data: quizGames.map(game => ({
        id: game._id,
        title: game.gameTitle,
        description: game.gameDescription || "",
        scheduledStart: game.gameScheduledStart,
        topics: game.topics || [],
        questionCount: game.questions ? game.questions.length : 0
      }))
    });
  } catch (error) {
    console.error('Error fetching quiz games:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz games' });
  }
});

app.get('/api/quizgame/:id', async (req, res) => {
  try {
    const gameId = req.params.id;
    
    if (!ObjectId.isValid(gameId)) {
      return res.status(400).json({ success: false, message: 'Invalid game ID' });
    }
    
    const game = await QuizGame.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ success: false, message: 'Quiz game not found' });
    }
    
    res.json({
      success: true,
      data: {
        id: game._id,
        title: game.gameTitle,
        description: game.gameDescription || "",
        scheduledStart: game.gameScheduledStart,
        scheduledEnd: game.gameScheduledEnd,
        topics: game.topics || [],
        questionCount: game.questions ? game.questions.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching quiz game:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quiz game' });
  }
});

// Game Management Routes
app.get('/admin', async (req, res) => {
  try {
    const quizGames = await QuizGame.find().sort({ createdAt: -1 });
    res.render('admin', { quizGames });
  } catch (err) {
    console.error('Error fetching quiz games:', err);
    res.status(500).send('Error fetching quiz games');
  }
});

app.get('/admin/game/:id', async (req, res) => {
  try {
    const game = await QuizGame.findById(req.params.id);
    if (!game) {
      return res.status(404).send('Game not found');
    }
    res.render('game-detail', { game });
  } catch (err) {
    console.error('Error fetching game details:', err);
    res.status(500).send('Error fetching game details');
  }
});

app.post('/admin/game/start/:id', async (req, res) => {
  try {
    const game = await QuizGame.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    // Clear any existing timer
    if (autoGameTimer) {
      clearTimeout(autoGameTimer);
      autoGameTimer = null;
    }
    
    game.isGameOpen = true;
    game.gameStartedAt = new Date();
    game.activeQuestionIndex = -1;
    await game.save();
    
    // Set as active game
    activeGame = game;
    
    // Create game sequence
    createGameSequence(game);
    currentSequenceIndex = 0;
    
    // Notify all clients
    io.emit('game_started', { gameId: game._id, gameTitle: game.gameTitle });
    
    // If automatic mode, start the sequence
    if (game.gameMode === 'automatic') {
      startAutomaticSequence(game);
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error starting game:', err);
    res.status(500).json({ success: false, message: 'Error starting game' });
  }
});

app.post('/admin/game/stop/:id', async (req, res) => {
  try {
    const game = await QuizGame.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    game.isGameOpen = false;
    game.gameEndedAt = new Date();
    game.isQuestionOpen = false;
    await game.save();
    
    // Clear active game
    if (activeGame && activeGame._id.toString() === game._id.toString()) {
      activeGame = null;
      
      // Clear automatic sequence timer
      if (autoGameTimer) {
        clearTimeout(autoGameTimer);
        autoGameTimer = null;
      }
    }
    
    // Notify all clients
    io.emit('game_stopped', { gameId: game._id, gameTitle: game.gameTitle });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error stopping game:', err);
    res.status(500).json({ success: false, message: 'Error stopping game' });
  }
});

app.post('/admin/game/toggle-mode/:id', async (req, res) => {
  try {
    const game = await QuizGame.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    // Toggle the game mode
    game.gameMode = game.gameMode === 'automatic' ? 'manual' : 'automatic';
    await game.save();
    
    // If the game is active and now in automatic mode, start the sequence
    if (game.isGameOpen && game.gameMode === 'automatic' && 
        activeGame && activeGame._id.toString() === game._id.toString()) {
      startAutomaticSequence(game);
    }
    
    // If switching to manual mode, clear any automatic timers
    if (game.gameMode === 'manual' && autoGameTimer) {
      clearTimeout(autoGameTimer);
      autoGameTimer = null;
    }
    
    res.json({ success: true, mode: game.gameMode });
  } catch (err) {
    console.error('Error toggling game mode:', err);
    res.status(500).json({ success: false, message: 'Error toggling game mode' });
  }
});

app.post('/admin/question/next/:gameId', async (req, res) => {
  try {
    const game = await QuizGame.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    if (!game.isGameOpen) {
      return res.status(400).json({ success: false, message: 'Game is not open' });
    }
    
    // In manual mode, admin controls the flow
    if (game.gameMode === 'manual') {
      // Close current question if open
      if (game.isQuestionOpen) {
        game.isQuestionOpen = false;
        await game.save();
      }
      
      // Move to next question
      if (game.activeQuestionIndex < game.questions.length - 1) {
        game.activeQuestionIndex += 1;
        game.questionStartedAt = new Date();
        game.isQuestionOpen = true;
        await game.save();
        
        // Update active game
        activeGame = game;
        
        // Send current question to all clients
        const questionItem = currentGameSequence.find(item => 
          item.primary?.type === 'question' && 
          item.questionIndex === game.activeQuestionIndex
        );
        
        if (questionItem) {
          io.emit('display_update', questionItem);
        }
        
        res.json({ success: true, activeQuestionIndex: game.activeQuestionIndex });
      } else {
        res.json({ success: false, message: 'No more questions' });
      }
    } else {
      res.json({ success: false, message: 'Cannot manually advance question in automatic mode' });
    }
  } catch (err) {
    console.error('Error advancing to next question:', err);
    res.status(500).json({ success: false, message: 'Error advancing to next question' });
  }
});

app.post('/admin/answer/show/:gameId', async (req, res) => {
  try {
    const game = await QuizGame.findById(req.params.gameId);
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    if (!game.isGameOpen) {
      return res.status(400).json({ success: false, message: 'Game is not open' });
    }
    
    // In manual mode, admin controls the flow
    if (game.gameMode === 'manual') {
      // Close current question
      game.isQuestionOpen = false;
      await game.save();
      
      // Send answer to all clients
      const currentQuestionIndex = game.activeQuestionIndex;
      const answerItemIndex = currentGameSequence.findIndex(item => 
        item.primary?.type === 'answer' && 
        item.questionIndex === currentQuestionIndex
      );
      
      if (answerItemIndex >= 0) {
        io.emit('display_update', currentGameSequence[answerItemIndex]);
        res.json({ success: true, message: 'Answer displayed' });
      } else {
        res.json({ success: false, message: 'Answer not found' });
      }
    } else {
      res.json({ success: false, message: 'Cannot manually show answer in automatic mode' });
    }
  } catch (err) {
    console.error('Error showing answer:', err);
    res.status(500).json({ success: false, message: 'Error showing answer' });
  }
});

app.post('/admin/display/:type/:gameId', async (req, res) => {
  try {
    const { type, gameId } = req.params;
    const game = await QuizGame.findById(gameId);
    
    if (!game) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }
    
    if (!game.isGameOpen) {
      return res.status(400).json({ success: false, message: 'Game is not open' });
    }
    
    // In manual mode, admin controls the flow
    if (game.gameMode === 'manual') {
      let displayItem = null;
      
      // Get the display item based on type
      switch (type) {
        case 'image':
          displayItem = { primary: sampleData.getRandomImage(), duration: TIMING.INTRO_IMAGE };
          break;
        case 'disclaimer':
          displayItem = { primary: sampleData.getDisclaimer(), duration: TIMING.DISCLAIMER };
          break;
        case 'video':
          displayItem = { primary: sampleData.getRandomVideo(), duration: TIMING.INTRO_VIDEO };
          break;
        case 'credits':
          displayItem = { 
            primary: sampleData.getCredits(), 
            secondary: sampleData.getRandomUpcomingSchedule(), 
            duration: TIMING.CREDITS 
          };
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid display type' });
      }
      
      // Send display item to all clients
      if (displayItem) {
        io.emit('display_update', displayItem);
        res.json({ success: true, message: `${type} displayed` });
      } else {
        res.json({ success: false, message: 'Display item not found' });
      }
    } else {
      res.json({ success: false, message: 'Cannot manually control display in automatic mode' });
    }
  } catch (err) {
    console.error('Error displaying content:', err);
    res.status(500).json({ success: false, message: 'Error displaying content' });
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected, ID:', socket.id);
  activeConnections.add(socket.id);
  
  // Send welcome message
  socket.emit('connection_established', { message: 'Connected to quiz server' });
  
  // Start game sequence if there's an active game
  if (activeGame && activeGame.isGameOpen) {
    // In automatic mode, send current sequence item
    if (activeGame.gameMode === 'automatic') {
      if (currentSequenceIndex < currentGameSequence.length) {
        socket.emit('display_update', currentGameSequence[currentSequenceIndex]);
      }
    } else {
      // In manual mode, send last displayed item or initial item
      if (currentSequenceIndex < currentGameSequence.length) {
        socket.emit('display_update', currentGameSequence[0]); // Send first item as default
      }
    }
  }
  
  // Handle start game request
  socket.on('start_game', async (data) => {
    try {
      console.log('Received start_game request:', data);
      
      if (!data.gameId || !ObjectId.isValid(data.gameId)) {
        socket.emit('error', { message: 'Invalid game ID' });
        return;
      }
      
      const game = await QuizGame.findById(data.gameId);
      
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }
      
      // Clear any existing timer
      if (autoGameTimer) {
        clearTimeout(autoGameTimer);
        autoGameTimer = null;
      }
      
      // Set game as active
      game.isGameOpen = true;
      game.gameStartedAt = new Date();
      game.activeQuestionIndex = -1;
      await game.save();
      
      activeGame = game;
      
      // Create and start game sequence
      createGameSequence(game);
      if (game.gameMode === 'automatic') {
        startAutomaticSequence(game);
      } else {
        // Send first item in sequence for manual mode
        if (currentGameSequence.length > 0) {
          socket.emit('display_update', currentGameSequence[0]);
        }
      }
      
      // Acknowledge the request
      socket.emit('game_started', { 
        gameId: game._id,
        gameTitle: game.gameTitle
      });
      
    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('error', { message: 'Failed to start game' });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected, ID:', socket.id);
    activeConnections.delete(socket.id);
  });
});

// Function to run the automatic sequence for a game
function startAutomaticSequence(game) {
  if (!game || !game.isGameOpen || currentGameSequence.length === 0) {
    console.log('No active game or sequence to display');
    return;
  }
  
  // Start from the beginning
  currentSequenceIndex = 0;
  
  const advanceSequence = () => {
    if (currentSequenceIndex < currentGameSequence.length) {
      const currentItem = currentGameSequence[currentSequenceIndex];
      io.emit('display_update', currentItem);
      
      // If this is a question, update game's active question index
      if (currentItem.primary?.type === 'question' && currentItem.questionIndex !== undefined) {
        game.activeQuestionIndex = currentItem.questionIndex;
        game.questionStartedAt = new Date();
        game.isQuestionOpen = true;
        
        // Find the correct choice for this question
        if (game.questions[currentItem.questionIndex]) {
          const correctChoice = game.questions[currentItem.questionIndex].choices.find(c => c.isCorrectChoice);
          if (correctChoice) {
            game.correctChoiceIndex = correctChoice.choiceIndex;
          } else {
            game.correctChoiceIndex = -1;
          }
        }
        
        game.save().catch(err => console.error('Error saving game state:', err));
      }
      
      // If this is an answer, close the question
      if (currentItem.primary?.type === 'answer') {
        game.isQuestionOpen = false;
        game.save().catch(err => console.error('Error saving game state:', err));
      }
      
      // Move to the next item after the specified duration
      currentSequenceIndex++;
      
      // Don't advance beyond the last item
      if (currentSequenceIndex < currentGameSequence.length) {
        autoGameTimer = setTimeout(advanceSequence, currentItem.duration);
      } else {
        console.log('Sequence completed, staying on last screen');
        
        // If this is the end of the game, update game status
        if (game.isGameOpen) {
          game.isGameOpen = false;
          game.gameEndedAt = new Date();
          game.save().catch(err => console.error('Error saving game state:', err));
        }
      }
    }
  };
  
  // Start the sequence
  advanceSequence();
}

// Function to create the display sequence for a game
function createGameSequence(game) {
  if (!game || !game.questions || game.questions.length === 0) {
    console.error('No questions found in the game');
    return [];
  }
  const totalQuestions = game.questions.length;
  currentSequenceIndex = 0;
  currentGameSequence = [];
  
  // Add intro items
  currentGameSequence.push({ primary: sampleData.getRandomImage(), duration: TIMING.INTRO_IMAGE });  // Image
  currentGameSequence.push({ primary: sampleData.getDisclaimer(), duration: TIMING.DISCLAIMER });   // Disclaimer
  currentGameSequence.push({ primary: sampleData.getRandomVideo(), duration: TIMING.INTRO_VIDEO });  // Video
  
  // Add each question and answer
  game.questions.forEach((question, index) => {
    // Convert question format to display format based on template code
    const questionData = {
      type: 'question',
      data: {
        text: question.questionText,
        image: question.questionImageUrl,
        choices: question.choices ? question.choices.map(choice => choice.choiceText) : [],
        templateCode: question.templateCode,
        questionType: question.questionType
      }
    };
    
    // Add question item
    currentGameSequence.push({ 
      primary: questionData, 
      duration: TIMING.QUESTION,
      questionIndex: index,
      totalQuestions: totalQuestions
    });
    
    // Find correct choice or use answer text for fill-in-blank
    let answerText = "Not specified";
    
    if (question.questionType === 'multiple-choice') {
      const correctChoiceIndex = question.choices.findIndex(choice => choice.isCorrectChoice);
      if (correctChoiceIndex >= 0) {
        answerText = question.choices[correctChoiceIndex].choiceText;
      }
    } else if (question.questionType === 'fill-in-blank') {
      answerText = question.answerText || "Not specified";
    }
    
    // Answer data
    const answerData = {
      type: 'answer',
      data: {
        text: answerText,
        description: question.answerExplanation,
        image: question.answerImageUrl, // New field for answer image
        questionText: question.questionText,
        questionImage: question.questionImageUrl,
        templateCode: question.templateCode,
        questionType: question.questionType
      }
    };
    
    // Add answer
    currentGameSequence.push({ 
      primary: answerData, 
      duration: TIMING.ANSWER,
      questionIndex: index
    });
  });
  
  // Add outro credits
  currentGameSequence.push({ 
    primary: sampleData.getCredits(), 
    secondary: sampleData.getRandomUpcomingSchedule(), 
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
