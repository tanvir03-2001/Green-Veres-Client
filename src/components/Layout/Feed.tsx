import React from 'react';

interface PostProps {
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const Post: React.FC<PostProps> = ({ author, avatar, time, content, image, likes, comments, shares }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {avatar}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-2">
          টমেটো
        </div>
        <h3 className="font-bold text-gray-900 mb-2 text-lg">{content.split('।')[0]}</h3>
        <p className="text-gray-800">{content}</p>
      </div>

      {/* Post Image */}
      {image && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <img src={image} alt="Post" className="w-full h-auto" />
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{likes}</span>
          </div>
          <span>{comments} মন্তব্য</span>
          <span>{shares} শেয়ার</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-around">
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium">লাইক</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">মন্তব্য</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="font-medium">শেয়ার</span>
        </button>
      </div>
    </div>
  );
};

const Feed: React.FC = () => {
  const posts: PostProps[] = [
    {
      author: 'রহিমা খাতুন',
      avatar: 'র',
      time: '২ ঘণ্টা আগে',
      content: 'আজকের টমেটো সংগ্রহ! জৈব পদ্ধতিতে চাষ করেছি। ফলন খুব ভালো হয়েছে। #জৈবচাষ #টমেটো #ছাদবাগান',
      image: 'https://images.unsplash.com/photo-1546094097-2c0c1e1c5a5c?w=800',
      likes: 234,
      comments: 28,
      shares: 12
    },
    {
      author: 'কামাল হোসেন',
      avatar: 'ক',
      time: '৫ ঘণ্টা আগে',
      content: 'টিপস: সকালবেলা গাছে পানি দিন। এতে পানি বাষ্পীভবন কম হয় এবং ছত্রাক রোগ থেকে রক্ষা পায়।',
      likes: 156,
      comments: 15,
      shares: 8
    },
    {
      author: 'মিজান রহমান',
      avatar: 'মি',
      time: '১ দিন আগে',
      content: 'আমার নতুন হার্ব গার্ডেন সেটআপ দেখুন! রান্নাঘরের জানালায় বেসিল, পুদিনা এবং ধনিয়া চাষ করছি।',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      likes: 89,
      comments: 12,
      shares: 5
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
              মি
            </div>
            <input
              type="text"
              placeholder="আপনার মনে কি চলছে?"
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-200">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">ছবি</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span className="font-medium">ভিডিও</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">ইভেন্ট</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {['All', 'Vegetables', 'Flowers', 'Indoor', 'Herbs', 'Succulents'].map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-green-600 text-white'
                  : index === 1
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts */}
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
