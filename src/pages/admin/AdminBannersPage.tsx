import { GalleryHorizontalEnd } from 'lucide-react';
import { BannerManager } from '../../components/admin/BannerManager';

export function AdminBannersPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <GalleryHorizontalEnd className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Banner Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage all homepage banners with scheduling, preview, and CTA options</p>
        </div>
      </div>
      <div className="mt-8">
        <BannerManager />
      </div>
    </div>
  );
}
