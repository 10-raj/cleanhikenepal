import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, Eye, EyeOff, Save, X, ArrowUp, ArrowDown,
  Image, Eye as PreviewIcon, FileText,
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { BannerSlide } from '../sections/BannerCarousel';
import { ImageUpload } from './ImageUpload';
import { AdminLoading, AdminEmpty, inputClass, Field } from './AdminUI';
import { CMS_LINK_OPTIONS } from '../../utils/navigateToLink';
import { useToast, toErrorMessage } from '../../context/ToastContext';

type BannerStatus = 'published' | 'draft';
type TextAlignment = 'left' | 'center' | 'right';

interface BannerForm {
  image: string;
  mobile_image: string;
  title: string;
  subtitle: string;
  description: string;
  button_text: string;
  button_link: string;
  button_visible: boolean;
  open_new_tab: boolean;
  overlay_opacity: number;
  text_alignment: TextAlignment;
  status: BannerStatus;
  start_date: string;
  end_date: string;
  sort_order: number;
  is_active: boolean;
}

const defaultBanner: BannerForm = {
  image: '',
  mobile_image: '',
  title: '',
  subtitle: '',
  description: '',
  button_text: 'Join Upcoming Clean Hike',
  button_link: '/contact#join-us-for-clean-hike',
  button_visible: true,
  open_new_tab: false,
  overlay_opacity: 50,
  text_alignment: 'center',
  status: 'published',
  start_date: '',
  end_date: '',
  sort_order: 0,
  is_active: true,
};

function toForm(b: BannerSlide): BannerForm {
  return {
    image: b.image || '',
    mobile_image: b.mobile_image || '',
    title: b.title || '',
    subtitle: b.subtitle || '',
    description: b.description || '',
    button_text: b.button_text || '',
    button_link: b.button_link || '',
    button_visible: b.button_visible !== false,
    open_new_tab: b.open_new_tab ?? false,
    overlay_opacity: b.overlay_opacity ?? 50,
    text_alignment: (b.text_alignment as TextAlignment) || 'center',
    status: (b.status as BannerStatus) || 'published',
    start_date: b.start_date ? b.start_date.slice(0, 16) : '',
    end_date: b.end_date ? b.end_date.slice(0, 16) : '',
    sort_order: b.sort_order || 0,
    is_active: b.is_active,
  };
}

function toDbRow(f: BannerForm): Record<string, any> {
  return {
    image: f.image,
    mobile_image: f.mobile_image || null,
    title: f.title,
    subtitle: f.subtitle || null,
    description: f.description || null,
    button_text: f.button_text,
    button_link: f.button_link,
    button_visible: f.button_visible,
    open_new_tab: f.open_new_tab,
    overlay_opacity: f.overlay_opacity,
    text_alignment: f.text_alignment,
    status: f.status,
    start_date: f.start_date ? new Date(f.start_date).toISOString() : null,
    end_date: f.end_date ? new Date(f.end_date).toISOString() : null,
    sort_order: f.sort_order,
    is_active: f.is_active,
  };
}

