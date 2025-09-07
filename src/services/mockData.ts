// Mock data service for testing without GameLayer API
import { User, Task, Badge, LeaderboardEntry, ClientConfig, CalendarDay, Reward } from '../types';

// Mock user data
export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  totalPoints: 1250,
  gems: 45,
  badges: [
    {
      id: 'badge-1',
      name: 'Early Bird',
      description: 'Completed first task of the month',
      icon: '🐦',
      rarity: 'common',
      unlockedAt: new Date('2024-12-01')
    },
    {
      id: 'badge-2',
      name: 'Streak Master',
      description: 'Completed 5 tasks in a row',
      icon: '🔥',
      rarity: 'rare',
      unlockedAt: new Date('2024-12-05')
    },
    {
      id: 'badge-3',
      name: 'Quiz Champion',
      description: 'Answered 10 quiz questions correctly',
      icon: '🧠',
      rarity: 'epic',
      unlockedAt: new Date('2024-12-10')
    }
  ]
};

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Holiday Trivia',
    description: 'Test your knowledge about holiday traditions around the world!',
    type: 'quiz',
    points: 100,
    gemReward: 5,
    content: {
      question: 'Which country is credited with starting the Christmas tree tradition?',
      options: ['Germany', 'England', 'France', 'Italy'],
      correctAnswer: 0
    },
    completionCriteria: { correctAnswer: 0 }
  },
  {
    id: 'task-2',
    title: 'Share Your Gratitude',
    description: 'Write about something you\'re grateful for this holiday season.',
    type: 'survey',
    points: 75,
    gemReward: 3,
    content: {
      question: 'What are you most grateful for this holiday season?'
    },
    completionCriteria: { minLength: 50 }
  },
  {
    id: 'task-3',
    title: 'Random Act of Kindness',
    description: 'Perform a random act of kindness and share your experience.',
    type: 'action',
    points: 150,
    gemReward: 8,
    content: {
      instructions: 'Do something kind for someone today - it could be as simple as holding a door, giving a compliment, or helping a neighbor.',
      requiresProof: true
    },
    completionCriteria: { requiresDescription: true }
  },
  {
    id: 'task-4',
    title: 'Holiday Recipe Challenge',
    description: 'Share your favorite holiday recipe or create a new one!',
    type: 'challenge',
    points: 200,
    gemReward: 10,
    content: {
      challenge: 'Share a holiday recipe (traditional or your own creation) with ingredients and instructions.'
    },
    completionCriteria: { minLength: 100 }
  }
];

// Mock calendar data with more engaging themes
export const generateMockCalendar = (): CalendarDay[] => {
  const calendar: CalendarDay[] = [];
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const isDecember = currentMonth === 12;

  // More varied and engaging icons
  const festiveIcons = [
    '🎄', '🎁', '⭐', '🔔', '🕯️', '🦌', '⛄', '🎅', 
    '🤶', '🧝', '🎪', '🎭', '🎨', '🎵', '🎯', '🎲',
    '🍪', '🥛', '🍫', '🧁', '❄️', '☃️', '🌟', '✨',
    '🎊'
  ];

  for (let day = 1; day <= 25; day++) {
    const date = new Date(2024, 11, day); // December 2024
    const isUnlocked = isDecember ? day <= currentDay : day <= 8; // Mock: first 8 days unlocked
    const isCompleted = day <= 3; // Mock: first 3 days completed
    
    // Create more varied themes
    const themeVariations = [
      { bg: '#dc2626', border: '#dc2626' }, // Red
      { bg: '#16a34a', border: '#16a34a' }, // Green  
      { bg: '#f59e0b', border: '#f59e0b' }, // Amber
      { bg: '#8b5cf6', border: '#8b5cf6' }, // Purple
      { bg: '#06b6d4', border: '#06b6d4' }, // Cyan
    ];
    
    const theme = themeVariations[day % themeVariations.length];
    
    // Completion images for completed days
    const completionImages = [
      'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop&crop=center', // Christmas cookies
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop&crop=center', // Christmas tree
      'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400&h=400&fit=crop&crop=center', // Christmas presents
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=400&fit=crop&crop=center', // Christmas lights
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=center', // Christmas ornaments
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop&crop=center', // Hot cocoa
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center', // Christmas wreath
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=400&fit=crop&crop=center', // Christmas market
    ];
    
    calendar.push({
      day,
      date,
      isUnlocked,
      isCompleted,
      task: isUnlocked ? mockTasks[Math.floor(Math.random() * mockTasks.length)] : undefined,
      theme: {
        backgroundColor: isCompleted ? theme.bg : isUnlocked ? theme.bg : '#374151',
        textColor: '#ffffff',
        borderColor: isCompleted ? theme.border : isUnlocked ? theme.border : '#6b7280',
        icon: festiveIcons[day % festiveIcons.length],
        image: isCompleted ? completionImages[day % completionImages.length] : undefined
      }
    });
  }

  return calendar;
};

