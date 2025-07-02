// src/hooks/useBookmarks.ts
import { useState, useCallback, useEffect } from 'react';

export const useBookmarks = (showToast: (message: string, type?: 'success' | 'info' | 'error') => void) => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState<string[]>([]);

  // Load bookmarks from localStorage
  useEffect(() => {
    console.log('Attempting to load bookmarks from localStorage...');
    const savedBookmarks = localStorage.getItem('ecuapost-bookmarks');
    if (savedBookmarks) {
      try {
        const parsedBookmarks = JSON.parse(savedBookmarks);
        setBookmarkedTweets(parsedBookmarks);
        console.log(`Loaded ${parsedBookmarks.length} bookmarks from localStorage.`);
      } catch (error) {
        console.error('Error loading bookmarks from localStorage:', error);
        setBookmarkedTweets([]);
      }
    } else {
      console.log('No bookmarks found in localStorage.');
      setBookmarkedTweets([]);
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecuapost-bookmarks', JSON.stringify(bookmarkedTweets));
      console.log(`Saved ${bookmarkedTweets.length} bookmarks to localStorage.`);
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }, [bookmarkedTweets]);

  const handleBookmark = useCallback((tweetId: string) => {
    setBookmarkedTweets(prev => {
      const isBookmarked = prev.includes(tweetId);
      if (isBookmarked) {
        showToast('Bookmark removido', 'info');
        return prev.filter(id => id !== tweetId);
      } else {
        showToast('¡Tweet guardado!', 'info');
        return [...prev, tweetId];
      }
    });
  }, [showToast]);

  return {
    bookmarkedTweets,
    setBookmarkedTweets, // Expose for potential direct manipulation
    handleBookmark,
  };
};
