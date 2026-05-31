# Changelog

All notable changes to **Sukar Helo** are documented in this file.

Format: Semantic versioning — MAJOR.MINOR.PATCH

---

## v2.3.0 - 2026-05-25

### Added — Menu data
- Arabic localization columns (`name_ar`, `description_ar`, `title_ar`, `subtitle_ar`, etc.) on `products`, `categories`, `product_options`, `product_images`, `banners`, `order_items`, and `rewards`.
- Public `products` Supabase Storage bucket (10 MB cap, common image MIMEs) with public-read RLS.
- 8 real menu products (Arabic-first) uploaded with images:
  - Sweets: بافل (20), فشافيش 12pcs (20), تياكي (20), تشوروس 5pcs (20), موس فواكه الترند (30)
  - Snacks: تيرس كبابي (5/10 with Small/Large size option), سيخ بطاطا (10)
  - Drinks: موخيتو (15)
- New 3-category set: حلويات / وجبات خفيفة / مشروبات (replacing the 6-category demo set).
- Migrations `006_arabic_columns_and_storage.sql` and `007_new_menu_seed.sql`.

### Added — UI
- `common.all` translation key in all three locales (`الكل` / `הכל` / `All`) — replaces hard-coded "All" label.
- `cardGap` token in `Layout` (12px) for consistent spacing in grids and carousels.
- Width-prop API on `ProductCard` and `ProductCardSkeleton`.
- Active-tab pill indicator behind the icon in the bottom tab bar.

### Changed
- Standardized horizontal screen padding to **16px** (`Layout.screenPaddingHorizontal`, was 20px) across home and menu.
- Greeting reads `"مرحباً Saleem!"` (no comma) and right-aligns under Arabic. Sub-greeting, loyalty card text, and other localized text right-align when `isRTL`.
- Product cards now use a **square (1:1) image** and a `minHeight` on the name to guarantee uniform card heights regardless of name length or image source ratio.
- Menu grid uses RN `gap` on the row + content container — 2 perfectly equal columns with 12px gutter, no more squished cards.
- Home carousels show 2 full cards + an intentional ~40px peek of the third, sized responsively per screen width (works cleanly on 390 and 430).
- Bottom tab bar respects the device safe area, gives each item more breathing room, and renders Arabic labels with proper line-height. Icons are slightly smaller (24/22 vs 26/24) to free room for labels.
- TS types `Product`, `Category`, `ProductOption`, and `Banner` now expose the new `_ar` fields.

### Removed
- All 23 demo products, 18 demo product options, and 3 demo banners (Unsplash-sourced placeholders).
- Demo categories (Coffee, Iced Drinks, Cakes, Desserts, Pastries, Snacks).

### Fixed
- **Product card image rendering on web** — `aspectRatio: 1` on the image container was being respected by the layout box but RN Web's `Image` (which renders as a background-image wrapper) didn't track the computed height, so the photo rendered as a wide strip with the container's cream `backgroundColor` showing through the bottom half. Now `ProductCard` sizes the image area with an explicit pixel height derived from the `width` prop, and passes that same height down to the inner `<Image>` style so the wrapper inherits it concretely.
- Profile tab label `الملف الشخصي` was being truncated to `الشخصي` on iPhone 390 (long Arabic string, narrow tab slot). Shortened to `حسابي` for Arabic so all five labels fit without clipping at the smallest target viewport.
- `CartItemCard`, `TransactionRow`, and `RedemptionModal` accepted `language: 'he' | 'en'` and silently fell back to English for Arabic users. Now accept the full `Language` type and read the `_ar` field when available.
- Favorite / badge buttons inside the product card now anchor to the correct corner under RTL (favorite on the left, badges on the right).

### Verified
- Drove the Expo web build through onboarding → guest → home and menu at both iPhone 390×844 and 430×932 viewports. Product images fill their squares with no cream gap; greeting reads right-aligned with the chocolate emoji; bottom tabs show centered Arabic labels with a clear active pill; menu grid is two clean equal columns.

---

## v2.3.0 - 2026-05-31

