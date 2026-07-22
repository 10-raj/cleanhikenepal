import { useState, useEffect } from 'react';
import { Sparkle, Upload, RotateCcw, Loader2, Check } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminLoading, AdminError } from '../../components/admin/AdminUI';
import { useToast, toErrorMessage } from '../../context/ToastContext';

export function AdminLogoPage() {
  const { showSuccess, showError } = useToast();
  const [logoUrl, setLogoUrl] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('website_settings')
        .select('site_logo_url')
        .limit(1)
        .maybeSingle();
      if (err) throw err;
      const url = data?.site_logo_url || '';
      setLogoUrl(url);
      setOriginalUrl(url);
    } catch (e) {
      setError(toErrorMessage(e, 'Failed to load logo settings.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const { data: settings } = await supabase
        .from('website_settings')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (!settings?.id) {
        showError('Settings row not found. Please contact support.');
        setSaving(false);
        return;
      }
      const { error: err } = await supabase
        .from('website_settings')
        .update({ site_logo_url: logoUrl || null })
        .eq('id', settings.id);
      if (err) throw err;
      setOriginalUrl(logoUrl);
      showSuccess('Logo updated successfully.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to save logo.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleRevert() {
    setSaving(true);
    try {
      const { data: settings } = await supabase
        .from('website_settings')
        .select('id')
        .limit(1)
        .maybeSingle();
      if (settings?.id) {
        const { error: err } = await supabase
          .from('website_settings')
          .update({ site_logo_url: null })
          .eq('id', settings.id);
        if (err) throw err;
      }
      setLogoUrl('');
      setOriginalUrl('');
      showSuccess('Reverted to default logo.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to revert logo.'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  const hasCustomLogo = !!logoUrl;

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <Sparkle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Logo Manager</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Replace the site logo via upload or URL, preview, and revert to default</p>
        </div>
      </div>

      <div className="mt-8 max-w-2xl space-y-6">
        {/* Current Logo Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Logo</h2>
          <div className="flex items-center justify-center p-8 rounded-xl bg-gray-50 dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-700">
            {hasCustomLogo ? (
              <img src={logoUrl} alt="Site Logo" className="max-h-24 max-w-full object-contain" />
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Sparkle className="w-6 h-6" />
                <span className="text-sm font-medium">Default CleanHike Nepal Logo</span>
              </div>
            )}
          </div>
          {hasCustomLogo && (
            <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4" /> Custom logo is active
            </div>
          )}
        </div>

        {/* Upload / URL */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Replace Logo</h2>
          <ImageUpload
            label="Logo Image"
            folder="branding"
            aspect="square"
            value={logoUrl}
            onChange={url => setLogoUrl(url)}
          />
          <p className="text-xs text-gray-400 mt-2">Upload a PNG or JPG with a transparent background for best results. Recommended size: 200x200px.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || logoUrl === originalUrl}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Publish Logo'}
          </button>
          <button
            onClick={handleRevert}
            disabled={saving || !hasCustomLogo}
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Revert to Default
          </button>
        </div>
      </div>
    </div>
  );
}
