import React from 'react';

type Notification = {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'system';
  title: string;
  description: string;
  time: string;
  unread?: boolean;
};

const notifications: Notification[] = [
  {
    id: 1,
    type: 'comment',
    title: "আপনার পোস্টে নতুন কমেন্ট",
    description: '"আপনার টমেটো গাছটা দারুণ হয়েছে! বীজ কোনটা ব্যবহার করেছেন?"',
    time: "২ মিনিট আগে",
    unread: true,
  },
  {
    id: 2,
    type: 'like',
    title: "৩ জন আপনার পোস্টে রিয়্যাক্ট করেছে",
    description: '"আজকের হার্ব গার্ডেন আপডেট" পোস্টে নতুন রিয়্যাকশন এসেছে।',
    time: "১৫ মিনিট আগে",
    unread: true,
  },
  {
    id: 3,
    type: 'follow',
    title: "নতুন ফলোয়ার",
    description: "নাদিয়া ইসলাম এখন থেকে আপনাকে ফলো করছে।",
    time: "১ ঘন্টা আগে",
  },
  {
    id: 4,
    type: 'system',
    title: "রিমাইন্ডার: গাছগুলোতে পানি দিন",
    description: "আপনার ৪টি গাছ গত ২ দিন ধরে পানি পায়নি। আজকে একবার দেখে নিন।",
    time: "গতকাল",
  },
];

const typeLabel: Record<Notification['type'], string> = {
  like: "রিয়্যাকশন",
  comment: "কমেন্ট",
  follow: "ফলো",
  system: "সিস্টেম",
};

const NotificationsPage: React.FC = () => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Notifications</p>
            <h1 className="text-2xl font-bold text-gray-900">বিজ্ঞপ্তি কেন্দ্র</h1>
            <p className="text-sm text-gray-600">
              আপনার পোস্ট, গ্রুপ আর বাগান সম্পর্কিত সব আপডেট এক জায়গায়।
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="bg-green-50 px-4 py-3 rounded-lg text-center">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">অপঠিত</p>
              <p className="text-lg font-bold text-green-800">{unreadCount}</p>
            </div>
            <button className="px-4 py-2 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
              সব মার্ক করুন পড়া হয়েছে
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {["সব", "কমেন্ট", "রিয়্যাকশন", "ফলো", "সিস্টেম"].map((chip, idx) => (
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

        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                item.unread ? "bg-green-50/40" : ""
              }`}
            >
              <div className="mt-1">
                {item.type === "comment" && (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                    💬
                  </span>
                )}
                {item.type === "like" && (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-pink-600 text-xs font-semibold">
                    ❤
                  </span>
                )}
                {item.type === "follow" && (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold">
                    👤
                  </span>
                )}
                {item.type === "system" && (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-xs font-semibold">
                    ⚙
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-gray-900">{item.title}</h2>
                    <span className="px-2 py-0.5 text-[11px] rounded-full bg-gray-100 text-gray-700">
                      {typeLabel[item.type]}
                    </span>
                    {item.unread && (
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">{item.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <button className="hover:text-green-700 font-semibold">ডিটেইলস দেখুন</button>
                  <button className="hover:text-gray-800">আজকের জন্য সাইলেন্ট করুন</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
