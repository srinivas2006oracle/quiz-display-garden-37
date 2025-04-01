
// Sample data for the quiz application
// These are server-side equivalents of the client-side sample data

// Sample questions
const sampleQuestions = [
  {
    text: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    showfor: 10000,
  },
  {
    text: "Which planet is known as the Red Planet?",
    // Removed image to see how layout looks without it
    choices: ["Mars", "Venus", "Jupiter", "Saturn"],
    showfor: 8000,
  },
  {
    text: "Who painted the Mona Lisa?",
    //image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    choices: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
    showfor: 12000,
  },
  {
    text: "What is the largest ocean on Earth?",
    // Removed image to see how layout looks without it
    choices: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    showfor: 9000,
  },
];

// Sample images
const sampleImages = [
  {
    url: "https://images.unsplash.com/photo-1682687982141-0143020ed57a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Space Exploration",
    description: "A beautiful image of the cosmos showing distant galaxies",
    showfor: 8000,
  },
  {
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Nature",
    description: "Serene landscape of mountains and lakes",
    showfor: 7000,
  },
];

// Sample videos
const sampleVideos = [
  {
    url: "https://www.example.com/video1.mp4",
    name: "Quiz Highlights",
    description: "Highlights from our previous quiz championship",
    showfor: 15000,
  },
  {
    url: "https://www.example.com/video2.mp4",
    name: "How to Play",
    description: "A quick tutorial on how to participate in our quiz",
    showfor: 20000,
  },
];

// Sample answers
const sampleAnswers = [
  {
    text: "Paris",
    description: "Paris is the capital and most populous city of France, with an estimated population of 2,175,601 residents.",
    showfor: 10000,
  },
  {
    text: "Mars",
    description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, often referred to as the 'Red Planet'.",
    showfor: 8000,
  },
];

// Sample responses
const sampleResponses = [
  { name: "John Doe", picture: "https://randomuser.me/api/portraits/men/1.jpg", responseTime: 2.5, showfor: 5000 },
  { name: "Jane Smith", picture: "https://randomuser.me/api/portraits/women/2.jpg", responseTime: 3.2, showfor: 5000 },
  { name: "Alex Johnson", picture: "https://randomuser.me/api/portraits/men/3.jpg", responseTime: 3.8, showfor: 5000 },
  { name: "Emily Wilson", picture: "https://randomuser.me/api/portraits/women/4.jpg", responseTime: 1.9, showfor: 5000 },
  { name: "Robert Brown", picture: "https://randomuser.me/api/portraits/men/5.jpg", responseTime: 2.7, showfor: 5000 },
  { name: "Olivia Martinez", picture: "https://randomuser.me/api/portraits/women/6.jpg", responseTime: 3.5, showfor: 5000 },
  { name: "Daniel Taylor", picture: "https://randomuser.me/api/portraits/men/7.jpg", responseTime: 2.2, showfor: 5000 },
  { name: "Sophia Anderson", picture: "https://randomuser.me/api/portraits/women/8.jpg", responseTime: 2.9, showfor: 5000 },
];

// Sample fastest answers
const sampleFastestAnswers = {
  responses: [
    { name: "Sarah Wilson", picture: "https://randomuser.me/api/portraits/women/4.jpg", responseTime: 1.8 },
    { name: "Michael Brown", picture: "https://randomuser.me/api/portraits/men/5.jpg", responseTime: 2.1 },
    { name: "Emily Davis", picture: "https://randomuser.me/api/portraits/women/6.jpg", responseTime: 2.3 },
    { name: "Sarah Wilson2", picture: "https://randomuser.me/api/portraits/women/4.jpg", responseTime: 1.8 },
    { name: "Michael Brown2", picture: "https://randomuser.me/api/portraits/men/5.jpg", responseTime: 2.1 },
    { name: "Emily Davis2", picture: "https://randomuser.me/api/portraits/women/6.jpg", responseTime: 2.3 },
  ],
  showfor: 12000,
};

