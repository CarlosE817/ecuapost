import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TweetCard from '../TweetCard'; // Adjust path as necessary
import { AppContextType, AppProvider } from '../../contexts/AppContext'; // Adjust path
import { Tweet, User }
from '../../types'; // Adjust path
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
  // firebaseUser: {} // Add mock firebaseUser if AppContext or TweetCard uses it directly
};

const mockTweet: Tweet = {
  id: 'tweet1',
  user: {
    id: 'user2', // Different user for a standard tweet
    username: 'janedoe',
    displayName: 'Jane Doe',
    avatar: 'https://example.com/janedoe.png',
    verified: false,
    bio: '',
    followers: 10,
    following: 5,
  },
  content: 'This is a test tweet content.',
  timestamp: new Date(),
  likes: 5,
  retweets: 2,
  replies: 1,
  liked: false,
  retweeted: false,
};

const mockOwnTweet: Tweet = {
  ...mockTweet,
  user: mockAppUser, // Tweet belongs to the current appUser
};

// Default mock context values
const mockContextValue: Partial<AppContextType> = {
  appUser: mockAppUser,
  firebaseUser: { uid: mockAppUser.id }, // Simplified mock
  loadingAuth: false,
  showAuthModal: false,
  openAuthModal: vi.fn(),
  closeAuthModal: vi.fn(),
  handleAuthSuccess: vi.fn(),
  tweets: [mockTweet, mockOwnTweet],
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

const MockAppProvider: React.FC<{ children: ReactNode, contextValue?: Partial<AppContextType> }> = ({ children, contextValue }) => {
  const combinedContext = { ...mockContextValue, ...contextValue } as AppContextType;
  return <AppProvider value={combinedContext}>{children}</AppProvider>;
};

// Custom render function to wrap components with AppProvider
const renderWithAppContext = (ui: React.ReactElement, providerProps?: { contextValue?: Partial<AppContextType> }) => {
  return render(ui, { wrapper: (props) => <MockAppProvider {...props} {...providerProps} /> });
};


describe('TweetCard Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    // Reset isTweetBookmarked mock specifically if needed for different scenarios
    (mockContextValue.isTweetBookmarked as vi.Mock).mockReturnValue(false);
  });

  it('renders tweet content and user information', () => {
    renderWithAppContext(<TweetCard tweet={mockTweet} />);
    expect(screen.getByText(mockTweet.content)).toBeInTheDocument();
    expect(screen.getByText(mockTweet.user.displayName)).toBeInTheDocument();
    expect(screen.getByText(`@${mockTweet.user.username}`)).toBeInTheDocument();
  });

  it('calls handleLikeTweet when like button is clicked', () => {
    renderWithAppContext(<TweetCard tweet={mockTweet} />);
    // Find button by its accessible name or structure if specific text isn't there
    const likeButton = screen.getByRole('button', { name: /like/i }); // This requires ARIA label or accessible text
    // If no accessible name, find by structure or test id. For example, assuming Lucide icons are SVGs:
    // const likeButtonContainer = screen.getByText(mockTweet.likes.toString()).closest('button');
    // For now, let's assume the button is identifiable. Often icons are wrapped in buttons.
    // Let's find the button that contains the Heart icon and the like count.
    const buttons = screen.getAllByRole('button');
    // This is fragile; ideally, buttons have aria-labels.
    // Assuming the like button is the one with the current like count text.
    const likeButtonParent = screen.getByText(mockTweet.likes.toString()).closest('button');
    if (!likeButtonParent) throw new Error("Like button not found");

    fireEvent.click(likeButtonParent);
    expect(mockContextValue.handleLikeTweet).toHaveBeenCalledWith(mockTweet.id);
  });

  it('shows edit and delete options for own tweet when menu is opened', () => {
    renderWithAppContext(<TweetCard tweet={mockOwnTweet} />);
    const menuButton = screen.getByRole('button', { name: /more options/i }); // Assuming MoreHorizontal has an accessible name or is wrapped
    fireEvent.click(menuButton);

    expect(screen.getByText('Editar tweet')).toBeInTheDocument();
    expect(screen.getByText('Eliminar tweet')).toBeInTheDocument();
  });

  it('does not show edit and delete for others tweet', () => {
    renderWithAppContext(<TweetCard tweet={mockTweet} />); // Tweet from another user
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);

    expect(screen.queryByText('Editar tweet')).not.toBeInTheDocument();
    expect(screen.queryByText('Eliminar tweet')).not.toBeInTheDocument();
  });

  it('allows editing own tweet', async () => {
    renderWithAppContext(<TweetCard tweet={mockOwnTweet} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);

    const editButton = screen.getByText('Editar tweet');
    fireEvent.click(editButton);

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe(mockOwnTweet.content);

    const newContent = "This is the updated content.";
    fireEvent.change(textarea, { target: { value: newContent } });
    expect(textarea.value).toBe(newContent);

    const saveButton = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockContextValue.handleEditTweet).toHaveBeenCalledWith(mockOwnTweet.id, newContent);
    });
    // Check if editing mode is exited (textarea no longer visible)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('calls handleDeleteTweet when delete is confirmed', async () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderWithAppContext(<TweetCard tweet={mockOwnTweet} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText('Eliminar tweet');
    fireEvent.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockContextValue.handleDeleteTweet).toHaveBeenCalledWith(mockOwnTweet.id);
    });
    confirmSpy.mockRestore();
  });

  it('calls handleBookmarkTweet when bookmark button is clicked', () => {
    (mockContextValue.isTweetBookmarked as vi.Mock).mockReturnValue(false); // Ensure it's not bookmarked initially
    renderWithAppContext(<TweetCard tweet={mockTweet} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);

    // Text changes based on bookmark state
    const bookmarkButton = screen.getByText('Guardar tweet');
    fireEvent.click(bookmarkButton);
    expect(mockContextValue.handleBookmarkTweet).toHaveBeenCalledWith(mockTweet.id);
  });

  it('displays correct bookmark text when already bookmarked', () => {
    (mockContextValue.isTweetBookmarked as vi.Mock).mockReturnValue(true); // Simulate already bookmarked
    renderWithAppContext(<TweetCard tweet={mockTweet} />);
    const menuButton = screen.getByRole('button', { name: /more options/i });
    fireEvent.click(menuButton);

    expect(screen.getByText('Quitar bookmark')).toBeInTheDocument();
  });

  // Test for image rendering
  it('renders images if present in tweet data', () => {
    const tweetWithImage = { ...mockTweet, images: ['https://example.com/image1.jpg'] };
    renderWithAppContext(<TweetCard tweet={tweetWithImage} />);
    const imageElement = screen.getByAltText('Tweet image') as HTMLImageElement; // Assuming one image
    expect(imageElement).toBeInTheDocument();
    expect(imageElement.src).toBe('https://example.com/image1.jpg');
  });

  it('does not render image area if no images in tweet data', () => {
    const tweetWithoutImage = { ...mockTweet, images: undefined };
    renderWithAppContext(<TweetCard tweet={tweetWithoutImage} />);
    // Query by a class or structure specific to the image container if possible
    // For now, checking that no image with common alt text is found
    expect(screen.queryByAltText(/Tweet image/i)).not.toBeInTheDocument();
  });

});

// Helper to make AppProvider work in tests by providing a default value
// This is a simplified version. Actual AppProvider has more logic.
// We are overriding the actual AppProvider with this mock version for testing.
vi.mock('../../contexts/AppContext', async (importOriginal) => {
  const actual = await importOriginal() as any; // Import original to get AppContextType if needed elsewhere
  return {
    ...actual, // Spread original exports
    AppProvider: ({ children, value }: { children: ReactNode, value: AppContextType}) => (
      <actual.AppContext.Provider value={value || mockContextValue}>
        {children}
      </actual.AppContext.Provider>
    ),
    useAppContext: () => mockContextValue, // Ensure useAppContext returns our mock value in tests
  };
});
