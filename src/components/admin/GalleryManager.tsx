import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, Pencil, Trash2, Search, Eye, EyeOff, ArrowUp, ArrowDown, Images, Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getAllGalleryAdmin, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';
import { supabase } from '../../services/supabase';
import { useToast, toErrorMessage } from '../../context/ToastContext';

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
  const { showSuccess, showError } = useToast();
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

  // Bulk upload — pick a category once, then add many photos at once
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('nature');
  const [bulkFiles, setBulkFiles] = useState<{ file: File; status: 'pending' | 'uploading' | 'done' | 'error'; error?: string }[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkFileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try { setError(null); setLoading(true); const data = await getAllGalleryAdmin(); setItems(data || []); }
    catch (e) { console.error(e); setError('Failed to fetch gallery images.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(g: GalleryRow) { setEditing(g); setForm(g); setModalOpen(true); }

  async function handleSave() {
    if (!form.src) { showError('Image URL is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, display_order: Number(form.display_order) || 0, alt: form.alt || form.title || 'Gallery image' };
      if (editing) await updateGalleryImage(editing.id, payload); else await createGalleryImage(payload);
      setModalOpen(false); showSuccess(editing ? 'Image updated successfully.' : 'Image added successfully.'); await load();
    } catch (e) { console.error(e); showError(toErrorMessage(e, 'Failed to save image.')); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteGalleryImage(deleteTarget.id); setDeleteTarget(null); showSuccess('Image deleted.'); await load(); }
    catch (e) { console.error(e); showError(toErrorMessage(e, 'Failed to delete image.')); }
    finally { setDeleting(false); }
  }

  async function handleToggleActive(g: GalleryRow) {
    try {
      await updateGalleryImage(g.id, { is_active: !g.is_active });
      setItems(prev => prev.map(i => i.id === g.id ? { ...i, is_active: !i.is_active } : i));
      showSuccess(g.is_active ? 'Image hidden.' : 'Image published.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to toggle visibility.'));
    }
  }

  function openBulkAdd() {
    setBulkCategory('nature');
    setBulkFiles([]);
    setBulkModalOpen(true);
  }

  const BULK_ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const BULK_MAX_SIZE = 10 * 1024 * 1024; // 10MB

  function addBulkFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles = Array.from(fileList).map(file => {
      if (!BULK_ACCEPTED_TYPES.includes(file.type)) {
        return { file, status: 'error' as const, error: 'Only JPG, PNG, or WEBP images are allowed.' };
      }
      if (file.size > BULK_MAX_SIZE) {
        return { file, status: 'error' as const, error: 'File too large (max 10MB).' };
      }
      return { file, status: 'pending' as const };
    });
    setBulkFiles(prev => [...prev, ...newFiles]);
  }

  function removeBulkFile(index: number) {
    setBulkFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function handleBulkUpload() {
    if (bulkFiles.length === 0) return;
    setBulkUploading(true);
    let successCount = 0;
    let nextOrder = items.length > 0 ? Math.max(...items.map(i => i.display_order)) + 1 : 0;

    for (let i = 0; i < bulkFiles.length; i++) {
      if (bulkFiles[i].status === 'error') continue;
      setBulkFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' } : f));
      try {
        const file = bulkFiles[i].file;
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('admin-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('admin-images').getPublicUrl(fileName);
        const baseName = file.name.replace(/\.[^/.]+$/, '');

        await createGalleryImage({
          src: urlData.publicUrl,
          title: baseName,
          alt: baseName,
          category: bulkCategory,
          location: '',
          display_order: nextOrder++,
          is_active: true,
        });

        successCount++;
        setBulkFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done' } : f));
      } catch (e) {
        console.error('Bulk gallery upload error:', e);
        setBulkFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error', error: 'Upload failed' } : f));
      }
    }

    setBulkUploading(false);
    if (successCount > 0) {
      showSuccess(`Added ${successCount} of ${bulkFiles.length} photo${bulkFiles.length === 1 ? '' : 's'}.`);
      await load();
    }
    if (successCount === bulkFiles.length) {
      setBulkModalOpen(false);
    }
  }


  async function handleMove(idx: number, direction: 'up' | 'down') {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === filtered.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const a = filtered[idx];
    const b = filtered[swapIdx];
    setItems(prev => {
      const next = [...prev];
      const ai = next.findIndex(i => i.id === a.id);
      const bi = next.findIndex(i => i.id === b.id);
      [next[ai], next[bi]] = [next[bi], next[ai]];
      return next;
    });
    try {
      await Promise.all([
        updateGalleryImage(a.id, { display_order: b.display_order }),
        updateGalleryImage(b.id, { display_order: a.display_order }),
      ]);
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to reorder.'));
      await load();
    }
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
        <div className="flex items-center gap-3">
          <button onClick={openBulkAdd} className="px-4 py-2.5 rounded-xl border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center gap-2">
            <Images className="w-5 h-5" /> Add Multiple Photos
          </button>
          <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Image
          </button>
        </div>
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
                  <button onClick={() => openEdit(g)} className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white" title="Edit"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleToggleActive(g)} className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white" title={g.is_active ? 'Hide' : 'Publish'}>{g.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}</button>
                  <button onClick={() => handleMove(filtered.indexOf(g), 'up')} disabled={filtered.indexOf(g) === 0} className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white disabled:opacity-30" title="Move up"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => handleMove(filtered.indexOf(g), 'down')} disabled={filtered.indexOf(g) === filtered.length - 1} className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white disabled:opacity-30" title="Move down"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteTarget(g)} className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
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

      <AdminModal open={bulkModalOpen} title="Add Multiple Photos" onClose={() => !bulkUploading && setBulkModalOpen(false)}>
        <div className="space-y-4">
          <Field label="Category (applies to all photos in this batch)">
            <select className={inputClass} value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} disabled={bulkUploading}>
              <option value="hikes">Hikes</option>
              <option value="nature">Nature</option>
              <option value="community">Community</option>
              <option value="events">Events</option>
            </select>
          </Field>

          <div>
            <div
              onClick={() => !bulkUploading && bulkFileRef.current?.click()}
              className="relative rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer p-8 text-center transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to select photos</p>
              <p className="text-xs text-gray-400 mt-1">Select as many as you like — PNG, JPG, WEBP up to 5MB each</p>
            </div>
            <input
              ref={bulkFileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={e => { addBulkFiles(e.target.files); e.target.value = ''; }}
              className="hidden"
            />
          </div>

          {bulkFiles.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-100 dark:border-gray-700 rounded-xl p-2">
              {bulkFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/40">
                  <img src={URL.createObjectURL(f.file)} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{f.file.name}</span>
                  {f.status === 'pending' && !bulkUploading && (
                    <button onClick={() => removeBulkFile(i)} className="text-gray-400 hover:text-red-500 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                  )}
                  {f.status === 'uploading' && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin flex-shrink-0" />}
                  {f.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  {f.status === 'error' && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" title={f.error} />}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setBulkModalOpen(false)}
              disabled={bulkUploading}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50"
            >
              {bulkFiles.some(f => f.status === 'done') ? 'Done' : 'Cancel'}
            </button>
            <button
              onClick={handleBulkUpload}
              disabled={bulkUploading || bulkFiles.length === 0 || bulkFiles.every(f => f.status === 'done')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {bulkUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : `Upload ${bulkFiles.filter(f => f.status === 'pending').length || bulkFiles.length} Photo${bulkFiles.length === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Image" message={`Delete "${deleteTarget?.title || deleteTarget?.alt}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}