// Generate a large mock leaderboard with realistic data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const firstNames = [
    'Sarah', 'Mike', 'Emily', 'Alex', 'Jessica', 'David', 'Lisa', 'Chris', 'Amanda', 'Ryan',
    'Jennifer', 'Kevin', 'Michelle', 'Brian', 'Ashley', 'Jason', 'Stephanie', 'Matthew', 'Nicole', 'Daniel',
    'Rachel', 'Andrew', 'Megan', 'Joshua', 'Lauren', 'Tyler', 'Samantha', 'Jacob', 'Hannah', 'Nicholas',
    'Brittany', 'Anthony', 'Kayla', 'William', 'Courtney', 'Jonathan', 'Danielle', 'Brandon', 'Amber', 'Justin',
    'Rebecca', 'Robert', 'Melissa', 'Zachary', 'Amy', 'Aaron', 'Tiffany', 'Thomas', 'Kimberly', 'Kyle'
  ];
  
  const lastNames = [
    'Johnson', 'Chen', 'Davis', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez',
    'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark',
    'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen', 'Sanchez', 'Wright', 'King',
    'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts',
    'Carter', 'Phillips', 'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Flores'
  ];

  const avatars = [
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face'
  ];

  const leaderboard: LeaderboardEntry[] = [];
  
  // Add our mock user at rank 2
  leaderboard.push({
    rank: 2,
    user: mockUser,
    points: 1250,
    completedTasks: 8
  });

  // Generate 299 other users (total 300)
  for (let i = 0; i < 299; i++) {
    const rank = i < 1 ? 1 : i + 2; // Skip rank 2 (our user)
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Generate realistic point distribution (higher ranks have more points)
    let basePoints: number;
    if (rank === 1) {
      basePoints = 2150; // Top player
    } else if (rank <= 10) {
      basePoints = Math.floor(Math.random() * 500) + 1000; // Top 10: 1000-1500 points
    } else if (rank <= 50) {
      basePoints = Math.floor(Math.random() * 400) + 600; // Top 50: 600-1000 points
    } else if (rank <= 100) {
      basePoints = Math.floor(Math.random() * 300) + 300; // Top 100: 300-600 points
    } else {
      basePoints = Math.floor(Math.random() * 300) + 50; // Others: 50-350 points
    }

    const completedTasks = Math.floor(basePoints / 100) + Math.floor(Math.random() * 3);
    const gems = Math.floor(basePoints / 50) + Math.floor(Math.random() * 10);

    leaderboard.push({
      rank,
      user: {
        id: `user-${i + 3}`,
        name,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        avatar: avatars[Math.floor(Math.random() * avatars.length)],
        totalPoints: basePoints,
        gems,
        badges: []
      },
      points: basePoints,
      completedTasks
    });
  }

  // Sort by points descending and update ranks
  leaderboard.sort((a, b) => b.points - a.points);
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return leaderboard;
};

// Generate the mock leaderboard
export const mockLeaderboard: LeaderboardEntry[] = generateMockLeaderboard();

// Mock rewards data
export const mockRewards: Reward[] = [
  {
    id: 'reward-1',
    name: 'Company T-Shirt',
    description: 'Premium branded t-shirt in your size',
    gemCost: 50,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    stock: 15,
    maxStock: 20,
    isAvailable: true,
    category: 'physical',
    rarity: 'common'
  },
  {
    id: 'reward-2',
    name: 'Wireless Headphones',
    description: 'High-quality bluetooth headphones',
    gemCost: 150,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    stock: 3,
    maxStock: 10,
    isAvailable: true,
    category: 'physical',
    rarity: 'rare'
  },
  {
    id: 'reward-3',
    name: 'Gift Card $25',
    description: 'Amazon gift card worth $25',
    gemCost: 75,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop',
    stock: 8,
    maxStock: 15,
    isAvailable: true,
    category: 'digital',
    rarity: 'common'
  },
  {
    id: 'reward-4',
    name: 'Team Lunch',
    description: 'Join the team for a special lunch outing',
    gemCost: 100,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop',
    stock: 0,
    maxStock: 5,
    isAvailable: false,
    category: 'experience',
    rarity: 'rare'
  },
  {
    id: 'reward-5',
    name: 'MacBook Pro',
    description: 'Latest MacBook Pro 14" - Grand Prize!',
    gemCost: 500,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    stock: 1,
    maxStock: 1,
    isAvailable: true,
    category: 'physical',
    rarity: 'legendary'
  },
  {
    id: 'reward-6',
    name: 'Coffee Mug',
    description: 'Branded ceramic coffee mug',
    gemCost: 25,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop',
    stock: 12,
    maxStock: 25,
    isAvailable: true,
    category: 'physical',
    rarity: 'common'
  }
];

