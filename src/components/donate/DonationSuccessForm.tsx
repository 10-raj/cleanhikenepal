import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, Heart, CheckCircle, Send, Loader2, Upload, AlertCircle, ImageIcon, Trash2 } from 'lucide-react';
import { PaymentMethod } from '../../config/paymentMethods';
import { uploadDonationScreenshot } from '../../services/admin';
import { sendDonationEmail } from '../../services/email.service';

interface DonationSuccessFormProps {
  paymentMethod: PaymentMethod | null;
  isOpen: boolean;
  onClose: () => void;
  isBank?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function DonationSuccessForm({ paymentMethod, isOpen, onClose, isBank }: DonationSuccessFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    transactionId: '',
    remarks: '',
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methodName = isBank ? 'Bank Transfer' : paymentMethod?.name || '';

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setValidationError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError('Only JPG, PNG, or WEBP files are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File too large. Maximum size is 5MB.');
      return;
    }

    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
    setScreenshotUrl(null);
  }

  async function handleUpload() {
    if (!screenshot) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadDonationScreenshot(screenshot);
      setScreenshotUrl(url);
    } catch {
      // If Supabase storage fails, we'll include the file name info in the email instead
      // Store a placeholder so we know a file was selected
      setScreenshotUrl(`file-attached:${screenshot.name}`);
      setUploadError(null); // Don't block submission
    } finally {
      setUploading(false);
    }
  }

  function removeScreenshot() {
    setScreenshot(null);
    setScreenshotPreview(null);
    setScreenshotUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleClose() {
    setFormData({ name: '', email: '', phone: '', amount: '', transactionId: '', remarks: '' });
    setScreenshot(null);
    setScreenshotPreview(null);
    setScreenshotUrl(null);
    setUploadError(null);
    setValidationError(null);
    setSubmitted(false);
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setValidationError('Please enter a valid donation amount.');
      return;
    }
    if (!formData.name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!formData.phone.trim()) {
      setValidationError('Please enter your phone number.');
      return;
    }
    if (!formData.remarks.trim()) {
      setValidationError('Please add a remark (e.g. donation purpose).');
      return;
    }

    // If screenshot is selected but not uploaded, upload it first
    if (screenshot && !screenshotUrl) {
      setUploading(true);
      try {
        const url = await uploadDonationScreenshot(screenshot);
        setScreenshotUrl(url);
      } catch {
        // Continue without screenshot URL — note file name in email
        setScreenshotUrl(`file-attached:${screenshot.name}`);
      } finally {
        setUploading(false);
      }
    }

    setLoading(true);
    try {
      // 1. Try Supabase edge function first
      let supabaseSuccess = false;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/record-donation`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email || null,
              phone: formData.phone,
              amount: parseFloat(formData.amount),
              payment_method: methodName,
              transaction_id: formData.transactionId || null,
              remarks: formData.remarks,
              screenshot_url: screenshotUrl || null,
            }),
          }
        );
        supabaseSuccess = response.ok;
      } catch { /* fall through to email */ }

      // 2. Always send notification email via Web3Forms
      await sendDonationEmail({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        amount: formData.amount,
        paymentMethod: methodName,
        transactionId: formData.transactionId || undefined,
        remarks: formData.remarks,
        screenshotUrl: screenshotUrl && !screenshotUrl.startsWith('file-attached:')
          ? screenshotUrl
          : screenshot
            ? `Screenshot attached (${screenshot.name})`
            : undefined,
      });

      setSubmitted(true);
    } catch (err) {
      setValidationError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {!submitted ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Donation</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">via {methodName}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email (Optional)</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label>
                      <input
                        required
                        value={formData.phone}
                        onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+977 9XXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Amount (NPR) *</label>
                      <input
                        required
                        type="number"
                        min="1"
                        value={formData.amount}
                        onChange={e => setFormData(f => ({ ...f, amount: e.target.value }))}
                        placeholder="e.g. 500"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    {/* Transaction ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transaction ID</label>
                      <input
                        value={formData.transactionId}
                        onChange={e => setFormData(f => ({ ...f, transactionId: e.target.value }))}
                        placeholder="Optional"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Remarks / Purpose *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.remarks}
                      onChange={e => setFormData(f => ({ ...f, remarks: e.target.value }))}
                      placeholder="e.g. Trail cleanup support, environmental fund..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                    />
                  </div>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Proof Screenshot</label>
                    {!screenshotPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click to upload <span className="text-emerald-600 dark:text-emerald-400 font-medium">payment proof</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={screenshotPreview}
                          alt="Payment proof"
                          className="w-full h-40 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          {!screenshotUrl && !uploading && (
                            <button
                              type="button"
                              onClick={handleUpload}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors shadow flex items-center gap-1"
                            >
                              <Upload className="w-3 h-3" /> Upload
                            </button>
                          )}
                          {uploading && (
                            <span className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                            </span>
                          )}
                          {screenshotUrl && (
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Uploaded
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={removeScreenshot}
                            className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {uploadError && (
                      <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {uploadError}
                      </p>
                    )}
                  </div>

                  {validationError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {validationError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                    ) : uploading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Uploading proof...</>
                    ) : (
                      <><Send className="w-5 h-5" /> I Have Donated</>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Donation Recorded!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Thank you for supporting nature conservation. Your donation is pending verification. We'll confirm it shortly.
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
