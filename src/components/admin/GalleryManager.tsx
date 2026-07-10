import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getAllGalleryAdmin, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';

interface GalleryRow {
  id: string;
  title: string | null;
  src: string;
  alt: string;
  category: string;
  location: string | null;
  display_order: number;
  is_active: boolean;
}

const emptyForm: Partial<GalleryRow> = { title: '', src: '', alt: '', category: 'nature', location: '', display_order: 0, is_active: true };

export function GalleryManager() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryRow | null>(null);
  const [form, setForm] = useState<Partial<GalleryRow>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try { setError(null); setLoading(true); const data = await getAllGalleryAdmin(); setItems(data || []); }
    catch (e) { console.error(e); setError('Failed to fetch gallery images.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(g: GalleryRow) { setEditing(g); setForm(g); setModalOpen(true); }

  async function handleSave() {
    if (!form.src) { alert('Image URL is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, display_order: Number(form.display_order) || 0, alt: form.alt || form.title || 'Gallery image' };
      if (editing) await updateGalleryImage(editing.id, payload); else await createGalleryImage(payload);
      setModalOpen(false); await load();
    } catch (e) { console.error(e); alert('Failed to save image.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteGalleryImage(deleteTarget.id); setDeleteTarget(null); await load(); }
    catch (e) { console.error(e); alert('Failed to delete image.'); }
    finally { setDeleting(false); }
  }

  const filtered = items.filter(g => !search || g.title?.toLowerCase().includes(search.toLowerCase()) || g.category?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} images</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Image
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search images..." className={`${inputClass} pl-10`} />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={ImageIcon} message="No images found. Click 'Add Image' to upload one." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(g => (
            <motion.div key={g.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                {g.src ? <img src={g.src} alt={g.alt} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />}
                {!g.is_active && <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gray-800/70 text-white text-xs">Hidden</span>}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(g)} className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTarget(g)} className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{g.title || g.alt}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs capitalize">{g.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? 'Edit Image' : 'Add Image'} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <ImageUpload label="Gallery Image" folder="gallery" value={form.src || ''} onChange={url => setForm({ ...form, src: url })} />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title"><input className={inputClass} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Alt Text"><input className={inputClass} value={form.alt || ''} onChange={e => setForm({ ...form, alt: e.target.value })} /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Category"><select className={inputClass} value={form.category || 'nature'} onChange={e => setForm({ ...form, category: e.target.value })}><option value="hikes">Hikes</option><option value="nature">Nature</option><option value="community">Community</option><option value="events">Events</option></select></Field>
            <Field label="Location"><input className={inputClass} value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Display Order"><input type="number" className={inputClass} value={form.display_order || 0} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} /></Field>
            <label className="flex items-end gap-3 cursor-pointer pb-2">
              <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visible on site</span>
            </label>
          </div>
          <SaveBar onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Image" message={`Delete "${deleteTarget?.title || deleteTarget?.alt}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
