// src/hooks/useTweets.ts
import { useState, useCallback, useEffect } from 'react';
import { Tweet, User } from '../types';
import { tweets as initialTweetsData } from '../data/mockData';
import { storage } from '../config/firebase'; // Import Firebase storage instance
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for images

// Helper to get current user (simplified, will be improved by AppContext's appUser)
// This getCurrentUser might be redundant if appUser from AppContext is always used.
// For now, keeping it if useTweets is callable outside full AppContext, though less likely.
const getCurrentUser = (authUser: any): User => {
  if (authUser) {
    return {
      id: authUser.uid,
      username: authUser.email?.split('@')[0] || authUser.displayName?.toLowerCase().replace(/\s+/g, '_') || 'usuario',
      displayName: authUser.displayName || authUser.email?.split('@')[0] || 'Usuario',
      avatar: authUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.displayName || authUser.email?.split('@')[0] || 'Usuario')}&background=3b82f6&color=fff`,
      bio: 'Usuario de EcuaPost',
      followers: 0,
      following: 0,
      verified: authUser.emailVerified || false, // Use emailVerified from Firebase user
    };
  }
  // Fallback, though ideally authUser should always be present if this function is called for posting.
  return {
    id: 'demo_fallback_user',
    username: 'demo_user_fallback',
    displayName: 'Usuario Demo Fallback',
    avatar: 'https://ui-avatars.com/api/?name=DemoFallback&background=3b82f6&color=fff',
    bio: 'Usuario demo de EcuaPost (Fallback)',
    followers: 0,
    following: 0,
    verified: false,
  };
};

// convertFilesToBase64 is no longer needed for Firebase Storage
// const convertFilesToBase64 = (files: File[]): Promise<string[]> => { ... };

export const useTweets = (authUser: any, showToast: (message: string, type?: 'success' | 'info' | 'error') => void) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  // Load tweets from localStorage
  useEffect(() => {
    console.log('Attempting to load tweets from localStorage...');
    const savedTweets = localStorage.getItem('ecuapost-tweets');
    if (savedTweets) {
      try {
        const parsedTweets = JSON.parse(savedTweets).map((tweet: any) => ({
          ...tweet,
          timestamp: new Date(tweet.timestamp),
        }));
        setTweets(parsedTweets);
        console.log(`Loaded ${parsedTweets.length} tweets from localStorage. First tweet author: ${parsedTweets.length > 0 ? parsedTweets[0].user.displayName : 'N/A'}`);
      } catch (error) {
        console.error('Error loading tweets from localStorage:', error);
        setTweets(initialTweetsData);
        console.log(`Fallback to initialTweetsData due to localStorage error. Loaded ${initialTweetsData.length} mock tweets. First mock tweet author: ${initialTweetsData.length > 0 ? initialTweetsData[0].user.displayName : 'N/A'}`);
      }
    } else {
      console.log('No tweets found in localStorage, loading initial mock data.');
      setTweets(initialTweetsData);
      console.log(`Loaded ${initialTweetsData.length} mock tweets. First mock tweet author: ${initialTweetsData.length > 0 ? initialTweetsData[0].user.displayName : 'N/A'}`);
    }
  }, []);

  // Save tweets to localStorage
  useEffect(() => {
    if (tweets.length > 0) {
        try {
            const serializableTweets = tweets.map(tweet => ({
              ...tweet,
              timestamp: tweet.timestamp.toISOString(),
            }));
            localStorage.setItem('ecuapost-tweets', JSON.stringify(serializableTweets));
            console.log(`Saved ${serializableTweets.length} tweets to localStorage.`);
          } catch (error) {
            console.error('Error saving tweets to localStorage:', error);
          }
    } else if (localStorage.getItem('ecuapost-tweets')) {
        localStorage.setItem('ecuapost-tweets', JSON.stringify([]));
        console.log('Saved empty tweets array to localStorage.');
    }
  }, [tweets]);

  const handleNewTweet = useCallback(async (content: string, images?: File[]) => {
    if (!authUser) {
      showToast('Debes iniciar sesión para twittear', 'error');
      return;
    }
    try {
      const currentUser = getCurrentUser(authUser); // Ensure authUser is the Firebase user object
      let uploadedImageUrls: string[] = [];

      if (images && images.length > 0) {
        showToast(`Subiendo ${images.length} imagen(es)...`, 'info');
        const uploadPromises = images.map(imageFile => {
          // Create a unique path for each image
          const imagePath = `tweet_images/${currentUser.id}/${uuidv4()}-${imageFile.name}`;
          const storageRef = ref(storage, imagePath);
          const uploadTask = uploadBytesResumable(storageRef, imageFile);

          return new Promise<string>((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // Optional: handle progress (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Subiendo ${imageFile.name} a ${storageRef.fullPath}: ${progress.toFixed(2)}%`);
              },
              (error) => { // Firebase Storage Error object often has a 'code' property
                console.error(`Error subiendo imagen (${imageFile.name}):`, error);
                console.error(`Detalles del error de subida (código: ${error.code}): ${error.message}`);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        });

        try {
          uploadedImageUrls = await Promise.all(uploadPromises);
        } catch (uploadError) {
          console.error('Una o más imágenes fallaron al subirse:', uploadError);
          showToast('Error al subir una o más imágenes. Inténtalo de nuevo.', 'error');
          return; // Stop tweet creation if image upload fails
        }
      }

      const newTweet: Tweet = {
        id: Date.now().toString(), // Consider using uuid for tweet IDs too for better uniqueness
        user: currentUser,
        content,
        timestamp: new Date(),
        likes: 0,
        retweets: 0,
        replies: 0,
        liked: false,
        retweeted: false,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
      };
      setTweets(prev => [newTweet, ...prev]);
      showToast(
        uploadedImageUrls.length > 0
          ? `¡Tweet con ${uploadedImageUrls.length} imagen${uploadedImageUrls.length > 1 ? 'es' : ''} publicado!`
          : '¡Tweet publicado exitosamente!',
        'success'
      );
    } catch (error) {
      console.error('Error creando tweet:', error);
      showToast('Error al publicar el tweet.', 'error');
    }
  }, [authUser, showToast]); // authUser dependency is important here

  const handleLike = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(tweet => {
      if (tweet.id === tweetId) {
        const wasLiked = tweet.liked;
        showToast(wasLiked ? 'Like removido' : '¡Te gusta este tweet!', 'info');
        return { ...tweet, liked: !wasLiked, likes: wasLiked ? tweet.likes - 1 : tweet.likes + 1 };
      }
      return tweet;
    }));
  }, [showToast]);

  const handleRetweet = useCallback((tweetId: string) => {
    setTweets(prev => prev.map(tweet => {
      if (tweet.id === tweetId) {
        const wasRetweeted = tweet.retweeted;
        showToast(wasRetweeted ? 'Retweet removido' : '¡Tweet compartido!', 'info');
        return { ...tweet, retweeted: !wasRetweeted, retweets: wasRetweeted ? tweet.retweets - 1 : tweet.retweets + 1 };
      }
      return tweet;
    }));
  }, [showToast]);

  const handleReply = useCallback((tweetId: string) => {
    console.log('Reply to tweet:', tweetId);
    showToast('Función de respuesta próximamente...', 'info');
  }, [showToast]);

  const handleDeleteTweet = useCallback((tweetId: string) => {
    setTweets(prev => prev.filter(tweet => tweet.id !== tweetId));
    showToast('Tweet eliminado', 'success');
  }, [showToast]);

  const handleEditTweet = useCallback((tweetId: string, newContent: string) => {
    setTweets(prev => prev.map(tweet =>
      tweet.id === tweetId ? { ...tweet, content: newContent, timestamp: new Date() } : tweet // Update timestamp on edit
    ));
    showToast('Tweet editado exitosamente', 'success');
  }, [showToast]);

  return {
    tweets,
    setTweets, // Expose setTweets for potential direct manipulation if needed elsewhere (e.g. profile updates affecting tweets)
    handleNewTweet,
    handleLike,
    handleRetweet,
    handleReply,
    handleDeleteTweet,
    handleEditTweet,
  };
};
