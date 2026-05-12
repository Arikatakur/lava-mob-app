# Changelog

All notable changes to **Sukar Helo** are documented in this file.

Format: Semantic versioning — MAJOR.MINOR.PATCH

---

## v2.0.0 - 2026-05-12

### Changed
- **Complete rebrand** from "Lava Cafe" to "Sukar Helo" across the entire application.
- App display name updated to `Sukar Helo` in `app.json`.
- Expo slug updated to `sukar-helo`; deep-link scheme updated to `sukarhelo`.
- iOS bundle identifier updated to `com.sukarhelo.app`.
- Android package name updated to `com.sukarhelo.app`.
- `package.json` name updated to `sukar-helo`; version bumped to `2.0.0`.
- Full theme overhaul — replaced green-based palette with rich chocolate/dessert aesthetic:
  - `backgroundPrimary` → warm cream `#FDF8F0`
  - `backgroundSecondary` → soft caramel `#F5ECD7`
  - `primaryBrown` → milk chocolate `#7B4A2D`
  - `darkEspresso` → dark chocolate `#3D1C02`
  - `softMocha` → warm mocha `#C8A882`
  - `warmBeige` → warm biscuit beige `#E8D5B5`
  - `accentCaramel` → gold caramel `#D4A843`
  - Text colors shifted to deep chocolate browns.
  - Border and divider colors updated to warm beige tones.
  - Shadow color updated to deep chocolate `#2C1A0E`.
- Splash screen background updated to `#FDF8F0`.
- Android adaptive icon background updated to `#FDF8F0`.

### Added
- New `src/theme/gradients.ts` — centralized gradient definitions:
  - `darkChocolate`, `milkChocolate`, `caramelGold`, `warmCream`
  - `heroChocolate`, `heroCream`, `cardOverlay`, `loyaltyCard`, `pageBackground`
- `Gradients` and `GradientKey` exported from `src/theme/index.ts`.

### Updated
- `AppLoadingScreen`: badge letter changed from `L` → `S`; wordmark changed to `SUKAR HELO`; shadow color updated.
- `order-mode.tsx`: brand mark letter `L` → `S`; wordmark `LAVA CAFE` → `SUKAR HELO`; AsyncStorage key updated to `@sukarhelo_last_order_mode`; shadow colors updated.
- English locale (`en.ts`): `appName` → `Sukar Helo`; onboarding copy updated to dessert theme; search placeholder updated.
- Hebrew locale (`he.ts`): `appName` → `סוכר הלו`; onboarding copy updated; `whatToday` updated to dessert phrasing.
- Home screen greeting emoji updated to 🍫; hero tag uses new `heroDessert` locale key.

---

## v1.0.0 - 2025-01-01

### Added
- Initial release of Lava Cafe mobile application.
- Expo / React Native project with Expo Router.
- Authentication via Supabase (phone OTP).
- Product catalog with categories, featured items, and banners.
- Shopping cart and checkout flow.
- Order management and tracking.
- Favorites / wishlist system.
- Loyalty rewards program with Bronze / Silver / Gold tiers.
- QR / loyalty card scan screen.
- RTL support for Hebrew (עברית) and English.
- Poppins font via `@expo-google-fonts/poppins`.
- Green-based brand theme (Lava Cafe).
