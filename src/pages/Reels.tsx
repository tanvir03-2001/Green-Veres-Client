import React from 'react';

type Reel = {
  id: number;
  author: string;
  authorAvatar: string;
  title: string;
  views: string;
  likes: string;
  thumbnail: string;
  duration: string;
};

const reels: Reel[] = [
  {
    id: 1,
    author: "রহিম উদ্দিন",
    authorAvatar: "র",
    title: "৩০ সেকেন্ডে কিচেন গার্ডেন সেটআপ",
    views: "১২.৫কে",
    likes: "১.২কে",
    thumbnail: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    duration: "০:৩০",
  },
  {
    id: 2,
    author: "ফাতেমা খাতুন",
    authorAvatar: "ফ",
    title: "টমেটো গাছের যত্ন - প্রো টিপস",
    views: "৮.৯কে",
    likes: "৯৫০",
    thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    duration: "০:৪৫",
  },
  {
    id: 3,
    author: "আনিসুর রহমান",
    authorAvatar: "আ",
    title: "ব্যালকনি গার্ডেন ট্রান্সফরমেশন",
    views: "১৫.৩কে",
    likes: "২.১কে",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
    duration: "১:১৫",
  },
  {
    id: 4,
    author: "নাজমা বেগম",
    authorAvatar: "ন",
    title: "জৈব সার তৈরি করার সহজ উপায়",
    views: "৬.৭কে",
    likes: "৭৮০",
    thumbnail: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    duration: "০:৫০",
  },
];

const ReelsPage: React.FC = () => {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">GreenVerse Reels</p>
            <h1 className="text-2xl font-bold text-gray-900">শর্ট ভিডিও - বাগান শেখার নতুন উপায়</h1>
            <p className="text-sm text-gray-600">
              কুইক টিপস, টিউটোরিয়াল আর ইনস্পিরেশন – সবকিছু ছোট ছোট ভিডিওতে।
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">মোট রিল</p>
              <p className="text-lg font-bold text-green-800">২৫০+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">দৈনিক ভিউ</p>
              <p className="text-lg font-bold text-green-800">৫০কে+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">ক্রিয়েটর</p>
              <p className="text-lg font-bold text-green-800">৪০+</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["সব", "টিউটোরিয়াল", "টিপস", "ট্রান্সফরমেশন", "নতুন"].map((chip, idx) => (
            <button
              key={chip}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                idx === 0
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-green-200 hover:text-green-700"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded">
                  {reel.duration}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                  <button className="opacity-0 hover:opacity-100 transition-opacity">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {reel.authorAvatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{reel.author}</p>
                      <p className="text-[11px] text-gray-500">{reel.views} ভিউ</p>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{reel.title}</h3>
                <div className="flex items-center justify-between pt-1 mt-auto">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-5.834a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5v5.834a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5V8.667a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5v7.666a1.5 1.5 0 01-3 0V10.5a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5v5.834a1.5 1.5 0 01-3 0v-5.834a1.5 1.5 0 00-1.5-1.5h-1a1.5 1.5 0 00-1.5 1.5z" />
                      </svg>
                      {reel.likes}
                    </span>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                    দেখুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">আপনার রিল শেয়ার করুন</p>
            <h2 className="text-xl font-bold text-gray-900">নিজের বাগানের ভিডিও আপলোড করুন</h2>
            <p className="text-sm text-gray-600">
              আপনার গার্ডেনিং টিপস, ট্রান্সফরমেশন বা যেকোনো ইনস্পিরেশন – সবকিছু শেয়ার করুন কমিউনিটির সাথে।
            </p>
          </div>
          <button className="px-5 py-2.5 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
            নতুন রিল তৈরি করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;
