import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, User, CalendarDay, LeaderboardEntry, Task, ClientConfig, Reward } from '../types';
import { GameLayerAPI, withErrorHandling } from '../services/gameLayerApi';
import { mergeClientConfig } from '../config/gameLayer';

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_PLAYER'; payload: any | null }
  | { type: 'SET_CALENDAR'; payload: CalendarDay[] }
  | { type: 'SET_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_REWARDS'; payload: Reward[] }
  | { type: 'SET_CONFIG'; payload: ClientConfig }
  | { type: 'SET_CURRENT_TASK'; payload: Task | null }
  | { type: 'UPDATE_CALENDAR_DAY'; payload: { day: number; updates: Partial<CalendarDay> } }
  | { type: 'UPDATE_USER_PROGRESS'; payload: { points: number; gems: number; badges: any[] } }
  | { type: 'SET_MODAL_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'APPEND_MODAL_LEADERBOARD'; payload: LeaderboardEntry[] }
  | { type: 'SET_MODAL_LEADERBOARD_PAGINATION'; payload: { hasMore: boolean; total: number; isLoadingMore: boolean; currentPage: number } }
  | { type: 'RESET_MODAL_LEADERBOARD' };

// Initial state
const initialState: AppState = {
  user: null,
  currentPlayer: null,
  calendar: [],
  leaderboard: [],
  rewards: [],
  config: mergeClientConfig({}),
  currentTask: null,
  isLoading: false,
  error: null,
  modalLeaderboard: [],
  modalLeaderboardPagination: {
    hasMore: false,
    total: 0,
    isLoadingMore: false,
    currentPage: 0,
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
    case 'SET_CURRENT_PLAYER':
      return { ...state, currentPlayer: action.payload };
    case 'SET_CALENDAR':
      return { ...state, calendar: action.payload };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
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
    case 'SET_MODAL_LEADERBOARD':
      return { ...state, modalLeaderboard: action.payload };
    case 'APPEND_MODAL_LEADERBOARD':
      return { ...state, modalLeaderboard: [...state.modalLeaderboard, ...action.payload] };
    case 'SET_MODAL_LEADERBOARD_PAGINATION':
      return { ...state, modalLeaderboardPagination: action.payload };
    case 'RESET_MODAL_LEADERBOARD':
      return { 
        ...state, 
        modalLeaderboard: [],
        modalLeaderboardPagination: {
          hasMore: false,
          total: 0,
          isLoadingMore: false,
          currentPage: 0,
        }
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
    setCurrentPlayer: (player: any) => void;
    loadStoredPlayer: () => void;
    loadRealPlayerData: (playerId: string) => Promise<void>;
    logoutPlayer: () => void;
    openCalendarDay: (day: number) => Promise<void>;
    completeTask: (taskId: string, submission: any) => Promise<void>;
    refreshLeaderboard: () => Promise<void>;
    trackEvent: (eventName: string, eventData: any) => Promise<void>;
    loadModalLeaderboard: () => Promise<void>;
    loadMoreModalLeaderboard: () => Promise<void>;
    resetModalLeaderboard: () => void;
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

      // Load leaderboard (top 5 entries for home page)
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(5, 0));
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboardData.entries });

      // Load rewards
      const rewards = await withErrorHandling(() => GameLayerAPI.getRewards());
      dispatch({ type: 'SET_REWARDS', payload: rewards });

      // No longer load mock user data - we use real GameLayer players only
      dispatch({ type: 'SET_USER', payload: null });

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loginUser = async (email: string, password: string) => {
    // This function is deprecated - we use real GameLayer player sign-in instead
    console.log('loginUser is deprecated - use GameLayer player sign-in');
  };

  const registerUser = async (userData: { name: string; email: string; password: string }) => {
    // This function is deprecated - we use real GameLayer player creation instead
    console.log('registerUser is deprecated - use GameLayer player creation');
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
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(5, 0));
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboardData.entries });
    } catch (error: any) {
      console.error('Failed to refresh leaderboard:', error.message);
    }
  };


  const trackEvent = async (eventName: string, eventData: any) => {
    try {
      await withErrorHandling(() => GameLayerAPI.trackEvent(eventName, eventData));
    } catch (error: any) {
      console.error('Failed to track event:', error.message);
    }
  };

  const loadModalLeaderboard = async () => {
    try {
      dispatch({ type: 'RESET_MODAL_LEADERBOARD' });
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(10, 0));
      dispatch({ type: 'SET_MODAL_LEADERBOARD', payload: leaderboardData.entries });
      dispatch({ 
        type: 'SET_MODAL_LEADERBOARD_PAGINATION', 
        payload: { 
          hasMore: leaderboardData.hasMore && leaderboardData.entries.length < 25, 
          total: Math.min(leaderboardData.total, 25), 
          isLoadingMore: false,
          currentPage: 1
        } 
      });
    } catch (error: any) {
      console.error('Failed to load modal leaderboard:', error.message);
    }
  };

  const loadMoreModalLeaderboard = async () => {
    if (state.modalLeaderboardPagination.isLoadingMore || !state.modalLeaderboardPagination.hasMore || state.modalLeaderboard.length >= 25) {
      return;
    }

    try {
      dispatch({ 
        type: 'SET_MODAL_LEADERBOARD_PAGINATION', 
        payload: { 
          ...state.modalLeaderboardPagination, 
          isLoadingMore: true 
        } 
      });

      const offset = state.modalLeaderboard.length;
      const remainingSlots = 25 - state.modalLeaderboard.length;
      const limit = Math.min(10, remainingSlots);
      
      const leaderboardData = await withErrorHandling(() => GameLayerAPI.getLeaderboard(limit, offset));
      
      // Only take entries that fit within the 25 limit
      const entriesToAdd = leaderboardData.entries.slice(0, remainingSlots);
      
      dispatch({ type: 'APPEND_MODAL_LEADERBOARD', payload: entriesToAdd });
      
      const newTotal = state.modalLeaderboard.length + entriesToAdd.length;
      dispatch({ 
        type: 'SET_MODAL_LEADERBOARD_PAGINATION', 
        payload: { 
          hasMore: leaderboardData.hasMore && newTotal < 25, 
          total: Math.min(leaderboardData.total, 25), 
          isLoadingMore: false,
          currentPage: state.modalLeaderboardPagination.currentPage + 1
        } 
      });
    } catch (error: any) {
      console.error('Failed to load more modal leaderboard entries:', error.message);
      dispatch({ 
        type: 'SET_MODAL_LEADERBOARD_PAGINATION', 
        payload: { 
          ...state.modalLeaderboardPagination, 
          isLoadingMore: false 
        } 
      });
    }
  };

  const resetModalLeaderboard = () => {
    dispatch({ type: 'RESET_MODAL_LEADERBOARD' });
  };

  // Player management functions
  const setCurrentPlayer = (player: any) => {
    dispatch({ type: 'SET_CURRENT_PLAYER', payload: player });
    localStorage.setItem('currentPlayer', JSON.stringify(player));
  };

  const loadStoredPlayer = () => {
    const storedPlayer = localStorage.getItem('currentPlayer');
    if (storedPlayer) {
      try {
        const player = JSON.parse(storedPlayer);
        dispatch({ type: 'SET_CURRENT_PLAYER', payload: player });
        // Load fresh player data from API
        if (player.player) {
          loadRealPlayerData(player.player);
        }
        return player; // Return the player so we know one exists
      } catch (error) {
        console.error('Failed to parse stored player:', error);
        localStorage.removeItem('currentPlayer');
      }
    }
    return null; // No stored player
  };

  const loadRealPlayerData = async (playerId: string) => {
    try {
      console.log('Loading real player data for:', playerId);
      const realPlayerData = await GameLayerAPI.getPlayer(playerId);
      console.log('Real player data loaded:', realPlayerData);
      console.log('Player image data:', {
        imgUrl: realPlayerData.imgUrl,
        image: realPlayerData.image,
        avatar: realPlayerData.avatar,
        hasAnyImage: !!(realPlayerData.imgUrl || realPlayerData.image || realPlayerData.avatar)
      });
      dispatch({ type: 'SET_CURRENT_PLAYER', payload: realPlayerData });
      // Update localStorage with fresh data
      localStorage.setItem('currentPlayer', JSON.stringify(realPlayerData));
    } catch (error) {
      console.error('Error loading real player data:', error);
    }
  };

  const logoutPlayer = () => {
    dispatch({ type: 'SET_CURRENT_PLAYER', payload: null });
    dispatch({ type: 'SET_USER', payload: null });
    localStorage.removeItem('currentPlayer');
  };

  // Load initial data on mount
  useEffect(() => {
    const initializeApp = async () => {
      const storedPlayer = loadStoredPlayer(); // Load stored player first (synchronous)
      console.log('Stored player found:', !!storedPlayer);
      await loadInitialData(); // Then load initial data (no mock user data)
    };
    
    initializeApp();
  }, []);

  const contextValue: AppContextType = {
    state,
    actions: {
      loadInitialData,
      loginUser,
      registerUser,
      setCurrentPlayer,
      loadStoredPlayer,
      loadRealPlayerData,
      logoutPlayer,
      openCalendarDay,
      completeTask,
      refreshLeaderboard,
      trackEvent,
      loadModalLeaderboard,
      loadMoreModalLeaderboard,
      resetModalLeaderboard,
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
