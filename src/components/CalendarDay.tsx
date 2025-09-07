import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Lock, Star, Zap, Gem } from 'lucide-react';
import { CalendarDay as CalendarDayType } from '../types';

const DayContainer = styled(motion.div)<{ $isUnlocked: boolean; $isCompleted: boolean; $isToday: boolean; $day: number }>`
  aspect-ratio: 1;
  border-radius: ${props => {
    // Vary border radius for visual interest
    const variations = ['16px', '20px', '24px', '18px'];
    return variations[props.$day % 4];
  }};
  cursor: ${props => props.$isUnlocked ? 'pointer' : 'not-allowed'};
  position: relative;
  overflow: hidden;
  border: 1px solid;
  transition: all 0.15s ease-out;
  
  /* Transparent window into the wallpaper background */
  background: transparent;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    transition: all 0.15s ease-out;
    
    ${props => {
      if (props.$isCompleted) {
        return `
          background: linear-gradient(135deg, ${props.theme.colors.secondary}60, ${props.theme.colors.secondary}40, ${props.theme.colors.accent}30);
        `;
      } else if (props.$isUnlocked) {
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary}60, ${props.theme.colors.primary}40, ${props.theme.colors.accent}30);
        `;
      } else {
        return `
          background: linear-gradient(135deg, ${props.theme.colors.background}70, ${props.theme.colors.background}50);
          backdrop-filter: blur(4px);
        `;
      }
    }}
  }
  
  border-color: #d1d5db;
  color: white;
  
  ${props => {
    if (props.$isCompleted) {
      return `
        box-shadow: 0 8px 32px ${props.theme.colors.secondary + '40'};
      `;
    } else if (props.$isUnlocked) {
      return `
        box-shadow: 0 6px 24px ${props.theme.colors.primary + '30'};
      `;
    } else {
      return `
        color: ${props.theme.colors.text + '50'};
      `;
    }
  }}
  
  ${props => props.$isToday && `
    animation: pulse 2s ease-in-out infinite;
    box-shadow: 0 0 30px ${props.theme.colors.accent + '80'}, 0 8px 32px ${props.theme.colors.accent + '40'};
    border-color: ${props.theme.colors.accent};
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `}
  
  &:hover {
    ${props => props.$isUnlocked && `
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      border-width: 4px;
    `}
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => {
      if (props.$isCompleted) return `linear-gradient(45deg, ${props.theme.colors.secondary}, ${props.theme.colors.accent})`;
      if (props.$isUnlocked) return `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`;
      return 'transparent';
    }};
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    ${props => (props.$isUnlocked || props.$isCompleted) && `opacity: 0.3;`}
  }
`;


const BackgroundImage = styled.div<{ $image: string; $isCompleted: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  opacity: ${props => props.$isCompleted ? 1 : 0.3};
  z-index: ${props => props.$isCompleted ? 1 : -1};
  border-radius: inherit;
  
  ${props => props.$isCompleted && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.3) 0%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.4) 100%
      );
      border-radius: inherit;
    }
  `}
`;

const CompletedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(22, 163, 74, 0.15) 0%,
    transparent 50%,
    rgba(22, 163, 74, 0.25) 100%
  );
  border-radius: inherit;
  z-index: 2;
`;

const TodayIndicator = styled(motion.div)`
  position: absolute;
  top: -2px;
  right: -2px;
  background: ${props => props.theme.colors.accent};
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  z-index: 25;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const CenterBadge = styled(motion.div)<{ $isCompleted: boolean; $isLocked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 70px;
  height: 70px;
  margin: auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  z-index: 30;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border: 4px solid rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  
  ${props => {
    if (props.$isCompleted) {
      return `
        background: rgba(255, 255, 255, 0.98);
        color: #1f2937;
        border-color: rgba(255, 255, 255, 0.9);
      `;
    } else if (props.$isLocked) {
      return `
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-color: rgba(255, 255, 255, 0.5);
      `;
    }
    return `
      background: rgba(255, 255, 255, 0.5);
      color: white;
      border-color: rgba(255, 255, 255, 0.7);
    `;
  }}
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const PointsBadge = styled(motion.div)<{ $isCompleted: boolean; $isLocked: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  z-index: 25;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease-out;
  min-width: 50px;
  justify-content: center;
  
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

const GemsBadge = styled(motion.div)<{ $isCompleted: boolean; $isLocked: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  z-index: 25;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s ease-out;
  min-width: 50px;
  justify-content: center;
  
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

interface CalendarDayProps {
  day: CalendarDayType;
  onClick: () => void;
  isToday: boolean;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ day, onClick, isToday }) => {
  const canOpen = day.isUnlocked && !day.isCompleted;
  
  const handleClick = () => {
    if (canOpen) {
      onClick();
    }
  };


  return (
    <DayContainer
      $isUnlocked={day.isUnlocked}
      $isCompleted={day.isCompleted}
      $isToday={isToday}
      $day={day.day}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: day.day * 0.03,
        type: "spring",
        stiffness: 120,
        damping: 12
      }}
      whileHover={canOpen ? { 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.15, ease: "easeOut" }
      } : {}}
      whileTap={canOpen ? { scale: 0.98 } : {}}
    >
      {day.theme?.image && (
        <BackgroundImage $image={day.theme.image} $isCompleted={day.isCompleted} />
      )}
      
      {day.isCompleted && <CompletedOverlay />}
      
      <CenterBadge
        $isCompleted={day.isCompleted}
        $isLocked={!day.isUnlocked}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
      >
        {day.isCompleted ? (
          day.day
        ) : !day.isUnlocked ? (
          <Lock />
        ) : (
          day.day
        )}
      </CenterBadge>
      
      {isToday && (
        <TodayIndicator
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          <Star />
        </TodayIndicator>
      )}
      
      {day.task && day.task.points && (
        <PointsBadge 
          $isCompleted={day.isCompleted}
          $isLocked={!day.isUnlocked}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.15, ease: "easeOut" } }}
        >
          <Zap />
          {day.task.points}
        </PointsBadge>
      )}
      
      {day.task && day.task.gemReward && (
        <GemsBadge 
          $isCompleted={day.isCompleted}
          $isLocked={!day.isUnlocked}
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.05, transition: { duration: 0.15, ease: "easeOut" } }}
        >
          <Gem />
          {day.task.gemReward}
        </GemsBadge>
      )}
    </DayContainer>
  );
};
