const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

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

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/QuizDbv2';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB Schemas
const { Schema } = mongoose;

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
  choiceResponses: [ResponseSchema],
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
const AllResponse = mongoose.model('AllResponse', ResponseSchema);

// Store active connections and game state
const activeConnections = new Set();
let activeGame = null;
let currentGameSequence = [];
let currentSequenceIndex = 0;
let responseRefreshTimer;
let autoGameTimer = null;

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
      clearInterval(responseRefreshTimer);
      
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
        
        // Show leaderboard after answer
        setTimeout(() => {
          const leaderboardItemIndex = currentGameSequence.findIndex(item => 
            item.primary?.type === 'leaderboard' && 
            item.questionIndex === currentQuestionIndex
          );
          
          if (leaderboardItemIndex >= 0) {
            io.emit('display_update', currentGameSequence[leaderboardItemIndex]);
          }
        }, 10000); // Show leaderboard 10 seconds after answer
        
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
          displayItem = { primary: sampleData.getRandomImage(), duration: 10000 };
          break;
        case 'disclaimer':
          displayItem = { primary: sampleData.getDisclaimer(), duration: 10000 };
          break;
        case 'video':
          displayItem = { primary: sampleData.getRandomVideo(), duration: 10000 };
          break;
        case 'credits':
          displayItem = { 
            primary: sampleData.getCredits(), 
            secondary: sampleData.getRandomUpcomingSchedule(), 
            duration: 20000 
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
  
  currentSequenceIndex = 0;
  currentGameSequence = [];
  
  // Add intro items
  currentGameSequence.push({ primary: sampleData.getRandomImage(), duration: 10000 });  // Image for 10 seconds
  currentGameSequence.push({ primary: sampleData.getDisclaimer(), duration: 10000 });   // Disclaimer for 10 seconds
  currentGameSequence.push({ primary: sampleData.getRandomVideo(), duration: 10000 });  // Video for 10 seconds
  
  // Add each question and answer
  game.questions.forEach((question, index) => {
    // Convert question format to display format
    const questionData = {
      type: 'question',
      data: {
        text: question.questionText,
        image: question.questionImageUrl,
        choices: question.choices.map(choice => choice.choiceText)
      }
    };
    
    // Fetch stored responses for this question
    let responseData = {
      type: 'responses',
      data: []
    };
    
    // Check if question has any responses stored
    let hasResponses = false;
    question.choices.forEach(choice => {
      if (choice.choiceResponses && choice.choiceResponses.length > 0) {
        hasResponses = true;
      }
    });
    
    if (hasResponses) {
      // Extract responses from all choices
      const allResponses = [];
      question.choices.forEach((choice, choiceIndex) => {
        if (choice.choiceResponses && choice.choiceResponses.length > 0) {
          choice.choiceResponses.forEach(response => {
            allResponses.push({
              name: response.userName || `User ${allResponses.length + 1}`,
              picture: response.ytProfilePicUrl || null,
              responseTime: response.responseTime,
              optionIndex: choiceIndex
            });
          });
        }
      });
      
      // Sort by response time and take first 6
      const sortedResponses = allResponses.sort((a, b) => 
        parseFloat(a.responseTime) - parseFloat(b.responseTime)
      );
      
      responseData.data = sortedResponses.slice(0, 6);
    }
    
    // Add question and responses pair
    currentGameSequence.push({ 
      primary: questionData, 
      secondary: responseData, 
      duration: 30000,
      questionIndex: index,
      responsePool: question.choices.flatMap(choice => 
        (choice.choiceResponses || []).map(response => ({
          name: response.userName || `Unknown User`,
          picture: response.ytProfilePicUrl || null,
          responseTime: response.responseTime,
          optionIndex: choice.choiceIndex
        }))
      ),
      responsePageIndex: 0
    });
    
    // Find correct choice
    const correctChoiceIndex = question.choices.findIndex(choice => choice.isCorrectChoice);
    
    // Answer data
    const answerData = {
      type: 'answer',
      data: {
        text: correctChoiceIndex >= 0 ? question.choices[correctChoiceIndex].choiceText : "Not specified",
        description: question.answerExplanation
      }
    };
    
    // SuperSix data - fastest correct answers
    const fastestAnswersData = {
      type: 'superSix',
      data: {
        responses: []
      }
    };
    
    // If there's a correct choice with responses, populate SuperSix
    if (correctChoiceIndex >= 0 && 
        question.choices[correctChoiceIndex].choiceResponses && 
        question.choices[correctChoiceIndex].choiceResponses.length > 0) {
      
      // Extract and sort correct responses
      const correctResponses = question.choices[correctChoiceIndex].choiceResponses.map(response => ({
        name: response.userName || 'Anonymous',
        picture: response.ytProfilePicUrl || null,
        responseTime: response.responseTime
      }));
      
      // Sort by response time and take first 6
      fastestAnswersData.data.responses = correctResponses
        .sort((a, b) => parseFloat(a.responseTime) - parseFloat(b.responseTime))
        .slice(0, 6);
    }
    
    // Add answer and fastest answers pair
    currentGameSequence.push({ 
      primary: answerData, 
      secondary: fastestAnswersData, 
      duration: 10000,
      questionIndex: index
    });
    
    // Empty leaderboard for now
    const leaderboardData = {
      type: 'leaderboard',
      data: {
        users: []
      }
    };
    
    // Add leaderboard
    currentGameSequence.push({ 
      primary: leaderboardData, 
      duration: 10000,
      questionIndex: index
    });
  });
  
  // Add outro items
  currentGameSequence.push({ 
    primary: sampleData.getCredits(), 
    secondary: sampleData.getRandomUpcomingSchedule(), 
    duration: 20000 
  });
  
  return currentGameSequence;
}

// Handle response pagination - Update for the next 6 responses
app.post('/admin/question/refresh-responses/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await QuizGame.findById(gameId);
    
    if (!game || !game.isGameOpen) {
      return res.status(400).json({ success: false, message: 'Game not found or not open' });
    }
    
    const questionIndex = game.activeQuestionIndex;
    if (questionIndex < 0 || questionIndex >= game.questions.length) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }
    
    // Find the current question in the sequence
    const questionItemIndex = currentGameSequence.findIndex(item => 
      item.primary?.type === 'question' && item.questionIndex === questionIndex
    );
    
    if (questionItemIndex < 0) {
      return res.status(400).json({ success: false, message: 'Question not found in sequence' });
    }
    
    const questionItem = currentGameSequence[questionItemIndex];
    
    // If we have a response pool, get the next page of responses
    if (questionItem.responsePool && questionItem.responsePool.length > 0) {
      questionItem.responsePageIndex = (questionItem.responsePageIndex || 0) + 1;
      const startIndex = (questionItem.responsePageIndex * 6) % questionItem.responsePool.length;
      
      // Get next 6 responses or wrap around
      const nextResponses = [];
      for (let i = 0; i < 6; i++) {
        const index = (startIndex + i) % questionItem.responsePool.length;
        nextResponses.push(questionItem.responsePool[index]);
      }
      
      // Update the responses in the question item
      questionItem.secondary = {
        type: 'responses',
        data: nextResponses
      };
      
      // Send the updated responses to all clients
      io.emit('display_update', questionItem);
      
      res.json({ success: true, message: 'Responses refreshed' });
    } else {
      res.json({ success: false, message: 'No responses available' });
    }
  } catch (err) {
    console.error('Error refreshing responses:', err);
    res.status(500).json({ success: false, message: 'Error refreshing responses' });
  }
});

// Define the port
const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
