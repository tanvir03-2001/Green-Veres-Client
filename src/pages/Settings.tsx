import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    avatar: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateUser(formData);
      alert('প্রোফাইল আপডেট হয়েছে');
    } catch (error: any) {
      alert(error.message || 'আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">সেটিংস</h1>
          <p className="text-sm text-gray-600 mt-1">
            আপনার একাউন্ট, নোটিফিকেশন আর ভাষা সংক্রান্ত সেটিংস এখানে ম্যানেজ করতে পারবেন।
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Account Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">একাউন্ট সেটিংস</h2>
              <p className="text-xs text-gray-500">নাম, প্রোফাইল আর ইমেইল আপডেট করুন।</p>
            </div>
            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">নাম</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">বায়ো</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">লোকেশন</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">ইমেইল</p>
                <p className="font-medium">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ফোন</p>
                <p className="font-medium">{user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">নোটিফিকেশন</h2>
              <p className="text-xs text-gray-500">কোন ধরনের নোটিফিকেশন আপনি পেতে চান ঠিক করুন।</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600" />
              <div>
                <p className="font-medium">পোস্ট, কমেন্ট এবং রিয়্যাকশন</p>
                <p className="text-xs text-gray-500">আপনার কনটেন্টে নতুন এক্টিভিটি হলে জানান।</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600" />
              <div>
                <p className="font-medium">গ্রুপ আপডেট</p>
                <p className="text-xs text-gray-500">আপনি যে গ্রুপগুলোতে আছেন সেগুলোর গুরুত্বপূর্ণ আপডেট।</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600" />
              <div>
                <p className="font-medium">প্রমোশনাল নোটিফিকেশন</p>
                <p className="text-xs text-gray-500">অফার, নতুন ফিচার আর সাজেশন।</p>
              </div>
            </label>
          </div>
        </section>

        {/* Language Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">ভাষা</h2>
              <p className="text-xs text-gray-500">GreenVerse কোন ভাষায় ব্যবহার করতে চান সেট করুন।</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold text-xs">
              বাংলা (ডিফল্ট)
            </button>
            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-xs hover:border-green-200 hover:text-green-700">
              English
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
