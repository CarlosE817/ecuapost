import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComposeBox from '../ComposeBox'; // Adjust path
import { AppContextType, AppProvider as ActualAppProvider, AppContext as ActualAppContext } from '../../contexts/AppContext'; // Adjust path
import { User } from '../../types'; // Adjust path
import React, { ReactNode } from 'react';

const mockAppUser: User = {
  id: 'user1',
  username: 'testuser',
  displayName: 'Test User',
  avatar: 'https://example.com/avatar.png',
  bio: '',
  followers: 0,
  following: 0,
  verified: true,
  firebaseUser: { uid: 'user1' } // Mocking firebaseUser part
};

// Default mock context values for ComposeBox tests
let mockContextValue: AppContextType;

// Helper component to provide context for tests
const TestAppProvider: React.FC<{ children: ReactNode, overrideContextValue?: Partial<AppContextType> }> = ({ children, overrideContextValue }) => {
  const combinedContext: AppContextType = {
    // Default values for all required properties in AppContextType
    appUser: null,
    firebaseUser: null,
    loadingAuth: false,
    showAuthModal: false,
    openAuthModal: vi.fn(),
    closeAuthModal: vi.fn(),
    handleAuthSuccess: vi.fn(),
    tweets: [],
    handleNewTweet: vi.fn().mockResolvedValue(undefined),
    handleLikeTweet: vi.fn(),
    handleRetweetTweet: vi.fn(),
    handleReplyTweet: vi.fn(),
    handleDeleteTweet: vi.fn(),
    handleEditTweet: vi.fn(),
    bookmarkedTweets: [],
    handleBookmarkTweet: vi.fn(),
    isTweetBookmarked: vi.fn().mockReturnValue(false),
    showToast: vi.fn(),
    activeTab: 'home',
    setActiveTab: vi.fn(),
    // Override with specific values for the test
    ...overrideContextValue,
  };
  return <ActualAppContext.Provider value={combinedContext}>{children}</ActualAppContext.Provider>;
};


const renderWithAppContext = (ui: React.ReactElement, providerProps?: { overrideContextValue?: Partial<AppContextType> }) => {
  return render(ui, { wrapper: (props) => <TestAppProvider {...props} {...providerProps} /> });
};

// Mock ImageUpload component as its internal workings are not the focus of ComposeBox tests
vi.mock('../ImageUpload', () => ({
  default: ({ onImageSelect, selectedImages, onRemoveImage, maxImages }: any) => (
    <div>
      <input
        type="file"
        data-testid="mock-image-upload"
        multiple
        onChange={(e) => onImageSelect(Array.from(e.target.files || []))}
        accept="image/*"
      />
      {selectedImages.map((img: File, index: number) => (
        <button key={img.name + index} onClick={() => onRemoveImage(index)} data-testid={`remove-image-${index}`}>
          Remove {img.name}
        </button>
      ))}
    </div>
  ),
}));


