
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

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

// Store active connections
const activeConnections = new Set();

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected, ID:', socket.id);
  activeConnections.add(socket.id);
  
  // Send welcome message
  socket.emit('connection_established', { message: 'Connected to quiz server' });
  
  // Start the quiz sequence for this connection
  startQuizSequence(socket);
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected, ID:', socket.id);
    activeConnections.delete(socket.id);
  });
});

// Function to run the quiz sequence for a connected client
function startQuizSequence(socket) {
  const sequence = createDisplaySequence();
  let sequenceIndex = 0;
  let responseRefreshTimer;
  
  const displayNextItem = () => {
    if (sequenceIndex >= sequence.length) {
      // Reset sequence when it completes
      sequenceIndex = 0;
    }
    
    const currentItem = sequence[sequenceIndex];
    socket.emit('display_update', currentItem);
    
    // Special handling for question-response paired data
    if (currentItem.primary.type === 'question' && currentItem.secondary?.type === 'response') {
      // Clear any existing response refresh timer
      if (responseRefreshTimer) clearInterval(responseRefreshTimer);
      
      // Setup a refresh timer that updates responses every 5 seconds
      responseRefreshTimer = setInterval(() => {
        const updatedResponses = {
          ...currentItem,
          secondary: sampleData.getRandomResponse() // Fresh response data every 5 seconds
        };
        socket.emit('display_update', updatedResponses);
      }, 5000);
      
      // Move to next sequence item after duration
      setTimeout(() => {
        clearInterval(responseRefreshTimer);
        sequenceIndex++;
        displayNextItem();
      }, currentItem.duration);
    } else {
      // For all other data types, display for the specified duration
      sequenceIndex++;
      setTimeout(displayNextItem, currentItem.duration);
    }
  };

  // Start the sequence with a short delay
  setTimeout(displayNextItem, 1000);
}

// Create the display sequence based on requirements
function createDisplaySequence() {
  const questionData1 = sampleData.getRandomQuestion();
  const questionData2 = sampleData.getRandomQuestion();
  const responseData = sampleData.getRandomResponse();
  const answerData = sampleData.getRandomAnswer();
  const fastestAnswersData = sampleData.getRandomFastestAnswers();
  
  return [
    { primary: sampleData.getRandomImage(), duration: 10000 },                               // 1. Image for 10 seconds
    { primary: sampleData.getRandomVideo(), duration: 10000 },                               // 2. Video for 10 seconds
    { primary: questionData1, secondary: responseData, duration: 30000 },                     // 3. Question & Responses for 30 seconds
    { primary: answerData, secondary: fastestAnswersData, duration: 10000 },                 // 4. Answer & Fastest Answers for 10 seconds
    { primary: sampleData.getRandomLeaderboard(), duration: 10000 },                         // 5. Leaderboard for 10 seconds
    { primary: questionData2, secondary: responseData, duration: 30000 },                     // 6. Another Question & Responses for 30 seconds
    { primary: sampleData.getRandomAnswer(), secondary: sampleData.getRandomFastestAnswers(), duration: 10000 }, // 7. Answer & Fastest Answers for 10 seconds
    { primary: sampleData.getRandomLeaderboard(), duration: 10000 },                         // 8. Leaderboard for 10 seconds
    { primary: sampleData.getRandomUpcomingSchedule(), duration: 20000 },                   // 9. Upcoming Schedule for 20 seconds
  ];
}

// Define the port
const PORT = process.env.PORT || 5001;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
