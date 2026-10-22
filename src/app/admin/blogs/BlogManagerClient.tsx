'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, Eye, EyeOff, ExternalLink, Loader2, BookOpen, X, Check, Save } from 'lucide-react';
import CloudinaryMediaUploader from '@/components/admin/CloudinaryMediaUploader';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  published: boolean;
  createdAt: string | Date;
}

export default function BlogManagerClient({ initialBlogs }: { initialBlogs: BlogPostItem[] }) {
  const router = useRouter();
  const [blogs, setBlogs] = useState(initialBlogs);
  const [showModal, setShowModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Buying Guide');
  const [author, setAuthor] = useState('Lappy Square Editorial');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80');
  const [published, setPublished] = useState(true);

  const openCreateModal = () => {
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setCategory('Buying Guide');
    setAuthor('Lappy Square Editorial');
    setExcerpt('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80');
    setPublished(true);
    setShowModal(true);
  };

  const openEditModal = (b: BlogPostItem) => {
    setEditingPostId(b.id);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category);
    setAuthor(b.author);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setCoverImage(b.coverImage);
    setPublished(b.published);
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPostId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPostId) {
        // EDIT MODE (PUT)
        const res = await fetch(`/api/admin/blogs/${editingPostId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            category,
            author,
            excerpt,
            content,
            coverImage,
            published,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update blog post');

        setBlogs((prev) =>
          prev.map((b) => (b.id === editingPostId ? { ...b, ...data.blog } : b))
        );
      } else {
        // CREATE MODE (POST)
        const res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            slug,
            category,
            author,
            excerpt,
            content,
            coverImage,
            published: true,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create blog');

        setBlogs((prev) => [data.blog, ...prev]);
      }

      setShowModal(false);
      router.refresh();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error saving blog post');
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, currentPublished: boolean) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === id ? { ...b, published: !currentPublished } : b))
        );
        router.refresh();
      } else {
        alert('Failed to update publication status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating blog post');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting post');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm text-slate-500">
            Create, edit, publish, and manage technology buying guides and laptop maintenance advice.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-700/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-3xl border border-[#E8E8E8] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E8E8E8] bg-slate-50/60 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Articles Directory ({blogs.length})</h2>
          <span className="text-xs text-slate-500">Live articles index at /blogs</span>
        </div>

        {blogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No blog articles found. Click &quot;New Article&quot; to publish your first guide!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8E8E8] text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-50/80">
                  <th className="py-3 px-4">Article Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8]">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-bold text-slate-950 line-clamp-1">{b.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">/blogs/{b.slug}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-semibold text-[10px]">
                        {b.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {b.author}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(b.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>

                    <td className="py-3.5 px-4">
                      {b.published ? (
                        <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Published
                        </span>
                      ) : (
                        <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blogs/${b.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Live Blog"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 text-slate-400 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit Article Content"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => togglePublish(b.id, b.published)}
                          disabled={actionLoading === b.id}
                          className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                          title={b.published ? 'Unpublish' : 'Publish'}
                        >
                          {b.published ? (
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </button>

                        <button
                          onClick={() => deleteBlog(b.id)}
                          disabled={actionLoading === b.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE & EDIT BLOG MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto my-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950">
                    {editingPostId ? 'Edit Tech Article' : 'Publish New Tech Guide / Article'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingPostId ? 'Update content, category, or publishing state' : 'Compose rich guide with markdown body'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Complete Checklist Before Buying a Refurbished Laptop in 2026"
                  className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-bold text-slate-900 bg-[#F7F8FA]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-mono text-[11px] bg-[#F7F8FA]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 bg-[#F7F8FA] font-medium"
                  >
                    <option value="Buying Guide">Buying Guide</option>
                    <option value="Tech Insights">Tech Insights</option>
                    <option value="Maintenance & Care">Maintenance & Care</option>
                    <option value="Comparisons">Comparisons</option>
                    <option value="Battery Health Tips">Battery Health Tips</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 bg-[#F7F8FA]"
                  />
                </div>

                <div>
                  <CloudinaryMediaUploader
                    value={coverImage}
                    onChange={(url) => setCoverImage(url)}
                    folder="lappy-square/blogs"
                    mediaType="image"
                    aspectRatio="banner"
                    label="Article Cover Image"
                    placeholder="Upload cover from computer or paste image URL"
                    helpText="Recommended: 1200x630 px for optimal card & social share display"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Short Excerpt / Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary for preview cards and search engines..."
                  className="w-full px-3 py-2 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 bg-[#F7F8FA]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Article Body Content (Markdown supported) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={9}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write complete article content, headings, specs tables, and checklist in markdown..."
                  className="w-full px-3.5 py-2.5 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-blue-600 font-mono text-xs bg-[#F7F8FA]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Publish immediately to /blogs</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E8E8E8] text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-700/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingPostId ? 'Save Article Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
