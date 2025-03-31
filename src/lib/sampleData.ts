export interface QuestionData {
  text?: string;
  image?: string;
  choices?: string[];
  showfor?: number;
}

export interface ResponseData {
  name?: string;
  picture?: string;
  responseTime?: number;
  showfor?: number;
}

export interface ImageData {
  url?: string;
  name?: string;
  description?: string;
  showfor?: number;
}

export interface VideoData {
  url?: string;
  name?: string;
  description?: string;
  showfor?: number;
}

export interface AnswerData {
  text?: string;
  description?: string;
  showfor?: number;
}

export interface FastestAnswersData {
  responses?: ResponseData[];
  showfor?: number;
}

export interface LeaderboardData {
  users?: {
    name?: string;
    picture?: string;
    score?: number;
  }[];
  showfor?: number;
}

export interface ScheduleItem {
  programName?: string;
  description?: string;
  startDateTime?: string;
  startsIn?: string;
}

export interface UpcomingScheduleData {
  schedule?: ScheduleItem[];
  showfor?: number;
}

export type DisplayData =
  | { type: 'question'; data: QuestionData }
  | { type: 'response'; data: ResponseData[] }
  | { type: 'image'; data: ImageData }
  | { type: 'video'; data: VideoData }
  | { type: 'answer'; data: AnswerData }
  | { type: 'fastestAnswers'; data: FastestAnswersData }
  | { type: 'leaderboard'; data: LeaderboardData }
  | { type: 'upcomingSchedule'; data: UpcomingScheduleData };

// Sample data generators
const sampleQuestions: QuestionData[] = [
  {
    text: "What is the capital of France?",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    showfor: 10000,
  },
  {
    text: "Which planet is known as the Red Planet?",
    image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    choices: ["Mars", "Venus", "Jupiter", "Saturn"],
    showfor: 8000,
  },
  {
    text: "Who painted the Mona Lisa?",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    choices: ["Leonardo da Vinci", "Pablo Picasso", "Vincent van Gogh", "Michelangelo"],
    showfor: 12000,
  },
  {
    text: "What is the largest ocean on Earth?",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    choices: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    showfor: 9000,
  },
];

const sampleImages: ImageData[] = [
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

const sampleVideos: VideoData[] = [
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

const sampleAnswers: AnswerData[] = [
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

const sampleResponses: ResponseData[] = [
  {
    name: "John Doe",
    picture: "https://randomuser.me/api/portraits/men/1.jpg",
    responseTime: 2.5,
    showfor: 5000,
  },
  {
    name: "Jane Smith",
    picture: "https://randomuser.me/api/portraits/women/2.jpg",
    responseTime: 3.2,
    showfor: 5000,
  },
  {
    name: "Alex Johnson",
    picture: "https://randomuser.me/api/portraits/men/3.jpg",
    responseTime: 3.8,
    showfor: 5000,
  },
  {
    name: "Emily Wilson",
    picture: "https://randomuser.me/api/portraits/women/4.jpg",
    responseTime: 1.9,
    showfor: 5000,
  },
  {
    name: "Robert Brown",
    picture: "https://randomuser.me/api/portraits/men/5.jpg",
    responseTime: 2.7,
    showfor: 5000,
  },
  {
    name: "Olivia Martinez",
    picture: "https://randomuser.me/api/portraits/women/6.jpg",
    responseTime: 3.5,
    showfor: 5000,
  },
  {
    name: "Daniel Taylor",
    picture: "https://randomuser.me/api/portraits/men/7.jpg",
    responseTime: 2.2,
    showfor: 5000,
  },
  {
    name: "Sophia Anderson",
    picture: "https://randomuser.me/api/portraits/women/8.jpg",
    responseTime: 2.9,
    showfor: 5000,
  },
];

const sampleFastestAnswers: FastestAnswersData = {
  responses: [
    {
      name: "Sarah Wilson",
      picture: "https://randomuser.me/api/portraits/women/4.jpg",
      responseTime: 1.8,
    },
    {
      name: "Michael Brown",
      picture: "https://randomuser.me/api/portraits/men/5.jpg",
      responseTime: 2.1,
    },
    {
      name: "Emily Davis",
      picture: "https://randomuser.me/api/portraits/women/6.jpg",
      responseTime: 2.3,
    },
  ],
  showfor: 12000,
};

const sampleLeaderboard: LeaderboardData = {
  users: [
    {
      name: "Rachel Green",
      picture: "https://randomuser.me/api/portraits/women/7.jpg",
      score: 950,
    },
    {
      name: "Ross Geller",
      picture: "https://randomuser.me/api/portraits/men/8.jpg",
      score: 850,
    },
    {
      name: "Joey Tribbiani",
      picture: "https://randomuser.me/api/portraits/men/9.jpg",
      score: 780,
    },
    {
      name: "Chandler Bing",
      picture: "https://randomuser.me/api/portraits/men/10.jpg",
      score: 750,
    },
    {
      name: "Monica Geller",
      picture: "https://randomuser.me/api/portraits/women/11.jpg",
      score: 720,
    },
  ],
  showfor: 15000,
};

const sampleUpcomingSchedule: UpcomingScheduleData = {
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

// Random data generators
export const getRandomQuestion = (): DisplayData => ({
  type: "question",
  data: sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)],
});

export const getRandomResponse = (): DisplayData => {
  // Randomly select 3-5 responses to display
  const numberOfResponses = Math.floor(Math.random() * 3) + 3; // 3 to 5 responses
  const shuffledResponses = [...sampleResponses].sort(() => 0.5 - Math.random());
  const selectedResponses = shuffledResponses.slice(0, numberOfResponses);
  
  return {
    type: "response",
    data: selectedResponses,
  };
};

export const getRandomImage = (): DisplayData => ({
  type: "image",
  data: sampleImages[Math.floor(Math.random() * sampleImages.length)],
});

export const getRandomVideo = (): DisplayData => ({
  type: "video",
  data: sampleVideos[Math.floor(Math.random() * sampleVideos.length)],
});

export const getRandomAnswer = (): DisplayData => ({
  type: "answer",
  data: sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)],
});

export const getRandomFastestAnswers = (): DisplayData => ({
  type: "fastestAnswers",
  data: sampleFastestAnswers,
});

export const getRandomLeaderboard = (): DisplayData => ({
  type: "leaderboard",
  data: sampleLeaderboard,
});

export const getRandomUpcomingSchedule = (): DisplayData => ({
  type: "upcomingSchedule",
  data: sampleUpcomingSchedule,
});

export const getRandomData = (): DisplayData => {
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
};
