import { useState, useEffect } from 'react';
import { BarChart3, MapPin, Mountain, Image, Video, Map } from 'lucide-react';
import { getWebsiteSettings, updateWebsiteSettings } from '../../services/admin';
import { AdminLoading, AdminError, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';
import { useToast, toErrorMessage } from '../../context/ToastContext';

interface SettingsRow {
  id: string;
  site_logo_url: string;
  stat_donors: string;
  stat_raised: string;
  stat_projects: string;
  stat_regions: string;
  stat_completed_hikes: string;
  stat_volunteers: string;
  stat_waste_collected: string;
  stat_partners: string;
  org_address: string;
  org_email: string;
  org_phone: string;
  org_hours: string;
  next_hike_name: string;
  next_hike_location: string;
  next_hike_date: string;
  next_hike_description: string;
  next_hike_time: string;
  next_hike_meeting_point: string;
  next_hike_difficulty: string;
  next_hike_registration_link: string;
  next_hike_map_url: string;
  next_hike_image: string;
  next_hike_participants: string;
  featured_photo_image: string;
  featured_photo_title: string;
  featured_photo_description: string;
  featured_photo_link: string;
  featured_video_url: string;
  featured_video_title: string;
  featured_video_description: string;
}

export function SettingsManager() {
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState<Partial<SettingsRow>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function load() {
    try {
      setError(null); setLoading(true);
      const data = await getWebsiteSettings();
      setForm(data);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch settings.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const { id, ...payload } = form;
      await updateWebsiteSettings(payload);
      setSaved(true);
      showSuccess('Settings saved successfully.');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      showError(toErrorMessage(e, 'Failed to save settings.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Website Settings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Edit homepage content, statistics, contact info, and next hike details</p>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Site Logo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Site Logo</h2>
          </div>
          <ImageUpload
            label="Logo"
            folder="branding"
            value={form.site_logo_url || ''}
            onChange={url => setForm({ ...form, site_logo_url: url })}
          />
          <p className="text-xs text-gray-400 mt-2">Used in the navbar and footer. Leave empty to keep the default CleanHike Nepal logo.</p>
        </div>

        {/* Featured Photo */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured Photo (Homepage)</h2>
          </div>
          <div className="space-y-4">
            <ImageUpload label="Featured Image" folder="featured" value={form.featured_photo_image || ''} onChange={url => setForm({ ...form, featured_photo_image: url })} />
            <Field label="Title"><input className={inputClass} value={form.featured_photo_title || ''} onChange={e => setForm({ ...form, featured_photo_title: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={2} className={inputClass} value={form.featured_photo_description || ''} onChange={e => setForm({ ...form, featured_photo_description: e.target.value })} /></Field>
            <Field label="Learn More Link (optional)"><input className={inputClass} value={form.featured_photo_link || ''} onChange={e => setForm({ ...form, featured_photo_link: e.target.value })} placeholder="/hikes" /></Field>
          </div>
        </div>

        {/* Featured Video */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Featured Video (Homepage)</h2>
          </div>
          <div className="space-y-4">
            <VideoUpload label="Featured Video (upload or paste URL)" value={form.featured_video_url || ''} onChange={url => setForm({ ...form, featured_video_url: url })} />
            <Field label="Title"><input className={inputClass} value={form.featured_video_title || ''} onChange={e => setForm({ ...form, featured_video_title: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={2} className={inputClass} value={form.featured_video_description || ''} onChange={e => setForm({ ...form, featured_video_description: e.target.value })} /></Field>
          </div>
        </div>

        {/* Homepage Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Homepage Statistics</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Completed Hikes"><input className={inputClass} value={form.stat_completed_hikes || ''} onChange={e => setForm({ ...form, stat_completed_hikes: e.target.value })} placeholder="5+" /></Field>
            <Field label="Volunteers"><input className={inputClass} value={form.stat_volunteers || ''} onChange={e => setForm({ ...form, stat_volunteers: e.target.value })} placeholder="50+" /></Field>
            <Field label="Waste Collected"><input className={inputClass} value={form.stat_waste_collected || ''} onChange={e => setForm({ ...form, stat_waste_collected: e.target.value })} placeholder="200kg" /></Field>
            <Field label="Partner Organizations"><input className={inputClass} value={form.stat_partners || ''} onChange={e => setForm({ ...form, stat_partners: e.target.value })} placeholder="10+" /></Field>
          </div>
        </div>

        {/* Next Clean Hike */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Next Clean Hike (Contact Page)</h2>
          </div>
          <div className="space-y-4">
            <ImageUpload label="Hike Featured Image" folder="next-hike" value={form.next_hike_image || ''} onChange={url => setForm({ ...form, next_hike_image: url })} />
            <Field label="Hike Name"><input className={inputClass} value={form.next_hike_name || ''} onChange={e => setForm({ ...form, next_hike_name: e.target.value })} /></Field>
            <Field label="Hike Location"><input className={inputClass} value={form.next_hike_location || ''} onChange={e => setForm({ ...form, next_hike_location: e.target.value })} /></Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Date"><input className={inputClass} value={form.next_hike_date || ''} onChange={e => setForm({ ...form, next_hike_date: e.target.value })} placeholder="Every Saturday" /></Field>
              <Field label="Time"><input className={inputClass} value={form.next_hike_time || ''} onChange={e => setForm({ ...form, next_hike_time: e.target.value })} placeholder="6:00 AM" /></Field>
            </div>
            <Field label="Meeting Point"><input className={inputClass} value={form.next_hike_meeting_point || ''} onChange={e => setForm({ ...form, next_hike_meeting_point: e.target.value })} /></Field>
            <Field label="Expected Participants"><input className={inputClass} placeholder="e.g. 50 Volunteers" value={(form as any).next_hike_participants || ''} onChange={e => setForm({ ...form, next_hike_participants: e.target.value } as any)} /></Field>
            <Field label="Difficulty"><select className={inputClass} value={form.next_hike_difficulty || 'Moderate'} onChange={e => setForm({ ...form, next_hike_difficulty: e.target.value })}><option>Easy</option><option>Moderate</option><option>Challenging</option><option>Hard</option></select></Field>
            <Field label="Description"><textarea rows={3} className={inputClass} value={form.next_hike_description || ''} onChange={e => setForm({ ...form, next_hike_description: e.target.value })} /></Field>
            <Field label="Registration Link (optional)"><input className={inputClass} value={form.next_hike_registration_link || ''} onChange={e => setForm({ ...form, next_hike_registration_link: e.target.value })} placeholder="https://..." /></Field>
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                <Map className="w-4 h-4" /> Google Maps URL
              </label>
              <input className={inputClass} value={form.next_hike_map_url || ''} onChange={e => setForm({ ...form, next_hike_map_url: e.target.value })} placeholder="https://maps.google.com/maps?q=...&output=embed" />
              <p className="text-xs text-gray-400 mt-1">Paste a Google Maps share URL or embed URL. The map will display on the Contact page.</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Organization Contact Info</h2>
          </div>
          <div className="space-y-4">
            <Field label="Address"><input className={inputClass} value={form.org_address || ''} onChange={e => setForm({ ...form, org_address: e.target.value })} /></Field>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Email"><input className={inputClass} value={form.org_email || ''} onChange={e => setForm({ ...form, org_email: e.target.value })} /></Field>
              <Field label="Phone"><input className={inputClass} value={form.org_phone || ''} onChange={e => setForm({ ...form, org_phone: e.target.value })} /></Field>
            </div>
            <Field label="Working Hours"><input className={inputClass} value={form.org_hours || ''} onChange={e => setForm({ ...form, org_hours: e.target.value })} /></Field>
          </div>
        </div>

        <SaveBar onSave={handleSave} onCancel={load} saving={saving} saveLabel="Save Settings" />
      </div>
    </div>
  );
}
