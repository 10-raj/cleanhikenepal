import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getAllCampaignsAdmin, createCampaign, updateCampaign, deleteCampaign } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';

interface CampaignRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  category: string;
  image: string;
  donors_count: number;
  end_date: string | null;
  status: string;
}

const emptyForm: Partial<CampaignRow> = { title: '', slug: '', description: '', goal_amount: 1000, current_amount: 0, category: 'environmental', image: '', donors_count: 0, end_date: '', status: 'active' };

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

export function CampaignsManager() {
  const [items, setItems] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CampaignRow | null>(null);
  const [form, setForm] = useState<Partial<CampaignRow>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CampaignRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try { setError(null); setLoading(true); const data = await getAllCampaignsAdmin(); setItems(data || []); }
    catch (e) { console.error(e); setError('Failed to fetch campaigns.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm(emptyForm); setModalOpen(true); }
  function openEdit(c: CampaignRow) { setEditing(c); setForm({ ...c, end_date: c.end_date ? c.end_date.split('T')[0] : '' }); setModalOpen(true); }

  async function handleSave() {
    if (!form.title || !form.description) { alert('Title and description are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title!),
        goal_amount: Number(form.goal_amount) || 0,
        current_amount: Number(form.current_amount) || 0,
        donors_count: Number(form.donors_count) || 0,
        end_date: form.end_date || null,
        image: form.image || 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?auto=compress&cs=tinysrgb&w=1200',
      };
      if (editing) await updateCampaign(editing.id, payload); else await createCampaign(payload);
      setModalOpen(false); await load();
    } catch (e) { console.error(e); alert('Failed to save campaign.'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteCampaign(deleteTarget.id); setDeleteTarget(null); await load(); }
    catch (e) { console.error(e); alert('Failed to delete campaign.'); }
    finally { setDeleting(false); }
  }

  const filtered = items.filter(c => !search || c.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Campaigns & Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} campaigns</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Campaign
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." className={`${inputClass} pl-10`} />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={Megaphone} message="No campaigns found. Click 'Add Campaign' to create one." />
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const progress = c.goal_amount > 0 ? Math.min(100, (Number(c.current_amount) / Number(c.goal_amount)) * 100) : 0;
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-48 h-32 sm:h-auto overflow-hidden flex-shrink-0">
                  {c.image ? <img src={c.image} alt={c.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />}
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 dark:text-white">{c.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'}`}>{c.status}</span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 text-xs capitalize">{c.category}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Rs. {Number(c.current_amount).toLocaleString()} raised</span>
                          <span>Goal: Rs. {Number(c.goal_amount).toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(c)} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1.5"><Pencil className="w-4 h-4" /> Edit</button>
                      <button onClick={() => setDeleteTarget(c)} className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? 'Edit Campaign' : 'Add Campaign'} onClose={() => setModalOpen(false)} maxWidth="max-w-2xl">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title" required><input className={inputClass} value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} /></Field>
            <Field label="Slug"><input className={inputClass} value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></Field>
          </div>
          <Field label="Description" required><textarea rows={3} className={inputClass} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Goal Amount (Rs.)" required><input type="number" className={inputClass} value={form.goal_amount || 0} onChange={e => setForm({ ...form, goal_amount: Number(e.target.value) })} /></Field>
            <Field label="Current Amount (Rs.)"><input type="number" className={inputClass} value={form.current_amount || 0} onChange={e => setForm({ ...form, current_amount: Number(e.target.value) })} /></Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Category"><select className={inputClass} value={form.category || 'environmental'} onChange={e => setForm({ ...form, category: e.target.value })}><option value="environmental">Environmental</option><option value="community">Community</option><option value="infrastructure">Infrastructure</option><option value="education">Education</option></select></Field>
            <Field label="Status"><select className={inputClass} value={form.status || 'active'} onChange={e => setForm({ ...form, status: e.target.value })}><option value="active">Active</option><option value="completed">Completed</option><option value="paused">Paused</option></select></Field>
            <Field label="End Date"><input type="date" className={inputClass} value={form.end_date || ''} onChange={e => setForm({ ...form, end_date: e.target.value })} /></Field>
          </div>
          <ImageUpload label="Campaign Image" folder="campaigns" value={form.image || ''} onChange={url => setForm({ ...form, image: url })} />
          <SaveBar onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Campaign" message={`Delete "${deleteTarget?.title}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
