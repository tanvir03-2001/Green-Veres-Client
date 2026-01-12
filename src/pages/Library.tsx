import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { libraryAPI } from '../services/api';

type Resource = {
  _id?: string;
  title: string;
  type: 'article' | 'guide' | 'video';
  duration?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  content?: string;
  url?: string;
  badge?: string;
};

const LibraryPage: FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await libraryAPI.getResources();
      if (response.success) {
        setResources(response.data.resources || []);
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const staticResources: Resource[] = [];

const levelLabel: Record<Resource['level'], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const typeLabel: Record<Resource['type'], string> = {
  article: "Article",
  guide: "Guide",
  video: "Video",
};

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">GreenVerse Library</p>
            <h1 className="text-2xl font-bold text-gray-900">All gardening knowledge in one library</h1>
            <p className="text-sm text-gray-600">
              Articles, guides, and videos – resources to learn gardening from basic to advanced levels.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-xs text-gray-600">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">Total Resources</p>
              <p className="text-lg font-bold text-green-800">{resources.length}+</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">English Content</p>
              <p className="text-lg font-bold text-green-800">100%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Guides", "Articles", "Videos", "Beginner"].map((chip, idx) => (
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
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {(resources.length > 0 ? resources : staticResources).map((item) => (
              <div
                key={item._id || item.title}
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
                </div>
                <p className="text-sm text-gray-600 leading-6">{item.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <a 
                    href={item.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-green-700 hover:text-green-800"
                  >
                    Read Now
                  </a>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Save for Later
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Learn, Write, Share</p>
            <h2 className="text-xl font-bold text-gray-900">Add your own guide or article</h2>
            <p className="text-sm text-gray-600">
              Document your experiences, experiments, or tips about plants and add them to the library so others can learn too.
            </p>
          </div>
          <button className="px-5 py-2.5 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
            Submit New Resource
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;

