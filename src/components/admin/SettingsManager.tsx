import { useState, useEffect } from 'react';
import { BarChart3, MapPin, Mountain } from 'lucide-react';
import { getWebsiteSettings, updateWebsiteSettings } from '../../services/admin';
import { AdminLoading, AdminError, Field, inputClass, SaveBar } from './AdminUI';

interface SettingsRow {
  id: string;
  stat_donors: string;
  stat_raised: string;
  stat_projects: string;
  stat_regions: string;
  org_address: string;
  org_email: string;
  org_phone: string;
  org_hours: string;
  next_hike_name: string;
  next_hike_location: string;
  next_hike_date: string;
  next_hike_description: string;
}

export function SettingsManager() {
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
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Website Settings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Edit homepage statistics, contact info, and next hike details</p>

      {saved && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        {/* Next Clean Hike */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Next Clean Hike (Contact Page)</h2>
          </div>
          <div className="space-y-4">
            <Field label="Hike Name"><input className={inputClass} value={form.next_hike_name || ''} onChange={e => setForm({ ...form, next_hike_name: e.target.value })} /></Field>
            <Field label="Hike Location"><input className={inputClass} value={form.next_hike_location || ''} onChange={e => setForm({ ...form, next_hike_location: e.target.value })} /></Field>
            <Field label="Hike Date / Schedule"><input className={inputClass} value={form.next_hike_date || ''} onChange={e => setForm({ ...form, next_hike_date: e.target.value })} placeholder="e.g. Every Saturday Morning" /></Field>
            <Field label="Description"><textarea rows={3} className={inputClass} value={form.next_hike_description || ''} onChange={e => setForm({ ...form, next_hike_description: e.target.value })} /></Field>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Homepage Statistics</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Donors stat"><input className={inputClass} value={form.stat_donors || ''} onChange={e => setForm({ ...form, stat_donors: e.target.value })} placeholder="10+" /></Field>
            <Field label="Raised stat"><input className={inputClass} value={form.stat_raised || ''} onChange={e => setForm({ ...form, stat_raised: e.target.value })} placeholder="$20" /></Field>
            <Field label="Projects stat"><input className={inputClass} value={form.stat_projects || ''} onChange={e => setForm({ ...form, stat_projects: e.target.value })} placeholder="5+" /></Field>
            <Field label="Regions stat"><input className={inputClass} value={form.stat_regions || ''} onChange={e => setForm({ ...form, stat_regions: e.target.value })} placeholder="1" /></Field>
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
