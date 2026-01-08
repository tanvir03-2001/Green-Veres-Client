import React from 'react';
import LeftSidebar from './LeftSidebar';
import Feed from './Feed';
import RightSidebar from './RightSidebar';

const MainLayout: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-50 overflow-hidden flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 h-14 flex-shrink-0 z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h1 className="text-xl font-bold text-green-600">GreenVerse</h1>
            </div>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 flex-1 max-w-md">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="GreenVerse এ খুঁজুন"
                className="bg-transparent flex-1 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-green-600 transition-colors">
              মি
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - 100vh minus header */}
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;
