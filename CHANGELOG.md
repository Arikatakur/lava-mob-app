# Changelog

All notable changes to **Sukar Helo** are documented in this file.

Format: Semantic versioning — MAJOR.MINOR.PATCH

---

## v2.2.0 - 2026-05-12

### Changed
- **Post-login navigation** — after OTP verification (both new and returning users), app navigates to `/order-mode` instead of `/(tabs)/home`.
- **Order type selection** reduced to two options: **Delivery** and **Pickup**. Dine-in removed entirely.

### Removed
- `dine_in` value from `OrderMode` type (`src/types/index.ts`).
- `dineIn` / `dineInSub` keys from `orderMode` section in all three locales (`en`, `he`, `ar`).
- `dine_in` entries from `MODE_ICON` and `MODE_LABEL_KEY` records in `cart.tsx` and `checkout/index.tsx`.
- `cashDineIn` branch from checkout cash-label logic.
- Third card entrance animation (Card 3 / 290 ms delay) from order-mode screen.

---

## v2.1.1 - 2026-05-12

### Changed
- **Order mode screen** — polished to App Store-level premium UX:
  - Tighter vertical rhythm; CTA button sits close to selection cards, no dead space.
  - Three ambient glow circles (caramel top-right, mocha bottom-left, soft center) add depth without flat areas.
  - Cards are taller (`paddingVertical` +4px), rest with softer shadow, lift with elevated shadow when selected.
  - Selected state uses warm gold (`accentCaramel`) border + subtle gold inner glow overlay + dark espresso icon badge shadow.
  - Spring-pulse scale animation fires on card selection (1.0 → 1.03 → 1.0).
  - Press feedback tightened (scale 0.965, no bounce).
  - CTA button: active state is floating with strong shadow (`shadowOpacity 0.32`, `elevation 10`); disabled state is flat warm beige — clearly distinct.
  - Subline bumped to `FontSize.base` for better readability.

---

## v2.1.0 - 2026-05-12

### Added
- **Arabic language support** — full `src/locales/ar.ts` with complete translations across all screens.
- Arabic added to `Language` type (`'he' | 'en' | 'ar'`).
- Arabic set as the **default app language** (RTL).
- `onboarding.welcomeSubtitle` locale key added to `en`, `he`, and `ar`.
- `settings.arabic` locale key added to all three locales.

### Changed
- **Onboarding screen** fully redesigned — replaced 3-slide carousel with a single premium welcome screen:
  - Centered `sukar-helo.png` logo with spring scale entrance animation.
  - `SUKAR HELO` wordmark + localized subtitle.
  - Primary "Sign In" button and subtle bordered "Continue as Guest" button.
  - Staggered fade + slide-up entrance animations.
  - Soft ambient glow background accents.
- `useAppStore` default language changed from `'he'` to `'ar'`; `setLanguage` now marks Arabic as RTL.
- `useLocalizedText` fallback for Arabic now resolves to English (not Hebrew) for DB content fields.
- Profile screen language toggle replaced binary Switch with a **tap-to-cycle badge** (AR → HE → EN → AR).

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
