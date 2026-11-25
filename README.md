# FictionFit (working name)

College project: a streetwear store inspired by anime, series and films. Frontend only.
All designs are original and "inspired by". They are not official merchandise.
Product pictures are SVG illustrations drawn in code (no photos, so nothing can break).

## Run it
    npm install
    npm run dev
Open the address Vite prints (usually http://localhost:5173).
Other commands: `npm run build` (make production files), `npm run preview` (test the build).

## Pages
/ home, /explore, /collection/:id, /product/:id, /cart, /wishlist, /build, /quiz,
/checkout, /order/:id, /admin

## Folders
- src/data        collections.js, characters.js, products.js (starting data)
- src/context     shared state: products, cart, wishlist, activity, page transition
- src/hooks       useLocalStorage (useState + saving in the browser)
- src/utils       formatPrice, pricing (delivery rule), filterProducts
- src/components  reusable pieces (Navbar, Footer, ProductCard, ProductBrowser, StyleModal, Garment ...)
- src/pages       one file per route
- src/styles      tokens.css (values), base.css (reset, buttons), layout.css (core), features.css (newer pages)

## Simulated vs real
Simulated: checkout, orders, stock changes, admin (no login, anyone can edit).
Needs a real backend: payments, accounts/authentication, a shared database, real stock tracking.
Data lives in each visitor's browser (localStorage). In /admin, "Reset demo data" restores the originals.

## Viva cheat sheet
- Routing: /product/:id uses useParams() to read the id, then getProduct(id) finds the object.
- Data flow: products.js is only starting data. ProductsContext copies it into state + localStorage; pages read from the context.
- Re-renders: setLines in CartContext re-renders every component that calls useCart(), so the navbar count updates.
- localStorage: useLocalStorage reads once on start (JSON.parse) and saves in useEffect whenever the value changes (JSON.stringify).
- Cart duplicates: key = productId|colour|size. Same key means qty goes up instead of a new line.
- Builder total: `chosen` is rebuilt every render and total is a reduce over it, so it never goes stale.
- Quiz: score() adds points per matching rule and records a reason string for each.
- Transitions: usePageTransition().openPage() shows an overlay, navigates after 650 ms, clears it after 1300 ms. useReducedMotion skips it.
- Admin CRUD: add/update/delete call context functions that use spread, map and filter to make new arrays.

Facts about shows and characters were written from general knowledge. Verify them before presenting.
