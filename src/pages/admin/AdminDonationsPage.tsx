import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Search, CheckCircle, Clock, XCircle, TrendingUp, Eye, Trash2, ImageIcon, ShieldCheck, XCircle as RejectIcon } from 'lucide-react';
import { getAllDonations, verifyDonation, deleteDonation } from '../../services/admin';
import { AdminLoading, AdminError, AdminEmpty, ConfirmDialog, AdminModal } from '../../components/admin/AdminUI';

export function AdminDonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewDonation, setViewDonation] = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try { setError(null); setLoading(true); const data = await getAllDonations(); setDonations(data || []); }
    catch (e) { console.error(e); setError('Failed to fetch donations.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleVerify(id: string, status: 'pending' | 'verified' | 'rejected') {
    try {
      await verifyDonation(id, status);
      setDonations(donations.map(d => d.id === id ? { ...d, verification_status: status } : d));
      if (viewDonation?.id === id) setViewDonation({ ...viewDonation, verification_status: status });
    } catch (e) { console.error(e); alert('Failed to update verification.'); }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try { await deleteDonation(deleteTarget.id); setDeleteTarget(null); await load(); }
    catch (e) { console.error(e); alert('Failed to delete donation.'); }
    finally { setDeleting(false); }
  }

  const filtered = donations.filter(d => !search || d.donor_name?.toLowerCase().includes(search.toLowerCase()) || d.donor_email?.toLowerCase().includes(search.toLowerCase()));

  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  const verifyBadge = {
    pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
    verified: { label: 'Verified', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'text-red-600 bg-red-100 dark:bg-red-900/30', icon: XCircle },
  };

  if (loading) return <AdminLoading />;
  if (error) return <AdminError message={error} onRetry={load} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Donations</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Total raised: Rs. {totalAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600"><DollarSign className="w-6 h-6 text-white" /></div>
            <div><p className="text-sm text-gray-500">Total Donations</p><p className="text-2xl font-bold text-gray-900 dark:text-white">Rs. {totalAmount.toLocaleString()}</p></div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600"><TrendingUp className="w-6 h-6 text-white" /></div>
            <div><p className="text-sm text-gray-500">Total Donors</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{donations.length}</p></div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600"><ShieldCheck className="w-6 h-6 text-white" /></div>
            <div><p className="text-sm text-gray-500">Pending Verification</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{donations.filter(d => (d.verification_status || 'pending') === 'pending').length}</p></div>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by donor name or email..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
      </div>

      {filtered.length === 0 ? (
        <AdminEmpty icon={DollarSign} message="No donations found yet." />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Donor</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Method</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Proof</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Verification</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map(d => {
                const v = verifyBadge[(d.verification_status || 'pending') as keyof typeof verifyBadge];
                return (
                  <motion.tr key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{d.donor_name || 'Anonymous'}</p>
                        {d.donor_email && <p className="text-sm text-gray-500">{d.donor_email}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Rs. {Number(d.amount).toLocaleString()}</span></td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 capitalize">{d.payment_method}</td>
                    <td className="px-6 py-4">
                      {d.screenshot_url ? (
                        <a href={d.screenshot_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline">
                          <ImageIcon className="w-4 h-4" /> View
                        </a>
                      ) : <span className="text-gray-400 text-sm">No proof</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${v.color}`}>
                        <v.icon className="w-4 h-4" /> {v.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewDonation(d)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600" title="View details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteTarget(d)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {viewDonation && (
          <AdminModal open={!!viewDonation} title="Donation Details" onClose={() => setViewDonation(null)} maxWidth="max-w-xl">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Donor</p><p className="font-medium text-gray-900 dark:text-white">{viewDonation.donor_name || 'Anonymous'}</p></div>
                <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-900 dark:text-white">{viewDonation.donor_email || '—'}</p></div>
                <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium text-gray-900 dark:text-white">{viewDonation.donor_phone || '—'}</p></div>
                <div><p className="text-xs text-gray-500">Amount</p><p className="font-bold text-emerald-600">Rs. {Number(viewDonation.amount).toLocaleString()}</p></div>
                <div><p className="text-xs text-gray-500">Payment Method</p><p className="font-medium text-gray-900 dark:text-white capitalize">{viewDonation.payment_method}</p></div>
                <div><p className="text-xs text-gray-500">Transaction ID</p><p className="font-mono text-sm text-gray-900 dark:text-white">{viewDonation.transaction_id || '—'}</p></div>
                <div><p className="text-xs text-gray-500">Date</p><p className="font-medium text-gray-900 dark:text-white">{new Date(viewDonation.created_at).toLocaleString()}</p></div>
                <div><p className="text-xs text-gray-500">Campaign</p><p className="font-medium text-gray-900 dark:text-white">{viewDonation.donation_campaigns?.title || 'General'}</p></div>
              </div>

              {viewDonation.remarks && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 mb-1">Remarks</p>
                  <p className="text-sm text-gray-900 dark:text-white">{viewDonation.remarks}</p>
                </div>
              )}

              {viewDonation.message && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-900 dark:text-white">{viewDonation.message}</p>
                </div>
              )}

              {viewDonation.screenshot_url && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Payment Proof Screenshot</p>
                  <a href={viewDonation.screenshot_url} target="_blank" rel="noopener noreferrer">
                    <img src={viewDonation.screenshot_url} alt="Payment proof" className="w-full max-h-64 object-contain rounded-xl border border-gray-200 dark:border-gray-700" />
                  </a>
                </div>
              )}

              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Verification Status</p>
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(viewDonation.id, 'verified')} className={`flex-1 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 ${viewDonation.verification_status === 'verified' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'}`}>
                    <CheckCircle className="w-4 h-4" /> Verify
                  </button>
                  <button onClick={() => handleVerify(viewDonation.id, 'rejected')} className={`flex-1 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 ${viewDonation.verification_status === 'rejected' ? 'bg-red-500 text-white' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100'}`}>
                    <RejectIcon className="w-4 h-4" /> Reject
                  </button>
                  <button onClick={() => handleVerify(viewDonation.id, 'pending')} className={`flex-1 px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 ${viewDonation.verification_status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100'}`}>
                    <Clock className="w-4 h-4" /> Pending
                  </button>
                </div>
              </div>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      <ConfirmDialog open={!!deleteTarget} title="Delete Donation" message={`Delete donation from "${deleteTarget?.donor_name || 'Anonymous'}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
