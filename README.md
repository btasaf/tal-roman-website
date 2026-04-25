# טל רומן — Website

Next.js 15 + Sanity Studio v3 + Tailwind CSS + Framer Motion. Hebrew-first RTL.

## Quick start (5 minutes)

1. `cp .env.example .env.local` — fill in your Sanity project ID and tokens
2. `npm install`
3. `npm run dev` → http://localhost:3000
4. Sanity Studio → http://localhost:3000/studio
5. First time only: `npx ts-node -e "require('./scripts/seed-sanity.ts')"` to create singleton documents

## Env vars

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | sanity.io → project settings |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | sanity.io → API → Tokens (read-only, for public fetches) |
| `SANITY_WRITE_TOKEN` | sanity.io → API → Tokens (editor, for seed script) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID |

## Stack

- **Next.js 15** App Router, React Server Components
- **Sanity Studio v3** embedded at `/studio`
- **Tailwind CSS** with RTL support
- **Framer Motion** LazyMotion + `m` API (~30KB)
- **Rubik** font via `next/font/google`
- **Vercel** deploy target

## Deploy

Push to `main` → Vercel auto-deploys. Add all env vars in the Vercel dashboard.

---

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
