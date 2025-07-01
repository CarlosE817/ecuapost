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
}

const Timeline: React.FC<TimelineProps> = ({ tweets, onTweet, onLike, onRetweet, onReply }) => {
  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Home</h1>
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
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;