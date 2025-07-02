import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useTweets } from '../useTweets';
import { tweets as mockInitialTweets } from '../../data/mockData'; // Adjust path if necessary
import { User } from '../../types';

// Mocks defined in setupTests.ts should be active:
// - localStorage
// - firebase/storage (uploadBytesResumable, getDownloadURL)

const mockShowToast = vi.fn();

const mockAuthUser: User = {
  id: 'test-user-id',
  username: 'testuser',
  displayName: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  followers: 0,
  following: 0,
  verified: true,
  // firebaseUser: { uid: 'test-user-id', email: 'test@example.com', displayName: 'Test User', photoURL: 'https://example.com/avatar.jpg' } // Simulate Firebase user object if needed by getCurrentUser
};
const mockAuthUserFirebase = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.jpg',
    emailVerified: true,
};


describe('useTweets Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    mockShowToast.mockClear();
    // Reset mocks for firebase storage if they store state across tests (though our current mocks are stateless funcs)
    vi.clearAllMocks(); // Clears all mocks, including those from setupTests.ts. Re-apply if needed per test.
                         // However, setupTests.ts mocks are global, so they should persist unless explicitly reset or overridden.
                         // For firebase/storage mocks, they are stateless, so clearing calls is enough.
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore original implementations if any spies were used directly in tests
  });

  it('should initialize with mock tweets if localStorage is empty', () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    // Expect a subset or transformation of mockInitialTweets, as the hook processes them (e.g. new Date(timestamp))
    // For simplicity, checking length or a specific property.
    expect(result.current.tweets.length).toBe(mockInitialTweets.length);
    expect(result.current.tweets[0].user.displayName).toBe(mockInitialTweets[0].user.displayName);
  });

  it('should load tweets from localStorage if available', () => {
    const storedTweets = [
      { id: 'stored-tweet-1', user: mockAuthUser, content: 'Stored tweet content', timestamp: new Date().toISOString(), likes: 5, retweets: 2, replies: 1, liked: false, retweeted: false },
    ];
    localStorage.setItem('ecuapost-tweets', JSON.stringify(storedTweets));

    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));

    expect(result.current.tweets.length).toBe(1);
    expect(result.current.tweets[0].id).toBe('stored-tweet-1');
    expect(result.current.tweets[0].content).toBe('Stored tweet content');
  });

  it('handleNewTweet should add a new tweet without images', async () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    const initialTweetCount = result.current.tweets.length;

    await act(async () => {
      await result.current.handleNewTweet('New tweet content');
    });

    expect(result.current.tweets.length).toBe(initialTweetCount + 1);
    expect(result.current.tweets[0].content).toBe('New tweet content');
    expect(result.current.tweets[0].user.id).toBe(mockAuthUserFirebase.uid);
    expect(mockShowToast).toHaveBeenCalledWith('¡Tweet publicado exitosamente!', 'success');
  });

  it('handleNewTweet should add a new tweet with images (mocked upload)', async () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    const initialTweetCount = result.current.tweets.length;

    const mockImageFile = new File(['dummyImage'], 'image1.png', { type: 'image/png' });

    await act(async () => {
      await result.current.handleNewTweet('Tweet with image', [mockImageFile]);
    });

    expect(result.current.tweets.length).toBe(initialTweetCount + 1);
    expect(result.current.tweets[0].content).toBe('Tweet with image');
    expect(result.current.tweets[0].images).toBeDefined();
    expect(result.current.tweets[0].images?.[0]).toBe('https://mockstorage.com/mockimage.jpg'); // From our mock
    expect(mockShowToast).toHaveBeenCalledWith('¡Tweet con 1 imagen publicado!', 'success');
  });

  it('handleNewTweet should show error if user is not authenticated', async () => {
    const { result } = renderHook(() => useTweets(null, mockShowToast)); // Pass null for authUser
    const initialTweetCount = result.current.tweets.length;

    await act(async () => {
      await result.current.handleNewTweet('Attempt to tweet');
    });

    expect(result.current.tweets.length).toBe(initialTweetCount); // No tweet should be added
    expect(mockShowToast).toHaveBeenCalledWith('Debes iniciar sesión para twittear', 'error');
  });

  it('handleLike should toggle like status and count', async () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    // Add a tweet first to ensure there's something to like
    await act(async () => {
      await result.current.handleNewTweet('Tweet to be liked');
    });
    const tweetToLike = result.current.tweets[0];

    // Like
    act(() => {
      result.current.handleLike(tweetToLike.id);
    });
    let likedTweet = result.current.tweets.find(t => t.id === tweetToLike.id);
    expect(likedTweet?.liked).toBe(true);
    expect(likedTweet?.likes).toBe(1);
    expect(mockShowToast).toHaveBeenCalledWith('¡Te gusta este tweet!', 'info');

    // Unlike
    act(() => {
      result.current.handleLike(tweetToLike.id);
    });
    likedTweet = result.current.tweets.find(t => t.id === tweetToLike.id);
    expect(likedTweet?.liked).toBe(false);
    expect(likedTweet?.likes).toBe(0);
    expect(mockShowToast).toHaveBeenCalledWith('Like removido', 'info');
  });

  it('handleRetweet should toggle retweet status and count', async () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    await act(async () => {
      await result.current.handleNewTweet('Tweet to be retweeted');
    });
    const tweetToRetweet = result.current.tweets[0];

    act(() => result.current.handleRetweet(tweetToRetweet.id));
    let retweetedTweet = result.current.tweets.find(t => t.id === tweetToRetweet.id);
    expect(retweetedTweet?.retweeted).toBe(true);
    expect(retweetedTweet?.retweets).toBe(1);
    expect(mockShowToast).toHaveBeenCalledWith('¡Tweet compartido!', 'info');

    act(() => result.current.handleRetweet(tweetToRetweet.id));
    retweetedTweet = result.current.tweets.find(t => t.id === tweetToRetweet.id);
    expect(retweetedTweet?.retweeted).toBe(false);
    expect(retweetedTweet?.retweets).toBe(0);
    expect(mockShowToast).toHaveBeenCalledWith('Retweet removido', 'info');
  });

  it('handleDeleteTweet should remove a tweet', async () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    await act(async () => {
      await result.current.handleNewTweet('Tweet to delete');
    });
    const tweetToDelete = result.current.tweets[0];
    const initialCount = result.current.tweets.length;

    act(() => result.current.handleDeleteTweet(tweetToDelete.id));

    expect(result.current.tweets.length).toBe(initialCount - 1);
    expect(result.current.tweets.find(t => t.id === tweetToDelete.id)).toBeUndefined();
    expect(mockShowToast).toHaveBeenCalledWith('Tweet eliminado', 'success');
  });

  it('handleEditTweet should update tweet content', async () => {
    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));
    await act(async () => {
      await result.current.handleNewTweet('Original content');
    });
    const tweetToEdit = result.current.tweets[0];
    const newContent = "Updated content";

    act(() => result.current.handleEditTweet(tweetToEdit.id, newContent));

    const editedTweet = result.current.tweets.find(t => t.id === tweetToEdit.id);
    expect(editedTweet?.content).toBe(newContent);
    expect(mockShowToast).toHaveBeenCalledWith('Tweet editado exitosamente', 'success');
  });

  it('should handle errors when parsing localStorage for tweets gracefully', () => {
    localStorage.setItem('ecuapost-tweets', 'invalid json');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useTweets(mockAuthUserFirebase, mockShowToast));

    // Should fall back to initial mock data
    expect(result.current.tweets.length).toBe(mockInitialTweets.length);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
