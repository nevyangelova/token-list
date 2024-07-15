This is a Li.fi candidacy Token list application coding challenge

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Technical Decisions 

### Virtualized List
- Initially, I wanted to implement server-side pagination to manage the large dataset efficiently. However, upon closer inspection of the API documentation, I discovered that the API does not support server-side pagination directly. This limitation means that I would need to handle all data on the client side if I wanted to paginate.

- Why Not Client-Side Pagination?
Client-side pagination involves fetching all data at once and then paginating through it on the client side. This can lead to significant performance issues, especially with large datasets, as it requires loading all the data into memory at once.

- Solution: React Virtualized
To address this, I opted for using react-virtualized so I can render only the visible rows in a list and efficiently handle scrolling through large datasets. That way I significantly reduce the number of DOM elements rendered at any one time, improving performance and responsiveness.

- Incremental Static Regeneration
I implemented ISR for the token detail pages to handle updates to token information (like price changes) without requiring a full rebuild of the site on the server side.

This allows pages to be statically generated at build time and then revalidated at runtime, ensuring fresh data without the overhead of server-side rendering on every request.

- Data Fetching and Caching

1. I fetch detailed information for individual tokens using ISR, setting a revalidation time of 10 seconds to ensure data freshness.

2. Given the size of the data fetched from the API, I need to implement logic to manage response sizes effectively. Fetching in chunks will be the next attempt.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
