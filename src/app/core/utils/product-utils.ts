import { Product, ProductSort } from '../../models/product.model';

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const sortedProducts = [...products];

  switch (sort) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'rating':
      return sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedProducts;
  }
}

export function filterProducts(products: Product[], query: string, category: string): Product[] {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery = !normalizedQuery || product.title.toLowerCase().includes(normalizedQuery);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  return items.slice(0, page * pageSize);
}
