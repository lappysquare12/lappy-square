'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Video, Star, ExternalLink, Loader2, Sparkles, CheckCircle2, AlertCircle, Edit2 } from 'lucide-react';
import CloudinaryMediaUploader from '@/components/admin/CloudinaryMediaUploader';

interface VideoReview {
  id: string;
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  laptopModel: string | null;
  rating: number;
  featured: boolean;
  displayOrder: number;
}

export default function VideoReviewsAdminClient({
  initialReviews,
}: {
  initialReviews: VideoReview[];
}) {
  const [reviews, setReviews] = useState<VideoReview[]>(initialReviews);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingReview, setEditingReview] = useState<VideoReview | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New review form state
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    videoUrl: '',
    thumbnailUrl: '',
    laptopModel: '',
    rating: 5,
    featured: true,
    displayOrder: 0,
  });

  // Edit review form state
  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    customerName: '',
    videoUrl: '',
    thumbnailUrl: '',
    laptopModel: '',
    rating: 5,
    featured: true,
    displayOrder: 0,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.customerName.trim() || !formData.videoUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Title, customer name, and video URL are required' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/video-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add video review');

      setStatusMessage({ type: 'success', text: 'Video review added successfully!' });
      setReviews((prev) => [data.review, ...prev]);
      setShowAddModal(false);
      setFormData({
        title: '',
        customerName: '',
        videoUrl: '',
        thumbnailUrl: '',
        laptopModel: '',
        rating: 5,
        featured: true,
        displayOrder: 0,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video review?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/video-reviews?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setStatusMessage({ type: 'success', text: 'Video review deleted' });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (rev: VideoReview) => {
    setEditingReview(rev);
    setEditFormData({
      id: rev.id,
      title: rev.title,
      customerName: rev.customerName,
      videoUrl: rev.videoUrl,
      thumbnailUrl: rev.thumbnailUrl || '',
      laptopModel: rev.laptopModel || '',
      rating: rev.rating,
      featured: rev.featured,
      displayOrder: rev.displayOrder,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editFormData.customerName.trim() || !editFormData.videoUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Title, customer name, and video URL are required' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/video-reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update video review');

      setStatusMessage({ type: 'success', text: 'Video review updated successfully!' });
      setReviews((prev) => prev.map((r) => (r.id === editFormData.id ? data.review : r)));
      setEditingReview(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating review';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="font-semibold text-slate-800">All Video Reviews ({reviews.length})</h2>
          <p className="text-xs text-slate-500">YouTube, Shorts, or Instagram video unboxing links</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Video Review
        </button>
      </div>

      {/* Grid of Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Video className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700">No video reviews yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Add your customer feedback videos from YouTube, Shorts, or unboxings to build trust and show off your refurbished laptops.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add First Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Video Preview / Thumbnail */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                  {rev.thumbnailUrl ? (
                    <img
                      src={rev.thumbnailUrl}
                      alt={rev.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <Video className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No custom thumbnail</span>
                    </div>
                  )}
                  {rev.featured && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-slate-600 font-bold">{rev.rating}.0</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{rev.title}</h3>
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">{rev.customerName}</span>
                    {rev.laptopModel && ` • ${rev.laptopModel}`}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate font-mono">
                    {rev.videoUrl}
                  </p>
                </div>
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <a
                  href={rev.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Watch Video
                </a>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Edit video review"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    disabled={deletingId === rev.id}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete review"
                  >
                    {deletingId === rev.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Add Customer Video Review</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro M1 Unboxing & Honest Review"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sharma, Jaipur"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Laptop Model Purchased</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple MacBook Air M1"
                    value={formData.laptopModel}
                    onChange={(e) => setFormData({ ...formData, laptopModel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <CloudinaryMediaUploader
                value={formData.videoUrl}
                onChange={(url) => setFormData({ ...formData, videoUrl: url })}
                folder="lappy-square/videos"
                mediaType="video"
                aspectRatio="video"
                label="Review Video (Cloudinary / YouTube)"
                placeholder="Upload MP4/WebM video or paste YouTube URL"
                helpText="Upload a customer video to Cloudinary or paste a YouTube/Video link"
                required
              />

              <CloudinaryMediaUploader
                value={formData.thumbnailUrl}
                onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
                folder="lappy-square/thumbnails"
                mediaType="image"
                aspectRatio="video"
                label="Custom Thumbnail Image (Optional)"
                placeholder="Upload thumbnail or paste image URL (auto-fetched if blank)"
                helpText="Optional: If left blank, YouTube thumbnail will be fetched automatically"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1 to 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs outline-none bg-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredReview"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="featuredReview" className="font-semibold text-slate-700 cursor-pointer">
                  Featured on Homepage & Reviews Section
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Video Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">Edit Customer Video Review</h3>
              </div>
              <button
                onClick={() => setEditingReview(null)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Review Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro M1 Unboxing & Honest Review"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohit Sharma, Jaipur"
                    value={editFormData.customerName}
                    onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Laptop Model Purchased</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple MacBook Air M1"
                    value={editFormData.laptopModel}
                    onChange={(e) => setEditFormData({ ...editFormData, laptopModel: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <CloudinaryMediaUploader
                value={editFormData.videoUrl}
                onChange={(url) => setEditFormData({ ...editFormData, videoUrl: url })}
                folder="lappy-square/videos"
                mediaType="video"
                aspectRatio="video"
                label="Review Video (Cloudinary / YouTube)"
                placeholder="Upload MP4/WebM video or paste YouTube URL"
                helpText="Upload a customer video to Cloudinary or paste a YouTube/Video link"
                required
              />

              <CloudinaryMediaUploader
                value={editFormData.thumbnailUrl}
                onChange={(url) => setEditFormData({ ...editFormData, thumbnailUrl: url })}
                folder="lappy-square/thumbnails"
                mediaType="image"
                aspectRatio="video"
                label="Custom Thumbnail Image (Optional)"
                placeholder="Upload thumbnail or paste image URL (auto-fetched if blank)"
                helpText="Optional: If left blank, YouTube thumbnail will be fetched automatically"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rating (1 to 5)</label>
                  <select
                    value={editFormData.rating}
                    onChange={(e) => setEditFormData({ ...editFormData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs outline-none bg-white"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editFormData.displayOrder}
                    onChange={(e) => setEditFormData({ ...editFormData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="editFeaturedReview"
                  checked={editFormData.featured}
                  onChange={(e) => setEditFormData({ ...editFormData, featured: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <label htmlFor="editFeaturedReview" className="font-semibold text-slate-700 cursor-pointer">
                  Featured on Homepage & Reviews Section
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Video Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
