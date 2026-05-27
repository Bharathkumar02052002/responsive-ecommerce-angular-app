export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface ProductFilters {
  category: string;
  query: string;
  sort: ProductSort;
  page: number;
}

export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';
