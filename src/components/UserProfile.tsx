import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { UserIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

const ProfileContainer = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary + '20'}, ${props => props.theme.colors.secondary + '20'});
  border: 2px solid ${props => props.theme.colors.primary + '40'};
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const Avatar = styled.div<{ $hasImage: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'none' : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid ${props => props.theme.colors.accent};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 700;
`;

const UserEmail = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.text + '80'};
  font-size: 14px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const StatCard = styled(motion.div)`
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.primary + '30'};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  backdrop-filter: blur(5px);
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.theme.colors.accent};
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.text + '80'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BadgesContainer = styled.div`
  margin-top: 20px;
`;

const BadgesTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.accent};
  }
`;

const BadgesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Badge = styled(motion.div)<{ $rarity: string }>`
  background: ${props => {
    switch (props.$rarity) {
      case 'legendary': return 'linear-gradient(135deg, #ffd700, #ffed4e)';
      case 'epic': return 'linear-gradient(135deg, #a855f7, #c084fc)';
      case 'rare': return 'linear-gradient(135deg, #3b82f6, #60a5fa)';
      default: return 'linear-gradient(135deg, #6b7280, #9ca3af)';
    }
  }};
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text + '80'};
`;

interface UserProfileProps {
  onLoginClick?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onLoginClick }) => {
  const { state } = useApp();
  const { config } = useTheme();
  const { user } = state;

  if (!user) {
    return (
      <ProfileContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginPrompt>
          <UserIcon style={{ width: 48, height: 48, margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Sign in to track your progress and compete on the leaderboard!</p>
          {onLoginClick && (
            <button
              onClick={onLoginClick}
              style={{
                background: config.primaryColor,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                marginTop: '16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Sign In
            </button>
          )}
        </LoginPrompt>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileHeader>
        <Avatar $hasImage={!!user.avatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <UserIcon />
          )}
        </Avatar>
        <UserInfo>
          <UserName>{user.name}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </UserInfo>
      </ProfileHeader>

      <StatsContainer>
        <StatCard
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatIcon>
            <TrophyIcon />
          </StatIcon>
          <StatValue>{user.totalPoints.toLocaleString()}</StatValue>
          <StatLabel>Points</StatLabel>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatIcon>
            <SparklesIcon />
          </StatIcon>
          <StatValue>{user.gems.toLocaleString()}</StatValue>
          <StatLabel>Gems</StatLabel>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatIcon>
            <TrophyIcon />
          </StatIcon>
          <StatValue>{user.badges.length}</StatValue>
          <StatLabel>Badges</StatLabel>
        </StatCard>
      </StatsContainer>

      {user.badges.length > 0 && (
        <BadgesContainer>
          <BadgesTitle>
            <TrophyIcon />
            Recent Badges
          </BadgesTitle>
          <BadgesList>
            {user.badges.slice(-5).map((badge, index) => (
              <Badge
                key={badge.id}
                $rarity={badge.rarity}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                title={badge.description}
              >
                {badge.icon && <span>{badge.icon}</span>}
                {badge.name}
              </Badge>
            ))}
          </BadgesList>
        </BadgesContainer>
      )}
    </ProfileContainer>
  );
};
