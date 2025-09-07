import axios from 'axios';
import { gameLayerConfig, API_HEADERS, ACCOUNT_ID } from '../config/gameLayer';
import { User, Task, Badge, LeaderboardEntry, ClientConfig, CalendarDay, Reward } from '../types';
import { MockGameLayerAPI } from './mockData';

// Create axios instance with GameLayer configuration
const api = axios.create({
  baseURL: gameLayerConfig.baseUrl,
  headers: API_HEADERS
});

// Check if we should use mock data (when API key is not provided)
const useMockData = !gameLayerConfig.apiKey || gameLayerConfig.apiKey === '';

// API service class for GameLayer integration
export class GameLayerAPI {
  // User Management
  static async getCurrentUser(): Promise<User> {
    // Always use mock data for current user since we're focusing on player creation
    return MockGameLayerAPI.getCurrentUser();
  }

  static async loginUser(email: string, password: string): Promise<User> {
    // Always use mock data for login since we're focusing on player creation
    return MockGameLayerAPI.loginUser(email, password);
  }

  static async registerUser(userData: { name: string; email: string; password: string }): Promise<User> {
    // Always use mock data for registration since we're focusing on player creation
    return MockGameLayerAPI.registerUser(userData);
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
    // Always use mock data for client config since this endpoint doesn't exist in GameLayer
    return MockGameLayerAPI.getClientConfig();
  }

  // Calendar and Tasks
  static async getCalendarData(year: number = 2024, month: number = 12): Promise<CalendarDay[]> {
    // Always use mock data for calendar since we're focusing on player creation
    return MockGameLayerAPI.getCalendarData();
  }

  static async getTaskForDay(day: number): Promise<Task> {
    // Always use mock data for tasks since we're focusing on player creation
    return MockGameLayerAPI.getTaskForDay(day);
  }

  static async submitTaskCompletion(taskId: string, submission: any): Promise<{ success: boolean; points: number; badge?: Badge; gems: number }> {
    // Always use mock data for task completion since we're focusing on player creation
    return MockGameLayerAPI.submitTaskCompletion(taskId, submission);
  }

  static async getUserProgress(): Promise<{ completedDays: number[]; totalPoints: number; badges: Badge[]; gems: number }> {
    // Always use mock data for user progress since we're focusing on player creation
    const user = await this.getCurrentUser();
    return {
      completedDays: [1, 2, 3], // Mock completed days
      totalPoints: user.totalPoints,
      badges: user.badges,
      gems: user.gems
    };
  }

  // Badges and Achievements
  static async getUserBadges(): Promise<Badge[]> {
    // Always use mock data since we're focusing on player creation
    const user = await this.getCurrentUser();
    return user.badges;
  }

  static async getAllBadges(): Promise<Badge[]> {
    // Always use mock data since we're focusing on player creation
    const user = await this.getCurrentUser();
    return user.badges;
  }

  // Leaderboard
  static async getLeaderboard(limit: number = 10, offset: number = 0): Promise<{ entries: LeaderboardEntry[]; hasMore: boolean; total: number }> {
    // Always use mock data since we're focusing on player creation
    return MockGameLayerAPI.getLeaderboard(limit, offset);
  }

  static async getUserRank(): Promise<{ rank: number; totalUsers: number }> {
    // Always use mock data since we're focusing on player creation
    return { rank: 2, totalUsers: 150 }; // Mock rank
  }

  // Rewards
  static async getRewards(): Promise<Reward[]> {
    // Always use mock data since we're focusing on player creation
    return MockGameLayerAPI.getRewards();
  }

  static async purchaseReward(rewardId: string): Promise<{ success: boolean; message: string }> {
    // Always use mock data since we're focusing on player creation
    return MockGameLayerAPI.purchaseReward(rewardId);
  }

  // Real player data fetching
  static async getPlayer(playerId: string): Promise<any> {
    try {
      const response = await fetch(`${gameLayerConfig.baseUrl}/players/${encodeURIComponent(playerId)}?account=${ACCOUNT_ID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': gameLayerConfig.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch player: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching player:', error);
      throw error;
    }
  }

  // Update player data
  static async updatePlayer(playerId: string, updates: { name?: string; imgUrl?: string }): Promise<any> {
    try {
      const response = await fetch(`${gameLayerConfig.baseUrl}/players/${encodeURIComponent(playerId)}?account=${ACCOUNT_ID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': gameLayerConfig.apiKey,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update player: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  }

  // Analytics and Events
  static async trackEvent(eventName: string, eventData: any): Promise<void> {
    // Always use mock data since we're focusing on player creation
    return MockGameLayerAPI.trackEvent(eventName, eventData);
  }

  static async getDailyStats(): Promise<{ totalUsers: number; activeToday: number; tasksCompleted: number }> {
    // Always use mock data since we're focusing on player creation
    return { totalUsers: 150, activeToday: 45, tasksCompleted: 89 };
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
