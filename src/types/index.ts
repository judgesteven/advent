// Core types for the advent calendar app

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  totalPoints: number;
  badges: Badge[];
  gems: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'action' | 'survey' | 'challenge';
  points: number;
  gemReward: number;
  badgeReward?: Badge;
  content: any; // Dynamic content based on task type
  completionCriteria: any;
}

export interface CalendarDay {
  day: number;
  date: Date;
  isUnlocked: boolean;
  isCompleted: boolean;
  task?: Task;
  theme?: DayTheme;
}

export interface DayTheme {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon?: string;
  image?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  completedTasks: number;
}

export interface ClientConfig {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  calendarTitle: string;
  welcomeMessage: string;
  completionMessage: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
  customCSS?: string;
}

export interface GameLayerConfig {
  apiKey: string;
  baseUrl: string;
  gameId: string;
  clientId: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  gemCost: number;
  image: string;
  stock: number;
  maxStock: number;
  isAvailable: boolean;
  category: 'physical' | 'digital' | 'experience';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface AppState {
  user: User | null;
  currentPlayer: any | null; // GameLayer player object
  calendar: CalendarDay[];
  leaderboard: LeaderboardEntry[];
  rewards: Reward[];
  config: ClientConfig;
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  // Modal leaderboard state (separate from main leaderboard)
  modalLeaderboard: LeaderboardEntry[];
  modalLeaderboardPagination: {
    hasMore: boolean;
    total: number;
    isLoadingMore: boolean;
    currentPage: number;
  };
}
