# Senate Call Bingo 2026

Election-night bingo for the closest 2026 Senate races. Every visitor gets their own randomly dealt
3x3 card (North Carolina, the safest early call, is always the center square) and a random player
name. Tap a square the moment CNN or Fox projects a winner; three in a row wins.

- Next.js (App Router) + Tailwind v4 + shadcn/ui components
- Confetti on every call, fireworks and soaring eagles on a bingo (`canvas-confetti`)
- Cards are saved in the visitor's browser (localStorage), so a refresh doesn't reshuffle
- "New card" deals a fresh random card; "Rearrange" lets you swap squares and use the bench

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Import the repo in Vercel (framework preset: Next.js, no settings to change), then add your
custom domain under Project → Settings → Domains.

Race data lives in `src/lib/races.ts`.
