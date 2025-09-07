import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ClientConfig } from '../types';
import { defaultClientConfig } from '../config/gameLayer';

interface ThemeContextType {
  config: ClientConfig;
  updateConfig: (newConfig: ClientConfig) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialConfig?: ClientConfig;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialConfig = defaultClientConfig 
}) => {
  const [config, setConfig] = useState<ClientConfig>(initialConfig);

  const updateConfig = (newConfig: ClientConfig) => {
    setConfig(newConfig);
  };

  // Apply custom CSS if provided
  useEffect(() => {
    if (config.customCSS) {
      const styleElement = document.createElement('style');
      styleElement.textContent = config.customCSS;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [config.customCSS]);

  // Apply CSS custom properties for dynamic theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--secondary-color', config.secondaryColor);
    root.style.setProperty('--accent-color', config.accentColor);
    root.style.setProperty('--background-color', config.backgroundColor);
    root.style.setProperty('--text-color', config.textColor);
    root.style.setProperty('--font-family', config.fontFamily);
  }, [config]);

  const styledTheme = {
    colors: {
      primary: config.primaryColor,
      secondary: config.secondaryColor,
      accent: config.accentColor,
      background: config.backgroundColor,
      text: config.textColor,
    },
    fonts: {
      main: config.fontFamily,
    },
    config,
  };

  return (
    <ThemeContext.Provider value={{ config, updateConfig }}>
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
