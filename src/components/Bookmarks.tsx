import React from 'react';
import { Bookmark } from 'lucide-react';
// import { Tweet } from '../types'; // Not strictly needed here if TweetCard handles its prop type
import TweetCard from './TweetCard';
import { useAppContext } from '../contexts/AppContext';

// BookmarksProps removed
// interface BookmarksProps {
//   tweets: Tweet[];
//   onLike: (tweetId: string) => void;
//   onRetweet: (tweetId: string) => void;
//   onReply: (tweetId: string) => void;
//   onBookmark: (tweetId: string) => void;
//   bookmarkedTweets: string[];
// }

const Bookmarks: React.FC = () => {
  const { appUser, tweets, isTweetBookmarked } = useAppContext();

  // Filter all tweets to get only the ones bookmarked by the current user
  const usersBookmarkedTweets = tweets.filter(tweet => isTweetBookmarked(tweet.id));
  // Sort them by timestamp, newest first (optional, but good for UX)
  usersBookmarkedTweets.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Guardados</h1>
        {appUser && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">@{appUser.username}</p>
        )}
      </div>
      
      <div>
        {usersBookmarkedTweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-xl font-bold mb-2">Guarda tweets para más tarde</p>
            <p>No tienes ningún tweet guardado aún. Cuando guardes tweets, aparecerán aquí.</p>
          </div>
        ) : (
          usersBookmarkedTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              // onLike, onRetweet, onReply, onBookmark, isBookmarked are handled by TweetCard via context
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;