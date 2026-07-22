import { useState } from 'react';
import { Home, Image, BarChart3, Layout } from 'lucide-react';
import { BannerManager } from '../../components/admin/BannerManager';
import { SettingsManager } from '../../components/admin/SettingsManager';

type Tab = 'banners' | 'featured' | 'settings';

const tabs = [
  { id: 'banners' as Tab, label: 'Hero Banner Carousel', icon: Layout, description: 'Manage homepage banner slides' },
  { id: 'featured' as Tab, label: 'Featured Photo & Video', icon: Image, description: 'Manage featured content' },
  { id: 'settings' as Tab, label: 'Statistics & Info', icon: BarChart3, description: 'Manage stats, contact info & next hike' },
];

export function AdminHomepageManagerPage() {
  const [activeTab, setActiveTab] = useState<Tab>('banners');

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homepage Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage all homepage content, banners, featured sections, and statistics</p>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-3 mt-8 mb-8 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {activeTab === 'banners' && <BannerManager />}
        {activeTab === 'featured' && <SettingsManager initialSection="featured" />}
        {activeTab === 'settings' && <SettingsManager initialSection="settings" />}
      </div>
    </div>
  );
}
