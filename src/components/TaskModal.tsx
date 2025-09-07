import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TrophyIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useApp } from '../context/AppContext';
import { Task } from '../types';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.primary + '40'};
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  backdrop-filter: blur(20px);
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text + '60'};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.text + '10'};
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const TaskTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  margin-right: 16px;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const TaskDescription = styled.p`
  color: ${props => props.theme.colors.text + '80'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const RewardsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const RewardCard = styled.div`
  background: ${props => props.theme.colors.primary + '20'};
  border: 1px solid ${props => props.theme.colors.primary + '40'};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 120px;
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.colors.accent};
  }
`;

const RewardText = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const TaskContent = styled.div`
  background: ${props => props.theme.colors.background + '40'};
  border: 1px solid ${props => props.theme.colors.primary + '30'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const QuizContainer = styled.div`
  .question {
    color: ${props => props.theme.colors.text};
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  
  .options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

const QuizOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid ${props => props.$selected ? props.theme.colors.primary : props.theme.colors.text + '30'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? props.theme.colors.primary + '20' : 'transparent'};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '10'};
  }
  
  input {
    margin: 0;
  }
  
  span {
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 2px solid ${props => props.theme.colors.text + '30'};
  border-radius: 8px;
  background: ${props => props.theme.colors.background + '60'};
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-size: 16px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text + '50'};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.$variant === 'primary' ? `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primary}dd;
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.text + '80'};
    border: 1px solid ${props.theme.colors.text + '30'};
    
    &:hover {
      background: ${props.theme.colors.text + '10'};
      color: ${props.theme.colors.text};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose }) => {
  const { actions, state } = useApp();
  const [submission, setSubmission] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!task || !submission) return;
    
    setIsSubmitting(true);
    try {
      await actions.completeTask(task.id, submission);
      onClose();
      setSubmission(null);
    } catch (error) {
      console.error('Failed to submit task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTaskContent = () => {
    if (!task) return null;

    switch (task.type) {
      case 'quiz':
        return (
          <QuizContainer>
            <div className="question">{task.content.question}</div>
            <div className="options">
              {task.content.options.map((option: string, index: number) => (
                <QuizOption
                  key={index}
                  $selected={submission === index}
                >
                  <input
                    type="radio"
                    name="quiz-option"
                    value={index}
                    checked={submission === index}
                    onChange={() => setSubmission(index)}
                  />
                  <span>{option}</span>
                </QuizOption>
              ))}
            </div>
          </QuizContainer>
        );

      case 'survey':
        return (
          <div>
            <div style={{ color: 'var(--text-color)', marginBottom: '16px', fontWeight: '600' }}>
              {task.content.question}
            </div>
            <TextInput
              placeholder="Share your thoughts..."
              value={submission || ''}
              onChange={(e) => setSubmission(e.target.value)}
            />
          </div>
        );

      case 'action':
        return (
          <div>
            <div style={{ color: 'var(--text-color)', marginBottom: '16px' }}>
              {task.content.instructions}
            </div>
            {task.content.requiresProof && (
              <TextInput
                placeholder="Describe what you did or provide proof..."
                value={submission || ''}
                onChange={(e) => setSubmission(e.target.value)}
              />
            )}
            {!task.content.requiresProof && (
              <Button
                $variant="primary"
                onClick={() => setSubmission('completed')}
                style={{ marginTop: '16px' }}
              >
                Mark as Completed
              </Button>
            )}
          </div>
        );

      case 'challenge':
        return (
          <div>
            <div style={{ color: 'var(--text-color)', marginBottom: '16px' }}>
              {task.content.challenge}
            </div>
            <TextInput
              placeholder="Submit your solution or answer..."
              value={submission || ''}
              onChange={(e) => setSubmission(e.target.value)}
            />
          </div>
        );

      default:
        return (
          <div style={{ color: 'var(--text-color)' }}>
            Task type not supported yet.
          </div>
        );
    }
  };

  const canSubmit = () => {
    if (!task || isSubmitting) return false;
    
    switch (task.type) {
      case 'quiz':
        return submission !== null;
      case 'survey':
      case 'challenge':
        return submission && submission.trim().length > 0;
      case 'action':
        return submission !== null;
      default:
        return false;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <TaskTitle>{task.title}</TaskTitle>
              <CloseButton onClick={onClose}>
                <XMarkIcon />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <TaskDescription>{task.description}</TaskDescription>

              <RewardsContainer>
                <RewardCard>
                  <TrophyIcon />
                  <RewardText>{task.points} Points</RewardText>
                </RewardCard>
                <RewardCard>
                  <SparklesIcon />
                  <RewardText>{task.gemReward} Gems</RewardText>
                </RewardCard>
              </RewardsContainer>

              <TaskContent>
                {renderTaskContent()}
              </TaskContent>

              <ActionButtons>
                <Button onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  $variant="primary"
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                >
                  {isSubmitting ? 'Submitting...' : 'Complete Task'}
                </Button>
              </ActionButtons>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
