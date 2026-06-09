# ShopSphere

ShopSphere is a responsive Angular 16 storefront that uses the FakeStore API for product data. The app includes catalog browsing, search, filters, sorting, cart and wishlist persistence, and a light/dark theme toggle.

## Features

- Home, product listing, product details, cart, wishlist, search results, and not found pages
- Product catalog loaded from FakeStore API
- Standalone components and lazy-loaded routes
- Cart, wishlist, theme, and page state handled with Angular Signals
- Cart, wishlist, and theme saved in `localStorage`
- Debounced search, category filters, sorting, and load-more pagination
- Quick view modal from the product catalog
- Stock status badges on product cards
- Price-range filtering for the catalog
- Minimum rating filter and active filter chips
- Recently viewed products saved locally
- Product comparison for up to 3 products
- Cart order summary with shipping and free-shipping progress
- Sample promo code flow with `SAVE10`
- Desktop sidebar filters and a mobile filter drawer
- Shared UI components for product cards, loaders, empty states, modals, search, and toasts
- Lazy images, image fallback, responsive layout, and keyboard-friendly controls

## Technologies Used

- Angular 16
- TypeScript
- Bootstrap 5 and Bootstrap Icons
- RxJS
- Angular Signals
- FakeStore API
- SCSS

## Getting Started

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Production Build

```bash
npm run build
```

The compiled app is generated in `dist/responsive-ecommerce-angular-app`.

## Project Structure

```text
src/app/
  core/
    constants/
    guards/
    interceptors/
    services/
    utils/
  features/
    cart/
    home/
    not-found/
    products/
    search-results/
    wishlist/
  layouts/
    breadcrumb/
    footer/
    navbar/
  models/
  shared/
    components/
    directives/
    pipes/
```

## Screenshots

Suggested screenshots to add before sharing the repo:

- `docs/screenshots/home.png`
- `docs/screenshots/products-desktop.png`
- `docs/screenshots/products-mobile.png`
- `docs/screenshots/product-details.png`
- `docs/screenshots/cart.png`
- `docs/screenshots/wishlist.png`

## Deployment

### Netlify

1. Build command: `npm run build`
2. Publish directory: `dist/responsive-ecommerce-angular-app`
3. Add a redirect rule for Angular routing:

```text
/* /index.html 200
```

### Vercel

1. Framework preset: Angular
2. Build command: `npm run build`
3. Output directory: `dist/responsive-ecommerce-angular-app`
4. Add route rewrites to serve `index.html` for client-side routes if prompted.

### GitHub Pages

```bash
npm run build -- --base-href /responsive-ecommerce-angular-app/
npx angular-cli-ghpages --dir=dist/responsive-ecommerce-angular-app
```

## Suggested Commit Messages

- `feat: scaffold Angular 16 ecommerce storefront`
- `feat: add product catalog filtering sorting and search`
- `feat: persist cart wishlist and theme with signals`
- `style: polish responsive ecommerce UI with Bootstrap`
- `docs: add setup deployment and project overview`

## API

Products are loaded from:

```text
https://fakestoreapi.com/products
```

## Important Implementation Notes

- `ProductApiService` keeps API calls in one place and caches the product list with `shareReplay`.
- Product stock labels are derived from API review counts because FakeStore does not expose inventory.
- `CartService`, `WishlistService`, and `ThemeService` hold client-side state with Angular Signals.
- `RecentlyViewedService` keeps the last few opened products available on the details page.
- `CompareService` persists selected products and powers the comparison table.
- `apiErrorInterceptor` retries failed HTTP calls and returns a consistent error message.
- Feature pages are lazy loaded from `app.routes.ts`.
