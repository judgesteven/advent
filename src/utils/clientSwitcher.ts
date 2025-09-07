// Utility to switch between different client configurations for demo purposes
import { MockGameLayerAPI, mockClientConfigs } from '../services/mockData';

export const switchClient = (clientId: string) => {
  if (mockClientConfigs[clientId]) {
    MockGameLayerAPI.setCurrentClient(clientId);
    // Reload the page to apply new configuration
    window.location.reload();
  } else {
    console.warn(`Client configuration not found for: ${clientId}`);
  }
};

export const getAvailableClients = () => {
  return Object.keys(mockClientConfigs).map(id => ({
    id,
    name: mockClientConfigs[id].name
  }));
};

// Add client switcher to window for easy demo access
if (typeof window !== 'undefined') {
  (window as any).switchClient = switchClient;
  (window as any).getAvailableClients = getAvailableClients;
  
  console.log('🎄 Advent Calendar Demo Commands:');
  console.log('• switchClient("christmas-corp") - Switch to Christmas Corp theme');
  console.log('• switchClient("winter-wonderland") - Switch to Winter Wonderland theme');
  console.log('• switchClient("holiday-heroes") - Switch to Holiday Heroes theme');
  console.log('• getAvailableClients() - List all available client configurations');
}
