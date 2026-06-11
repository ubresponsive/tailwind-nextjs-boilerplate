# Tailwind CSS v4 with Next.js: Setup, Theming and Component Best Practices

Implementation guide for an AI agent building a Next.js website with Tailwind CSS v4, Heroicons, Headless UI, and a local library of prebuilt Tailwind Plus components (marketing, application UI, ecommerce). This document is the authority on Tailwind usage for the project. Tailwind v4 changed fundamentally from v3; never apply v3 patterns. Current as at June 2026, targeting Tailwind CSS v4.3.x.

---

## 1. Stack and Versions

| Package                       | Version                                                    | Notes                                        |
| ----------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| `tailwindcss`                 | 4.3.x                                                      | CSS first configuration, Oxide engine        |
| `@tailwindcss/postcss`        | 4.3.x                                                      | The only PostCSS plugin needed               |
| `@headlessui/react`           | 2.x                                                        | Used by Tailwind Plus interactive components |
| `@heroicons/react`            | 2.x                                                        | Icon set                                     |
| `clsx` + `tailwind-merge`     | latest (tailwind-merge v3+, required for v4 class support) | Powers the `cn()` utility                    |
| `prettier-plugin-tailwindcss` | latest                                                     | Automatic class sorting                      |
| `@tailwindcss/typography`     | latest                                                     | Blog prose styling                           |

Hard rules:

- There is NO `tailwind.config.js` in this project. All configuration lives in CSS. Do not create one. (A legacy JS config can be loaded with `@config`, but this project must not use it.)
- Do not install or configure `autoprefixer` or `postcss-import`. Tailwind v4 handles vendor prefixing and import resolution internally via Lightning CSS.
- Do not add a `content` array anywhere. v4 detects template files automatically.

---

## 2. Installation and Setup with Next.js

```bash
npm install tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.mjs (entire file)
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

```css
/* app/globals.css — first line */
@import "tailwindcss";
```

```tsx
// app/layout.tsx
import "./globals.css";
```

- This works identically under Turbopack (the Next.js 16 default) and webpack.
- `@import 'tailwindcss'` replaces the three v3 `@tailwind base/components/utilities` directives. Never write those directives; they are invalid in v4.
- One global stylesheet imported once in the root layout. Route or component CSS files are rare and need `@reference` (see Gotchas).
- Browser support baseline: Safari 16.4+, Chrome 111+, Firefox 128+. v4.1+ degrades gracefully in older browsers but do not target them.

---

## 3. CSS First Configuration: Theming with @theme

All design tokens are defined in CSS with the `@theme` directive. Tokens in `@theme` do two things: generate utility classes (`--color-primary-600` enables `bg-primary-600`, `text-primary-600`, `border-primary-600`, etc.) and emit CSS custom properties usable anywhere (`var(--color-primary-600)`).

```css
/* app/globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Brand colour with a full shade scale so every utility depth works.
     Generate the scale from the brand hex (OKLCH keeps hue consistent). */
  --color-primary-50: oklch(0.97 0.02 255);
  --color-primary-100: oklch(0.93 0.04 255);
  --color-primary-200: oklch(0.87 0.07 255);
  --color-primary-300: oklch(0.78 0.11 255);
  --color-primary-400: oklch(0.68 0.15 255);
  --color-primary-500: oklch(0.6 0.18 255);
  --color-primary-600: oklch(0.53 0.19 255); /* core brand value */
  --color-primary-700: oklch(0.46 0.17 255);
  --color-primary-800: oklch(0.4 0.14 255);
  --color-primary-900: oklch(0.35 0.11 255);
  --color-primary-950: oklch(0.25 0.08 255);

  /* Secondary/accent scale: same structure */
  --color-secondary-500: oklch(0.65 0.15 150);
  --color-secondary-600: oklch(0.55 0.16 150);
  /* ...remaining steps... */

  /* Shape and depth tokens */
  --radius-card: 0.75rem;
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.08);

  /* Breakpoints and container queries are themeable too */
  --breakpoint-3xl: 120rem;
}
```

Rules:

- Define the full 50 to 950 scale for `primary` (and `secondary` if used for surfaces/buttons). Tailwind Plus components use multiple depths of their default colour (`indigo-600` base, `indigo-500` hover, `indigo-100` tints, `indigo-950` dark text); the brand scale must support the same swaps.
- Namespace meaning: `--color-*` makes colour utilities, `--font-*` font families, `--text-*` font sizes, `--radius-*` border radii, `--shadow-*` shadows, `--spacing-*` the spacing scale, `--breakpoint-*` responsive variants, `--animate-*` animations.
- To remove unused default palettes (smaller CSS, prevents off brand colours), reset a namespace then redefine: `--color-*: initial;` followed by the project colours plus the neutrals actually used. Optional but recommended for brand discipline.
- Semantic aliases for theme switching use plain CSS variables mapped through `@theme inline`:

```css
:root {
  --surface: var(--color-white);
  --surface-muted: var(--color-gray-50);
}
.dark {
  --surface: var(--color-gray-950);
  --surface-muted: var(--color-gray-900);
}

