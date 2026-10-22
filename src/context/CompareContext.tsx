'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CompareProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice: number;
  image: string;
  brand: string;
  conditionGrade: string;
  processor: string;
  ramGb: number;
  storageGb: number;
  screenSize: string;
  graphicsCard?: string | null;
  os: string;
  batteryHealth?: string | null;
  batteryBackupHours?: string | null;
  warrantyMonths: number;
}

interface CompareContextType {
  compareItems: CompareProduct[];
  addToCompare: (product: CompareProduct) => boolean;
  removeFromCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<CompareProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lappy_compare');
      if (saved) {
        setCompareItems(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('lappy_compare', JSON.stringify(compareItems));
    } catch {
      // Ignore
    }
  }, [compareItems, isLoaded]);

  const addToCompare = (product: CompareProduct): boolean => {
    if (compareItems.find((i) => i.id === product.id)) {
      return false;
    }
    if (compareItems.length >= 4) {
      alert('You can compare a maximum of 4 laptops at a time.');
      return false;
    }
    setCompareItems((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isInCompare = (id: string) => {
    return compareItems.some((i) => i.id === id);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
