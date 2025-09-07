import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Mail, ChevronDown, LogOut } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { AdventCalendar } from './components/AdventCalendar';
import { TaskModal } from './components/TaskModal';
import { SignInModal } from './components/SignInModal';
import './utils/clientSwitcher';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-family, 'Inter', system-ui, sans-serif);
    background: var(--background-color, #f3f4f6);
    color: var(--text-color, #1f2937);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
  }

  button {
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const GameLayerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  img {
    height: 20px;
    width: auto;
    
    @media (max-width: 768px) {
      height: 18px;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    gap: 12px;
  }
`;

const Footer = styled.footer`
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 20px 0;
  margin-top: 40px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  
  /* Center the powered by logo */
  > :nth-child(2) {
    justify-self: center;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 12px;
    
    > :nth-child(2) {
      justify-self: center;
    }
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  img {
    height: 16px;
    width: auto;
  }
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.15s ease-out;
  
  &:hover {
    color: #374151;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CompactUserProfile = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.15));
  border: 2px solid #8b5cf6;
  border-radius: 50px;
  padding: 8px 16px 8px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #7c3aed;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
    background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.2));
    border-color: #7c3aed;
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px 6px 6px;
    gap: 8px;
  }
`;

const CompactAvatar = styled.div<{ $hasImage: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'none' : 'rgba(139, 92, 246, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(139, 92, 246, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #7c3aed;
  }
`;

const CompactUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const CompactUserName = styled.div`
  color: #7c3aed;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
`;

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  &:last-child {
    color: #dc2626;
  }

  &:last-child:hover {
    background-color: #fef2f2;
  }
`;

const DropdownArrow = styled(ChevronDown)`
  margin-left: 4px;
  transition: transform 0.2s;
  font-size: 12px;
`;


const MainContent = styled.main`
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppContent: React.FC = () => {
  const { state, actions } = useApp();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Show task modal when currentTask is set
  useEffect(() => {
    if (state.currentTask) {
      setShowTaskModal(true);
    }
  }, [state.currentTask]);

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
  };

  const handleOpenSignInModal = () => {
    setIsSignInModalOpen(true);
  };

  const handleCloseSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  const handlePlayerCreated = async (player: any) => {
    // Set the initial player data
    actions.setCurrentPlayer(player);
    // Load fresh real player data from GameLayer API
    if (player.player) {
      await actions.loadRealPlayerData(player.player);
    }
    // Reload initial data to clear mock user and refresh with real player context
    await actions.loadInitialData();
  };

  const CompactUserProfileComponent = () => {
    const { user, currentPlayer } = state;
    
    if (!currentPlayer) {
      return (
        <CompactUserProfile
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenSignInModal}
          style={{ cursor: 'pointer' }}
        >
          <CompactAvatar $hasImage={false}>
            <User size={16} />
          </CompactAvatar>
          <CompactUserInfo>
            <CompactUserName>Sign In</CompactUserName>
          </CompactUserInfo>
        </CompactUserProfile>
      );
    }

    const displayUser = user || currentPlayer;
    
    return (
      <UserDropdown>
        <CompactUserProfile
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ cursor: 'pointer' }}
        >
          <CompactAvatar $hasImage={!!(displayUser.imgUrl || displayUser.avatar || displayUser.image)}>
            {(displayUser.imgUrl || displayUser.avatar || displayUser.image) ? (
              <img src={displayUser.imgUrl || displayUser.avatar || displayUser.image} alt={displayUser.name} />
            ) : (
              <User size={16} />
            )}
          </CompactAvatar>
          <CompactUserInfo>
            <CompactUserName>
              {displayUser.name}
              <DropdownArrow size={12} />
            </CompactUserName>
          </CompactUserInfo>
        </CompactUserProfile>
        
        {isDropdownOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <DropdownItem onClick={() => {
              setIsDropdownOpen(false);
              setIsSignInModalOpen(true);
            }}>
              <User size={16} />
              Update
            </DropdownItem>
            <DropdownItem onClick={() => {
              setIsDropdownOpen(false);
              actions.logoutPlayer();
            }}>
              <LogOut size={16} />
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        )}
      </UserDropdown>
    );
  };

  return (
    <AppContainer>
      <GlobalStyle />
      
      <Header>
        <HeaderContent>
          <GameLayerLogo>
            <img src="/logo.png" alt="Logo" />
            <span>POWERED BY GAMELAYER</span>
          </GameLayerLogo>
          <CompactUserProfileComponent />
        </HeaderContent>
      </Header>

      <MainContent>
        <AdventCalendar />
      </MainContent>

      <Footer>
        <FooterContent>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>© 2025 All Rights Reserved</span>
          
          <FooterLogo>
            <img src="/logo.png" alt="Logo" />
            <span>POWERED BY GAMELAYER</span>
          </FooterLogo>
        </FooterContent>
      </Footer>

      <TaskModal
        task={state.currentTask}
        isOpen={showTaskModal}
        onClose={handleCloseTaskModal}
      />
      
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={handleCloseSignInModal}
        onPlayerCreated={handlePlayerCreated}
        existingPlayer={state.currentPlayer}
      />
    </AppContainer>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
