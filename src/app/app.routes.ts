import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'ShopSphere | Modern ecommerce storefront',
    loadComponent: () => import('./features/home/home.component').then((c) => c.HomeComponent)
  },
  {
    path: 'products',
    title: 'Products | ShopSphere',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then((c) => c.ProductListComponent)
  },
  {
    path: 'products/:id',
    title: 'Product details | ShopSphere',
    loadComponent: () =>
      import('./features/products/product-details/product-details.component').then((c) => c.ProductDetailsComponent)
  },
  {
    path: 'cart',
    title: 'Cart | ShopSphere',
    loadComponent: () => import('./features/cart/cart.component').then((c) => c.CartComponent)
  },
  {
    path: 'wishlist',
    title: 'Wishlist | ShopSphere',
    loadComponent: () => import('./features/wishlist/wishlist.component').then((c) => c.WishlistComponent)
  },
  {
    path: 'search',
    title: 'Search | ShopSphere',
    loadComponent: () =>
      import('./features/search-results/search-results.component').then((c) => c.SearchResultsComponent)
  },
  {
    path: '**',
    title: 'Page not found | ShopSphere',
    loadComponent: () => import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent)
  }
];
