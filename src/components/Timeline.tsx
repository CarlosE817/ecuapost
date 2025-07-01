import React from 'react';
import { Tweet } from '../types';
import TweetCard from './TweetCard';
import ComposeBox from './ComposeBox';

interface TimelineProps {
  tweets: Tweet[];
  onTweet: (content: string) => void;
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
  onBookmark: (tweetId: string) => void;
  onDelete: (tweetId: string) => void;
  onEdit: (tweetId: string, content: string) => void;
  bookmarkedTweets: string[];
}

const Timeline: React.FC<TimelineProps> = ({ 
  tweets, 
  onTweet, 
  onLike, 
  onRetweet, 
  onReply, 
  onBookmark, 
  onDelete, 
  onEdit, 
  bookmarkedTweets 
}) => {
  return (
    <div className="border-l border-r border-gray-200 dark:border-gray-800 min-h-screen">
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inicio</h1>
      </div>
      
      <ComposeBox onTweet={onTweet} />
      
      <div>
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            onLike={onLike}
            onRetweet={onRetweet}
            onReply={onReply}
            onBookmark={onBookmark}
            onDelete={onDelete}
            onEdit={onEdit}
            isBookmarked={bookmarkedTweets.includes(tweet.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;