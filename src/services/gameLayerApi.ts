import axios from 'axios';
import { gameLayerConfig } from '../config/gameLayer';
import { User, Task, Badge, LeaderboardEntry, ClientConfig, CalendarDay, Reward } from '../types';
import { MockGameLayerAPI } from './mockData';

// Create axios instance with GameLayer configuration
const api = axios.create({
  baseURL: gameLayerConfig.baseUrl,
  headers: {
    'Authorization': `Bearer ${gameLayerConfig.apiKey}`,
    'Content-Type': 'application/json',
    'X-Game-ID': gameLayerConfig.gameId,
    'X-Client-ID': gameLayerConfig.clientId
  }
});

// Check if we should use mock data (when API key is not provided)
const useMockData = !gameLayerConfig.apiKey || gameLayerConfig.apiKey === '';

// API service class for GameLayer integration
export class GameLayerAPI {
  // User Management
  static async getCurrentUser(): Promise<User> {
    if (useMockData) {
      return MockGameLayerAPI.getCurrentUser();
    }
    const response = await api.get('/user/profile');
    return response.data;
  }

  static async loginUser(email: string, password: string): Promise<User> {
    if (useMockData) {
      return MockGameLayerAPI.loginUser(email, password);
    }
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  }

  static async registerUser(userData: { name: string; email: string; password: string }): Promise<User> {
    if (useMockData) {
      return MockGameLayerAPI.registerUser(userData);
    }
    const response = await api.post('/auth/register', userData);
    return response.data;
  }

  static async updateUserProfile(updates: Partial<User>): Promise<User> {
    if (useMockData) {
      // Mock implementation - just return updated user
      const currentUser = await this.getCurrentUser();
      return { ...currentUser, ...updates };
    }
    const response = await api.patch('/user/profile', updates);
    return response.data;
  }

  // Client Configuration
  static async getClientConfig(): Promise<ClientConfig> {
    if (useMockData) {
      return MockGameLayerAPI.getClientConfig();
    }
    const response = await api.get(`/clients/${gameLayerConfig.clientId}/config`);
    return response.data;
  }

  // Calendar and Tasks
  static async getCalendarData(year: number = 2024, month: number = 12): Promise<CalendarDay[]> {
    if (useMockData) {
      return MockGameLayerAPI.getCalendarData();
    }
    const response = await api.get(`/calendar/${year}/${month}`);
    return response.data;
  }

  static async getTaskForDay(day: number): Promise<Task> {
    if (useMockData) {
      return MockGameLayerAPI.getTaskForDay(day);
    }
    const response = await api.get(`/tasks/day/${day}`);
    return response.data;
  }

  static async submitTaskCompletion(taskId: string, submission: any): Promise<{ success: boolean; points: number; badge?: Badge; gems: number }> {
    if (useMockData) {
      return MockGameLayerAPI.submitTaskCompletion(taskId, submission);
    }
    const response = await api.post(`/tasks/${taskId}/complete`, { submission });
    return response.data;
  }

  static async getUserProgress(): Promise<{ completedDays: number[]; totalPoints: number; badges: Badge[]; gems: number }> {
    if (useMockData) {
      const user = await this.getCurrentUser();
      return {
        completedDays: [1, 2, 3], // Mock completed days
        totalPoints: user.totalPoints,
        badges: user.badges,
        gems: user.gems
      };
    }
    const response = await api.get('/user/progress');
    return response.data;
  }

  // Badges and Achievements
  static async getUserBadges(): Promise<Badge[]> {
    if (useMockData) {
      const user = await this.getCurrentUser();
      return user.badges;
    }
    const response = await api.get('/user/badges');
    return response.data;
  }

  static async getAllBadges(): Promise<Badge[]> {
    if (useMockData) {
      const user = await this.getCurrentUser();
      return user.badges;
    }
    const response = await api.get('/badges');
    return response.data;
  }

  // Leaderboard
  static async getLeaderboard(limit: number = 10, offset: number = 0): Promise<{ entries: LeaderboardEntry[]; hasMore: boolean; total: number }> {
    if (useMockData) {
      return MockGameLayerAPI.getLeaderboard(limit, offset);
    }
    const response = await api.get(`/leaderboard?limit=${limit}&offset=${offset}`);
    return response.data;
  }

  static async getUserRank(): Promise<{ rank: number; totalUsers: number }> {
    if (useMockData) {
      return { rank: 2, totalUsers: 150 }; // Mock rank
    }
    const response = await api.get('/user/rank');
    return response.data;
  }

  // Rewards
  static async getRewards(): Promise<Reward[]> {
    if (useMockData) {
      return MockGameLayerAPI.getRewards();
    }
    const response = await api.get('/rewards');
    return response.data;
  }

  static async purchaseReward(rewardId: string): Promise<{ success: boolean; message: string }> {
    if (useMockData) {
      return MockGameLayerAPI.purchaseReward(rewardId);
    }
    const response = await api.post('/rewards/purchase', { rewardId });
    return response.data;
  }

  // Analytics and Events
  static async trackEvent(eventName: string, eventData: any): Promise<void> {
    if (useMockData) {
      return MockGameLayerAPI.trackEvent(eventName, eventData);
    }
    await api.post('/analytics/track', {
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    });
  }

  static async getDailyStats(): Promise<{ totalUsers: number; activeToday: number; tasksCompleted: number }> {
    if (useMockData) {
      return { totalUsers: 150, activeToday: 45, tasksCompleted: 89 };
    }
    const response = await api.get('/analytics/daily-stats');
    return response.data;
  }
}

// Error handling wrapper
export const withErrorHandling = async <T>(apiCall: () => Promise<T>): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    console.error('GameLayer API Error:', error);
    
    if (error.response?.status === 401) {
      // Handle authentication error
      throw new Error('Authentication failed. Please log in again.');
    } else if (error.response?.status === 403) {
      // Handle authorization error
      throw new Error('You don\'t have permission to perform this action.');
    } else if (error.response?.status === 404) {
      // Handle not found error
      throw new Error('The requested resource was not found.');
    } else if (error.response?.status >= 500) {
      // Handle server error
      throw new Error('Server error. Please try again later.');
    } else {
      // Handle other errors
      throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
    }
  }
};
