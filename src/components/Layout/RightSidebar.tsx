import type { FC } from 'react';

const RightSidebar: FC = () => {
  return (
    <aside className="w-80 h-full bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-4">
        {/* Sponsored Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Sponsored</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-32 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Garden Tools Sale</h4>
                <p className="text-xs text-gray-500">gardenstore.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-32 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">Organic Seeds</h4>
                <p className="text-xs text-gray-500">organicseeds.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Birthdays Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Birthdays</h3>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Sarah Johnson</span> and <span className="font-semibold">2 others</span> have birthdays today.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Contacts Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Contacts</h3>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Alex Brown', status: 'online' },
              { name: 'Emma Wilson', status: 'online' },
              { name: 'David Lee', status: 'away' },
              { name: 'Lisa Chen', status: 'online' },
              { name: 'Tom Anderson', status: 'away' },
              { name: 'Maria Garcia', status: 'online' },
            ].map((contact, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    contact.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                </div>
                <span className="text-sm text-gray-700 font-medium">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Group Conversations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Group Conversations</h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Create
            </button>
          </div>
          <div className="space-y-2">
            {[
              'Garden Enthusiasts',
              'Organic Farmers',
              'Plant Care Tips',
            ].map((group, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {group[0]}
                </div>
                <span className="text-sm text-gray-700 font-medium">{group}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
