export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  followers: number;
  following: number;
  verified?: boolean;
}

export interface Tweet {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  liked?: boolean;
  retweeted?: boolean;
  images?: string[];
  imageFiles?: File[];
}