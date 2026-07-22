import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, GripVertical, Eye, EyeOff, Save, X, ArrowUp, ArrowDown, Image, Link } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { BannerSlide } from '../sections/BannerCarousel';
import { ImageUpload } from './ImageUpload';
import { AdminLoading, AdminError, inputClass } from './AdminUI';
import { CMS_LINK_OPTIONS } from '../../utils/navigateToLink';
import { useToast, toErrorMessage } from '../../context/ToastContext';

const defaultBanner: Omit<BannerSlide, 'id'> = {
  image: '',
  title: '',
  subtitle: '',
  button_text: 'Join Upcoming Clean Hike',
  button_link: '/contact#join-us-for-clean-hike',
  sort_order: 0,
  is_active: true,
};

/** Shared dropdown + external-URL field for a banner's button destination. */
function LinkPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (link: string) => void;
}) {
  const matched = CMS_LINK_OPTIONS.find(o => o.value === value);
  const isExternal = !matched && !!value;
  const [mode, setMode] = useState<string>(isExternal ? '__external__' : (matched?.value || CMS_LINK_OPTIONS[0].value));
  const [customUrl, setCustomUrl] = useState(isExternal ? value : '');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Links To</label>
      <select
        className={inputClass}
        value={mode}
        onChange={e => {
          const next = e.target.value;
          setMode(next);
          if (next === '__external__') {
            onChange(customUrl);
          } else {
            onChange(next);
          }
        }}
      >
        {CMS_LINK_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {mode === '__external__' && (
        <input
          className={`${inputClass} mt-2`}
          placeholder="https://example.com"
          value={customUrl}
          onChange={e => { setCustomUrl(e.target.value); onChange(e.target.value); }}
        />
      )}
    </div>
  );
}

