import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBookmarks } from '../useBookmarks';

// Mock showToast function
const mockShowToast = vi.fn();

describe('useBookmarks Hook', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    mockShowToast.mockClear();
  });

  it('should initialize with an empty array if localStorage is empty', () => {
    const { result } = renderHook(() => useBookmarks(mockShowToast));
    expect(result.current.bookmarkedTweets).toEqual([]);
  });

  it('should load bookmarks from localStorage on initialization', () => {
    localStorage.setItem('ecuapost-bookmarks', JSON.stringify(['tweet1', 'tweet2']));
    const { result } = renderHook(() => useBookmarks(mockShowToast));
    expect(result.current.bookmarkedTweets).toEqual(['tweet1', 'tweet2']);
  });

  it('should add a bookmark if not already bookmarked', () => {
    const { result } = renderHook(() => useBookmarks(mockShowToast));

    act(() => {
      result.current.handleBookmark('tweet1');
    });

    expect(result.current.bookmarkedTweets).toEqual(['tweet1']);
    expect(localStorage.getItem('ecuapost-bookmarks')).toBe(JSON.stringify(['tweet1']));
    expect(mockShowToast).toHaveBeenCalledWith('¡Tweet guardado!', 'info');
  });

  it('should remove a bookmark if already bookmarked', () => {
    localStorage.setItem('ecuapost-bookmarks', JSON.stringify(['tweet1', 'tweet2']));
    const { result } = renderHook(() => useBookmarks(mockShowToast));

    act(() => {
      result.current.handleBookmark('tweet1');
    });

    expect(result.current.bookmarkedTweets).toEqual(['tweet2']);
    expect(localStorage.getItem('ecuapost-bookmarks')).toBe(JSON.stringify(['tweet2']));
    expect(mockShowToast).toHaveBeenCalledWith('Bookmark removido', 'info');
  });

  it('should toggle bookmark status correctly', () => {
    const { result } = renderHook(() => useBookmarks(mockShowToast));

    // Add bookmark
    act(() => {
      result.current.handleBookmark('tweet3');
    });
    expect(result.current.bookmarkedTweets).toContain('tweet3');
    expect(mockShowToast).toHaveBeenCalledWith('¡Tweet guardado!', 'info');

    // Remove bookmark
    act(() => {
      result.current.handleBookmark('tweet3');
    });
    expect(result.current.bookmarkedTweets).not.toContain('tweet3');
    expect(mockShowToast).toHaveBeenCalledWith('Bookmark removido', 'info');
  });

  it('should handle errors when parsing localStorage gracefully', () => {
    localStorage.setItem('ecuapost-bookmarks', 'invalid json');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error for this test

    const { result } = renderHook(() => useBookmarks(mockShowToast));

    expect(result.current.bookmarkedTweets).toEqual([]); // Should default to empty array
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
