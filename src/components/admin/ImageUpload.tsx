import { useState, useRef } from 'react';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { inputClass } from './AdminUI';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  aspect?: 'square' | 'wide';
}

export function ImageUpload({ value, onChange, label = 'Image', folder = 'misc', aspect = 'wide' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('admin-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('admin-images')
        .getPublicUrl(fileName);

      onChange(urlData.publicUrl);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearImage() {
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const aspectClass = aspect === 'square' ? 'aspect-square' : 'h-40';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrl(!showUrl)}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrl ? 'Upload from PC' : 'Use URL instead'}
        </button>
      </div>

      {showUrl ? (
        <input
          className={inputClass}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
        />
      ) : (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          className={`relative ${aspectClass} rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer overflow-hidden transition-colors group`}
        >
          {value ? (
            <>
              <img src={value} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); clearImage(); }}
                  className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : uploading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onInputChange}
        className="hidden"
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
