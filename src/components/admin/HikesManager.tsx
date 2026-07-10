import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Plus, Pencil, Trash2, Search, Star } from 'lucide-react';
import { getAllHikesAdmin, createHike, updateHike, deleteHike } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';

interface HikeRow {
  id: string;
  name: string;
  slug: string;
  location: string;
  region: string;
  difficulty: string;
  duration: string;
  distance: string;
  max_elevation: number;
  description: string;
  image: string;
  featured: boolean;
  price: number;
  rating: number;
  highlights: string[];
  best_season: string[];
}

const emptyForm: Partial<HikeRow> = {
  name: '', slug: '', location: '', region: '', difficulty: 'Moderate',
  duration: '', distance: '', max_elevation: 0, description: '', image: '',
  featured: false, price: 0, rating: 4.5, highlights: [], best_season: [],
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function HikesManager() {
  const [hikes, setHikes] = useState<HikeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HikeRow | null>(null);
  const [form, setForm] = useState<Partial<HikeRow>>(emptyForm);
  const [highlightsText, setHighlightsText] = useState('');
  const [seasonText, setSeasonText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HikeRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getAllHikesAdmin();
      setHikes(data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch hikes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setHighlightsText('');
    setSeasonText('');
    setModalOpen(true);
  }

  function openEdit(h: HikeRow) {
    setEditing(h);
    setForm(h);
    setHighlightsText((h.highlights || []).join(', '));
    setSeasonText((h.best_season || []).join(', '));
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.location) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.name!),
        max_elevation: Number(form.max_elevation) || 0,
        price: Number(form.price) || 0,
        rating: Number(form.rating) || 4.5,
        highlights: highlightsText.split(',').map(s => s.trim()).filter(Boolean),
        best_season: seasonText.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editing) {
        await updateHike(editing.id, payload);
      } else {
        await createHike(payload);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to save hike. Check console for details.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHike(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to delete hike.');
    } finally {
      setDeleting(false);
    }
  }

  const filtered = hikes.filter(h =>
    !search || h.name?.toLowerCase().includes(search.toLowerCase()) || h.location?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hikes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{hikes.length} hikes</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Hike
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hikes..." className={`${inputClass} pl-10`} />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={Mountain} message="No hikes found. Click 'Add Hike' to create one." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(h => (
            <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                {h.image ? <img src={h.image} alt={h.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />}
                {h.featured && <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-semibold flex items-center gap-1"><Star className="w-3 h-3" /> Featured</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white">{h.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{h.location}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">{h.difficulty}</span>
                  <span className="text-gray-500">{h.duration}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(h)} className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1.5">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(h)} className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? 'Edit Hike' : 'Add Hike'} onClose={() => setModalOpen(false)} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name" required><input className={inputClass} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} /></Field>
            <Field label="Slug"><input className={inputClass} value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Location" required><input className={inputClass} value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} /></Field>
            <Field label="Region"><input className={inputClass} value={form.region || ''} onChange={e => setForm({ ...form, region: e.target.value })} /></Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Difficulty"><select className={inputClass} value={form.difficulty || 'Moderate'} onChange={e => setForm({ ...form, difficulty: e.target.value })}><option>Easy</option><option>Moderate</option><option>Challenging</option><option>Hard</option></select></Field>
            <Field label="Duration"><input className={inputClass} value={form.duration || ''} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3-4 hours" /></Field>
            <Field label="Distance"><input className={inputClass} value={form.distance || ''} onChange={e => setForm({ ...form, distance: e.target.value })} placeholder="e.g. 3,500 m" /></Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Max Elevation (m)"><input type="number" className={inputClass} value={form.max_elevation || 0} onChange={e => setForm({ ...form, max_elevation: Number(e.target.value) })} /></Field>
            <Field label="Price (Rs.)"><input type="number" className={inputClass} value={form.price || 0} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></Field>
            <Field label="Rating"><input type="number" step="0.1" className={inputClass} value={form.rating || 4.5} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} /></Field>
          </div>
          <ImageUpload label="Hike Image" folder="hikes" value={form.image || ''} onChange={url => setForm({ ...form, image: url })} />
          <Field label="Description"><textarea rows={3} className={inputClass} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Highlights (comma separated)"><input className={inputClass} value={highlightsText} onChange={e => setHighlightsText(e.target.value)} placeholder="Panoramic views, Pine forest" /></Field>
            <Field label="Best Season (comma separated)"><input className={inputClass} value={seasonText} onChange={e => setSeasonText(e.target.value)} placeholder="Spring, Autumn" /></Field>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured hike</span>
          </label>
          <SaveBar onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Hike" message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
