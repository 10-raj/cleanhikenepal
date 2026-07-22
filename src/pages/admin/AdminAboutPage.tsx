import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit3, Eye, EyeOff, Save, X, ArrowUp, ArrowDown, Users, FileText,
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { AdminLoading, AdminEmpty, inputClass, Field } from '../../components/admin/AdminUI';
import { useToast, toErrorMessage } from '../../context/ToastContext';

type AboutSection = 'founders' | 'history' | 'mission' | 'vision' | 'values' | 'story';
type ContentStatus = 'published' | 'draft';

interface AboutItem {
  id: string;
  section: AboutSection;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  designation: string | null;
  display_order: number;
  is_active: boolean;
  status: ContentStatus;
}

const sectionLabels: Record<AboutSection, string> = {
  founders: 'Founder Members',
  history: 'History',
  mission: 'Mission',
  vision: 'Vision',
  values: 'Values',
  story: 'Story',
};

const defaultForm = {
  section: 'founders' as AboutSection,
  title: '',
  subtitle: '',
  description: '',
  image: '',
  designation: '',
  display_order: 0,
  is_active: true,
  status: 'published' as ContentStatus,
};

export function AdminAboutPage() {
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ ...defaultForm });

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('section', { ascending: true })
        .order('display_order', { ascending: true });
      if (error) throw error;
      setItems((data as AboutItem[]) || []);
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to load about content.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setSaving(true);
    try {
      if (!newItem.title) {
        showError('Title is required.');
        setSaving(false);
        return;
      }
      const { error } = await supabase.from('about_content').insert([{
        section: newItem.section,
        title: newItem.title,
        subtitle: newItem.subtitle || null,
        description: newItem.description || null,
        image: newItem.image || null,
        designation: newItem.designation || null,
        display_order: newItem.display_order,
        is_active: newItem.is_active,
        status: newItem.status,
      }]);
      if (error) throw error;
      setNewItem({ ...defaultForm });
      setShowAddForm(false);
      showSuccess('Content added successfully.');
      await load();
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to add content.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, form: typeof defaultForm) {
    setSaving(true);
    try {
      const { error } = await supabase.from('about_content').update({
        section: form.section,
        title: form.title,
        subtitle: form.subtitle || null,
        description: form.description || null,
        image: form.image || null,
        designation: form.designation || null,
        display_order: form.display_order,
        is_active: form.is_active,
        status: form.status,
      }).eq('id', id);
      if (error) throw error;
      showSuccess('Content updated successfully.');
      setEditingId(null);
      await load();
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to update content.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this content item?')) return;
    try {
      const { error } = await supabase.from('about_content').delete().eq('id', id);
      if (error) throw error;
      setItems(prev => prev.filter(i => i.id !== id));
      showSuccess('Content deleted.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to delete content.'));
    }
  }

  async function handleToggleActive(item: AboutItem) {
    try {
      const { error } = await supabase.from('about_content').update({ is_active: !item.is_active }).eq('id', item.id);
      if (error) throw error;
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
      showSuccess(item.is_active ? 'Content unpublished.' : 'Content published.');
    } catch (e) {
      showError(toErrorMessage(e, 'Failed to toggle content.'));
    }
  }

  async function handleMove(item: AboutItem, direction: 'up' | 'down') {
    const sectionItems = items.filter(i => i.section === item.section).sort((a, b) => a.display_order - b.display_order);
    const idx = sectionItems.findIndex(i => i.id === item.id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sectionItems.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const swapItem = sectionItems[swapIdx];
    await Promise.all([
      supabase.from('about_content').update({ display_order: swapItem.display_order }).eq('id', item.id),
      supabase.from('about_content').update({ display_order: item.display_order }).eq('id', swapItem.id),
    ]);
    await load();
  }

  if (loading) return <AdminLoading />;

  const sections = Object.keys(sectionLabels) as AboutSection[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Page Content</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage founder members, history, mission, vision, and more</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Content
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">New Content Item</h3>
              <button onClick={() => setShowAddForm(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <AboutFormFields
              form={newItem}
              setForm={setNewItem}
              onSave={handleAdd}
              onCancel={() => setShowAddForm(false)}
              saving={saving}
              saveLabel="Add Content"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {items.length === 0 && (
        <AdminEmpty icon={FileText} message="No about content yet. Click 'Add Content' to get started." />
      )}

      <div className="space-y-8">
        {sections.map(section => {
          const sectionItems = items.filter(i => i.section === section);
          if (sectionItems.length === 0) return null;
          return (
            <div key={section}>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                {section === 'founders' ? <Users className="w-5 h-5 text-emerald-500" /> : <FileText className="w-5 h-5 text-emerald-500" />}
                {sectionLabels[section]}
              </h2>
              <div className="space-y-3">
                {sectionItems.map((item, idx) => (
                  <motion.div key={item.id} layout className={`rounded-2xl border overflow-hidden ${item.is_active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-100 dark:border-gray-800 opacity-60'}`}>
                    {editingId === item.id ? (
                      <div className="p-5 bg-white dark:bg-gray-800">
                        <EditAboutForm
                          item={item}
                          onSave={form => handleUpdate(item.id, form)}
                          onCancel={() => setEditingId(null)}
                          saving={saving}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800">
                        {item.image ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                            {item.status === 'draft' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">Draft</span>
                            )}
                          </div>
                          {item.designation && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{item.designation}</p>}
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.description || ''}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => handleMove(item, 'up')} disabled={idx === 0} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-30 transition-colors">
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleMove(item, 'down')} disabled={idx === sectionItems.length - 1} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 disabled:opacity-30 transition-colors">
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleToggleActive(item)} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors">
                            {item.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                          </button>
                          <button onClick={() => setEditingId(item.id)} className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center text-red-400 transition-colors">
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
        })}
      </div>
    </div>
  );
}

function AboutFormFields({
  form,
  setForm,
  onSave,
  onCancel,
  saving,
  saveLabel,
}: {
  form: typeof defaultForm;
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  saveLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Section" required>
          <select className={inputClass} value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value as AboutSection }))}>
            {(Object.keys(sectionLabels) as AboutSection[]).map(s => (
              <option key={s} value={s}>{sectionLabels[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Display Order">
          <input type="number" className={inputClass} value={form.display_order} onChange={e => setForm(f => ({ ...f, display_order: Number(e.target.value) }))} />
        </Field>
      </div>
      <Field label="Title" required>
        <input className={inputClass} placeholder="e.g. Raj Acharya" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      </Field>
      <Field label="Designation (for founders)">
        <input className={inputClass} placeholder="e.g. Founder & Director" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} />
      </Field>
      <Field label="Subtitle">
        <input className={inputClass} placeholder="Optional subtitle" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
      </Field>
      <Field label="Description">
        <textarea rows={3} className={inputClass} placeholder="Content body" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </Field>
      <ImageUpload label="Photo" folder="about" value={form.image} onChange={url => setForm(f => ({ ...f, image: url }))} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Status">
          <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ContentStatus }))}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="rounded" />
            Active (visible on site)
          </label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : saveLabel}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function EditAboutForm({
  item,
  onSave,
  onCancel,
  saving,
}: {
  item: AboutItem;
  onSave: (form: typeof defaultForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({
    section: item.section,
    title: item.title || '',
    subtitle: item.subtitle || '',
    description: item.description || '',
    image: item.image || '',
    designation: item.designation || '',
    display_order: item.display_order,
    is_active: item.is_active,
    status: item.status,
  });

  return (
    <div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Edit Content</h3>
      <AboutFormFields
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
