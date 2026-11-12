# Elixir Perfumería — Agent Directives & UI Engineering Standards

This project follows the strict design and engineering standards of **Emil Kowalski (Design Engineering)**, **Impeccable (Anti-Slop Craft)**, and **Taste Skill (Awwwards-Level Frontend)**.

---

## 1. Aesthetic & Identity Guidelines (Luxury Perfumery)
- **Palette**:
  - Obsidian Dark: `#191410` (Primary text, dark pills, luxury buttons)
  - Refined Gold: `#C8A96A` (Accents, active states, key icons, badges)
  - Warm Sand/Gold Dark: `#8a6d42` / `#6d5228` (Subtitles, brand text, secondary accents)
  - Backgrounds: `#fbfaf7` (Warm cream canvas), `#efe9e0` (Image containers), `#ffffff` (Elevated cards)
- **Typography**:
  - Headings: Serif (`font-serif`) for luxury, elegance, and artisanal heritage.
  - Body & UI: Sans-serif (`font-sans`) for legibility, prices, metrics, and micro-labels.
  - Tracking: Wide tracking on micro-labels (`tracking-[0.2em]` to `tracking-[0.25em]`, uppercase).

---

## 2. Emil Kowalski — Design Engineering Principles
- **Motion & Transitions**:
  - Snappy, responsive UI. No floaty, sluggish animations.
  - Modals and drawers: Spring or natural deceleration curves.
  - Hover states: Subtle scaling (`scale-[1.03]`), border illumination.
  - Press feedback: Micro-compression on active click (`active:scale-[0.98]`).
- **Tactile Polish**:
  - Seamless layout shifts; elements never jump abruptly.
  - All interactive elements must have clear focus, hover, and active states.

---

## 3. Impeccable & Taste — Anti-Slop Discipline
- **Banned Clichés**:
  - No generic purple-to-blue gradients.
  - No three identical centered cards with generic stock icons.
  - No empty whitespace without spatial purpose.
- **Craft & Density**:
  - Clear editorial hierarchy.
  - Image containers must show products with `object-contain` without awkward cropping.
  - Live feedback loops and real-time previews.

---

## 4. Technical & Architectural Rules (Angular 22)
- **Signals**: Always use Angular signals (`signal`, `computed`). Never mix outdated Zone.js or dirty-checking hacks.
- **SSR / Hydration Safety**:
  - Avoid reading and writing signals inside effects in a way that triggers circular reactivity or hydration breaks.
  - For route changes, use controlled RxJS subscriptions (`takeUntilDestroyed()`) outside signal tracking contexts.
- **Build Verification**:
  - Always verify with `npm run build` after making modifications.
