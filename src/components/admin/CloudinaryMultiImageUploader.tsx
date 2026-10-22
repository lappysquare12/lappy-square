'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Loader2,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface CloudinaryMultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  label?: string;
  helpText?: string;
}

export default function CloudinaryMultiImageUploader({
  images,
  onChange,
  folder = 'lappy-square/products',
  label = 'Product Image Gallery (Multiple Images)',
  helpText = 'Upload multiple laptop photos (front, keyboard, ports, back). First image is the primary cover photo.',
}: CloudinaryMultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        formData.append('resource_type', 'image');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        newUrls.push(data.url);
      }

      onChange([...images, ...newUrls]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Error uploading images');
    } finally {
      setUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const cleanUrl = urlInput.trim();
    if (!images.includes(cleanUrl)) {
      onChange([...images, cleanUrl]);
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const item = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([item, ...rest]);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            {label} ({images.length} {images.length === 1 ? 'image' : 'images'})
          </label>
          {helpText && <p className="text-[11px] text-slate-500 mt-0.5">{helpText}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Cancel URL' : 'Paste Image URL'}</span>
          </button>
        </div>
      </div>

      {/* Paste URL Input Drawer */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
            className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Add Photo
          </button>
        </form>
      )}

      {/* Image Gallery Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className={`group relative rounded-2xl border-2 overflow-hidden bg-slate-50 aspect-square flex flex-col justify-between transition-all ${
                idx === 0
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              <Image
                src={url}
                alt={`Product image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-contain p-2"
              />

              {/* Top Bar Badges & Remove */}
              <div className="absolute top-1.5 inset-x-1.5 z-10 flex items-center justify-between pointer-events-none">
                {idx === 0 ? (
                  <span className="pointer-events-auto bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    Cover Photo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="pointer-events-auto bg-white/90 hover:bg-white text-slate-700 hover:text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-slate-200 shadow-xs opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Set as Cover Photo"
                  >
                    Set Primary
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="pointer-events-auto w-6 h-6 rounded-full bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Re-order arrows on hover */}
              <div className="absolute bottom-1.5 inset-x-1.5 z-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, idx - 1)}
                  className="pointer-events-auto w-6 h-6 rounded-md bg-white/90 hover:bg-white text-slate-800 disabled:opacity-30 border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer"
                  title="Move left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-1.5 py-0.5 rounded">
                  #{idx + 1}
                </span>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => handleMove(idx, idx + 1)}
                  className="pointer-events-auto w-6 h-6 rounded-md bg-white/90 hover:bg-white text-slate-800 disabled:opacity-30 border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer"
                  title="Move right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add More Thumbnail Trigger Button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-600 hover:bg-blue-50/40 aspect-square flex flex-col items-center justify-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
            </div>
            <span className="text-[11px] font-bold">Add Photo</span>
          </button>
        </div>
      )}

      {/* Main Upload Dropzone (shown prominently when 0 images, or as an upload trigger) */}
      {images.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-3xl p-8 text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-blue-600 shadow-sm">
            {uploading ? (
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
            ) : (
              <UploadCloud className="w-7 h-7 text-blue-600" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {uploading ? uploadProgress : 'Click to Upload Multiple Photos'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Select multiple JPEG, PNG, or WebP laptop images at once.
            </p>
          </div>
          <div>
            <span className="inline-block px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
              Choose Images
            </span>
          </div>
        </div>
      )}

      {/* Hidden Multiple File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Uploading progress bar */}
      {uploading && images.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-xl font-medium animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{uploadProgress || 'Uploading images to Cloudinary...'}</span>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
          {uploadError}
        </div>
      )}
    </div>
  );
}
