import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrophyIcon, UserIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';

const LeaderboardContainer = styled(motion.div)`
  background: linear-gradient(135deg, ${props => props.theme.colors.background + '80'}, ${props => props.theme.colors.background + '40'});
  border: 2px solid ${props => props.theme.colors.primary + '40'};
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
`;

const LeaderboardTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    width: 28px;
    height: 28px;
    color: ${props => props.theme.colors.accent};
  }
`;

const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LeaderboardEntry = styled(motion.div)<{ $isCurrentUser: boolean; $rank: number }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.2s;
  
  ${props => {
    if (props.$isCurrentUser) {
      return `
        background: ${props.theme.colors.primary + '20'};
        border: 2px solid ${props.theme.colors.primary + '60'};
      `;
    } else if (props.$rank <= 3) {
      return `
        background: ${props.theme.colors.accent + '15'};
        border: 1px solid ${props.theme.colors.accent + '30'};
      `;
    } else {
      return `
        background: ${props.theme.colors.background + '20'};
        border: 1px solid ${props.theme.colors.text + '20'};
      `;
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
  
  ${props => {
    switch (props.$rank) {
      case 1:
        return `
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #000;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
        `;
      case 2:
        return `
          background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
          color: #000;
          box-shadow: 0 0 15px rgba(192, 192, 192, 0.4);
        `;
      case 3:
        return `
          background: linear-gradient(135deg, #cd7f32, #deb887);
          color: #000;
          box-shadow: 0 0 15px rgba(205, 127, 50, 0.4);
        `;
        default:
        return `
          background: ${props.theme.colors.text + '20'};
          color: ${props.theme.colors.text};
        `;
    }
  }}
`;

const UserAvatar = styled.div<{ $hasImage: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'none' : `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.accent + '40'};
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserStats = styled.div`
  color: ${props => props.theme.colors.text + '70'};
  font-size: 14px;
`;

const PointsDisplay = styled.div`
  text-align: right;
  flex-shrink: 0;
`;

const Points = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 2px;
`;

const PointsLabel = styled.div`
  color: ${props => props.theme.colors.text + '60'};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text + '60'};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text};
`;

export const Leaderboard: React.FC = () => {
  const { state, actions } = useApp();
  const { leaderboard, user, isLoading } = state;

  React.useEffect(() => {
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(() => {
      actions.refreshLeaderboard();
    }, 30000);

    return () => clearInterval(interval);
  }, [actions]);

  if (isLoading && leaderboard.length === 0) {
    return (
      <LeaderboardContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LeaderboardTitle>
          <TrophyIcon />
          Leaderboard
        </LeaderboardTitle>
        <LoadingState>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: 24,
              height: 24,
              border: '2px solid currentColor',
              borderTop: '2px solid transparent',
              borderRadius: '50%'
            }}
          />
        </LoadingState>
      </LeaderboardContainer>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <LeaderboardContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LeaderboardTitle>
          <TrophyIcon />
          Leaderboard
        </LeaderboardTitle>
        <EmptyState>
          <TrophyIcon style={{ width: 48, height: 48, margin: '0 auto 16px', opacity: 0.3 }} />
          <p>No participants yet. Be the first to complete a task!</p>
        </EmptyState>
      </LeaderboardContainer>
    );
  }

  return (
    <LeaderboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LeaderboardTitle>
        <TrophyIcon />
        Leaderboard
      </LeaderboardTitle>
      
      <LeaderboardList>
        {leaderboard.slice(0, 10).map((entry, index) => (
          <LeaderboardEntry
            key={entry.user.id}
            $isCurrentUser={user?.id === entry.user.id}
            $rank={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <RankBadge $rank={entry.rank}>
              {entry.rank}
            </RankBadge>
            
            <UserAvatar $hasImage={!!entry.user.avatar}>
              {entry.user.avatar ? (
                <img src={entry.user.avatar} alt={entry.user.name} />
              ) : (
                <UserIcon />
              )}
            </UserAvatar>
            
            <UserInfo>
              <UserName>{entry.user.name}</UserName>
              <UserStats>
                {entry.completedTasks} tasks completed
              </UserStats>
            </UserInfo>
            
            <PointsDisplay>
              <Points>{entry.points.toLocaleString()}</Points>
              <PointsLabel>Points</PointsLabel>
            </PointsDisplay>
          </LeaderboardEntry>
        ))}
      </LeaderboardList>
      
      {user && !leaderboard.find(entry => entry.user.id === user.id) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '16px',
            padding: '12px',
            textAlign: 'center',
            color: 'var(--text-color)',
            opacity: 0.7,
            fontSize: '14px'
          }}
        >
          Complete more tasks to appear on the leaderboard!
        </motion.div>
      )}
    </LeaderboardContainer>
  );
};
