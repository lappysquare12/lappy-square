'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#F7F8FA] min-h-[70vh] py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-4 bg-white border border-[#E8E8E8] rounded-3xl p-10 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon on any laptop to save models you like and compare later.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              <span>Explore Laptops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F8FA] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-1.5">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-slate-900">Account</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Wishlist</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-8">
          Saved in Wishlist ({wishlist.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-[#E8E8E8] rounded-2xl p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] rounded-xl bg-slate-50 overflow-hidden mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="300px"
                    className="object-contain p-2"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                  {item.conditionGrade}
                </span>

                <Link
                  href={`/product/${item.slug}`}
                  className="block text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-2 mt-2 mb-2"
                >
                  {item.title}
                </Link>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-base font-black text-slate-950">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{item.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    addToCart({
                      productId: item.productId,
                      title: item.title,
                      slug: item.slug,
                      sku: `WSH-${item.productId.slice(0, 5)}`,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      image: item.image,
                      conditionGrade: item.conditionGrade,
                      ramGb: 16,
                      storageGb: 512,
                      processor: 'Intel Core / Apple',
                      stock: 1,
                    });
                    removeFromWishlist(item.productId);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
