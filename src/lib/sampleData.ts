
// DisplayData type for quiz interface
export interface DisplayData {
  type: 'question' | 'response' | 'image' | 'video' | 'answer' | 'fastestAnswers' | 'leaderboard' | 'upcomingSchedule' | 'credits' | 'disclaimer';
  data: unknown;
}

export interface PairedData {
  primary: DisplayData;
  secondary?: DisplayData;
  duration: number;
}

// Sample questions
export const sampleQuestions = [
  {
    text: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
  },
  {
    text: "Which planet is known as the Red Planet?",
    // Removed image to see how layout looks without it
    choices: ["Mars", "Venus", "Jupiter", "Saturn"],
  },
  {
    text: "Who painted the Mona Lisa?",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    choices: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
  },
  {
    text: "What is the largest ocean on Earth?",
    // Removed image to see how layout looks without it
    choices: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
  },
];

// Sample images
export const sampleImages = [
  {
    url: "https://images.unsplash.com/photo-1682687982141-0143020ed57a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Space Exploration",
    description: "A beautiful image of the cosmos showing distant galaxies",
  },
  {
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    name: "Nature",
    description: "Serene landscape of mountains and lakes",
  },
];

// Sample videos
export const sampleVideos = [
  {
    url: "https://www.example.com/video1.mp4",
    name: "Quiz Highlights",
    description: "Highlights from our previous quiz championship",
  },
  {
    url: "https://www.example.com/video2.mp4",
    name: "How to Play",
    description: "A quick tutorial on how to participate in our quiz",
  },
];

// Sample answers
export const sampleAnswers = [
  {
    text: "Paris",
    description: "Paris is the capital and most populous city of France, with an estimated population of 2,175,601 residents.",
  },
  {
    text: "Mars",
    description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, often referred to as the 'Red Planet'.",
  },
];

// Sample responses (array of user responses)
export const sampleResponses = [
  { name: "John Doe", picture: "https://randomuser.me/api/portraits/men/1.jpg", responseTime: 2.5 },
  { name: "Jane Smith", picture: "https://randomuser.me/api/portraits/women/2.jpg", responseTime: 3.2 },
  { name: "Alex Johnson", picture: "https://randomuser.me/api/portraits/men/3.jpg", responseTime: 3.8 },
];

// Sample fastest answers (object with array of responses)
export const sampleFastestAnswers = {
  responses: [
    { name: "Sarah Wilson", picture: "https://randomuser.me/api/portraits/women/4.jpg", responseTime: 1.8 },
    { name: "Michael Brown", picture: "https://randomuser.me/api/portraits/men/5.jpg", responseTime: 2.1 },
    { name: "Emily Davis", picture: "https://randomuser.me/api/portraits/women/6.jpg", responseTime: 2.3 },
    { name: "Sarah Wilson2", picture: "https://randomuser.me/api/portraits/women/4.jpg", responseTime: 1.8 },
    { name: "Michael Brown2", picture: "https://randomuser.me/api/portraits/men/5.jpg", responseTime: 2.1 },
  ],
};

// Sample leaderboard (object with array of users)
export const sampleLeaderboard = {
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
  ],
};

// Sample upcoming schedule
export const sampleUpcomingSchedule = {
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
};

// Sample credits
export const sampleCredits = {
  curator: {
    name: "Dr. Alex Morgan",
    image: "https://randomuser.me/api/portraits/men/42.jpg",
    bio: "Quiz master with 10 years experience in educational games"
  },
  sponsor: {
    name: "Knowledge Plus Inc.",
    image: "https://randomuser.me/api/portraits/women/43.jpg",
    bio: "Supporting educational initiatives since 2010"
  },
};

// Sample disclaimer
export const sampleDisclaimer = {
  qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://example.com/terms",
  text: "By participating in this quiz game, you agree to abide by our terms and conditions and have given your consent to record your responses for safe usage. Visit our website for more information.",
};

// Functions to generate random data
export function getRandomQuestion(): DisplayData {
  return {
    type: "question",
    data: sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)],
  };
}

export function getRandomResponse(): DisplayData {
  return {
    type: "response",
    data: [...sampleResponses].sort(() => 0.5 - Math.random()).slice(0, 3),
  };
}

export function getRandomImage(): DisplayData {
  return {
    type: "image",
    data: sampleImages[Math.floor(Math.random() * sampleImages.length)],
  };
}

export function getRandomVideo(): DisplayData {
  return {
    type: "video",
    data: sampleVideos[Math.floor(Math.random() * sampleVideos.length)],
  };
}

export function getRandomAnswer(): DisplayData {
  return {
    type: "answer",
    data: sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)],
  };
}

export function getFastestAnswers(): DisplayData {
  return {
    type: "fastestAnswers",
    data: sampleFastestAnswers,
  };
}

export function getLeaderboard(): DisplayData {
  return {
    type: "leaderboard",
    data: sampleLeaderboard,
  };
}

export function getUpcomingSchedule(): DisplayData {
  return {
    type: "upcomingSchedule",
    data: sampleUpcomingSchedule,
  };
}

export function getCredits(): DisplayData {
  return {
    type: "credits",
    data: sampleCredits,
  };
}

export function getDisclaimer(): DisplayData {
  return {
    type: "disclaimer",
    data: sampleDisclaimer,
  };
}

// Function to get random paired data for display
export function getRandomPairedData(): PairedData {
  const displayTypes = [
    getRandomQuestion,
    getRandomResponse,
    getRandomImage,
    getRandomVideo,
    getRandomAnswer,
    getFastestAnswers,
    getLeaderboard,
    getUpcomingSchedule,
    getCredits,
    getDisclaimer,
  ];
  
  const primaryFunction = displayTypes[Math.floor(Math.random() * displayTypes.length)];
  const primary = primaryFunction();
  
  // Secondary might be undefined (single display)
  const hasSecondary = Math.random() > 0.5;
  
  if (hasSecondary) {
    // Avoid duplicate types for side-by-side
    const filteredTypes = displayTypes.filter(fn => fn !== primaryFunction);
    const secondaryFunction = filteredTypes[Math.floor(Math.random() * filteredTypes.length)];
    const secondary = secondaryFunction();
    
    return {
      primary,
      secondary,
      duration: 10000, // 10 seconds
    };
  }
  
  return {
    primary,
    duration: 10000, // 10 seconds
  };
}
