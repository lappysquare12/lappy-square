'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, Sparkles, X, CheckCircle2, Film, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

interface CloudinaryMediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  mediaType?: 'image' | 'video' | 'all';
  label?: string;
  placeholder?: string;
  helpText?: string;
  aspectRatio?: 'banner' | 'video' | 'square' | 'auto';
  required?: boolean;
}

export default function CloudinaryMediaUploader({
  value,
  onChange,
  folder = 'lappy-square/uploads',
  mediaType = 'image',
  label = 'Media Upload (Cloudinary)',
  placeholder = 'https://res.cloudinary.com/... or paste image URL',
  helpText = 'Upload directly from your device or paste a web URL.',
  aspectRatio = 'auto',
  required = false,
}: CloudinaryMediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptTypes =
    mediaType === 'image'
      ? 'image/jpeg,image/png,image/webp,image/gif,image/avif'
      : mediaType === 'video'
      ? 'video/mp4,video/webm,video/quicktime,video/x-msvideo'
      : 'image/*,video/*';

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    return (
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.mov') ||
      url.includes('/video/upload/') ||
      url.includes('youtube.com') ||
      url.includes('youtu.be')
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-uploading the same file works
    e.target.value = '';

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append(
        'resource_type',
        mediaType === 'image' ? 'image' : mediaType === 'video' ? 'video' : 'auto'
      );

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload to Cloudinary failed');
      }

      onChange(data.url);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  const aspectClass =
    aspectRatio === 'banner'
      ? 'aspect-[16/7]'
      : aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'min-h-[140px] max-h-[220px]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Cloudinary</span>
          </span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL' : 'Paste URL'}</span>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview or Upload Drop Area */}
      {value ? (
        <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 group">
          {isVideoUrl(value) && !value.includes('youtube.com') && !value.includes('youtu.be') ? (
            <video
              src={value}
              controls
              className={`w-full ${aspectClass} object-cover`}
            />
          ) : isVideoUrl(value) ? (
            <div className={`w-full ${aspectClass} flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center`}>
              <Film className="w-10 h-10 text-rose-500 mb-2" />
              <p className="text-xs font-semibold truncate max-w-full px-4">{value}</p>
              <span className="text-[10px] text-slate-400 mt-1">Video Link Attached</span>
            </div>
          ) : (
            <div className={`relative w-full ${aspectClass}`}>
              <Image
                src={value}
                alt="Cloudinary media preview"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          )}

          {/* Action overlay bar */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px] font-mono text-slate-600 truncate flex-1">
                {value}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1"
              >
                <UploadCloud className="w-3 h-3 text-slate-600" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove media"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center text-center group ${
            uploading ? 'pointer-events-none opacity-80 bg-slate-50' : ''
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-slate-900">Uploading to Cloudinary...</p>
              <p className="text-[10px] text-slate-400">Optimizing & converting automatically</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-100 group-hover:scale-105 transition-all flex items-center justify-center text-blue-700 shadow-2xs">
                {mediaType === 'video' ? (
                  <Film className="w-6 h-6" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Click to Upload {mediaType === 'video' ? 'Video' : 'Image'} to Cloudinary
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{helpText}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual URL input toggle (or when active) */}
      {(showUrlInput || !value) && (
        <div className="pt-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-blue-600 font-mono text-slate-800"
          />
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2">
          {uploadError}
        </p>
      )}
    </div>
  );
}
