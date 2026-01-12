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
      alert('Profile updated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account, notifications, and language settings here.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Account Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Account Settings</h2>
              <p className="text-xs text-gray-500">Update your name, profile, and email.</p>
            </div>
            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                rows={3}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div className="grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Notification Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-500">Choose what types of notifications you want to receive.</p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600" />
              <div>
                <p className="font-medium">Posts, Comments, and Reactions</p>
                <p className="text-xs text-gray-500">Notify me when there's new activity on my content.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600" />
              <div>
                <p className="font-medium">Group Updates</p>
                <p className="text-xs text-gray-500">Important updates from groups you're in.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600" />
              <div>
                <p className="font-medium">Promotional Notifications</p>
                <p className="text-xs text-gray-500">Offers, new features, and suggestions.</p>
              </div>
            </label>
          </div>
        </section>

        {/* Language Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Language</h2>
              <p className="text-xs text-gray-500">Choose the language you want to use GreenVerse in.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <button className="px-4 py-2 rounded-full bg-green-600 text-white font-semibold text-xs">
              English (Default)
            </button>
            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-xs hover:border-green-200 hover:text-green-700">
              বাংলা
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
