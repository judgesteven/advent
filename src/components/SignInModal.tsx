import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, User, Mail } from 'lucide-react';
import { API_HEADERS, ACCOUNT_ID, gameLayerConfig } from '../config/gameLayer';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayerCreated: (player: any) => void;
  existingPlayer?: any;
}

type ModalMode = 'signin' | 'create' | 'update';

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

const TabContainer = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 24px;
  padding: 4px;
  margin-bottom: 24px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 16px;
  background: ${props => props.$active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#6b7280'};
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#7c3aed' : '#e5e7eb'};
  }
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
  border-radius: 24px;
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
  border-radius: 24px;
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
  border-radius: 30px;
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
  border-radius: 20px;
  border: 1px solid #fecaca;
`;

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onPlayerCreated, existingPlayer }) => {
  const [mode, setMode] = useState<ModalMode>(existingPlayer ? 'update' : 'signin');
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: existingPlayer?.name || '',
    email: existingPlayer?.email || existingPlayer?.player || '',
    account: ACCOUNT_ID,
  });
  const [imagePreview, setImagePreview] = useState<string>(existingPlayer?.imgUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when existingPlayer changes
  useEffect(() => {
    if (existingPlayer) {
      setMode('update');
      setPlayerData({
        name: existingPlayer.name || '',
        email: existingPlayer.email || existingPlayer.player || '',
        account: ACCOUNT_ID,
      });
      setImagePreview(existingPlayer.imgUrl || '');
    } else {
      setMode('signin');
      setPlayerData({
        name: '',
        email: '',
        account: ACCOUNT_ID,
      });
      setImagePreview('');
    }
  }, [existingPlayer]);

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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'update') {
        // Update existing player
        console.log('Updating player:', existingPlayer.player);
        
        const updatePayload: any = {
          name: playerData.name,
        };

        // Convert image to base64 and include in payload if changed
        if (playerData.image) {
          try {
            const base64Image = await convertImageToBase64(playerData.image);
            updatePayload.imgUrl = base64Image;
            console.log('Image converted to base64 for update, length:', base64Image.length);
          } catch (imageError) {
            console.warn('Failed to convert image to base64:', imageError);
          }
        }

        console.log('Updating player with GameLayer API (PATCH):', {
          ...updatePayload,
          hasImage: !!playerData.image,
          endpoint: `${gameLayerConfig.baseUrl}/players/${existingPlayer.player}?account=${ACCOUNT_ID}`,
          playerId: existingPlayer.player,
        });

        const response = await fetch(`${gameLayerConfig.baseUrl}/players/${encodeURIComponent(existingPlayer.player)}?account=${ACCOUNT_ID}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': gameLayerConfig.apiKey,
          },
          body: JSON.stringify(updatePayload),
        });

        console.log('Update API Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Update API Error Response:', errorText);
          
          let errorMessage = 'Failed to update player';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `API Error (${response.status}): ${errorText}`;
          }
          
          throw new Error(errorMessage);
        }

        const updatedPlayer = await response.json();
        console.log('Player updated successfully:', updatedPlayer);
        
        // Pass the updated player to the parent component
        onPlayerCreated(updatedPlayer);
        onClose();
        
        return;
      }

      if (mode === 'signin') {
        // Sign in mode - just try to get existing player
        console.log('Signing in player:', playerData.email);
        
        const existingPlayerResponse = await fetch(`${gameLayerConfig.baseUrl}/players/${encodeURIComponent(playerData.email)}?account=${ACCOUNT_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': gameLayerConfig.apiKey,
          },
        });

        if (existingPlayerResponse.ok) {
          const existingPlayer = await existingPlayerResponse.json();
          console.log('Player signed in successfully:', existingPlayer);
          onPlayerCreated(existingPlayer);
          onClose();
          setPlayerData({ name: '', email: '', account: ACCOUNT_ID });
          setImagePreview('');
          return;
        } else {
          throw new Error('Player not found. Please create an account first.');
        }
      }

      // Create mode - check if player exists first, then create if not
      console.log('Checking if player exists before creating:', playerData.email);
      
      try {
        const existingPlayerResponse = await fetch(`${gameLayerConfig.baseUrl}/players/${encodeURIComponent(playerData.email)}?account=${ACCOUNT_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': gameLayerConfig.apiKey,
          },
        });

        if (existingPlayerResponse.ok) {
          throw new Error('Player already exists. Please use Sign In instead.');
        }
      } catch (checkError) {
        if (checkError instanceof Error && checkError.message.includes('already exists')) {
          throw checkError;
        }
        console.log('Player does not exist, proceeding with creation');
      }

      // Create player with JSON (include image as base64 if present)
      const playerPayload: any = {
        name: playerData.name,
        email: playerData.email,
        player: playerData.email,
        account: ACCOUNT_ID,
      };

      // Convert image to base64 and include in payload
      if (playerData.image) {
        try {
          const base64Image = await convertImageToBase64(playerData.image);
          playerPayload.imgUrl = base64Image;
          console.log('Image converted to base64, length:', base64Image.length);
        } catch (imageError) {
          console.warn('Failed to convert image to base64:', imageError);
        }
      }

      console.log('Creating player with GameLayer API (JSON):', {
        ...playerPayload,
        hasImage: !!playerData.image,
        endpoint: `${gameLayerConfig.baseUrl}/players?account=${ACCOUNT_ID}`,
        ACCOUNT_ID_DEBUG: ACCOUNT_ID,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': gameLayerConfig.apiKey,
        }
      });

      const response = await fetch(`${gameLayerConfig.baseUrl}/players?account=${ACCOUNT_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'api-key': gameLayerConfig.apiKey,
        },
        body: JSON.stringify(playerPayload),
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = 'Failed to create player';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `API Error (${response.status}): ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const newPlayer = await response.json();
      console.log('Player created successfully:', newPlayer);
      console.log('Player imgUrl field:', newPlayer.imgUrl);
      
      // Pass the new player to the parent component
      // The parent will handle storing and loading real player data
      onPlayerCreated(newPlayer);
      onClose();
      
      // Reset form
      setPlayerData({ name: '', email: '', account: ACCOUNT_ID });
      setImagePreview('');
      
    } catch (err) {
      console.error('Player creation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = mode === 'signin' 
    ? playerData.email.trim() && playerData.email.includes('@')
    : mode === 'update'
    ? playerData.name.trim()
    : playerData.name.trim() && playerData.email.trim() && playerData.email.includes('@');

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
            
            <ModalTitle>
              {mode === 'update' ? 'Update Profile' : 'Join the Adventure!'}
            </ModalTitle>
            
            {mode !== 'update' && (
              <TabContainer>
                <Tab $active={mode === 'signin'} onClick={() => setMode('signin')}>
                  Sign In
                </Tab>
                <Tab $active={mode === 'create'} onClick={() => setMode('create')}>
                  Create Account
                </Tab>
              </TabContainer>
            )}
            
            <ModalSubtitle>
              {mode === 'signin' 
                ? 'Welcome back! Enter your email to continue your adventure.'
                : mode === 'update'
                ? 'Update your player name and profile picture. Your email cannot be changed.'
                : 'Create your player profile to start your advent calendar journey.'
              }
            </ModalSubtitle>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <Form onSubmit={handleSubmit} onReset={(e) => e.preventDefault()}>
              {(mode === 'create' || mode === 'update') && (
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
              )}
              
              <FormGroup>
                <Label>
                  <Mail size={16} />
                  Email Address {mode === 'update' && '(Cannot be changed)'}
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={playerData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={mode === 'update'}
                  style={mode === 'update' ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
                />
              </FormGroup>
              
              {(mode === 'create' || mode === 'update') && (
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
              )}
              
              <SubmitButton
                type="submit"
                disabled={!isFormValid || isLoading}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                {isLoading 
                  ? (mode === 'signin' ? 'Signing In...' : mode === 'update' ? 'Updating...' : 'Creating Account...')
                  : (mode === 'signin' ? 'Sign In' : mode === 'update' ? 'Update Profile' : 'Create Account')
                }
              </SubmitButton>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};
