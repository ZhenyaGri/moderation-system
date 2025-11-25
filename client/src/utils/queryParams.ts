import { CATEGORIES } from "../constants";
import type { Filters } from "../types";

export const buildQueryParams = (
  page: number, 
  sortBy: 'createdAt' | 'price' | 'priority',
  sortOrder: 'asc' | 'desc',
  filters: Filters
) => {
  const params: Record<string, string | number | string[]> = {
    page,
    limit: 10,
    sortBy,
    sortOrder,
  };

  if (filters.status.length > 0) {
    params.status = filters.status;
  }
  if (filters.category) {
    params.categoryId = CATEGORIES[filters.category as keyof typeof CATEGORIES];
  }
  if (filters.minPrice) {
    params.minPrice = Number(filters.minPrice);
  }
  if (filters.maxPrice) {
    params.maxPrice = Number(filters.maxPrice);
  }
  if (filters.search) {
    params.search = filters.search;
  }

  return params;
};

export const buildNavigationParams = (
  sortBy: 'createdAt' | 'price' | 'priority',
  sortOrder: 'asc' | 'desc',
  filters: Filters
) => {
  const params = buildQueryParams(1, sortBy, sortOrder, filters);
  params.limit = 1000;
  delete params.page;
  return params;
};