// Mock client configurations for different clients
export const mockClientConfigs: Record<string, ClientConfig> = {
  'christmas-corp': {
    id: 'christmas-corp',
    name: 'Christmas Corp',
    logo: '/logo-christmas.png',
    primaryColor: '#dc2626',
    secondaryColor: '#16a34a',
    accentColor: '#f59e0b',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    fontFamily: 'Inter, system-ui, sans-serif',
    calendarTitle: 'Christmas Corp Advent Calendar 2024',
    welcomeMessage: 'Join our festive countdown! Complete daily challenges to earn rewards and climb the leaderboard.',
    completionMessage: 'Congratulations! You\'ve completed our Christmas journey. Happy holidays from all of us at Christmas Corp!',
    socialLinks: {
      website: 'https://christmascorp.com',
      twitter: 'https://twitter.com/christmascorp',
      instagram: 'https://instagram.com/christmascorp'
    }
  },
  'winter-wonderland': {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    logo: '/logo-winter.png',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#06b6d4',
    backgroundColor: '#1e1b4b',
    textColor: '#e0e7ff',
    fontFamily: 'Georgia, serif',
    calendarTitle: 'Winter Wonderland Adventure',
    welcomeMessage: 'Embark on a magical winter journey filled with daily surprises and challenges.',
    completionMessage: 'You\'ve conquered the winter wonderland! May your holidays be filled with magic and joy.',
    socialLinks: {
      website: 'https://winterwonderland.com'
    }
  },
  'holiday-heroes': {
    id: 'holiday-heroes',
    name: 'Holiday Heroes',
    logo: '/logo-heroes.png',
    primaryColor: '#059669',
    secondaryColor: '#dc2626',
    accentColor: '#f59e0b',
    backgroundColor: '#064e3b',
    textColor: '#ecfdf5',
    fontFamily: 'Roboto, sans-serif',
    calendarTitle: 'Holiday Heroes Mission Calendar',
    welcomeMessage: 'Every day is a new mission to spread holiday cheer. Are you ready to be a Holiday Hero?',
    completionMessage: 'Mission accomplished, Hero! You\'ve made this holiday season brighter for everyone.',
    socialLinks: {
      website: 'https://holidayheroes.org',
      twitter: 'https://twitter.com/holidayheroes'
    }
  }
};

// Mock API service that mimics GameLayer API
export class MockGameLayerAPI {
  private static currentClient = 'christmas-corp';
  private static isAuthenticated = true; // Default to authenticated for demo

  static async getCurrentUser(): Promise<User> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }
    return mockUser;
  }

  static async loginUser(email: string, password: string): Promise<User> {
    // Mock authentication - accept any email/password
    this.isAuthenticated = true;
    return mockUser;
  }

  static async registerUser(userData: { name: string; email: string; password: string }): Promise<User> {
    this.isAuthenticated = true;
    return {
      ...mockUser,
      name: userData.name,
      email: userData.email,
      totalPoints: 0,
      gems: 0,
      badges: []
    };
  }

  static async getClientConfig(): Promise<ClientConfig> {
    return mockClientConfigs[this.currentClient];
  }

  static async getCalendarData(): Promise<CalendarDay[]> {
    return generateMockCalendar();
  }

  static async getTaskForDay(day: number): Promise<Task> {
    return {
      ...mockTasks[Math.floor(Math.random() * mockTasks.length)],
      id: `task-day-${day}`
    };
  }

  static async submitTaskCompletion(taskId: string, submission: any): Promise<{ success: boolean; points: number; badge?: Badge; gems: number }> {
    // Mock successful completion
    const points = Math.floor(Math.random() * 100) + 50;
    const gems = Math.floor(Math.random() * 10) + 3;
    
    return {
      success: true,
      points,
      gems,
      badge: Math.random() > 0.7 ? mockUser.badges[0] : undefined
    };
  }

  static async getLeaderboard(limit: number = 10, offset: number = 0): Promise<{ entries: LeaderboardEntry[]; hasMore: boolean; total: number }> {
    const total = mockLeaderboard.length;
    const entries = mockLeaderboard.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    
    return {
      entries,
      hasMore,
      total
    };
  }

  static async getRewards(): Promise<Reward[]> {
    return mockRewards;
  }

  static async purchaseReward(rewardId: string): Promise<{ success: boolean; message: string }> {
    const reward = mockRewards.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }
    if (!reward.isAvailable || reward.stock <= 0) {
      return { success: false, message: 'Reward out of stock' };
    }
    if (mockUser.gems < reward.gemCost) {
      return { success: false, message: 'Not enough gems' };
    }
    
    // Simulate purchase
    reward.stock -= 1;
    if (reward.stock <= 0) {
      reward.isAvailable = false;
    }
    mockUser.gems -= reward.gemCost;
    
    return { success: true, message: 'Reward purchased successfully!' };
  }

  static async trackEvent(eventName: string, eventData: any): Promise<void> {
    console.log('Mock event tracked:', eventName, eventData);
  }

  static setCurrentClient(clientId: string) {
    this.currentClient = clientId;
  }
}
