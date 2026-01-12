import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

type Plant = {
  name: string;
  type: string;
  status: 'healthy' | 'needs_water' | 'needs_sun' | 'new';
  lastWatered: string;
  location: string;
};

const MyGardenPage: FC = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGarden();
  }, [user]);

  const loadGarden = async () => {
    try {
      setLoading(true);
      if (user) {
        const response = await authAPI.getProfile();
        if (response.success && response.data.user.garden?.plants) {
          const gardenPlants = response.data.user.garden.plants.map((plant: any) => ({
            name: plant.name,
            type: plant.type,
            status: plant.status,
            lastWatered: plant.lastWatered ? new Date(plant.lastWatered).toLocaleDateString('en-US') : 'Never',
            location: plant.location,
          }));
          setPlants(gardenPlants);
        }
      }
    } catch (error) {
      console.error('Failed to load garden:', error);
    } finally {
      setLoading(false);
    }
  };

  const staticPlants: Plant[] = [];

const statusLabel: Record<Plant['status'], string> = {
  healthy: "Healthy",
  needs_water: "Needs Water",
  needs_sun: "Needs Sun",
  new: "New Plant",
};

const statusColor: Record<Plant['status'], string> = {
  healthy: "bg-emerald-50 text-emerald-700",
  needs_water: "bg-sky-50 text-sky-700",
  needs_sun: "bg-amber-50 text-amber-700",
  new: "bg-violet-50 text-violet-700",
};

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">My Garden</p>
            <h1 className="text-2xl font-bold text-gray-900">My Garden Dashboard</h1>
            <p className="text-sm text-gray-600">
              Track where each plant is located, when you last watered them, and which ones need extra care – all in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">Total Plants</p>
              <p className="text-lg font-bold text-green-800">{plants.length}</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">Watered Today</p>
              <p className="text-lg font-bold text-green-800">0</p>
            </div>
            <div className="bg-green-50 px-4 py-3 rounded-lg">
              <p className="text-[11px] uppercase tracking-wide text-green-700 font-semibold">Alerts</p>
              <p className="text-lg font-bold text-amber-700">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {["All Plants", "Indoor", "Outdoor", "Vegetables", "Herbs"].map((chip, idx) => (
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
            {(plants.length > 0 ? plants : staticPlants).map((plant, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{plant.name}</h2>
                  <p className="text-xs text-gray-500 mt-1">{plant.type}</p>
                </div>
                <span
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full ${statusColor[plant.status]}`}
                >
                  {statusLabel[plant.status]}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <p>
                  <span className="font-semibold text-gray-800">Last Watered:</span> {plant.lastWatered}
                </p>
                <p className="hidden sm:block">
                  <span className="font-semibold text-gray-800">Location:</span> {plant.location}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <button className="px-4 py-1.5 text-xs font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                  Mark as Watered
                </button>
                <button className="text-xs font-semibold text-gray-600 hover:text-gray-800">
                  Update Details
                </button>
              </div>
            </div>
            ))}
          </div>
        )}

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Next Steps</p>
            <h2 className="text-xl font-bold text-gray-900">Save all your plants</h2>
            <p className="text-sm text-gray-600">
              Add new plants, set reminders, and upload photos – all features coming soon.
            </p>
          </div>
          <button className="px-5 py-2.5 text-sm font-semibold rounded-full bg-green-700 text-white hover:bg-green-800 transition-colors">
            Export Plant List
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyGardenPage;