### Added
- **Premium dessert-shop redesign** — soft cream background (#F8F4EE), chocolate brown (#8B5A3C), soft gold accents (#D8B26E)
- **Arabic typography system** — Cairo SemiBold (headings), IBM Plex Sans Regular (body), Tajawal Medium (labels)
- **Floating bottom tab bar** — absolute positioned, white background, radius 32px, active tab filled brown circle, shadow
- **ScreenWrapper bottom padding** — 100px iOS / 90px Android for floating tab bar clearance
- **ProductCard StarRow** — dynamic full/half/empty stars with gold color
- **ProductCard image 70% ratio** — image occupies 70% of card height for premium look
- **Glassmorphism favorite button** — translucent white background with border, positioned top-right
- **Floating add-to-cart button** — circular brown button with shadow overlay
- **Search with 300ms debounce and queryRef race-condition guard** — categories always visible during search
- **Promotional banners** — chocolate brown banners with emoji, title, subtitle, CTA button on home and menu screens
- **Loyalty card** — tier-based (Bronze/Silver/Gold) with progress bar, QR code, decorative background circles

### Changed
- **Home screen** — logo circle header, hardcoded Arabic greeting, 52px pill search bar, "الفئات" section, featured/most ordered carousels with 16px card gap
- **Menu screen** — clean header, pill search bar, categories always visible, promo banner, 2-column grid with equal card widths
- **ProductCard** — redesigned with centered name, StarRow rating, price, floating add button, glass heart, "New" badge, soft shadow
- **CategoryChip** — smaller pills (40px height), 16px icons, selected filled chocolate, unselected white with border, equal spacing
- **Layout spacing** — horizontal padding 20px (Spacing[5]), section gap 24px (Spacing[6]), card gap 16px (Spacing[4])
- **Shadow system** — soft shadows with chocolate-tinted color, `Shadows.float` for floating elements

### Fixed
- **ProductCard merge conflicts** — removed duplicate `imageContainer` key, restored missing `favoriteGlow` style
- **Missing `alignRight` style** — added to home.tsx loyalty card styles
- **Unused variables** — removed `greetingName`, `currentCategory`, `firstName`, `greeting` from home.tsx
- **Theme imports** — replaced all `Colors.chocolate` → `Colors.primaryBrown`, `Typography.*` → `FontFamily.*`, `Colors.screenBg` → `Colors.backgroundPrimary`

## v2.3.0 - 2026-05-31

### Added
- **Premium dessert-shop redesign** — soft cream background (#F8F4EE), chocolate brown (#8B5A3C), soft gold accents (#D8B26E)
- **Arabic typography system** — Cairo SemiBold (headings), IBM Plex Sans Regular (body), Tajawal Medium (labels)
- **Floating bottom tab bar** — absolute positioned, white background, radius 32px, active tab filled brown circle, shadow
- **ScreenWrapper bottom padding** — 100px iOS / 90px Android for floating tab bar clearance
- **ProductCard StarRow** — dynamic full/half/empty stars with gold color
- **ProductCard image 70% ratio** — image occupies 70% of card height for premium look
- **Glassmorphism favorite button** — translucent white background with border, positioned top-right
- **Floating add-to-cart button** — circular brown button with shadow overlay
- **Search with 300ms debounce and queryRef race-condition guard** — categories always visible during search
- **Promotional banners** — chocolate brown banners with emoji, title, subtitle, CTA button on home and menu screens
- **Loyalty card** — tier-based (Bronze/Silver/Gold) with progress bar, QR code, decorative background circles

### Changed
- **Home screen** — logo circle header, hardcoded Arabic greeting, 52px pill search bar, "الفئات" section, featured/most ordered carousels with 16px card gap
- **Menu screen** — clean header, pill search bar, categories always visible, promo banner, 2-column grid with equal card widths
- **ProductCard** — redesigned with centered name, StarRow rating, price, floating add button, glass heart, "New" badge, soft shadow
- **CategoryChip** — smaller pills (40px height), 16px icons, selected filled chocolate, unselected white with border, equal spacing
- **Layout spacing** — horizontal padding 20px (Spacing[5]), section gap 24px (Spacing[6]), card gap 16px (Spacing[4])
- **Shadow system** — soft shadows with chocolate-tinted color, `Shadows.float` for floating elements
- **Home header** — replaced profile avatar with sukar-helo.png logo in a circular container, hardcoded Arabic greeting
- **Promotional banner** — added chocolate-themed promo banners between categories and featured/menu sections on both home and menu screens
- **Menu search bar** — redesigned with white pill shape, shadow, and updated typography

### Fixed
- **ProductCard merge conflicts** — removed duplicate `imageContainer` key, restored missing `favoriteGlow` style
- **Missing `alignRight` style** — added to home.tsx loyalty card styles
- **Unused variables** — removed `greetingName`, `currentCategory`, `firstName`, `greeting` from home.tsx
- **Theme imports** — replaced all `Colors.chocolate` → `Colors.primaryBrown`, `Typography.*` → `FontFamily.*`, `Colors.screenBg` → `Colors.backgroundPrimary`
- **Color references** — replaced `Colors.chocolate` → `Colors.primaryBrown`, `Typography.arabic*` → `FontFamily.*`, `Colors.screenBg` → `Colors.backgroundPrimary`
- **Missing imports** — added `Platform` and `Shadows` imports to home and menu screens
- **Logo image** — `require('../../assets/logo.png')` → `require('../../assets/sukar-helo.png')`

## v2.2.3 - 2026-05-31

## v2.2.2 - 2026-05-31

### Changed
- **Home screen refresh** — pull-to-refresh now reloads banners, featured products, categories, and menu items.
- **Home search input** — added inline search field to filter category products without leaving the home screen.
- **Category browsing** — category chips now switch products locally instead of navigating immediately to the menu screen.
- **No-results state** — added friendly empty state when filtered category products do not match the search.

## v2.2.1 - 2026-05-31

### Fixed
- **CategoryChip** resizing when selected — both states now use the same `fontFamily` so text width stays consistent.
- **Menu grid layout** — removed hardcoded widths, added proper `paddingHorizontal` and `gap` so product cards fill the screen evenly and don't change size when switching categories.
- **Categories FlatList overlap** — added `flexGrow: 0` to prevent it from stretching and covering header content.
- **Single product in row stretching** — replaced `flex: 1` with calculated fixed width per card using `useWindowDimensions`, so a lone product stays at half-width instead of filling the whole row.
- **ProductCard** — added optional `style` prop so cards in the menu grid can use dynamic widths while home page horizontal lists keep the default 160px.
- **Search debounce & race condition** — added 300ms debounce and `queryRef` to prevent stale results from overwriting newer searches; immediate skeleton feedback on keystroke.
- **Search auto-focus** — pressing the search icon on the home page now auto-focuses the search bar on the menu page.
- **Search icon tappable** — wrapped search icon in `TouchableOpacity` so users can tap it to focus the input.
- **Categories always visible** — removed `{!isSearching &&}` that hid categories during search; tapping a category now clears search text.
- **Remove home page search bar** — removed the inline `Input` search field from the home page; only the search icon button (navigates to menu) remains.
- **Design polish** — restored missing menu header title; fixed RTL text alignment in `SectionHeader`; replaced hardcoded `borderRadius`/`shadow`/`letterSpacing` in `SkeletonLoader`, `QuantityStepper`, and `Badge` with theme tokens.
- **✨ Premium UI Redesign** — complete visual overhaul:
  - **Colors**: soft cream `#F8F4EE` background, chocolate brown `#8B5A3C` primary, soft gold `#D8B26E` accents
  - **Typography**: Cairo SemiBold, IBM Plex Sans Arabic, Tajawal Medium
  - **ProductCard**: larger image, centered name, rating stars, prep time, glassmorphism heart, floating plus button with shadow
  - **Home Screen**: profile avatar, Arabic greeting, pill-style search bar, category pills with icons, section icons, most ordered section
  - **Tab Bar**: floating bottom bar with rounded corners, active tab filled brown circle
  - **Shadows**: softer, more premium `Shadows.float` token

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
  
---

## v2.2.1 - 2026-05-31

### Fixed
- `ProductCard` fixed to use a consistent height so menu grid doesn't resize when switching categories.
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