export function BannerManager() {
  const { showSuccess, showError } = useToast();
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBanner, setNewBanner] = useState({ ...defaultBanner });
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');

  async function loadBanners() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('hero_banners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (err) throw err;
      setBanners(data as BannerSlide[] || []);
    } catch (e: any) {
      // Table might not exist yet — show a friendly message
      setError('Hero Banners table not found. Run the migration or the app uses default slides.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBanners(); }, []);

  async function handleAdd() {
    setSaving(true);
    try {
      const bannerData = {
        ...newBanner,
        image: imageMode === 'url' ? imageUrl : newBanner.image,
        sort_order: banners.length + 1,
      };
      if (!bannerData.title || !bannerData.image) {
        showError('Please fill in the title and image.');
        return;
      }
      const { error: err } = await supabase.from('hero_banners').insert([bannerData]);
      if (err) throw err;
      setNewBanner({ ...defaultBanner });
      setImageUrl('');
      setShowAddForm(false);
      showSuccess('Banner added successfully.');
      await loadBanners();
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to add banner.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, updates: Partial<BannerSlide>) {
    setSaving(true);
    try {
      const { error: err } = await supabase.from('hero_banners').update(updates).eq('id', id);
      if (err) throw err;
      setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      showSuccess('Banner updated successfully.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to update banner.'));
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return;
    try {
      const { error: err } = await supabase.from('hero_banners').delete().eq('id', id);
      if (err) throw err;
      setBanners(prev => prev.filter(b => b.id !== id));
      showSuccess('Banner deleted.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to delete banner.'));
    }
  }

  async function handleToggleActive(banner: BannerSlide) {
    await handleUpdate(banner.id, { is_active: !banner.is_active });
  }

  async function handleMoveUp(idx: number) {
    if (idx === 0) return;
    const updated = [...banners];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setBanners(updated);
    await Promise.all([
      supabase.from('hero_banners').update({ sort_order: idx }).eq('id', updated[idx - 1].id),
      supabase.from('hero_banners').update({ sort_order: idx + 1 }).eq('id', updated[idx].id),
    ]);
  }

  async function handleMoveDown(idx: number) {
    if (idx === banners.length - 1) return;
    const updated = [...banners];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setBanners(updated);
    await Promise.all([
      supabase.from('hero_banners').update({ sort_order: idx + 1 }).eq('id', updated[idx].id),
      supabase.from('hero_banners').update({ sort_order: idx + 2 }).eq('id', updated[idx + 1].id),
    ]);
  }

  if (loading) return <AdminLoading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Banner Carousel</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the full-width banners at the top of the homepage</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm">
          ⚠️ {error}
          <p className="mt-2 text-xs">To enable dynamic banners, create a <code>hero_banners</code> table in Supabase with columns: id, image, title, subtitle, button_text, button_link, sort_order, is_active.</p>
        </div>
      )}

      {/* Add Banner Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">New Banner</h3>
              <button onClick={() => setShowAddForm(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="space-y-4">
              {/* Image source toggle */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setImageMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === 'upload' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                >
                  <Image className="w-4 h-4" /> Upload File
                </button>
                <button
                  onClick={() => setImageMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === 'url' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                >
                  <Link className="w-4 h-4" /> Image URL
                </button>
              </div>

              {imageMode === 'upload' ? (
                <ImageUpload
                  label="Banner Image"
                  folder="banners"
                  value={newBanner.image}
                  onChange={url => setNewBanner(b => ({ ...b, image: url }))}
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    className={inputClass}
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                  />
                </div>
              )}

              {/* Preview */}
              {(newBanner.image || imageUrl) && (
                <img
                  src={imageMode === 'url' ? imageUrl : newBanner.image}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input className={inputClass} placeholder="Banner title" value={newBanner.title} onChange={e => setNewBanner(b => ({ ...b, title: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                  <input className={inputClass} placeholder="e.g. Join Upcoming Clean Hike" value={newBanner.button_text} onChange={e => setNewBanner(b => ({ ...b, button_text: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                <input className={inputClass} placeholder="Banner subtitle/description" value={newBanner.subtitle} onChange={e => setNewBanner(b => ({ ...b, subtitle: e.target.value }))} />
              </div>
              <LinkPicker
                value={newBanner.button_link}
                onChange={link => setNewBanner(b => ({ ...b, button_link: link }))}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={newBanner.button_visible !== false}
                  onChange={e => setNewBanner(b => ({ ...b, button_visible: e.target.checked }))}
                  className="rounded"
                />
                Show button on this banner
              </label>

              <button
                onClick={handleAdd}
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Add Banner'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      {banners.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No banners added yet. Click "Add Banner" to create your first slide.</p>
          <p className="text-xs mt-2 text-gray-400">The carousel will use default images until you add banners here.</p>
        </div>
      )}

      <div className="space-y-4">
        {banners.map((banner, idx) => (
          <motion.div
            key={banner.id}
            layout
            className={`rounded-2xl border overflow-hidden ${banner.is_active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}
          >
            {editingId === banner.id ? (
              <EditBannerForm
                banner={banner}
                onSave={updates => handleUpdate(banner.id, updates)}
                onCancel={() => setEditingId(null)}
                saving={saving}
              />
            ) : (
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  {banner.image && (
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  )}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{banner.title || '(No title)'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{banner.subtitle}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">CTA: {banner.button_text}</p>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-30 transition-colors">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleMoveDown(idx)} disabled={idx === banners.length - 1} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-30 transition-colors">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggleActive(banner)} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                    {banner.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                  </button>
                  <button onClick={() => setEditingId(banner.id)} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EditBannerForm({
  banner,
  onSave,
  onCancel,
  saving,
}: {
  banner: BannerSlide;
  onSave: (updates: Partial<BannerSlide>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...banner });

  return (
    <div className="p-5 bg-white dark:bg-gray-800 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
          <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
          <input className={inputClass} value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
        <input className={inputClass} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
        <input className={inputClass} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
        {form.image && <img src={form.image} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl" />}
      </div>
      <LinkPicker
        value={form.button_link}
        onChange={link => setForm(f => ({ ...f, button_link: link }))}
      />
      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <input
          type="checkbox"
          checked={form.button_visible !== false}
          onChange={e => setForm(f => ({ ...f, button_visible: e.target.checked }))}
          className="rounded"
        />
        Show button on this banner
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
