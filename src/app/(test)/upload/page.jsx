'use client';

import { useState } from 'react';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB limit

export default function UploadTestPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileSelect = (selectedFile) => {
    setStatus({ type: '', message: '' });
    setUploadedUrl('');

    if (!selectedFile) return;

    // 1 MB Client-side Validation
    if (selectedFile.size > MAX_FILE_SIZE) {
      setStatus({
        type: 'error',
        message: `File size exceeds 1 MB limit (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB).`,
      });
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      setUploadedUrl(data.imageUrl);
      setStatus({ type: 'success', message: 'Image uploaded successfully to VPS storage!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const fullImageUrl = uploadedUrl.startsWith('http')
    ? uploadedUrl
    : `${process.env.NEXT_PUBLIC_API_URL || ''}${uploadedUrl}`;

  return (
    <main className="min-h-screen bg-[#080B1A] flex items-center justify-center p-6 text-slate-100 font-sans">
      <div className="w-full max-w-lg bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
            LexFlow Image Storage Test
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Test Next.js file upload to AlmaLinux VPS Nginx directory (`/var/www/uploads/images`). Max 1 MB.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Drag & Drop Upload Zone */}
          <div
            className="border-2 border-dashed border-slate-700 hover:border-amber-400/60 transition-colors rounded-xl p-6 text-center cursor-pointer bg-slate-950/40 relative group"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            <div className="flex flex-col items-center justify-center space-y-2">
              <FiUploadCloud className="text-4xl text-slate-400 group-hover:text-amber-400 transition-colors" />
              <p className="text-xs font-medium text-slate-300">
                <span className="text-amber-400 font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                PNG, JPG, or WEBP (MAX 1 MB)
              </p>
            </div>
          </div>

          {/* Image Preview Window */}
          {preview && (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
              <img
                src={preview}
                alt="Selected preview"
                className="w-16 h-16 object-cover rounded-lg border border-slate-700"
              />
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-medium text-slate-200 truncate">{file?.name}</p>
                <p className="text-[10px] text-slate-400">
                  {(file?.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          )}

          {/* Status Message Feed */}
          {status.message && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                status.type === 'error'
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}
            >
              {status.type === 'error' ? <FiAlertCircle className="text-base shrink-0" /> : <FiCheckCircle className="text-base shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg ${
              !file || isUploading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-white hover:bg-slate-200 text-slate-950'
            }`}
          >
            {isUploading ? 'Uploading to VPS...' : 'Upload Image'}
          </button>
        </form>

        {/* Nginx Static Asset Result Display */}
        {uploadedUrl && (
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
              Image Direct URL (Served by Nginx)
            </span>
            <div className="mt-2 bg-slate-950 p-3 rounded-lg border border-slate-800 break-all text-xs font-mono text-amber-400">
              {fullImageUrl}
            </div>
            <a
              href={fullImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-xs text-slate-300 hover:text-white underline font-medium"
            >
              Open Image in New Tab ↗
            </a>
          </div>
        )}
      </div>
    </main>
  );
}