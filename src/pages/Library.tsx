import React from 'react';

type Resource = {
  title: string;
  type: 'article' | 'guide' | 'video';
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  badge?: string;
  description: string;
};

const resources: Resource[] = [
  {
    title: "শুরুর জন্য ইনডোর গার্ডেনিং গাইড",
    type: "guide",
    duration: "১৫ মিনিট রিড",
    level: "beginner",
    badge: "নতুন",
    description: "ছোট ঘরেও কীভাবে আলো, পানি আর মাটি ম্যানেজ করে সুন্দর ইনডোর গার্ডেন বানাবেন – ধাপে ধাপে গাইড।",
  },
  {
    title: "সবজি গাছের জন্য জৈব সারের রেসিপি",
    type: "article",
    duration: "১০ মিনিট রিড",
    level: "intermediate",
    description: "বাড়ির ফেলে দেওয়া জিনিস দিয়ে কিভাবে কম খরচে কার্যকরী জৈব সার তৈরি করবেন।",
  },
  {
    title: "ভিডিও: ৩০ মিনিটে টেরেস গার্ডেন প্ল্যান",
    type: "video",
    duration: "৩০ মিনিট ভিডিও",
    level: "beginner",
    badge: "ভিডিও",
    description: "ছাদে গার্ডেন করার আগে কোন কোন জিনিস প্ল্যান করতে হবে – একটি পূর্ণাঙ্গ ভিডিও ওভারভিউ।",
  },
  {
    title: "মাটি, পিএইচ আর ড্রেনেজ – ডিপ ডাইভ",
    type: "article",
    duration: "২০ মিনিট রিড",
    level: "advanced",
    description: "মাটির গঠন, পিএইচ ব্যালেন্স আর ড্রেনেজ কেন গাছের জন্য এত গুরুত্বপূর্ণ – সায়েন্স সহ ব্যাখ্যা।",
  },
];

const levelLabel: Record<Resource['level'], string> = {
  beginner: "শুরুর স্তর",
  intermediate: "মাঝারি স্তর",
  advanced: "অ্যাডভান্সড",
};

const typeLabel: Record<Resource['type'], string> = {
  article: "আর্টিকেল",
  guide: "গাইড",
  video: "ভিডিও",
};

const LibraryPage: React.FC = () => {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">GreenVerse Library</p>
            <h1 className="text-2xl font-bold text-gray-900">গাছের জ্ঞানের সবকিছু এক লাইব্রেরিতে</h1>
            <p className="text-sm text-gray-600">
              আর্টিকেল, গাইড আর ভিডিও – বেসিক থেকে অ্যাডভান্সড পর্যন্ত বাগান শেখার রিসোর্স।
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-600">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">মোট রিসোর্স</p>
              <p className="text-lg font-bold text-green-800">৪০+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">বাংলা কনটেন্ট</p>
              <p className="text-lg font-bold text-green-800">৯০%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["সব", "গাইড", "আর্টিকেল", "ভিডিও", "শুরুর স্তর"].map((chip, idx) => (
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

        <div className="grid gap-4 lg:grid-cols-2">
          {resources.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {typeLabel[item.type]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                      {levelLabel[item.level]}
                    </span>
                    {item.duration && <span>{item.duration}</span>}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">{item.title}</h2>
                </div>
                {item.badge && (
                  <span className="px-3 py-1 text-[11px] font-semibold bg-green-50 text-green-700 rounded-full whitespace-nowrap">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-6">{item.description}</p>
              <div className="flex items-center justify-between pt-1">
                <button className="text-sm font-semibold text-green-700 hover:text-green-800">
                  এখনই পড়ুন
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                  পরে রাখুন
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">শিখুন, লিখুন, শেয়ার করুন</p>
            <h2 className="text-xl font-bold text-gray-900">আপনার নিজস্ব গাইড বা আর্টিকেল যোগ করুন</h2>
            <p className="text-sm text-gray-600">
              গাছ নিয়ে আপনার অভিজ্ঞতা, এক্সপেরিমেন্ট বা টিপস – সবকিছু ডকুমেন্ট করে লাইব্রেরিতে যুক্ত করুন, অন্যরাও শিখুক।
            </p>
          </div>
          <button className="px-5 py-2.5 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
            নতুন রিসোর্স সাবমিট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;

