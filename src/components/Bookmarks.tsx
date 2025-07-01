import React from 'react';
import { Bookmark } from 'lucide-react';
import { Tweet } from '../types';
import TweetCard from './TweetCard';

interface BookmarksProps {
  tweets: Tweet[];
  onLike: (tweetId: string) => void;
  onRetweet: (tweetId: string) => void;
  onReply: (tweetId: string) => void;
  onBookmark: (tweetId: string) => void;
  bookmarkedTweets: string[];
}

const Bookmarks: React.FC<BookmarksProps> = ({ 
  tweets, 
  onLike, 
  onRetweet, 
  onReply, 
  onBookmark, 
  bookmarkedTweets 
}) => {
  return (
    <div className="border-l border-r border-gray-200 min-h-screen">
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
        <h1 className="text-xl font-bold text-gray-900">Bookmarks</h1>
        <p className="text-gray-500 text-sm">@carlos_ec</p>
      </div>
      
      <div>
        {tweets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-bold mb-2">Guarda tweets para más tarde</p>
            <p>No tienes ningún tweet guardado aún. Cuando guardes tweets, aparecerán aquí.</p>
          </div>
        ) : (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onLike={onLike}
              onRetweet={onRetweet}
              onReply={onReply}
              onBookmark={onBookmark}
              isBookmarked={bookmarkedTweets.includes(tweet.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Bookmarks;