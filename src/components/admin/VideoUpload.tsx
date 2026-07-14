import { useState, useRef } from 'react';
import { Upload, X, Loader2, Link as LinkIcon, Video } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { inputClass } from './AdminUI';

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function VideoUpload({ value, onChange, label = 'Video' }: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const fileName = `videos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

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
      setError(e instanceof Error ? e.message : 'Upload failed. Ensure the storage bucket exists and allows uploads.');
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearVideo() {
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const isStoredFile = value && !value.startsWith('http');
  const isUrl = value && value.startsWith('http');

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
        <div className="space-y-2">
          <input
            className={inputClass}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://... (mp4, webm, mov)"
          />
          {value && (
            <video
              src={value}
              controls
              className="w-full rounded-xl max-h-40 bg-black"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            className="relative h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500 cursor-pointer overflow-hidden transition-colors group"
          >
            {isUrl || isStoredFile ? (
              <>
                <video
                  src={value}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                    className="p-2 rounded-lg bg-white/90 text-gray-800 hover:bg-white"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); clearVideo(); }}
                    className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : uploading ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <span className="text-sm">Uploading video...</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <Video className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Click to upload video</span>
                <span className="text-xs mt-1">MP4, WebM, MOV up to 100MB</span>
              </div>
            )}
          </div>
          {value && (
            <video
              src={value}
              controls
              className="w-full rounded-xl max-h-48 bg-black"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={onInputChange}
        className="hidden"
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
