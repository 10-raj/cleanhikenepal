import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getAllSponsorsAdmin, createSponsor, updateSponsor, deleteSponsor } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';

interface SponsorRow {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm: Partial<SponsorRow> = { name: '', logo: '', website: '', tier: 'silver', description: '', display_order: 0, is_active: true };

export function SponsorsManager() {
  const [items, setItems] = useState<SponsorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SponsorRow | null>(null);
  const [form, setForm] = useState<Partial<SponsorRow>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SponsorRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try { setError(null); setLoading(true); const data = await getAllSponsorsAdmin(); setItems(data || []); }
    catch (e) { console.error(e); setError('Failed to fetch sponsors.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(s: SponsorRow) { setEditing(s); setForm(s); setModalOpen(true); }

  async function handleSave() {
    if (!form.name) { alert('Sponsor name is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, display_order: Number(form.display_order) || 0 };
      if (editing) await updateSponsor(editing.id, payload); else await createSponsor(payload);
      setModalOpen(false); await load();
    } catch (e) { console.error(e); alert('Failed to save sponsor.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteSponsor(deleteTarget.id); setDeleteTarget(null); await load(); }
    catch (e) { console.error(e); alert('Failed to delete sponsor.'); }
    finally { setDeleting(false); }
  }

  const filtered = items.filter(s => !search || s.name?.toLowerCase().includes(search.toLowerCase()));

  const tierColors: Record<string, string> = {
    platinum: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900',
    gold: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-900',
    silver: 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700',
    bronze: 'bg-gradient-to-r from-orange-400 to-amber-600 text-white',
  };

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sponsors</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} sponsors</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Sponsor
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sponsors..." className={`${inputClass} pl-10`} />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={Handshake} message="No sponsors found. Click 'Add Sponsor' to create one." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-4 mb-4">
                {s.logo ? <img src={s.logo} alt={s.name} className="w-16 h-16 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 p-2" /> : <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center"><Handshake className="w-8 h-8 text-gray-400" /></div>}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{s.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${tierColors[s.tier] || 'bg-gray-200 text-gray-700'}`}>{s.tier}</span>
                </div>
              </div>
              {s.description && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{s.description}</p>}
              {!s.is_active && <span className="inline-block mb-3 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">Inactive</span>}
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)} className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1.5"><Pencil className="w-4 h-4" /> Edit</button>
                <button onClick={() => setDeleteTarget(s)} className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? 'Edit Sponsor' : 'Add Sponsor'} onClose={() => setModalOpen(false)}>
        <div className="space-y-4">
          <Field label="Name" required><input className={inputClass} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <ImageUpload label="Sponsor Logo" folder="sponsors" aspect="square" value={form.logo || ''} onChange={url => setForm({ ...form, logo: url })} />
          <Field label="Website"><input className={inputClass} value={form.website || ''} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." /></Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Tier"><select className={inputClass} value={form.tier || 'silver'} onChange={e => setForm({ ...form, tier: e.target.value })}><option value="platinum">Platinum</option><option value="gold">Gold</option><option value="silver">Silver</option><option value="bronze">Bronze</option></select></Field>
            <Field label="Display Order"><input type="number" className={inputClass} value={form.display_order || 0} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} /></Field>
          </div>
          <Field label="Description"><textarea rows={3} className={inputClass} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active (visible on site)</span>
          </label>
          <SaveBar onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Sponsor" message={`Delete "${deleteTarget?.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
