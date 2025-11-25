import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

import type { Ad, AdsResponse, Filters } from '../types';
import AdCard from './AdCard';
import { useFilters } from '../hooks/useFilters';
import { useListState } from '../hooks/useListState';
import { CATEGORIES } from '../constants';
import { buildQueryParams } from '../utils/queryParams';

const AdsList: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
   const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [filters, setFilters] = useFilters();
  const { sortBy, setSortBy, sortOrder, setSortOrder, currentPage, setCurrentPage } = useListState();

  const [showFilters, setShowFilters] = useState(false);
  

  const fetchAdsWithFilters = useCallback(async (page: number = 1, currentFilters: Filters = filters) => {
    try {
      setLoading(true);
      
      const params = buildQueryParams(page, sortBy, sortOrder, currentFilters);
      
      const response = await axios.get<AdsResponse>('/api/v1/ads', { params });
      setAds(response.data.ads || []);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, filters, setCurrentPage]);

  useEffect(() => {
    fetchAdsWithFilters(currentPage);
  }, [fetchAdsWithFilters, currentPage]);

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
    fetchAdsWithFilters(1);
  };

  const resetFilters = () => {
    const newFilters = {
      status: [],
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    };

    setFilters(newFilters);
    setShowFilters(false);
    fetchAdsWithFilters(1, newFilters);
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchAdsWithFilters(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      fetchAdsWithFilters(pagination.currentPage - 1);
    }
  };

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Загрузка списка...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col px-[30px] py-[50px] gap-[25px] items-center'>
      <h1 className=''>Список объявлений</h1>

      <div className="w-full max-w-4xl space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск по названию или описанию..."
              value={filters.search}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={applyFilters}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors border-none"
            >
              <Search size={18} />
            </button>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            Фильтры
          </button>
          
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600 transition-colors"
          >
            Применить
          </button>
          
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 border rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            <X size={18} />
            Сбросить
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-[15px] bg-gray-50">

            <div>
              <label className="block text-sm font-medium mb-2">Статус</label>
              <div className="space-y-2">
                {['pending', 'approved', 'rejected', 'draft'].map(status => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {status === 'pending' && 'На модерации'}
                      {status === 'approved' && 'Одобрено'}
                      {status === 'rejected' && 'Отклонено'}
                      {status === 'draft' && 'Черновик'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Категория</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Все категории</option>
                {Object.keys(CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Цена</label>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Мин. цена"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Макс. цена"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Сортировка</label>
              <div className="space-y-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'createdAt' || value === 'price' || value === 'priority') {
                      setSortBy(value);
                    }
                  }}
                  className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">По дате</option>
                  <option value="price">По цене</option>
                  <option value="priority">По приоритету</option>
                </select>
                
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'asc' || value === 'desc') {
                      setSortOrder(value);
                    }
                  }}
                  className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">По убыванию</option>
                  <option value="asc">По возрастанию</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-[20px] justify-center">
        {ads.map(ad => (
          <AdCard 
            key={ad.id} 
            {...ad}
          />
        ))}
      </div>
      <div className="flex items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={pagination.currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] border transition-colors ${
              pagination.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm text-gray-600">
            Страница {pagination.currentPage} из {pagination.totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-[10px] border transition-colors ${
              pagination.currentPage === pagination.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="">
          Всего: {pagination.totalItems} объявлений
        </p>
    </div>
  );
};

export default AdsList;