import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { notificationsAPI } from '../services/api';

type Notification = {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'system';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const NotificationsPage: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('সব');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications();
      if (response.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'এখনই';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} মিনিট আগে`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ঘণ্টা আগে`;
    return `${Math.floor(diffInSeconds / 86400)} দিন আগে`;
  };

  const filteredNotifications = selectedType === 'সব' 
    ? notifications 
    : notifications.filter(n => {
        const typeMap: Record<string, string> = {
          'কমেন্ট': 'comment',
          'রিয়্যাকশন': 'like',
          'ফলো': 'follow',
          'সিস্টেম': 'system',
        };
        return n.type === typeMap[selectedType];
      });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeLabel: Record<Notification['type'], string> = {
    like: "রিয়্যাকশন",
    comment: "কমেন্ট",
    follow: "ফলো",
    system: "সিস্টেম",
  };

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
            <button 
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              সব মার্ক করুন পড়া হয়েছে
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {["সব", "কমেন্ট", "রিয়্যাকশন", "ফলো", "সিস্টেম"].map((chip) => (
            <button
              key={chip}
              onClick={() => setSelectedType(chip)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedType === chip
                  ? "bg-green-600 text-white border-green-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:border-green-200 hover:text-green-700"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">লোড হচ্ছে...</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => !item.read && handleMarkAsRead(item._id)}
                  className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !item.read ? "bg-green-50/40" : ""
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
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 whitespace-nowrap">{formatTime(item.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                কোন বিজ্ঞপ্তি নেই
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
