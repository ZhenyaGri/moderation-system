export type Ad = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  priority: 'normal' | 'urgent';
  images: string[];
  createdAt: string;
  seller: {
    id: string;
    name: string;
    rating: number;
    totalAds: number;
    registeredAt: string;
  };
  characteristics: Record<string, string>;
  moderationHistory: Array<{
    id: string;
    moderatorName: string;
    action: string;
    reason?: string;
    comment?: string;
    timestamp: string;
  }>;
}

export type Pagination = {
 currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export type AdsResponse = {
  ads: Ad[];
  pagination: Pagination;
}

export type Filters = {
  status: string[];
  category: string;
  minPrice: string;
  maxPrice: string;
  search: string;
}

export type ApiParams = {
  limit: number;
  sortBy: string;
  sortOrder: string;
  status?: string[];
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export type StatsSummary = {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
};

export type ActivityData = {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
};

export type DecisionsData = {
  approved: number;
  rejected: number;
  requestChanges: number;
};

export type CategoryData = {
  [category: string]: number;
};