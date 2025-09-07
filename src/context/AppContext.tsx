import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, CalendarDay, LeaderboardEntry, Task, ClientConfig, Reward } from '../types';
import { GameLayerAPI, withErrorHandling } from '../services/gameLayerApi';
import { mergeClientConfig } from '../config/gameLayer';

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CALENDAR'; payload: CalendarDay[] }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'APPEND_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_LEADERBOARD_PAGINATION'; payload: { hasMore: boolean; total: number; isLoadingMore: boolean } }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'SET_CONFIG'; payload: ClientConfig }
  | { type: 'SET_CURRENT_TASK'; payload: Task | null }
  | { type: 'UPDATE_CALENDAR_DAY'; payload: { day: number; updates: Partial<CalendarDay> } }
  | { type: 'UPDATE_USER_PROGRESS'; payload: { points: number; gems: number; badges: any[] } };

// Initial state
const initialState: AppState = {
  user: null,
  calendar: [],
  leaderboard: [],
  rewards: [],
  config: mergeClientConfig({}),
  currentTask: null,
  isLoading: false,
  error: null,
  leaderboardPagination: {
    hasMore: false,
    total: 0,
    isLoadingMore: false,
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CALENDAR':
      return { ...state, calendar: action.payload };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'APPEND_LEADERBOARD':
      return { ...state, leaderboard: [...state.leaderboard, ...action.payload] };
    case 'SET_LEADERBOARD_PAGINATION':
      return { ...state, leaderboardPagination: action.payload };
    case 'SET_REWARDS':
      return { ...state, rewards: action.payload };
    case 'SET_CONFIG':
      return { ...state, config: action.payload };
    case 'SET_CURRENT_TASK':
      return { ...state, currentTask: action.payload };
    case 'UPDATE_CALENDAR_DAY':
      return {
        ...state,
        calendar: state.calendar.map(day =>
          day.day === action.payload.day
            ? { ...day, ...action.payload.updates }
            : day
        ),
      };
    case 'UPDATE_USER_PROGRESS':
      return {
        ...state,
        user: state.user
          ? {
              ...state.user,
              totalPoints: action.payload.points,
              gems: action.payload.gems,
              badges: action.payload.badges,
            }
          : null,
      };
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  actions: {
    loadInitialData: () => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    registerUser: (userData: { name: string; email: string; password: string }) => Promise<void>;
    openCalendarDay: (day: number) => Promise<void>;
    completeTask: (taskId: string, submission: any) => Promise<void>;
    refreshLeaderboard: () => Promise<void>;
    loadMoreLeaderboard: () => Promise<void>;
    trackEvent: (eventName: string, eventData: any) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Provider component
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Load client configuration
      const config = await withErrorHandling(() => GameLayerAPI.getClientConfig());
      dispatch({ type: 'SET_CONFIG', payload: mergeClientConfig(config) });

      // Load calendar data
      const calendar = await withErrorHandling(() => GameLayerAPI.getCalendarData());
      dispatch({ type: 'SET_CALENDAR', payload: calendar });

      // Load leaderboard (first page)
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(10, 0));
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboardData.entries });
      dispatch({ 
        type: 'SET_LEADERBOARD_PAGINATION', 
        payload: { 
          hasMore: leaderboardData.hasMore, 
          total: leaderboardData.total, 
          isLoadingMore: false 
        } 
      });

      // Load rewards
      const rewards = await withErrorHandling(() => GameLayerAPI.getRewards());
      dispatch({ type: 'SET_REWARDS', payload: rewards });

      // Load current user (mock data defaults to authenticated)
      try {
        const user = await withErrorHandling(() => GameLayerAPI.getCurrentUser());
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        // User not authenticated, continue without user data
        console.log('User not authenticated:', error);
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loginUser = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await withErrorHandling(() => GameLayerAPI.loginUser(email, password));
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // Reload calendar with user progress
      const calendar = await withErrorHandling(() => GameLayerAPI.getCalendarData());
      dispatch({ type: 'SET_CALENDAR', payload: calendar });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const registerUser = async (userData: { name: string; email: string; password: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await withErrorHandling(() => GameLayerAPI.registerUser(userData));
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const openCalendarDay = async (day: number) => {
    try {
      const task = await withErrorHandling(() => GameLayerAPI.getTaskForDay(day));
      dispatch({ type: 'SET_CURRENT_TASK', payload: task });
      dispatch({ type: 'UPDATE_CALENDAR_DAY', payload: { day, updates: { isUnlocked: true, task } } });
      
      // Track event
      await trackEvent('calendar_day_opened', { day });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const completeTask = async (taskId: string, submission: any) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await withErrorHandling(() => GameLayerAPI.submitTaskCompletion(taskId, submission));
      
      if (result.success) {
        // Update user progress
        const currentUser = state.user;
        if (currentUser) {
          dispatch({
            type: 'UPDATE_USER_PROGRESS',
            payload: {
              points: currentUser.totalPoints + result.points,
              gems: currentUser.gems + result.gems,
              badges: result.badge ? [...currentUser.badges, result.badge] : currentUser.badges,
            },
          });
        }

        // Mark calendar day as completed
        const currentTask = state.currentTask;
        if (currentTask) {
          const calendarDay = state.calendar.find(d => d.task?.id === taskId);
          if (calendarDay) {
            dispatch({
              type: 'UPDATE_CALENDAR_DAY',
              payload: { day: calendarDay.day, updates: { isCompleted: true } },
            });
          }
        }

        // Clear current task
        dispatch({ type: 'SET_CURRENT_TASK', payload: null });

        // Refresh leaderboard
        await refreshLeaderboard();

        // Track event
        await trackEvent('task_completed', { taskId, points: result.points, gems: result.gems });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(10, 0));
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboardData.entries });
      dispatch({ 
        type: 'SET_LEADERBOARD_PAGINATION', 
        payload: { 
          hasMore: leaderboardData.hasMore, 
          total: leaderboardData.total, 
          isLoadingMore: false 
        } 
      });
    } catch (error: any) {
      console.error('Failed to refresh leaderboard:', error.message);
    }
  };

  const loadMoreLeaderboard = async () => {
    if (state.leaderboardPagination.isLoadingMore || !state.leaderboardPagination.hasMore) {
      return;
    }

    try {
      dispatch({ 
        type: 'SET_LEADERBOARD_PAGINATION', 
        payload: { 
          ...state.leaderboardPagination, 
          isLoadingMore: true 
        } 
      });

      const offset = state.leaderboard.length;
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(10, offset));
      
      dispatch({ type: 'APPEND_LEADERBOARD', payload: leaderboardData.entries });
      dispatch({ 
        type: 'SET_LEADERBOARD_PAGINATION', 
        payload: { 
          hasMore: leaderboardData.hasMore, 
          total: leaderboardData.total, 
          isLoadingMore: false 
        } 
      });
    } catch (error: any) {
      console.error('Failed to load more leaderboard entries:', error.message);
      dispatch({ 
        type: 'SET_LEADERBOARD_PAGINATION', 
        payload: { 
          ...state.leaderboardPagination, 
          isLoadingMore: false 
        } 
      });
    }
  };

  const trackEvent = async (eventName: string, eventData: any) => {
    try {
      await withErrorHandling(() => GameLayerAPI.trackEvent(eventName, eventData));
    } catch (error: any) {
      console.error('Failed to track event:', error.message);
    }
  };

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const contextValue: AppContextType = {
    state,
    actions: {
      loadInitialData,
      loginUser,
      registerUser,
      openCalendarDay,
      completeTask,
      refreshLeaderboard,
      loadMoreLeaderboard,
      trackEvent,
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
