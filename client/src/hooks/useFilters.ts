import { useState, useEffect } from 'react';

export interface Filters {
  status: string[];
  category: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(() => {
    const saved = localStorage.getItem('ads-filters');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      status: [],
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('ads-filters', JSON.stringify(filters));
  }, [filters]);

  return [filters, setFilters] as const;
};