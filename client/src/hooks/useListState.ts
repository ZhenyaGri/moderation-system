import { useState, useEffect } from 'react';

export const useListState = () => {
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'priority'>(() => {
    const saved = localStorage.getItem('ads-sortBy');
    return (saved as 'createdAt' | 'price' | 'priority') || 'createdAt';
  });

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    const saved = localStorage.getItem('ads-sortOrder');
    return (saved as 'asc' | 'desc') || 'desc';
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('ads-currentPage');
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem('ads-sortBy', sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem('ads-sortOrder', sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    localStorage.setItem('ads-currentPage', currentPage.toString());
  }, [currentPage]);

  return {
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage
  };
};