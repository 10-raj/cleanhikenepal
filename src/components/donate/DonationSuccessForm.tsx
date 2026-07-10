import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, Heart, CheckCircle, Send, Loader2, Upload, AlertCircle, ImageIcon } from 'lucide-react';
import { PaymentMethod } from '../../config/paymentMethods';
import { uploadDonationScreenshot } from '../../services/admin';

interface DonationSuccessFormProps {
  paymentMethod: PaymentMethod | null;
  isOpen: boolean;
  onClose: () => void;
  isBank?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
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
    } catch (e) {
      console.error(e);
      setUploadError('Failed to upload screenshot. Please try again.');
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    // Validation: all required fields + screenshot
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setValidationError('Please enter a valid donation amount.');
      return;
    }
    if (!formData.name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!formData.remarks.trim()) {
      setValidationError('Please add a remark (e.g. donation purpose).');
      return;
    }
    if (!screenshotUrl) {
      // Try to upload if file selected but not yet uploaded
      if (screenshot && !uploading) {
        await handleUpload();
      }
      setValidationError('Please upload a payment proof screenshot to confirm your donation.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/record-donation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email || null,
            phone: formData.phone || null,
            amount: parseFloat(formData.amount),
            paymentMethod: isBank ? 'bank' : paymentMethod?.id,
            transactionId: formData.transactionId || null,
            remarks: formData.remarks,
            screenshotUrl,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to record donation');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to record donation:', error);
      setValidationError('Failed to submit donation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setFormData({ name: '', email: '', phone: '', amount: '', transactionId: '', remarks: '' });
    removeScreenshot();
    setValidationError(null);
    setUploadError(null);
    setSubmitted(false);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Floating close */}
          <button onClick={handleClose} aria-label="Close" className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <>
              {/* Header */}
              <div className="p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white pr-14">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">Confirm Your Donation</h3>
                    <p className="text-white/80 text-sm">via {methodName}</p>
                  </div>
                </div>
              </div>

              {/* Form — scrollable */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  You sent via {methodName}. Help us verify your donation by providing details and a payment screenshot below.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Donation Amount (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="1000"
                      className="w-full pl-14 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Transaction / Reference ID
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="e.g. TXN123456789"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">JPG, PNG, or WEBP. Max 5MB.</p>

                  {!screenshotPreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400"
                    >
                      <Upload className="w-8 h-8" />
                      <span className="text-sm font-medium">Click to upload payment proof</span>
                    </button>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img src={screenshotPreview} alt="Payment proof" className="w-full max-h-48 object-contain bg-gray-50 dark:bg-gray-700" />
                      <button type="button" onClick={removeScreenshot} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70">
                        <X className="w-4 h-4" />
                      </button>
                      {!screenshotUrl && (
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                          <button type="button" onClick={handleUpload} disabled={uploading} className="w-full py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2">
                            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><ImageIcon className="w-4 h-4" /> Confirm Upload</>}
                          </button>
                        </div>
                      )}
                      {screenshotUrl && (
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm">
                          <CheckCircle className="w-4 h-4" /> Screenshot uploaded
                        </div>
                      )}
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
                  {uploadError && <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {uploadError}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Remarks <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.remarks}
                    onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="Donation purpose or message for the organization..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                </div>

                {validationError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {validationError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
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
              className="p-8 text-center overflow-y-auto"
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
    </AnimatePresence>
  );
}
