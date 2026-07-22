import { MapPin } from 'lucide-react';
import { SettingsManager } from '../../components/admin/SettingsManager';

export function AdminSettingsPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Organization contact info shown across the site. Logo, featured homepage content, and statistics are managed in Logo Manager and Homepage Manager.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <SettingsManager sections={['contact-info']} />
      </div>
    </div>
  );
}