@theme inline {
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
}
```

`@theme inline` is required whenever a theme token references another CSS variable; without `inline` the utility points at the variable definition site and resolves incorrectly.

- Dark mode in v4 defaults to `prefers-color-scheme`. For a class toggled theme, define the variant explicitly:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Only implement dark mode if the brief asks for it; partial dark support is worse than none.

---

## 4. Fonts with next/font

`next/font` exposes a CSS variable; map it into the theme with `@theme inline` (the variable reference rule above):

```tsx
// app/layout.tsx
import { Inter, Lexend } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' })

<html lang="en-AU" className={`${inter.variable} ${lexend.variable}`}>
```

```css
@theme inline {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-lexend), var(--font-inter), sans-serif;
}
```

Now `font-sans` is the body default and `font-display` styles headings. Never link Google Fonts in `<head>` and never declare `@font-face` manually for hosted fonts.

---

## 5. Custom Utilities, Variants and Plugins

- Custom utility classes use `@utility`, never `@layer utilities` (v4 utilities defined with `@utility` work with all variants and are tree shaken):

```css
@utility section-pad {
  padding-block: calc(var(--spacing) * 16);
  @media (min-width: 40rem) {
    padding-block: calc(var(--spacing) * 24);
  }
}
```

- Custom variants use `@custom-variant`:

```css
@custom-variant scrolled (&:where([data-scrolled] *));
```

- Plugins load with `@plugin`: `@plugin '@tailwindcss/typography';` then style blog content with `prose prose-lg prose-gray max-w-prose` plus `prose-headings:font-display prose-a:text-primary-600` modifiers.
- Keep custom CSS minimal. Before writing any `@utility`, confirm no built in utility or component abstraction covers it. The order of preference is: built in utility > React component encapsulating utilities > `@utility` > raw CSS.

---

## 6. Writing Utilities Correctly

- Mobile first always: unprefixed utilities are the mobile style; `sm: md: lg: xl:` add up. Never write desktop styles unprefixed and "undo" them at small sizes.
- Variants compose left to right in v4 and stack freely: `dark:lg:hover:bg-primary-700`, `*:first:pt-0` (v3 ordered some stacked variants right to left; never copy v3 ordering).
- Prefer modern variants over JavaScript state where CSS can do the job:
  - `group`/`group-hover:` and `peer`/`peer-checked:` for relational styling
  - `has-[:checked]:` and `in-*` for parent and ancestor conditions
  - `data-*:` variants for Headless UI v2 states: `data-open:rotate-180`, `data-focus:bg-primary-50`, `data-hover:` (Tailwind Plus components rely on these)
  - `aria-expanded:` and friends for accessibility driven styling
  - `nth-*`, `not-*`, `inert:` where applicable
- Container queries are built in: mark a wrapper `@container` and size children with `@sm: @md: @lg:` variants so components respond to their container, not the viewport. Prefer these inside cards and sidebars.
- Opacity uses the slash modifier only: `bg-gray-900/60`, `text-white/80`. The `bg-opacity-*` and `text-opacity-*` utilities no longer exist.
- Arbitrary values `h-[72px]` are a last resort; prefer scale values (`h-18` works in v4's dynamic spacing scale). Arbitrary CSS variable syntax uses parentheses: `bg-(--brand-overlay)`, not the v3 square bracket form `bg-[--brand-overlay]`.
- Logical properties for spacing where direction matters (`ms-*`, `me-*`, `ps-*`, `pe-*`); v4.2+ favours logical property utilities and deprecated `start-*`/`end-*` inset utilities in favour of `inline-s-*`/`inline-e-*`.
- Prefer `gap-*` in flex and grid over `space-x/y-*` (the v4 `space-*` selector changed and can misbehave with reversed or wrapped layouts).
- Install `prettier-plugin-tailwindcss` so every class list is auto sorted; never hand order classes.

### The dynamic class name rule (most common agent failure)

Tailwind only generates classes it finds as complete, unbroken strings in source files. String building produces classes that silently do not exist:

```tsx
// BROKEN: never do this
<div className={`bg-${color}-600 text-${size}`} />

