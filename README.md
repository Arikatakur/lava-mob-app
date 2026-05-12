# Sukar Helo

A premium dessert & chocolate ordering app built with Expo / React Native.

## Features

- Browse premium desserts, chocolates, and pastries
- Phone OTP authentication (Supabase)
- Shopping cart and checkout
- Order tracking and history
- Favorites / wishlist
- Loyalty rewards program (Bronze / Silver / Gold tiers)
- QR loyalty card scan
- Full RTL support (Hebrew + English)
- Chocolate-inspired premium UI

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo 54 / React Native 0.81 |
| Navigation | Expo Router 6 |
| State | Zustand 5 |
| Backend | Supabase |
| Fonts | Poppins (via @expo-google-fonts) |
| Language | TypeScript 5 |

## Getting Started

```bash
npm install
npm start
```

## Theme System

All design tokens are in [`src/theme/`](src/theme/):

- `colors.ts` — full chocolate/dessert color palette
- `typography.ts` — Poppins type scale
- `spacing.ts` — 4-point grid
- `radius.ts` — border radius tokens
- `shadows.ts` — warm shadow system
- `gradients.ts` — gradient definitions

## Project Structure

```
app/           Expo Router screens and navigation
src/
  components/  Reusable UI, layout, and product components
  hooks/       Custom React hooks
  locales/     i18n strings (en + he)
  services/    Supabase API layer
  store/       Zustand state stores
  theme/       Design tokens
  types/       TypeScript types
assets/        App icons and images
supabase/      Database migrations
```

## Localization

The app supports English and Hebrew (RTL). All strings live in `src/locales/`.

## Version

Current: **v2.0.0** — See [CHANGELOG.md](CHANGELOG.md) for full history.
