import React from 'react';
import TweetCard from './TweetCard';
import ComposeBox from './ComposeBox';
import { useAppContext } from '../contexts/AppContext';

// TimelineProps are no longer needed as most props are removed
// interface TimelineProps {
//   // tweets: Tweet[]; // Will come from context
//   // onTweet: (content: string, images?: File[]) => void; // Will come from context via ComposeBox
//   // ... other handlers ...
// }

const Timeline: React.FC = () => {
  const { tweets, handleNewTweet } = useAppContext(); // Get tweets and relevant handlers from context

  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inicio</h1>
      </div>
      
      {/* ComposeBox will use handleNewTweet from context internally */}
      <ComposeBox />
      
      <div>
        {tweets.length === 0 && (
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            No hay tweets todavía. ¡Sé el primero en publicar!
          </p>
        )}
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            // All handlers (onLike, onRetweet, etc.) and isBookmarked will be accessed
            // directly within TweetCard using useAppContext
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;