// CORRECT: map to complete strings
const styles = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50',
} as const
<div className={styles[variant]} />
```

If classes genuinely cannot appear in source (CMS driven), safelist them explicitly: `@source inline("bg-primary-600 bg-secondary-600");` in globals.css. Use sparingly.

---

## 7. Components over @apply

- Reuse comes from React components, not CSS abstraction. Do not create `.btn`, `.card` style classes with `@apply`; wrap the markup once:

```tsx
// components/ui/button.tsx
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 focus-visible:outline-primary-600",
  secondary:
    "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
  ghost: "text-primary-600 hover:text-primary-500",
};

export function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold",
        "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
```

- `cn()` = `twMerge(clsx(...))`. Use it whenever a component accepts `className`, so caller overrides beat defaults without duplicate conflicting classes. `tailwind-merge` must be v3+ for Tailwind v4 class recognition; if custom `--text-*` or `--shadow-*` tokens collide incorrectly, extend its config.
- The legacy `classNames()` helper in `lib/utils` exists only so pasted Tailwind Plus code compiles unchanged; new components use `cn()`.
- `@apply` is acceptable only inside `@utility` definitions for patterns that genuinely cannot be componentised (e.g. styling raw CMS HTML). Note `@apply` does not work with arbitrary variants of custom classes and hides styles from markup; treat it as a smell.
- Shared layout primitives to build once and use everywhere: `Container` (`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`), `Section` (vertical rhythm), `SectionHeading` (eyebrow + H2 + intro).

---

## 8. Working with the Tailwind Plus Component Library

The project includes 657 prebuilt components under `components/` (marketing, application-ui, ecommerce, templates, ui). Treat them as a catalogue to copy from, not modules to import directly.

Workflow per component:

1. Locate the closest block (`ls components/marketing/sections/...` or `find components -name "*hero*"`).
2. Copy it into the app as a project component (kebab-case file, PascalCase export per the repo README), under `components/` for shared pieces or colocated in the route folder for page specific sections.
3. Convert to TypeScript and extract hardcoded placeholder arrays into typed props or data files. Page content never lives inside the component.
4. Rebrand (next subsection), swap imagery, adjust spacing to the project rhythm.
5. Keep it a Server Component unless it uses Headless UI, state, or handlers; then add `'use client'` at the leaf.

Rebranding map (apply consistently; default Tailwind Plus components ship in indigo and gray):

| Tailwind Plus default                   | Replace with                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `indigo-600` (solid backgrounds, links) | `primary-600`                                                                                     |
| `indigo-500` (hover on solid)           | `primary-500` (or `primary-700` if the brand scale darkens on hover; pick one direction sitewide) |
| `indigo-100/50` (tints)                 | `primary-100/50`                                                                                  |
| `indigo-400` (dark surface accents)     | `primary-400`                                                                                     |
| `focus-visible:outline-indigo-600`      | `focus-visible:outline-primary-600`                                                               |
| `gray-*`                                | Keep, or map to the chosen neutral scale once, globally                                           |
| Default font (none declared = sans)     | `font-display` on headings per the type system                                                    |

Rules:

- Any `indigo` remaining in shipped code is a defect. Grep before completion: `grep -rn "indigo" app/ components/ --include="*.tsx"`.
- Do not mix component aesthetics: pick one hero family, one feature section family, one footer, and reuse their visual language (border vs shadow, tint usage, density) sitewide.
- Headless UI v2 components (Menu, Dialog, Disclosure, Tabs, Listbox) provide behaviour and accessibility. Never replace them with hand rolled `useState` toggles, and never remove their `data-*` styling hooks or ARIA wiring. Style states with `data-open:`, `data-focus:`, `data-selected:` variants.
- Application UI blocks (tables, forms, pagination, breadcrumbs) and ecommerce blocks follow the same copy, type, retoken, extract props process.
- Mind heading levels when composing blocks: Tailwind Plus sections often ship with `h2`; ensure the page composition yields exactly one `h1` and no skipped levels.

---

## 9. Icons (Heroicons primary, Lucide secondary)

Heroicons is the primary set. **Lucide** (`lucide-react`) is a gap filler for icons Heroicons does not cover, visually normalised to match Heroicons. **Font Awesome is prohibited**: never install `@fortawesome/*`, `react-icons`, or any FA fonts/CDN links.

**Selection order — apply on every icon decision:**

1. **Heroicons** from the correct size set first.
2. **Lucide via the `Icon` wrapper** (stroke 1.5) only when no suitable Heroicon exists.
3. **Brand/social logos**: local SVG components in `components/ui/logos/` (Simple Icons or licensed assets), `aria-hidden` plus `sr-only` text where linked.
4. Nothing else. If an icon cannot be found in 1–3, flag it rather than adding a new library.

**Heroicons usage (unchanged):**

- Import per icon from the correct size set: `@heroicons/react/24/outline` (default UI and feature icons), `@heroicons/react/20/solid` (dense UI, buttons, inline), `@heroicons/react/16/solid` (very tight spots). Outline at 24, solid at 20/16; do not render a 24px outline icon at 16px.
- Size with Tailwind (`size-5`, `size-6`) and colour via `text-*` (icons inherit `currentColor`).
- Decorative icons get `aria-hidden="true"`; icon only buttons get an `aria-label` or screen reader text (`<span className="sr-only">`).
- Render Heroicons directly in JSX. **Do not** retrofit them through the `Icon` wrapper — the wrapper normalises Lucide to Heroicons, not the reverse.

**Lucide usage:**

- Lucide draws at `strokeWidth=2` by default; Heroicons outline is `1.5`. **Always** route Lucide through the single wrapper `components/ui/icon.tsx`, which forces `strokeWidth={1.5}` and sets a11y defaults, so the two sets are indistinguishable side by side.
- Lucide icons are **never** rendered directly in JSX (`<Forklift />` is a defect). Import by name and pass to the wrapper:

```tsx
import { Forklift } from 'lucide-react'
import { Icon } from '@/components/ui/icon'

<Icon icon={Forklift} className="size-5 text-primary-600" />
```

- Next.js optimises both `lucide-react` and `@heroicons/react` via built-in `optimizePackageImports`, so named imports tree shake correctly — no `modularizeImports` or bundler config needed.
- Mixing both sets within one component is allowed only if both render the same visual style (outline with outline, solid with solid) at the same size.

---

## 10. v3 Habits the Agent Must Not Reproduce

Most AI training data is Tailwind v3. The following will be wrong by default; this table is the correction. Never emit the v3 form.

| v3 (WRONG in this project)                                   | v4 (correct)                                                                                                                             |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.js` with `content`, `theme.extend`          | `@theme` in globals.css; automatic content detection                                                                                     |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import 'tailwindcss';`                                                                                                                 |
| `darkMode: 'class'` in config                                | `@custom-variant dark (&:where(.dark, .dark *));`                                                                                        |
| `plugins: [require('@tailwindcss/typography')]`              | `@plugin '@tailwindcss/typography';`                                                                                                     |
| `theme()` function in CSS                                    | `var(--token-name)`                                                                                                                      |
| `shadow-sm` / `shadow`                                       | `shadow-xs` / `shadow-sm`                                                                                                                |
| `rounded-sm` / `rounded`                                     | `rounded-xs` / `rounded-sm`                                                                                                              |
| `blur-sm` / `blur`, `drop-shadow-sm`, `backdrop-blur-sm`     | `blur-xs` / `blur-sm`, `drop-shadow-xs`, `backdrop-blur-xs`                                                                              |
| `ring` (3px implied)                                         | `ring-3` (`ring` is now 1px)                                                                                                             |
| `outline-none` (to hide outline)                             | `outline-hidden` (note: `outline-none` now genuinely means `outline-style: none`)                                                        |
| `bg-opacity-50`, `text-opacity-80`                           | `bg-black/50`, `text-white/80`                                                                                                           |
| `bg-[--brand]` arbitrary variable                            | `bg-(--brand)`                                                                                                                           |
| `flex-grow` / `flex-shrink`                                  | `grow` / `shrink`                                                                                                                        |
| Expecting default `border` colour gray-200                   | Default border/divide colour is `currentColor`; always state it: `border-gray-200`                                                       |
| Expecting default `ring` colour blue-500                     | Default ring colour is `currentColor`; state it: `ring-gray-300`                                                                         |
| Expecting placeholder text gray-400                          | Placeholder is currentColor at 50%; style explicitly if needed                                                                           |
| Expecting buttons to get `cursor: pointer`                   | Preflight sets `cursor: default`; add a base override if pointer is wanted: `@layer base { button:not(:disabled) { cursor: pointer; } }` |
| Right to left stacked variant order                          | Left to right: `*:first:pt-0`                                                                                                            |
| `safelist` config array                                      | `@source inline("...")`                                                                                                                  |
| `prefix: 'tw-'` producing `tw-flex`                          | Prefix renders as a variant: `tw:flex`                                                                                                   |
| `important: true` config                                     | `@import 'tailwindcss' important;`                                                                                                       |
| `corePlugins` disabling                                      | Not supported; remove the concept                                                                                                        |

Behavioural changes to remember: `hover:` styles only apply on devices that actually support hover (touch devices ignore them, so never hide essential affordances behind hover); the default palette is OKLCH based and renders wider gamut colour on P3 displays; `space-y-*` uses a different selector than v3 (prefer `gap`).

---

## 11. Compilation, Content Detection and Tree Shaking

How v4 builds CSS, and how to keep the output tiny:

- The Oxide engine (Rust) compiles on demand: only classes found in source files are generated. There is no purge step and nothing to configure; full builds are several times faster than v3 and incremental rebuilds measured in microseconds (v4.2 improved recompilation a further ~3.8x).
- Automatic content detection scans the project for class names, skipping anything in `.gitignore`, binary files, and `node_modules`. CSS, vendor prefixing (Lightning CSS), import flattening, and production minification are all built in.
- **Critical gotcha for this project**: the 657 component catalogue sits inside the repo, so automatic detection will scan all of it and generate CSS for classes used by components that were never copied into the app, bloating the stylesheet. Exclude the catalogue explicitly:

```css
@import "tailwindcss";
@source not "../components/tailwind-plus-catalog";
```

(Adjust the path to wherever the unconverted catalogue lives; keep copied, in use components inside the app source so their classes are detected. Alternatively keep the catalogue out of the repo or gitignored.)

- `@source "../node_modules/some-ui-lib";` force includes a package that ships Tailwind classes (detection skips node_modules by default).
- Classes in Markdown/MDX content are detected if the files are in the project; CMS sourced classes need `@source inline(...)` safelisting.
- Theme CSS variables are emitted for tokens; resetting unused namespaces (`--color-*: initial`) keeps both the variable block and the temptation surface small.
- Verify output size after the build: the production CSS for a marketing site should be roughly 10 to 30KB gzipped. If it is far larger, something (usually the catalogue) is being scanned unintentionally.

---

## 12. Gotchas Summary

| Gotcha                                                                                           | Resolution                                                                                                                               |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `@apply` or `@variant` in a CSS Module or any file other than globals.css fails to resolve theme | Add `@reference "../app/globals.css";` at the top of that file; better, avoid extra CSS files                                            |
| Theme token referencing another variable resolves wrongly                                        | Define it under `@theme inline`                                                                                                          |
| Brand utilities missing (`bg-primary-600` not working)                                           | Token must be declared in `@theme` with the exact namespace (`--color-primary-600`)                                                      |
| Dynamically concatenated class names produce no styles                                           | Complete class strings only; map via objects; `@source inline()` as last resort                                                          |
| Hover styles "not working" on touch devices                                                      | Intentional v4 behaviour; design must not rely on hover                                                                                  |
| Black borders/rings appearing                                                                    | v4 default is currentColor; always specify border and ring colours                                                                       |
| Old Tailwind Plus copies using `shadow-sm`, `rounded`, `ring`, `outline-none`                    | Translate to v4 names on paste (table in Section 10); components in the local catalogue are already v4, but external snippets may not be |
| Styles from `tailwind-merge` dropping custom utilities                                           | Upgrade tailwind-merge to a v4 aware release and extend its config for custom token groups                                               |
| Headless UI open/focus styling not applying                                                      | Use `data-open:` / `data-focus:` variants (v2 data attributes), not `ui-open:` classes from Headless UI v1 era                           |
| CSS bloat from the component catalogue                                                           | `@source not` exclusion per Section 11                                                                                                   |
| Editor showing unknown at rule warnings for `@theme`, `@utility`                                 | Use the official Tailwind CSS IntelliSense extension; do not "fix" by removing directives                                                |

---

## 13. Setup and Review Checklist

1. Install per Section 1; confirm no `tailwind.config.js`, no autoprefixer, no `content` array anywhere.
2. Create `globals.css`: `@import 'tailwindcss'`, `@plugin` typography, `@source not` for the component catalogue, `@theme` with full primary scale, shape tokens, and `@theme inline` font mappings.
3. Wire `next/font` variables on `<html>`; verify `font-sans` and `font-display` resolve.
4. Build `cn()`, `Button`, `Container`, `Section`, `SectionHeading` primitives before composing pages.
5. Copy Tailwind Plus blocks per the Section 8 workflow; retoken immediately; extract content to props.
6. Run the indigo grep and a `shadow-sm|rounded |ring |outline-none` audit for v3 era class leakage.
7. Add `prettier-plugin-tailwindcss` and format all files.
8. Production build: inspect generated CSS size; confirm catalogue exclusion worked.
9. Visual pass: borders and rings have explicit colours, focus rings visible, hover dependent UI works on touch, dark sections use the semantic tokens.
