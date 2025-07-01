import { User, Tweet } from '../types';

export const currentUser: User = {
  id: '1',
  username: 'carlos_ec',
  displayName: 'CarlosEC',
  avatar: 'https://scontent.fgye6-1.fna.fbcdn.net/v/t39.30808-1/500274830_122129503712702005_496116845774339751_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=106&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=q9It6UzGWjEQ7kNvwFITARL&_nc_oc=Adm1BoRHxDFxQdwwS1k5-6SZIWtWTOnqwEgJYKrYKYy6inic9-G9lGRJ5Vl5UjsrPL0&_nc_zt=24&_nc_ht=scontent.fgye6-1.fna&_nc_gid=-kUIO_YGHBAXSipcamoQ4g&oh=00_AfOId_mZ0KuBSMDc9yut7PT--cHj51L5QEi44nGcWFkzrw&oe=686A0846',
  bio: 'Full-stack developer | Coffee enthusiast | Tech blogger',
  followers: 1234,
  following: 567,
  verified: true
};

export const users: User[] = [
  currentUser,
  {
    id: '2',
    username: 'sarah_tech',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'UX Designer | Creating beautiful digital experiences',
    followers: 2345,
    following: 890,
    verified: true
  },
  {
    id: '3',
    username: 'mike_dev',
    displayName: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'React Developer | Open Source Contributor',
    followers: 987,
    following: 234
  },
  {
    id: '4',
    username: 'emma_design',
    displayName: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Product Designer | Startup enthusiast',
    followers: 3456,
    following: 1234
  }
];

export const tweets: Tweet[] = [
  {
    id: '1',
    user: users[1],
    content: 'Just finished redesigning our mobile app! The new user flow is 40% more intuitive. Excited to see how users respond to the changes. 🎨✨',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    likes: 45,
    retweets: 12,
    replies: 8,
    liked: false,
    retweeted: false
  },
  {
    id: '2',
    user: users[2],
    content: 'Hot take: The best way to learn a new framework is to build something you actually want to use. Just spent the weekend building a habit tracker with Next.js 14. The learning curve is steep but so worth it! 🚀',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 123,
    retweets: 34,
    replies: 27,
    liked: true,
    retweeted: false
  },
  {
    id: '3',
    user: users[3],
    content: 'Working on a new design system for our company. Color theory is fascinating - did you know that blue increases productivity by 15%? 🔵',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 67,
    retweets: 19,
    replies: 15,
    liked: false,
    retweeted: true,
    images: ['https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2']
  },
  {
    id: '4',
    user: users[0],
    content: 'Coffee shops are the unsung heroes of remote work. Found this amazing place with the perfect coding playlist and lightning-fast WiFi. Productivity level: 📈',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 89,
    retweets: 23,
    replies: 12,
    liked: true,
    retweeted: false
  },
  {
    id: '5',
    user: users[1],
    content: 'Reminder: Your users don\'t care about your tech stack. They care about how fast your app loads and how easy it is to use. Keep it simple, keep it fast. 💡',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 234,
    retweets: 67,
    replies: 45,
    liked: false,
    retweeted: false
  }
];

export const trendingTopics = [
  { tag: '#ReactJS', tweets: '45.2K' },
  { tag: '#WebDevelopment', tweets: '28.7K' },
  { tag: '#UIDesign', tweets: '19.3K' },
  { tag: '#JavaScript', tweets: '67.8K' },
  { tag: '#TechNews', tweets: '34.1K' }
];

export const suggestedUsers = users.slice(1, 4);