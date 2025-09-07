import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Trophy, Gift, Calendar, Gem, Zap } from 'lucide-react';
import { CalendarDay } from './CalendarDay';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';


const CalendarContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const CalendarTitle = styled(motion.h1)`
  text-align: center;
  color: ${props => props.theme.colors.text};
  font-size: clamp(32px, 6vw, 56px);
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary}, ${props => props.theme.colors.accent});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '✨';
    position: absolute;
    top: -10px;
    right: -20px;
    font-size: 24px;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  @keyframes sparkle {
    0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.8; }
    50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
  }
`;

const CalendarSubtitle = styled(motion.p)`
  text-align: center;
  color: ${props => props.theme.colors.text + '90'};
  font-size: 20px;
  margin-bottom: 32px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 500;
`;

const CalendarGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: ${props => props.theme.colors.text};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.text};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  margin: 20px 0;
`;

const TopCardsRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const HorizontalLeaderboard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  flex: 0 0 60%;
  
  @media (max-width: 768px) {
    flex: none;
  }
`;

const LeaderboardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const LeaderboardScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LeaderboardCard = styled(motion.div)<{ $rank: number; $isCurrentUser?: boolean }>`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.15s ease-out;
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    gap: 10px;
  }
`;

const LeaderboardRank = styled.div<{ $rank: number }>`
  font-size: 18px;
  font-weight: 800;
  min-width: 32px;
  text-align: center;
  color: #000000;
`;

const LeaderboardAvatar = styled.div<{ $hasImage: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'none' : props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

const LeaderboardName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LeaderboardPoints = styled.div`
  font-size: 19px;
  font-weight: 700;
  color: #8b5cf6;
  flex-shrink: 0;
`;


const ProfileCard = styled(motion.div)`
  background: #8b5cf6;
  border: 1px solid #7c3aed;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  flex: 0 0 40%;
  color: white;
  
  @media (max-width: 768px) {
    flex: none;
  }
`;

const ProfileAvatar = styled.div<{ $hasImage: boolean }>`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'none' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 5px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  margin: 0 auto 16px auto;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 64px;
    height: 64px;
    color: white;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const ProfileNameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
  gap: 12px;
`;

const ProfileName = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 2px;
`;

const ProfileBadges = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  min-width: 50px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.15s ease-out;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

const RankingBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
  margin: 0 auto 16px auto;
  width: fit-content;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.15s ease-out;
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;


const RewardsSection = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  overflow: hidden;
`;

const RewardsTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CalendarSection = styled(motion.div)`
  background-image: url('/wallpaper.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(1px);
    z-index: 1;
  }
`;

const CalendarSectionTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  position: relative;
  z-index: 2;
  
  svg {
    color: white;
  }
`;


const RewardsGrid = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-behavior: smooth;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const RewardCard = styled(motion.div)<{ $isAvailable: boolean; $rarity: string }>`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 0;
  text-align: left;
  position: relative;
  overflow: hidden;
  opacity: ${props => props.$isAvailable ? 1 : 0.6};
  min-width: 280px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease-out;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    min-width: 240px;
  }
`;

const RewardImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 180px;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  border-radius: 20px 20px 0 0;
  position: relative;
`;

const RewardCategoryBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  z-index: 15;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  text-transform: capitalize;
  white-space: nowrap;
`;

const RewardContent = styled.div`
  padding: 16px;
`;

const RewardName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RewardDescription = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
  height: auto;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const RewardProgress = styled.div`
  margin-bottom: 16px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: #6b7280;
  text-align: right;
  margin-top: 4px;
`;

const RewardCost = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 8px;
`;

const RewardStock = styled.div<{ $isLow: boolean }>`
  font-size: 11px;
  color: ${props => props.$isLow ? '#ef4444' : props.theme.colors.text + '70'};
  margin-bottom: 12px;
`;

