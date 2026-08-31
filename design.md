# RIRI CARS — Design Document

## Brand Overview

**Business:** Riri Cars — Premier importer and dealer of quality used imported vehicles in Nairobi, Kenya.
**Tagline:** "Where Excellence Meets Affordability"
**Slogan:** "Cars You Can Trust"
**Established:** 2010
**Audience:** Kenyan car buyers looking for reliable, affordable imports.

---

## Design Tokens

### Colors

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#CC0000` | Primary red — CTAs, highlights, badges, price tags |
| `primary-dark` | `#AA0000` | Hover state for primary buttons |
| `primary-darker` | `#880000` | Active/pressed state |
| `primary-light` | `#E60000` | Accents |
| `primary-subtle` | `#FEF2F2` | Tinted backgrounds |
| `dark` | `#0D0D0D` | Body text, headings |
| `dark-charcoal` | `#1A1A1A` | Secondary text, body |
| `dark-surface` | `#242424` | Dark card surfaces |
| `dark-nav` | `#0B1A31` | Navigation bar, dark sections, footer |
| `accent` | `#D4AF37` | Gold — star ratings, premium highlights |
| `accent-dark` | `#B8960C` | Hover on gold elements |
| `accent-light` | `#F0CE60` | Light gold tints |
| `brand-bg` | `#F7F7F7` | Page background |
| `brand-surface` | `#FFFFFF` | Card/panel backgrounds |
| `brand-low` | `#F4F3F3` | Slightly off-white sections |
| `brand-border` | `#E5E7EB` | Card borders, dividers |
| `muted` | `#6B7280` | Secondary/body text |
| `muted-light` | `#9CA3AF` | Placeholder text |
| `muted-dark` | `#374151` | Slightly stronger secondary |
| `success` | `#16A34A` | "New" badges, positive states |
| `warning` | `#D97706` | Warnings |
| `error` | `#EF4444` | Error states |
| `info` | `#3B82F6` | Info states |

### Typography

- **Font Family:** Outfit (Google Fonts) — weights 300, 400, 500, 600, 700, 800
- **Base size:** 16px
- **Headings:** Bold/ExtraBold, tight tracking (`tracking-tight`)
- **Body:** Regular/Medium
- **Buttons/Labels:** SemiBold, uppercase, wide tracking (`tracking-wide uppercase`)

### Spacing & Layout

- **Container max-width:** 1200px
- **Section padding:** `py-12 md:py-20` (48px / 80px)
- **Container padding:** `px-4 sm:px-6`
- **Border radius:** 4px default (very subtle rounding — near-square feel)

### Shadows

| Name | Value | Usage |
|---|---|---|
| `card` | `0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)` | Default card shadow |
| `card-hover` | `0 10px 30px rgba(204,0,0,0.12), 0 4px 10px rgba(0,0,0,0.10)` | Hover — red tinted lift |
| `red-glow` | `0 0 24px rgba(204,0,0,0.35)` | Red glow on feature elements |
| `gold-glow` | `0 0 20px rgba(212,175,55,0.40)` | Gold glow on accent elements |
| `nav` | `0 2px 20px rgba(0,0,0,0.60)` | Navigation bar shadow |

### Gradients

- **Hero overlay:** `linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(11,26,49,0.72) 50%, rgba(0,0,0,0.55) 100%)`
- **Red shine (buttons/banners):** `linear-gradient(135deg, #AA0000 0%, #CC0000 50%, #E60000 100%)`
- **CTA section:** `linear-gradient(135deg, #0B1A31 0%, #1A1A1A 100%)`

---

## Component Patterns

### Buttons

```
btn-primary   → Red fill (#CC0000), white text, uppercase, semibold, px-6 py-3, rounded-sm, hover darkens
btn-secondary → Dark navy fill (#0B1A31), white text, same sizing
btn-outline   → Transparent with white border, white text — used on dark backgrounds
btn-outline-primary → Transparent with red border, red text — used on light backgrounds
```

