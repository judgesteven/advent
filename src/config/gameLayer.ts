import { GameLayerConfig, ClientConfig } from '../types';

// GameLayer configuration - can be set via environment variables or config file
export const gameLayerConfig: GameLayerConfig = {
  apiKey: process.env.REACT_APP_GAMELAYER_API_KEY || 'b7fbe484f99ad0917e051e5f193e2d9c',
  baseUrl: process.env.REACT_APP_GAMELAYER_BASE_URL || 'https://api.gamelayer.co/api/v0',
  gameId: process.env.REACT_APP_GAMELAYER_GAME_ID || '',
  clientId: process.env.REACT_APP_CLIENT_ID || 'default'
};

// API Headers for GameLayer requests
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'api-key': gameLayerConfig.apiKey,
};

// Account ID for GameLayer
export const ACCOUNT_ID = 'gl-advent';

// Default client configuration - this will be overridden by GameLayer data
export const defaultClientConfig: ClientConfig = {
  id: 'default',
  name: 'Advent Calendar',
  logo: '/logo.png',
  primaryColor: '#3b82f6',
  secondaryColor: '#10b981',
  accentColor: '#f59e0b',
  backgroundColor: '#f3f4f6',
  textColor: '#1f2937',
  fontFamily: 'Inter, system-ui, sans-serif',
  calendarTitle: 'Advent Adventure 2025',
  welcomeMessage: 'Unwrap a new challenge every day, collect shiny gems and trade them for awesome prizes ... Can you make it into the Top25?!',
  completionMessage: 'Congratulations! You\'ve completed your advent calendar journey!',
  socialLinks: {
    website: 'https://example.com',
    twitter: 'https://twitter.com/example',
    instagram: 'https://instagram.com/example'
  }
};

// Helper function to merge client config with defaults
export const mergeClientConfig = (clientConfig: Partial<ClientConfig>): ClientConfig => {
  return {
    ...defaultClientConfig,
    ...clientConfig,
    socialLinks: {
      ...defaultClientConfig.socialLinks,
      ...clientConfig.socialLinks
    }
  };
};
