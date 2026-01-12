import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import { reelsAPI } from '../services/api';

type Reel = {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  category?: string;
  likes: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
};

const ReelsPage: FC = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Fetch reels
  useEffect(() => {
    fetchReels();
  }, [selectedCategory]);

  const fetchReels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reelsAPI.getReels(selectedCategory);
      if (response.success && response.data.reels) {
        setReels(response.data.reels);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load reels');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleCreateReel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    try {
      setIsUploading(true);
      const files: File[] = [videoFile];
      if (thumbnailFile) {
        files.push(thumbnailFile);
      }

      const response = await reelsAPI.createReel({
        title: title.trim(),
        description: description.trim(),
        category: category !== 'All' ? category : 'Other',
        files,
      });

      if (response.success) {
        alert('Reel created successfully!');
        // Reset form
        setTitle('');
        setDescription('');
        setCategory('Other');
        setVideoFile(null);
        setThumbnailFile(null);
        setIsCreateModalOpen(false);
        
        // Refresh reels list
        fetchReels();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create reel');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleWatchReel = async (reel: Reel) => {
    setSelectedReel(reel);
    setIsWatchModalOpen(true);
    
    // Increment view count
    try {
      await reelsAPI.getReelById(reel._id);
    } catch (err) {
      console.error('Failed to increment view count:', err);
    }
  };

  const handleCloseWatchModal = () => {
    setIsWatchModalOpen(false);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    setTimeout(() => setSelectedReel(null), 300);
  };

  const handleLikeReel = async (reelId: string) => {
    try {
      const response = await reelsAPI.likeReel(reelId);
      if (response.success) {
        // Update the reel in the list
        setReels(prevReels => 
          prevReels.map(r => 
            r._id === reelId 
              ? { ...r, likes: response.data.likes } 
              : r
          )
        );
        // Update selected reel if watching
        if (selectedReel?._id === reelId) {
          setSelectedReel(prev => prev ? { ...prev, likes: response.data.likes } : null);
        }
      }
    } catch (err: any) {
      console.error('Failed to like reel:', err);
    }
  };
  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 to-green-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                GreenVerse Reels
              </h1>
            </div>
            
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Tutorials", "Tips", "Transformation", "New"].map((chip) => (
            <button
              key={chip}
              onClick={() => handleCategoryChange(chip)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === chip
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:shadow-md"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Reels Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 text-sm">Loading reels...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
              <div className="flex items-center gap-2 text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-medium text-sm">{error}</p>
              </div>
            </div>
          </div>
        ) : reels.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center max-w-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No reels yet</h3>
              <p className="text-gray-600 text-sm mb-4">Be the first to share your gardening journey!</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Reel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {reel.thumbnail ? (
                    <img 
                      src={reel.thumbnail} 
                      alt={reel.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                      <svg className="w-20 h-20 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                  )}
                  {reel.duration && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                      {reel.duration}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => handleWatchReel(reel)}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                        <svg className="w-8 h-8 text-green-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {reel.author.avatar || getAuthorInitials(reel.author.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{reel.author.name}</p>
                      <p className="text-xs text-gray-500">{formatViews(reel.views)} views</p>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{reel.title}</h3>
                  <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{reel.likes.length}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => handleWatchReel(reel)}
                      className="px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200"
                    >
                      Watch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Reel Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Create New Reel</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setTitle('');
                      setDescription('');
                      setCategory('Other');
                      setVideoFile(null);
                      setThumbnailFile(null);
                    }}
                    className="text-white hover:bg-white/20 transition-all p-2 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                <form onSubmit={handleCreateReel} className="p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your reel an awesome title..."
                      maxLength={200}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell viewers what your reel is about..."
                      rows={3}
                      maxLength={1000}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                    >
                      <option value="Other">Other</option>
                      <option value="Tutorials">Tutorials</option>
                      <option value="Tips">Tips</option>
                      <option value="Transformation">Transformation</option>
                      <option value="New">New</option>
                    </select>
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Video <span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center group"
                    >
                      {videoFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-green-600">{videoFile.name}</p>
                            <p className="text-xs text-gray-500 mt-1">Click to change video</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="font-semibold text-gray-700 mb-1">Click to upload video</p>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thumbnail <span className="text-xs text-gray-500 font-normal">(Optional - Auto-generated if not provided)</span>
                    </label>
                    <input
                      ref={thumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center group"
                    >
                      {thumbnailFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-blue-600 text-sm">{thumbnailFile.name}</p>
                            <p className="text-xs text-gray-500">Click to change</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <p className="font-medium text-gray-700 text-sm">Upload custom thumbnail</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG (or auto-generate)</p>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setTitle('');
                        setDescription('');
                        setCategory('Other');
                        setVideoFile(null);
                        setThumbnailFile(null);
                      }}
                      className="flex-1 px-6 py-3 text-sm font-semibold rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || !title.trim() || !videoFile}
                      className="flex-1 px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Create Reel
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Watch Reel Modal */}
        {isWatchModalOpen && selectedReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="bg-black rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={handleCloseWatchModal}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Player */}
              <div className="bg-black">
                <video
                  ref={videoPlayerRef}
                  src={selectedReel.videoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Reel Info */}
              <div className="bg-gray-900 p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {selectedReel.author.avatar || getAuthorInitials(selectedReel.author.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{selectedReel.author.name}</p>
                        <p className="text-xs text-gray-400">{formatViews(selectedReel.views)} views</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{selectedReel.title}</h3>
                    {selectedReel.description && (
                      <p className="text-sm text-gray-300">{selectedReel.description}</p>
                    )}
                    {selectedReel.category && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-green-600 rounded-full">
                        {selectedReel.category}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleLikeReel(selectedReel._id)}
                      className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-5.834a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5v5.834a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5V8.667a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5v7.666a1.5 1.5 0 01-3 0V10.5a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5v5.834a1.5 1.5 0 01-3 0v-5.834a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5z" />
                      </svg>
                      <span className="text-xs">{selectedReel.likes.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReelsPage;
