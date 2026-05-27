# ShopSphere - Responsive Ecommerce Angular App

ShopSphere is a recruiter-friendly Angular 16 ecommerce product listing website built with standalone components, lazy routing, Bootstrap 5, Angular Signals, RxJS, and the FakeStore API. It demonstrates clean frontend architecture, production-minded state handling, responsive UI, accessible controls, and persistent cart/wishlist workflows.

## Features

- Home, product listing, product details, cart, wishlist, search results, and not found pages
- FakeStore API integration with typed Angular services and HTTP retry/error interceptor
- Standalone Angular architecture with lazy-loaded route components
- Signal-backed cart, wishlist, theme, and page state
- LocalStorage persistence for cart, wishlist, and dark/light theme
- Debounced search, category filtering, sorting, and load-more pagination
- Desktop filter sidebar and mobile filter drawer
- Reusable navbar, footer, product card, search bar, loader, empty state, modal, and toast components
- Skeleton loading, toast notifications, lazy images, image fallback, badges, hover states, and responsive layouts
- Accessibility-minded labels, semantic sections, keyboard-friendly buttons, and ARIA states

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

Add screenshots after running locally:

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

- `ProductApiService` centralizes FakeStore API access and caches product reads with `shareReplay`.
- `CartService`, `WishlistService`, and `ThemeService` use Angular Signals for local UI state.
- `apiErrorInterceptor` retries failed HTTP calls and normalizes user-facing API errors.
- Feature pages are lazy loaded through `app.routes.ts` to keep route bundles focused.
- Shared components keep UI reusable and easier to extend in interview or portfolio discussions.
