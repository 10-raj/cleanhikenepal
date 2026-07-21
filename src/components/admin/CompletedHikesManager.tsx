import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Plus, Pencil, Trash2, Search } from 'lucide-react';
import {
  getAllCompletedHikesAdmin,
  createCompletedHike,
  updateCompletedHike,
  deleteCompletedHike,
} from '../../services/admin';
import {
  AdminLoading,
  AdminEmpty,
  AdminError,
  ConfirmDialog,
  AdminModal,
  Field,
  inputClass,
  SaveBar,
} from './AdminUI';

interface CompletedHikeRow {
  id: string;
  name: string;
  location: string;
  elevation: string;
  distance: string;
  duration: string;
  difficulty: string;
  completed_date: string;
  image: string;
  description: string;
  highlights: string[];
  display_order: number;
  is_active: boolean;
}

const emptyForm: Partial<CompletedHikeRow> = {
  name: '',
  location: '',
  elevation: '',
  distance: '',
  duration: '',
  difficulty: 'Easy',
  completed_date: '',
  image: '',
  description: '',
  highlights: [],
  display_order: 0,
  is_active: true,
};

export function CompletedHikesManager() {
  const [items, setItems] = useState<CompletedHikeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CompletedHikeRow | null>(null);
  const [form, setForm] = useState<Partial<CompletedHikeRow>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CompletedHikeRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [highlightsText, setHighlightsText] = useState('');

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const data = await getAllCompletedHikesAdmin();
      setItems(data || []);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch completed hikes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setHighlightsText('');
    setModalOpen(true);
  }

  function openEdit(h: CompletedHikeRow) {
    setEditing(h);
    setForm(h);
    setHighlightsText((h.highlights || []).join(', '));
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.location || !form.completed_date) {
      alert('Name, location, and completed date are required.');
      return;
    }
    setSaving(true);
    try {
      const highlights = highlightsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const payload = {
        ...form,
        highlights,
        display_order: Number(form.display_order) || 0,
      };
      if (editing) {
        await updateCompletedHike(editing.id, payload);
      } else {
        await createCompletedHike(payload);
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to save completed hike.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCompletedHike(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      console.error(e);
      alert('Failed to delete completed hike.');
    } finally {
      setDeleting(false);
    }
  }

  const filtered = items.filter(
    h => !search || h.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Completed Hikes
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {items.length} completed hikes
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Completed Hike
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search completed hikes..."
          className={`${inputClass} pl-10`}
        />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty
          icon={Mountain}
          message="No completed hikes found. Click 'Add Completed Hike' to create one."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(h => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {h.image ? (
                <img
                  src={h.image}
                  alt={h.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Mountain className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                  {h.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {h.location}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    {h.difficulty}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {h.completed_date}
                  </span>
                  {!h.is_active && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openEdit(h)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1.5"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(h)}
                    className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        title={editing ? 'Edit Completed Hike' : 'Add Completed Hike'}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-4">
          <Field label="Name" required>
            <input
              className={inputClass}
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Location" required>
            <input
              className={inputClass}
              value={form.location || ''}
              onChange={e => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Elevation">
              <input
                className={inputClass}
                value={form.elevation || ''}
                onChange={e => setForm({ ...form, elevation: e.target.value })}
                placeholder="e.g. 2,285 meters"
              />
            </Field>
            <Field label="Distance">
              <input
                className={inputClass}
                value={form.distance || ''}
                onChange={e => setForm({ ...form, distance: e.target.value })}
                placeholder="e.g. 3,500 meters"
              />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Duration">
              <input
                className={inputClass}
                value={form.duration || ''}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 3-4 hours"
              />
            </Field>
            <Field label="Difficulty">
              <select
                className={inputClass}
                value={form.difficulty || 'Easy'}
                onChange={e => setForm({ ...form, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Hard">Hard</option>
              </select>
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Completed Date" required>
              <input
                type="date"
                className={inputClass}
                value={form.completed_date || ''}
                onChange={e => setForm({ ...form, completed_date: e.target.value })}
              />
            </Field>
            <Field label="Display Order">
              <input
                type="number"
                className={inputClass}
                value={form.display_order || 0}
                onChange={e =>
                  setForm({ ...form, display_order: Number(e.target.value) })
                }
              />
            </Field>
          </div>
          <Field label="Image URL">
            <input
              className={inputClass}
              value={form.image || ''}
              onChange={e => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              className={inputClass}
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="Highlights (comma-separated)">
            <input
              className={inputClass}
              value={highlightsText}
              onChange={e => setHighlightsText(e.target.value)}
              placeholder="Himalayan Ridge Panorama, Pine Forest Canopy"
            />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active ?? true}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
              className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active (visible on site)
            </span>
          </label>
          <SaveBar
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
            saving={saving}
          />
        </div>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Completed Hike"
        message={`Delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
