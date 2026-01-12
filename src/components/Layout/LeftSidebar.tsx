import { NavLink } from 'react-router-dom';
import type { FC } from 'react';

const LeftSidebar: FC = () => {
  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        {/* Navigation Links */}
        <nav className="space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="font-medium">Home</span>
          </NavLink>

          <NavLink
            to="/reels"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Reels</span>
          </NavLink>

          <NavLink
            to="/shop"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Shop</span>
          </NavLink>

          <NavLink
            to="/group"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Groups</span>
          </NavLink>

          <NavLink
            to="/library"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Library</span>
          </NavLink>

          <NavLink
            to="/my-garden"
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">My Garden</span>
          </NavLink>
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Quick Links */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">Quick Links</h3>
          <div className="space-y-2">
            <NavLink
              to="/notifications"
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="text-sm font-medium">Notifications</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </NavLink>
          </div>
        </div>

        {/* Switch Language */}
        <div className="mb-4">
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 001 1h3a1 1 0 110 2h-1.829a20.009 20.009 0 01.94 2.5 1 1 0 11-1.895.64c-.234-.7-.52-1.388-.857-2.05H13a1 1 0 110-2h1.17a19.93 19.93 0 01-.94-2.5H13a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Switch to English</span>
          </button>
        </div>
      </div>

      {/* User Profile - Fixed at Bottom */}
      <div className="border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3 py-2 px-6 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">User</p>
            <p className="text-xs text-gray-500">@username</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