describe('ComposeBox Component', () => {
  beforeEach(() => {
    // Reset context for each test
    mockContextValue = {
      appUser: mockAppUser, // Logged in by default for most tests
      firebaseUser: { uid: mockAppUser.id },
      loadingAuth: false,
      showAuthModal: false,
      openAuthModal: vi.fn(),
      closeAuthModal: vi.fn(),
      handleAuthSuccess: vi.fn(),
      tweets: [],
      handleNewTweet: vi.fn().mockResolvedValue(undefined),
      handleLikeTweet: vi.fn(),
      handleRetweetTweet: vi.fn(),
      handleReplyTweet: vi.fn(),
      handleDeleteTweet: vi.fn(),
      handleEditTweet: vi.fn(),
      bookmarkedTweets: [],
      handleBookmarkTweet: vi.fn(),
      isTweetBookmarked: vi.fn().mockReturnValue(false),
      showToast: vi.fn(),
      activeTab: 'home',
      setActiveTab: vi.fn(),
    };
  });

  it('renders textarea and user avatar when user is logged in', () => {
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser } });
    expect(screen.getByPlaceholderText('¿Qué está pasando?')).toBeInTheDocument();
    expect(screen.getByAltText(mockAppUser.displayName)).toHaveAttribute('src', mockAppUser.avatar);
  });

  it('disables textarea and shows login prompt if user is not logged in', () => {
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: null } });
    const textarea = screen.getByPlaceholderText('Inicia sesión para publicar') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea).toBeDisabled();
    // Check if action buttons like Smile, Calendar, MapPin are disabled
    const smileButton = screen.getByRole('button', { name: /smile/i }); // Assuming lucide icons add aria-label or text
    expect(smileButton).toBeDisabled();
  });

  it('allows typing in textarea', async () => {
    const user = userEvent.setup();
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser } });
    const textarea = screen.getByPlaceholderText('¿Qué está pasando?');
    await user.type(textarea, 'Hello world!');
    expect(textarea).toHaveValue('Hello world!');
  });

  it('calls handleNewTweet on submit with content', async () => {
    const user = userEvent.setup();
    const handleNewTweetMock = vi.fn().mockResolvedValue(undefined);
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser, handleNewTweet: handleNewTweetMock } });

    const textarea = screen.getByPlaceholderText('¿Qué está pasando?');
    await user.type(textarea, 'Test tweet content');

    const submitButton = screen.getByRole('button', { name: 'Publicar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleNewTweetMock).toHaveBeenCalledWith('Test tweet content', []); // Expect empty array for images
    });
    expect(textarea).toHaveValue(''); // Clears after submit
  });

  it('calls handleNewTweet with content and images', async () => {
    const user = userEvent.setup();
    const handleNewTweetMock = vi.fn().mockResolvedValue(undefined);
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser, handleNewTweet: handleNewTweetMock } });

    const textarea = screen.getByPlaceholderText('¿Qué está pasando?');
    await user.type(textarea, 'Tweet with image');

    const mockFile = new File(['image'], 'test.png', { type: 'image/png' });
    const imageUploadInput = screen.getByTestId('mock-image-upload');
    await user.upload(imageUploadInput, mockFile);

    const submitButton = screen.getByRole('button', { name: 'Publicar' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleNewTweetMock).toHaveBeenCalledWith('Tweet with image', [mockFile]);
    });
  });

  it('disables submit button if content is empty and no images', () => {
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser } });
    const submitButton = screen.getByRole('button', { name: 'Publicar' }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true); // Based on canSubmit logic in ComposeBox
  });

  it('enables submit button if content is not empty', async () => {
    const user = userEvent.setup();
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser } });
    const textarea = screen.getByPlaceholderText('¿Qué está pasando?');
    await user.type(textarea, 'Some content');
    const submitButton = screen.getByRole('button', { name: 'Publicar' }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it('disables submit button if content exceeds maxLength', async () => {
    const user = userEvent.setup();
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: mockAppUser } });
    const textarea = screen.getByPlaceholderText('¿Qué está pasando?');
    const longText = 'a'.repeat(281); // MaxLength is 280
    await user.type(textarea, longText);

    const submitButton = screen.getByRole('button', { name: 'Publicar' }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
    expect(screen.getByText('-1')).toBeInTheDocument(); // Character count
  });

  it('shows error toast if user tries to submit when not logged in (via submit button logic)', async () => {
    const showToastMock = vi.fn();
    renderWithAppContext(<ComposeBox />, { overrideContextValue: { appUser: null, showToast: showToastMock } });

    // Even if button is disabled, if somehow clicked or form submitted
    const form = screen.getByRole('form'); // Assuming the form has a role or can be found
    fireEvent.submit(form); // Simulate form submission

    await waitFor(() => {
        expect(showToastMock).toHaveBeenCalledWith('Debes iniciar sesión para publicar.', 'error');
    });
  });
});