// Sample leaderboard
const sampleLeaderboard = {
  users: [
    { name: "Rachel Green", picture: "https://randomuser.me/api/portraits/women/7.jpg", score: 950 },
    { name: "Ross Geller", picture: "https://randomuser.me/api/portraits/men/8.jpg", score: 850 },
    { name: "Joey Tribbiani", picture: "https://randomuser.me/api/portraits/men/9.jpg", score: 780 },
    { name: "Chandler Bing", picture: "https://randomuser.me/api/portraits/men/10.jpg", score: 750 },
    { name: "Monica Geller", picture: "https://randomuser.me/api/portraits/women/11.jpg", score: 720 },
    { name: "Rachel Green2", picture: "https://randomuser.me/api/portraits/women/7.jpg", score: 950 },
    { name: "Ross Geller2", picture: "https://randomuser.me/api/portraits/men/8.jpg", score: 850 },
    { name: "Joey Tribbiani2", picture: "https://randomuser.me/api/portraits/men/9.jpg", score: 780 },
    { name: "Chandler Bing2", picture: "https://randomuser.me/api/portraits/men/10.jpg", score: 750 },
    { name: "Monica Geller2", picture: "https://randomuser.me/api/portraits/women/11.jpg", score: 720 },
    { name: "Rachel Green3", picture: "https://randomuser.me/api/portraits/women/7.jpg", score: 950 },
    { name: "Ross Geller3", picture: "https://randomuser.me/api/portraits/men/8.jpg", score: 850 },
    { name: "Joey Tribbiani3", picture: "https://randomuser.me/api/portraits/men/9.jpg", score: 780 },
    { name: "Chandler Bing3", picture: "https://randomuser.me/api/portraits/men/10.jpg", score: 750 },
    { name: "Monica Geller3", picture: "https://randomuser.me/api/portraits/women/11.jpg", score: 720 },
  ],
  showfor: 15000,
};

// Sample upcoming schedule
const sampleUpcomingSchedule = {
  schedule: [
    {
      programName: "Science Quiz",
      description: "Test your knowledge of scientific facts",
      startDateTime: "2023-05-20T18:00:00",
      startsIn: "2 days",
    },
    {
      programName: "History Challenge",
      description: "Journey through time with our history quiz",
      startDateTime: "2023-05-22T19:30:00",
      startsIn: "4 days",
    },
    {
      programName: "Movie Trivia",
      description: "How well do you know your films?",
      startDateTime: "2023-05-25T20:00:00",
      startsIn: "7 days",
    },
  ],
  showfor: 18000,
};

// Functions to get random data
function getRandomQuestion() {
  return {
    type: "question",
    data: sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)],
  };
}

function getRandomResponse() {
  // Randomly select 3-5 responses to display
  const numberOfResponses = Math.floor(Math.random() * 3) + 3; // 3 to 5 responses
  const shuffledResponses = [...sampleResponses].sort(() => 0.5 - Math.random());
  const selectedResponses = shuffledResponses.slice(0, numberOfResponses);
  
  return {
    type: "response",
    data: selectedResponses,
  };
}

function getRandomImage() {
  return {
    type: "image",
    data: sampleImages[Math.floor(Math.random() * sampleImages.length)],
  };
}

function getRandomVideo() {
  return {
    type: "video",
    data: sampleVideos[Math.floor(Math.random() * sampleVideos.length)],
  };
}

function getRandomAnswer() {
  return {
    type: "answer",
    data: sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)],
  };
}

function getRandomFastestAnswers() {
  return {
    type: "fastestAnswers",
    data: sampleFastestAnswers,
  };
}

function getRandomLeaderboard() {
  return {
    type: "leaderboard",
    data: sampleLeaderboard,
  };
}

function getRandomUpcomingSchedule() {
  return {
    type: "upcomingSchedule",
    data: sampleUpcomingSchedule,
  };
}

function getRandomData() {
  const types = [
    getRandomQuestion,
    getRandomResponse,
    getRandomImage,
    getRandomVideo,
    getRandomAnswer,
    getRandomFastestAnswers,
    getRandomLeaderboard,
    getRandomUpcomingSchedule,
  ];
  return types[Math.floor(Math.random() * types.length)]();
}

// Export all functions
module.exports = {
  getRandomQuestion,
  getRandomResponse,
  getRandomImage,
  getRandomVideo,
  getRandomAnswer,
  getRandomFastestAnswers,
  getRandomLeaderboard,
  getRandomUpcomingSchedule,
  getRandomData
};
