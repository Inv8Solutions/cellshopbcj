Admin Dashboard — Firestore Stats Integration

What this file documents

- How the Admin dashboard `stats` cards (Total Revenue, Total Orders, Total Product Listings, Total Reviews) are computed from Firestore.
- Expected Firestore collection names and field shapes.
- How to test locally and debug common issues.

Files changed

- `src/app/admin/page.tsx`
  - Replaced hard-coded stats with live values fetched from Firestore.
  - Uses `getCountFromServer` for efficient counts and `getDocs` to sum revenue.

Firestore collections and fields (expected)

- `orders` (collection)
  - Each document represents an order.
  - Expected numeric fields (one of): `total`, `totalAmount`, or `subtotal` (the code looks for these fields in that order and falls back to 0).
  - Used for:
    - Total orders: document count in `orders`
    - Total revenue: sum of the numeric `total` (or fallback) across all order documents

- `items` (collection)
  - Each document represents a product/listing.
  - The code counts documents in `items` to produce "Total Product Listings".
  - Additionally, the admin page reads `items` documents to compute the "Top Selling Products" tile.
    It looks for a numeric `sold` or `sales` field on each item to rank products. If those fields are missing,
    items are treated as having 0 sales and the static fallback is shown.

- `orders` (collection) - recent order shape
  - For the "Recent Orders" list the page fetches the newest 5 documents from `orders` ordered by `createdAt`.
  - Expected fields used (best-effort):
    - `orderId` (optional) — used as the visible ID; falls back to document id
    - `status` or `state` — order state string
    - `items` — array (length is shown) or a human-readable string
    - `createdAt` — Firestore Timestamp (preferred) or string; used to display date/time
    - `total` / `totalAmount` / `subtotal` — numeric or string price used to show the amount

- `reviews` (collection) — optional
  - If you have a reviews collection, the dashboard will attempt to count its documents.
  - If the collection does not exist or the count fails, the dashboard falls back to 0.

Implementation notes

- Counts use `getCountFromServer(collectionRef)` which is faster and cheaper than reading all documents.
  - This requires Firebase JS SDK that exports `getCountFromServer` (v9+ modular). If your SDK version does not include it, replace with `getDocs` and read `snapshot.size`.

- Revenue is computed by reading all docs in `orders` and summing a numeric field. This is simple and correct for small datasets, but:
  - For large amounts of orders this will be slow and cost read operations. Consider maintaining an aggregated `counters` document that stores running totals (e.g., `stats/summary`) and update it transactionally whenever orders are created/updated.

- The admin page fetch is triggered in a client-side `useEffect` because `src/app/admin/page.tsx` is a client component (`'use client'`). If you want server-side rendering of stats, move the logic to a server component or use an API route that the client calls.

How to test locally

1. Ensure you have valid Firebase config in `src/firebase/config.js` and authentication (if any) set up.
2. Start the dev server:

```bash
npm run dev
```

3. Open the admin dashboard (by default: `/admin`) and check the stats cards.

4. If you want to verify values manually in the Firestore console:

- For `orders`:
  - Inspect several documents and confirm they have a numeric `total` or `totalAmount` field.
  - Use the Firestore console query to view document count.

- For `items` and `reviews`:
  - Confirm documents exist in those collections.

Troubleshooting

- Stats show `—` or remain blank:
  - Check browser console for errors (network, permission issues).
  - Ensure your Firestore rules allow reads for the collections from your environment.
  - Confirm `src/firebase/config.js` contains the correct project credentials and that the app is connected.

- Revenue is incorrect:
  - Check that order documents have numeric `total` values.
  - If totals are stored as strings, the code attempts `Number(...)` but you should normalize stored values to numbers.

Next steps / improvements

- Add a server-side aggregated `stats/summary` document updated transactionally when orders are created/updated to avoid scanning all orders for revenue.
- Add unit/integration tests for the stats fetcher (mock Firestore using the emulator or a library like `@firebase/rules-unit-testing`).
- Add an admin UI refresh button and cache/ttl to avoid refetching on every page load.

If anything in your Firestore schema differs (collection names or field names), update the queries in `src/app/admin/page.tsx` to match.
