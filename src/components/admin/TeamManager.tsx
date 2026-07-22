import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../services/admin';
import { AdminLoading, AdminEmpty, AdminError, ConfirmDialog, AdminModal, Field, inputClass, SaveBar } from './AdminUI';
import { ImageUpload } from './ImageUpload';
import { useToast, toErrorMessage } from '../../context/ToastContext';

interface TeamMemberRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social_links: Record<string, string>;
  display_order: number;
  is_active: boolean;
}

const emptyForm: Partial<TeamMemberRow> = {
  name: '', role: '', bio: '', image: '', social_links: {}, display_order: 0, is_active: true,
};

export function TeamManager() {
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRow | null>(null);
  const [form, setForm] = useState<Partial<TeamMemberRow>>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try { setError(null); setLoading(true); const data = await getAllTeamMembers(); setItems(data || []); }
    catch (e) { console.error(e); setError('Failed to fetch team members.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditing(null); setForm({ ...emptyForm, social_links: {} }); setModalOpen(true); }
  function openEdit(m: TeamMemberRow) { setEditing(m); setForm({ ...m, social_links: m.social_links || {} }); setModalOpen(true); }

  async function handleSave() {
    if (!form.name || !form.role) { showError('Name and designation are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        role: form.role,
        bio: form.bio || '',
        image: form.image || '',
        social_links: form.social_links || {},
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active !== false,
      };
      if (editing) await updateTeamMember(editing.id, payload); else await createTeamMember(payload);
      setModalOpen(false); showSuccess(editing ? 'Team member updated successfully.' : 'Team member added successfully.'); await load();
    } catch (e) { console.error(e); showError(toErrorMessage(e, 'Failed to save team member.')); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteTeamMember(deleteTarget.id); setDeleteTarget(null); showSuccess('Team member deleted.'); await load(); }
    catch (e) { console.error(e); showError(toErrorMessage(e, 'Failed to delete team member.')); }
    finally { setDeleting(false); }
  }

  const filtered = items.filter(m => !search || m.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{items.length} members</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Member
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className={`${inputClass} pl-10`} />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={Users} message="No team members found. Click 'Add Member' to create one." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(m => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
                  {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : <Users className="w-8 h-8 text-gray-400 m-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">{m.name}</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{m.role}</p>
                  {!m.is_active && <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs">Inactive</span>}
                </div>
              </div>
              <div className="flex gap-2 px-4 pb-4">
                <button onClick={() => openEdit(m)} className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-1.5"><Pencil className="w-4 h-4" /> Edit</button>
                <button onClick={() => setDeleteTarget(m)} className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} title={editing ? 'Edit Member' : 'Add Member'} onClose={() => setModalOpen(false)} maxWidth="max-w-xl">
        <div className="space-y-4">
          <ImageUpload label="Profile Photo" folder="team" aspect="square" value={form.image || ''} onChange={url => setForm({ ...form, image: url })} />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name" required><input className={inputClass} value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Designation" required><input className={inputClass} value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} /></Field>
          </div>
          <Field label="Description"><textarea rows={2} className={inputClass} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} /></Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Twitter URL"><input className={inputClass} value={form.social_links?.twitter || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })} placeholder="https://twitter.com/..." /></Field>
            <Field label="LinkedIn URL"><input className={inputClass} value={form.social_links?.linkedin || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })} placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Instagram URL"><input className={inputClass} value={form.social_links?.instagram || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })} placeholder="https://instagram.com/..." /></Field>
            <Field label="Facebook URL"><input className={inputClass} value={form.social_links?.facebook || ''} onChange={e => setForm({ ...form, social_links: { ...form.social_links, facebook: e.target.value } })} placeholder="https://facebook.com/..." /></Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Display Order"><input type="number" className={inputClass} value={form.display_order || 0} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} /></Field>
            <Field label="Status"><select className={inputClass} value={form.is_active === false ? 'false' : 'true'} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })}><option value="true">Active</option><option value="false">Inactive</option></select></Field>
          </div>
          <SaveBar onSave={handleSave} onCancel={() => setModalOpen(false)} saving={saving} />
        </div>
      </AdminModal>

      <ConfirmDialog open={!!deleteTarget} title="Delete Member" message={`Delete "${deleteTarget?.name}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