### Cards

```
card-base → White bg, 1px border (#E5E7EB), subtle shadow, hover lifts with red-tinted shadow
```

### Badges

```
badge-new  → Green (#16A34A) pill, white uppercase text — "NEW"
badge-used → Red (#CC0000) pill, white uppercase text — "USED"
```

### Form Fields

```
input-field  → White bg, gray border, focus ring red, placeholder muted
select-field → Same as input-field + appearance-none
```

### Typography Helpers

```
section-title    → text-3xl font-bold text-dark tracking-tight
section-subtitle → text-muted text-base mt-2 max-w-xl
price-tag        → text-primary font-bold text-xl
divider-red      → w-12 h-1 bg-primary mt-3 mb-1  (accent underline below section titles)
star-filled      → text-accent (#D4AF37)
star-empty       → text-brand-border
```

---

## Page Structure

### Navigation (Header)

- **Background:** `#0B1A31` (dark navy)
- **Shadow:** nav shadow
- **Logo:** Left-aligned with brand name
- **Links:** White, hover → red accent underline
- **CTA button:** `btn-primary` (red)
- **Mobile:** Hamburger menu, full-screen slide-down

### Home Page — Section Order

1. **Hero** — full-viewport, dark overlay on background image, headline + subheadline + dual CTA buttons + search bar
2. **Brand Scroll** — horizontal scrolling strip of car brand logos on white/light bg
3. **Featured Cars** — grid of car cards (image, title, specs pills, price, CTA)
4. **Stats** — dark navy (`#0B1A31`) full-width band with 4 counters (e.g. "54K+ Facebook Fans", "14+ Years", "90% Recommendation Rate")
5. **Services** — icon + title + description cards on light bg
6. **About** — two-column: text left (headline, body, trust bullets) / image right
7. **Testimonials** — customer review cards with stars, name, role
8. **Blog** — 3-column article preview cards
9. **Newsletter** — dark bg, centered email capture form
10. **CTA** — full-width dark gradient band, headline + two buttons
11. **Footer** — dark navy, 4-column grid (logo+desc, quick links, services, contact), bottom bar with copyright

### Floating Socials

- Fixed left-side vertical strip with social icons (Facebook, Instagram, TikTok, WhatsApp)

---

## Business Info (for copy)

```
Name:        Riri Cars
Phone:       +254 729 003 333
WhatsApp:    +254 729 003 333
Email:       info@riricars.co.ke
Website:     https://riricars.co.ke
Address:     Kiambu Road, Fourways Junction
             Ridgeways, Nairobi
Hours:       Mon–Sat: 8 AM–6 PM | Sun: 10 AM–4 PM
Facebook:    https://www.facebook.com/riricars.co.ke/
Instagram:   https://www.instagram.com/riricars/
TikTok:      https://www.tiktok.com/@riricarsltd1
WhatsApp:    https://wa.me/254729003333
Hashtags:    #DriveRiriCars #WhereExcellenceMeetsAffordability #CarsYouCanTrust
```

---

## Tone & Voice

- Professional yet approachable
- Trust-forward (emphasize verified stock, transparent pricing, after-sales support)
- Kenyan market — local landmark references, KES pricing
- Active voice: "Browse our stock", "Book a test drive", "Get financed today"

---

## Pages Still to Build

| Page | Priority | Notes |
|---|---|---|
| Inventory / Stock Listing | High | Filter by make, model, year, price, body type |
| Car Detail Page | High | Full specs, image gallery, finance calculator, WhatsApp CTA |
| About Us | Medium | Team, story, milestones, location map |
| Services | Medium | Financing, trade-in, after-sales |
| Contact | Medium | Form, map embed, opening hours |
| Blog / News | Low | Articles about car buying tips |
| Finance Calculator | Low | Standalone tool or modal |
