import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Mail } from 'lucide-react';
import { API_HEADERS, ACCOUNT_ID, gameLayerConfig } from '../config/gameLayer';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayerCreated: (player: any) => void;
}

interface PlayerData {
  name: string;
  email: string;
  image?: File;
  account: string;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  text-align: center;
`;

const ModalSubtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin: 0 0 32px 0;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const ImageUploadArea = styled.div<{ $hasImage: boolean }>`
  border: 2px dashed ${props => props.$hasImage ? '#8b5cf6' : '#d1d5db'};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$hasImage ? '#f3f4f6' : 'transparent'};
  
  &:hover {
    border-color: #8b5cf6;
    background: #f9fafb;
  }
`;

const ImageUploadInput = styled.input`
  display: none;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 12px;
  display: block;
`;

const UploadText = styled.div`
  color: #6b7280;
  font-size: 14px;
  
  .primary {
    color: #8b5cf6;
    font-weight: 600;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
`;

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onPlayerCreated }) => {
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: '',
    email: '',
    account: ACCOUNT_ID,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof PlayerData, value: string) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlayerData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', playerData.name);
      formData.append('email', playerData.email);
      formData.append('account', playerData.account);
      
      if (playerData.image) {
        formData.append('image', playerData.image);
      }

      const response = await fetch(`${gameLayerConfig.baseUrl}/players`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'api-key': gameLayerConfig.apiKey,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create player');
      }

      const newPlayer = await response.json();
      
      // Store player data in localStorage
      localStorage.setItem('currentPlayer', JSON.stringify(newPlayer));
      
      onPlayerCreated(newPlayer);
      onClose();
      
      // Reset form
      setPlayerData({ name: '', email: '', account: ACCOUNT_ID });
      setImagePreview('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = playerData.name.trim() && playerData.email.trim() && playerData.email.includes('@');

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
            
            <ModalTitle>Join the Adventure!</ModalTitle>
            <ModalSubtitle>Create your player profile to start your advent calendar journey</ModalSubtitle>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  <User size={16} />
                  Player Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={playerData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Mail size={16} />
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={playerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  <Upload size={16} />
                  Profile Picture (Optional)
                </Label>
                <ImageUploadArea 
                  $hasImage={!!imagePreview}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <ImageUploadInput
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <>
                      <ImagePreview src={imagePreview} alt="Profile preview" />
                      <UploadText>
                        <span className="primary">Click to change image</span>
                      </UploadText>
                    </>
                  ) : (
                    <>
                      <Upload size={32} color="#8b5cf6" style={{ margin: '0 auto 12px' }} />
                      <UploadText>
                        <span className="primary">Click to upload</span> or drag and drop<br />
                        PNG, JPG up to 5MB
                      </UploadText>
                    </>
                  )}
                </ImageUploadArea>
              </FormGroup>
              
              <SubmitButton
                type="submit"
                disabled={!isFormValid || isLoading}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? 'Creating Player...' : 'Start My Adventure'}
              </SubmitButton>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
