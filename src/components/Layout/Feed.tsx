import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface PostProps {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  content: string;
  images?: string[];
  videos?: string[];
  category?: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    text: string;
    createdAt: string;
  }>;
  isLiked?: boolean;
  onLike: (id: string) => void;
}

const Post: FC<PostProps> = ({ _id, author, createdAt, content, images, videos, category, likes, comments, isLiked, onLike }) => {
  const formatTime = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'এখনই';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘণ্টা আগে`;
    return `${Math.floor(diffInSeconds / 86400)} দিন আগে`;
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(author.name)
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{author.name}</h4>
          <p className="text-xs text-gray-500">{formatTime(createdAt)}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        {category && category !== 'All' && (
          <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-2">
            {category}
          </div>
        )}
        <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
      </div>

      {/* Post Images */}
      {images && images.length > 0 && (
        <div className="mb-3 rounded-lg overflow-hidden">
          {images.length === 1 ? (
            <img src={images[0]} alt="Post" className="w-full h-auto" />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.slice(0, 4).map((img, idx) => (
                <img key={idx} src={img} alt={`Post ${idx + 1}`} className="w-full h-48 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Videos */}
      {videos && videos.length > 0 && (
        <div className="mb-3 rounded-lg overflow-hidden">
          {videos.length === 1 ? (
            <video src={videos[0]} controls className="w-full h-auto max-h-96" />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {videos.slice(0, 4).map((video, idx) => (
                <video key={idx} src={video} controls className="w-full h-48 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <svg className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} fill={isLiked ? 'currentColor' : 'none'} viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{likes.length}</span>
          </div>
          <span>{comments.length} মন্তব্য</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-around">
        <button 
          onClick={() => onLike(_id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
        >
          <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
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
      </div>
    </div>
  );
};

const Feed: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('All');
  const [creatingPost, setCreatingPost] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts(selectedCategory);
      if (response.success) {
        const postsWithLikes = response.data.posts.map((post: any) => ({
          ...post,
          isLiked: user ? post.likes.some((likeId: string) => likeId.toString() === user.id) : false,
        }));
        setPosts(postsWithLikes);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const invalidFiles: string[] = [];
    
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      
      if (!isValidType) {
        invalidFiles.push(`${file.name}: শুধুমাত্র ছবি এবং ভিডিও আপলোড করা যাবে`);
        return false;
      }
      
      // Cloudinary free tier limits: Images 10MB, Videos 100MB
      const isImage = file.type.startsWith('image/');
      const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for images, 100MB for videos
      const isValidSize = file.size <= maxSize;
      
      if (!isValidSize) {
        const maxSizeMB = isImage ? 10 : 100;
        const fileSizeMB = formatFileSize(file.size);
        invalidFiles.push(`${file.name}: ${isImage ? 'ছবি' : 'ভিডিও'} ${maxSizeMB}MB পর্যন্ত আপলোড করা যাবে (ফাইল সাইজ: ${fileSizeMB})`);
        return false;
      }
      
      return true;
    });

    if (invalidFiles.length > 0) {
      alert(invalidFiles.join('\n\n'));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 files
      
      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, reader.result as string]);
        };
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;

    try {
      setCreatingPost(true);
      const response = await postsAPI.createPost({
        content: postContent,
        category: postCategory !== 'All' ? postCategory : undefined,
        files: selectedFiles,
      });

      if (response.success) {
        setPostContent('');
        setPostCategory('All');
        setSelectedFiles([]);
        setFilePreviews([]);
        loadPosts();
      }
    } catch (error: any) {
      alert(error.message || 'পোস্ট তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setCreatingPost(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await postsAPI.likePost(postId);
      if (response.success) {
        loadPosts();
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex-1 h-full overflow-y-auto bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">লগইন করুন পোস্ট দেখতে</p>
          <a href="/login" className="text-green-600 hover:text-green-700 font-semibold">
            লগইন করুন
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="আপনার মনে কি চলছে?"
                className="w-full bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500 resize-none"
                rows={3}
              />
              
              {/* File Previews */}
              {filePreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      {selectedFiles[index]?.type.startsWith('image/') ? (
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <video 
                          src={preview} 
                          className="w-full h-32 object-cover rounded-lg"
                          controls={false}
                        />
                      )}
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer group">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">ছবি/ভিডিও</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-0.5">ছবি: ১০MB, ভিডিও: ১০০MB</span>
                    </div>
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="All">All</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Succulents">Succulents</option>
                  </select>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={(!postContent.trim() && selectedFiles.length === 0) || creatingPost}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingPost ? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {['All', 'Vegetables', 'Flowers', 'Indoor', 'Herbs', 'Succulents'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">লোড হচ্ছে...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">কোন পোস্ট নেই</div>
        ) : (
          posts.map((post) => (
            <Post key={post._id} {...post} onLike={handleLike} />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