const PurchaseButton = styled.button<{ $canAfford: boolean; $isAvailable: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => (props.$canAfford && props.$isAvailable) ? 'pointer' : 'not-allowed'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  ${props => {
    if (!props.$isAvailable) {
      return `
        background: #f3f4f6;
        color: #9ca3af;
      `;
    } else if (!props.$canAfford) {
      return `
        background: #f3f4f6;
        color: #9ca3af;
      `;
    } else {
      return `
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
        }
      `;
    }
  }}
`;

export const AdventCalendar: React.FC = () => {
  const { state, actions } = useApp();
  const { config } = useTheme();
  const { calendar, leaderboard, rewards, user, isLoading, error } = state;

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; // December is month 12
  const isDecember = currentMonth === 12;

  const completedDays = calendar.filter(day => day.isCompleted).length;
  const totalDays = calendar.length;

  const handleDayClick = async (day: number) => {
    const calendarDay = calendar.find(d => d.day === day);
    if (calendarDay && calendarDay.isUnlocked && !calendarDay.isCompleted) {
      await actions.openCalendarDay(day);
    }
  };

  const ProfileCardComponent = () => {
    // Show profile card even if no user (with placeholder data)
    const displayUser = user || {
      name: 'Guest Player',
      avatar: null,
      totalPoints: 0,
      gems: 0,
      badges: []
    };
    
    const userRank = user ? (leaderboard.find(entry => entry.user.id === user.id)?.rank || '?') : '?';

    return (
      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ProfileName>{displayUser.name}</ProfileName>
        <ProfileAvatar $hasImage={!!displayUser.avatar}>
          {displayUser.avatar ? (
            <img src={displayUser.avatar} alt={displayUser.name} />
          ) : (
            <User size={64} />
          )}
        </ProfileAvatar>
        <RankingBadge>
          <Trophy size={12} />
          Ranking: {userRank}
        </RankingBadge>
        <ProfileInfo>
          <ProfileBadges>
            <ProfileBadge>
              <Gem size={16} />
              {displayUser.gems}
            </ProfileBadge>
            <ProfileBadge>
              <Zap size={16} />
              {displayUser.totalPoints.toLocaleString()}
            </ProfileBadge>
          </ProfileBadges>
        </ProfileInfo>
      </ProfileCard>
    );
  };

  const HorizontalLeaderboardComponent = () => {
    if (leaderboard.length === 0) return null;

    return (
      <HorizontalLeaderboard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <LeaderboardTitle>
          <Trophy size={20} />
          December's Movers & Shakers
        </LeaderboardTitle>
        <LeaderboardScroll>
          {leaderboard.slice(0, 5).map((entry, index) => (
            <LeaderboardCard
              key={entry.user.id}
              $rank={entry.rank}
              $isCurrentUser={user?.id === entry.user.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -1, transition: { duration: 0.15, ease: "easeOut" } }}
              whileTap={{ scale: 0.98 }}
            >
              <LeaderboardRank $rank={entry.rank}>
                {entry.rank}
              </LeaderboardRank>
              <LeaderboardAvatar $hasImage={!!entry.user.avatar}>
                {entry.user.avatar ? (
                  <img src={entry.user.avatar} alt={entry.user.name} />
                ) : (
                  <User size={18} />
                )}
              </LeaderboardAvatar>
              <LeaderboardName>{entry.user.name}</LeaderboardName>
              <LeaderboardPoints>{entry.points.toLocaleString()}</LeaderboardPoints>
            </LeaderboardCard>
          ))}
        </LeaderboardScroll>
      </HorizontalLeaderboard>
    );
  };

  const RewardsComponent = () => {
    if (!rewards || rewards.length === 0) return null;

    const handlePurchase = async (rewardId: string) => {
      // This would call the GameLayer API to purchase the reward
      console.log('Purchase reward:', rewardId);
    };

    return (
      <RewardsSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <RewardsTitle>
          <Gift size={20} />
          Exchange Your Gems for Cool Stuff
        </RewardsTitle>
        <RewardsGrid>
          {rewards.map((reward, index) => {
            const canAfford = user ? user.gems >= reward.gemCost : false;
            const isLowStock = reward.stock <= 3 && reward.stock > 0;
            
            return (
              <RewardCard
                key={reward.id}
                $isAvailable={reward.isAvailable}
                $rarity={reward.rarity}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={reward.isAvailable ? { scale: 1.02, y: -2, transition: { duration: 0.15, ease: "easeOut" } } : {}}
              >
                <RewardImage $image={reward.image} />
                <RewardCategoryBadge>{reward.category}</RewardCategoryBadge>
                <RewardContent>
                  <RewardName>{reward.name}</RewardName>
                  <RewardDescription>{reward.description}</RewardDescription>
                  <RewardProgress>
                    <ProgressBar>
                      <ProgressFill $percentage={((reward.maxStock - reward.stock) / reward.maxStock) * 100} />
                    </ProgressBar>
                    <ProgressText>{reward.maxStock - reward.stock} / {reward.maxStock}</ProgressText>
                  </RewardProgress>
                  <PurchaseButton
                    $canAfford={canAfford}
                    $isAvailable={reward.isAvailable}
                    onClick={() => reward.isAvailable && canAfford && handlePurchase(reward.id)}
                  >
                    GET <Gem size={16} /> {reward.gemCost}
                  </PurchaseButton>
                </RewardContent>
              </RewardCard>
            );
          })}
        </RewardsGrid>
      </RewardsSection>
    );
  };

  if (isLoading && calendar.length === 0) {
    return (
      <CalendarContainer>
        <LoadingContainer>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: 40,
              height: 40,
              border: `3px solid ${config.primaryColor}30`,
              borderTop: `3px solid ${config.primaryColor}`,
              borderRadius: '50%'
            }}
          />
        </LoadingContainer>
      </CalendarContainer>
    );
  }

  if (error) {
    return (
      <CalendarContainer>
        <ErrorContainer>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button
            onClick={() => actions.loadInitialData()}
            style={{
              background: config.primaryColor,
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </ErrorContainer>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <CalendarTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {config.calendarTitle}
      </CalendarTitle>
      
      <CalendarSubtitle
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {config.welcomeMessage}
      </CalendarSubtitle>

      <TopCardsRow>
        <ProfileCardComponent />
        <HorizontalLeaderboardComponent />
      </TopCardsRow>
      <RewardsComponent />

      <CalendarSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <CalendarSectionTitle>
          <Calendar size={20} />
          Countdown to Christmas
        </CalendarSectionTitle>
        <CalendarGrid
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {calendar.map((day) => (
            <CalendarDay
              key={day.day}
              day={day}
              onClick={() => handleDayClick(day.day)}
              isToday={isDecember && day.day === currentDay}
            />
          ))}
        </CalendarGrid>
      </CalendarSection>

      {completedDays === totalDays && totalDays > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '32px',
            background: `linear-gradient(135deg, ${config.primaryColor}25, ${config.secondaryColor}25)`,
            borderRadius: '20px',
            border: `2px solid ${config.accentColor}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          <h2 style={{ color: config.textColor, marginBottom: '16px', position: 'relative', zIndex: 1 }}>
            🎉 Congratulations! 🎉
          </h2>
          <p style={{ color: `${config.textColor}90`, fontSize: '18px', position: 'relative', zIndex: 1 }}>
            {config.completionMessage}
          </p>
        </motion.div>
      )}
    </CalendarContainer>
  );
};
