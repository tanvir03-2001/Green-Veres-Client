import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { groupsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type Group = {
  _id?: string;
  name: string;
  members: string[] | string;
  privacy: 'public' | 'private';
  description: string;
  cover?: string;
  category?: string;
  isMember?: boolean;
  badge?: string;
};

const GroupPage: FC = () => {
  const { isAuthenticated } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await groupsAPI.getGroups();
      if (response.success) {
        setGroups(response.data.groups || []);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!isAuthenticated) {
      alert('গ্রুপে যোগ দিতে লগইন করুন');
      return;
    }

    try {
      const response = await groupsAPI.joinGroup(groupId);
      if (response.success) {
        loadGroups();
      }
    } catch (error: any) {
      alert(error.message || 'গ্রুপে যোগ দিতে সমস্যা হয়েছে');
    }
  };

  const staticGroups: Group[] = [
  {
    name: "ঢাকা আরবান গার্ডেনারস",
    members: "১২.৪কে সদস্য",
    privacy: "public",
    badge: "সক্রিয়",
    description: "ব্যালকনি আর ছাদবাগানের জন্য টিপস, প্রশ্ন আর অভিজ্ঞতা শেয়ার করুন।",
    cover: "https://images.unsplash.com/photo-1454311073588-182526194ad3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "বনসাই প্রেমী বাংলাদেশ",
    members: "৫.৮কে সদস্য",
    privacy: "private",
    badge: "বিশেষজ্ঞ",
    description: "বনসাই নিয়ে সিরিয়াস যারা, তাদের জন্য ডেডিকেটেড কমিউনিটি।",
    cover: "https://images.unsplash.com/photo-1518895949257-7621c3c786d4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "গ্রামবাংলার ফুলবাগান",
    members: "৩.২কে সদস্য",
    privacy: "public",
    description: "গ্রামের ফুলবাগান, মৌসুমি ফুল আর বীজ বিনিময়ের প্ল্যাটফর্ম।",
    cover: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "কিচেন গার্ডেন হেল্পলাইন",
    members: "৮.৭কে সদস্য",
    privacy: "public",
    badge: "হেল্পলাইন",
    description: "সবজি, মসলা আর হার্বস – কিচেন গার্ডেন সম্পর্কিত সব প্রশ্নের জায়গা।",
    cover: "https://images.unsplash.com/photo-1483794344563-d27a8d18014e?auto=format&fit=crop&w=1200&q=80",
  },
];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">GreenVerse Groups</p>
            <h1 className="text-2xl font-bold text-gray-900">যাদের সাথে বাগান নিয়ে কথা বলা যায়</h1>
            <p className="text-sm text-gray-600">
              আপনার মত বাগানপ্রেমীদের কমিউনিটি, যেখানে প্রতিদিন চলবে অভিজ্ঞতা আর আইডিয়া বিনিময়।
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-600">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">সক্রিয় গ্রুপ</p>
              <p className="text-lg font-bold text-green-800">২০+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">দৈনিক পোস্ট</p>
              <p className="text-lg font-bold text-green-800">৩০০+</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["সব গ্রুপ", "আপনার শহর", "নতুন", "আপনি জয়েন করেছেন"].map((chip, idx) => (
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

        {loading ? (
          <div className="text-center py-8 text-gray-500">লোড হচ্ছে...</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {groups.length > 0 ? (
              groups.map((group) => (
                <div
                  key={group._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-32 bg-gray-100 overflow-hidden">
                    <img 
                      src={group.cover || 'https://images.unsplash.com/photo-1454311073588-182526194ad3?w=1200'} 
                      alt={group.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{group.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">
                          {Array.isArray(group.members) ? group.members.length : group.members} সদস্য · {group.privacy === "public" ? "পাবলিক গ্রুপ" : "প্রাইভেট গ্রুপ"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-6 flex-1">{group.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        {Array.isArray(group.members) ? (
                          group.members.slice(0, 3).map((member: any, idx: number) => (
                            <div key={idx} className="w-7 h-7 rounded-full bg-green-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">
                              {typeof member === 'object' && member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">মি</div>
                            <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">আ</div>
                            <div className="w-7 h-7 rounded-full bg-lime-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">র</div>
                          </>
                        )}
                      </div>
                      <button 
                        onClick={() => group._id && handleJoinGroup(group._id)}
                        disabled={group.isMember}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                          group.isMember 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {group.isMember ? 'যোগ দেওয়া হয়েছে' : 'গ্রুপে যোগ দিন'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              staticGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="h-32 bg-gray-100 overflow-hidden">
                    <img src={group.cover} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{group.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">
                          {typeof group.members === 'string' ? group.members : group.members.length} · {group.privacy === "public" ? "পাবলিক গ্রুপ" : "প্রাইভেট গ্রুপ"}
                        </p>
                        {group.badge && (
                          <span className="px-3 py-1 text-[11px] font-semibold bg-green-50 text-green-700 rounded-full">
                            {group.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-6 flex-1">{group.description}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">
                          মি
                        </div>
                        <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">
                          আ
                        </div>
                        <div className="w-7 h-7 rounded-full bg-lime-500 border-2 border-white text-[11px] flex items-center justify-center text-white font-semibold">
                          র
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                        গ্রুপে যোগ দিন
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">আপনার নিজের কমিউনিটি</p>
            <h2 className="text-xl font-bold text-gray-900">নতুন গ্রুপ তৈরি করুন</h2>
            <p className="text-sm text-gray-600">
              আপনার এলাকার গার্ডেনারদের জন্য, স্কুল প্রোজেক্টের জন্য বা যেকোনো বিশেষ আগ্রহের জন্য আলাদা গ্রুপ বানাতে পারেন।
            </p>
          </div>
          <button className="px-5 py-2.5 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
            গ্রুপ ক্রিয়েট করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;