function LinkPicker({ value, onChange }: { value: string; onChange: (link: string) => void }) {
  const matched = CMS_LINK_OPTIONS.find(o => o.value === value);
  const isExternal = !matched && !!value && value !== '__external__';
  const [mode, setMode] = useState<string>(isExternal ? '__external__' : (matched?.value || CMS_LINK_OPTIONS[0].value));
  const [customUrl, setCustomUrl] = useState(isExternal ? value : '');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner Click Destination</label>
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

function BannerFormFields({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  saveLabel,
}: {
  form: BannerForm;
  setForm: React.Dispatch<React.SetStateAction<BannerForm>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  saveLabel: string;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [useMobileImage, setUseMobileImage] = useState(!!form.mobile_image);

  return (
    <div className="space-y-4">
      {/* Image source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Background Image *</label>
        <ImageUpload
          label="Desktop Image"
          folder="banners"
          value={form.image}
          onChange={url => setForm(f => ({ ...f, image: url }))}
        />
      </div>

      {/* Mobile image toggle */}
      <div>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
          <input
            type="checkbox"
            checked={useMobileImage}
            onChange={e => {
              setUseMobileImage(e.target.checked);
              if (!e.target.checked) setForm(f => ({ ...f, mobile_image: '' }));
            }}
            className="rounded"
          />
          Use a separate mobile image
        </label>
        {useMobileImage && (
          <ImageUpload
            label="Mobile Image"
            folder="banners"
            value={form.mobile_image}
            onChange={url => setForm(f => ({ ...f, mobile_image: url }))}
          />
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Title" required>
          <input className={inputClass} placeholder="Banner title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </Field>
        <Field label="Button Text">
          <input className={inputClass} placeholder="e.g. Join Upcoming Clean Hike" value={form.button_text} onChange={e => setForm(f => ({ ...f, button_text: e.target.value }))} />
        </Field>
      </div>

      <Field label="Subtitle">
        <input className={inputClass} placeholder="Banner subtitle" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
      </Field>

      <Field label="Description (optional)">
        <textarea rows={2} className={inputClass} placeholder="Longer body text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </Field>

      {/* Overlay + Alignment */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Overlay Opacity">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={form.overlay_opacity}
              onChange={e => setForm(f => ({ ...f, overlay_opacity: Number(e.target.value) }))}
              className="flex-1 accent-emerald-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 w-10 text-right">{form.overlay_opacity}%</span>
          </div>
        </Field>
        <Field label="Text Alignment">
          <select
            className={inputClass}
            value={form.text_alignment}
            onChange={e => setForm(f => ({ ...f, text_alignment: e.target.value as TextAlignment }))}
          >
            <option value="center">Center</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </div>

      {/* Scheduling */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Start Date (optional)">
          <input type="datetime-local" className={inputClass} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
        </Field>
        <Field label="End Date (optional)">
          <input type="datetime-local" className={inputClass} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
        </Field>
      </div>

      <LinkPicker value={form.button_link} onChange={link => setForm(f => ({ ...f, button_link: link }))} />
      <p className="text-xs text-gray-400 -mt-2">Clicking anywhere on this banner (not just the button) will take visitors here.</p>

      {/* Toggles */}
      <div className="space-y-2 pt-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={form.button_visible} onChange={e => setForm(f => ({ ...f, button_visible: e.target.checked }))} className="rounded" />
          Show a CTA button on this banner (optional — the whole banner is clickable either way)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={form.open_new_tab} onChange={e => setForm(f => ({ ...f, open_new_tab: e.target.checked }))} className="rounded" />
          Open in a new tab (for external URLs)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
            className="rounded"
          />
          Active (visible on site)
        </label>
      </div>

      {/* Status */}
      <Field label="Status">
        <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as BannerStatus }))}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </Field>

      {/* Preview */}
      {showPreview && (
        <div className={`relative h-48 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 ${form.button_link ? 'cursor-pointer' : ''}`}>
          <img src={form.image} alt="preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black" style={{ opacity: form.overlay_opacity / 100 }} />
          <div className={`absolute inset-0 flex items-center justify-center px-6 ${form.text_alignment === 'left' ? 'justify-start' : form.text_alignment === 'right' ? 'justify-end' : ''}`}>
            <div className={`max-w-lg ${form.text_alignment === 'left' ? 'text-left' : form.text_alignment === 'right' ? 'text-right' : 'text-center'}`}>
              <h3 className="text-xl font-bold text-white mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{form.title || 'Banner Title'}</h3>
              {form.subtitle && <p className="text-sm text-gray-200 mb-1" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{form.subtitle}</p>}
              {form.description && <p className="text-xs text-gray-300" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{form.description}</p>}
              {form.button_visible && form.button_text && (
                <span className="inline-block mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold">
                  {form.button_text}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <PreviewIcon className="w-4 h-4" /> {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : saveLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function BannerManager() {
  const { showSuccess, showError } = useToast();
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBanner, setNewBanner] = useState<BannerForm>({ ...defaultBanner });

  async function loadBanners() {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('hero_banners')
        .select('*')
        .order('sort_order', { ascending: true });
      if (err) throw err;
      setBanners((data as BannerSlide[]) || []);
    } catch (e: any) {
      showError(toErrorMessage(e, 'Failed to load banners.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBanners(); }, []);

  async function handleAdd() {
    setSaving(true);
    try {
      if (!newBanner.title || !newBanner.image) {
        showError('Please fill in the title and image.');
        setSaving(false);
        return;
      }
      const payload = toDbRow({ ...newBanner, sort_order: banners.length + 1 });
      const { error: err } = await supabase.from('hero_banners').insert([payload]);
      if (err) throw err;
      setNewBanner({ ...defaultBanner });
      setShowAddForm(false);
      showSuccess('Banner added successfully.');
      await loadBanners();
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to add banner.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, form: BannerForm) {
    setSaving(true);
    try {
      const { error: err } = await supabase.from('hero_banners').update(toDbRow(form)).eq('id', id);
      if (err) throw err;
      showSuccess('Banner updated successfully.');
      setEditingId(null);
      await loadBanners();
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to update banner.'));
    } finally {
      setSaving(false);
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
    try {
      const { error: err } = await supabase.from('hero_banners').update({ is_active: !banner.is_active }).eq('id', banner.id);
      if (err) throw err;
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: !b.is_active } : b));
      showSuccess(banner.is_active ? 'Banner unpublished.' : 'Banner published.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to toggle banner.'));
    }
  }

  async function handleMoveUp(idx: number) {
    if (idx === 0) return;
    const updated = [...banners];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setBanners(updated);
    await Promise.all([
      supabase.from('hero_banners').update({ sort_order: updated[idx - 1].sort_order }).eq('id', updated[idx - 1].id),
      supabase.from('hero_banners').update({ sort_order: updated[idx].sort_order }).eq('id', updated[idx].id),
    ]);
  }

  async function handleMoveDown(idx: number) {
    if (idx === banners.length - 1) return;
    const updated = [...banners];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setBanners(updated);
    await Promise.all([
      supabase.from('hero_banners').update({ sort_order: updated[idx].sort_order }).eq('id', updated[idx].id),
      supabase.from('hero_banners').update({ sort_order: updated[idx + 1].sort_order }).eq('id', updated[idx + 1].id),
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
            <BannerFormFields
              form={newBanner}
              setForm={setNewBanner}
              onSave={handleAdd}
              onCancel={() => setShowAddForm(false)}
              saving={saving}
              saveLabel="Add Banner"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      {banners.length === 0 && (
        <AdminEmpty icon={Image} message="No banners added yet. Click 'Add Banner' to create your first slide." />
      )}

      <div className="space-y-4">
        {banners.map((banner, idx) => (
          <motion.div
            key={banner.id}
            layout
            className={`rounded-2xl border overflow-hidden ${banner.is_active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}
          >
            {editingId === banner.id ? (
              <div className="p-5 bg-white dark:bg-gray-800">
                <EditBannerForm
                  banner={banner}
                  onSave={form => handleUpdate(banner.id, form)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800">
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  {banner.image && <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{banner.title || '(No title)'}</p>
                    {banner.status === 'draft' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">
                        <FileText className="w-3 h-3 inline mr-0.5" /> Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{banner.subtitle}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">CTA: {banner.button_text || 'None'}</span>
                    <span className="text-xs text-gray-400">Opacity: {banner.overlay_opacity ?? 50}%</span>
                    <span className="text-xs text-gray-400">Align: {banner.text_alignment || 'center'}</span>
                  </div>
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
  onSave: (form: BannerForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<BannerForm>(toForm(banner));

  return (
    <div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Edit Banner</h3>
      <BannerFormFields
        form={form}
        setForm={setForm}
        onSave={() => onSave(form)}
        onCancel={onCancel}
        saving={saving}
        saveLabel="Save Changes"
      />
    </div>
  );
}
