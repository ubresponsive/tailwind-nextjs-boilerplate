# UX/UI Best Practices for Building a Standout Marketing Website

Implementation guide for an AI agent building a multipage website with blog, using Tailwind Plus components on Next.js. The goal is a site that looks professionally designed and distinctive, converts visitors, and remains intuitive and consistent throughout. Apply every directive unless the brief explicitly overrides it.

---

## 1. Core Design Principles

- **One job per page.** Every page has a single primary goal (enquire, read, subscribe, browse). Design decisions are judged against that goal.
- **Hierarchy before decoration.** A visitor should know within 5 seconds what the site offers, who it is for, and what to do next. Size, weight, colour, and spacing create that hierarchy; ornament never substitutes for it.
- **Consistency builds trust.** Same button styles, heading scale, spacing rhythm, icon set, and image treatment on every page. A component, once styled, looks identical everywhere.
- **Whitespace is a feature.** Generous, consistent spacing reads as premium. Cramped layouts read as amateur. When in doubt, add space rather than another element.
- **Distinctive, not templated.** Tailwind Plus blocks are a starting point, not the finished design. The site must carry one memorable signature (a typographic treatment, a colour use, a layout device, an interaction) and disciplined restraint everywhere else. Spend boldness in one place.
- **Quality floor, always.** Responsive to 360px, visible keyboard focus, WCAG AA contrast, reduced motion respected. These are non negotiable and never announced.

---

## 2. User Journeys and Information Architecture

Before building any page, define:

| Item               | Requirement                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Personas           | 2 to 3 visitor types with their goal (evaluate, learn, contact)                                            |
| Primary journey    | Land (home or blog via search) > understand offer > see proof > act (CTA). Map each step to a page section |
| Secondary journeys | Blog reader > related content > soft CTA; returning visitor > contact or pricing directly                  |
| Page goals         | One primary CTA per page; everything else supports or removes friction                                     |

Rules:

- Navigation reflects visitor tasks, not internal structure. Labels are plain nouns visitors would search for ("Services", "Pricing", "About", "Blog", "Contact"), never internal jargon or clever names.
- Maximum 5 to 7 top level nav items. Every important page reachable within 3 clicks; every page links onward (no dead ends).
- Each journey step answers the visitor's next question in order: What is it? Is it for me? Can I trust it? What does it cost or involve? What do I do next?
- Place the strongest proof (testimonials, logos, results) immediately before or beside the conversion point, not buried at the bottom.

---

## 3. Layout System and Responsive Grid

- Content container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` site wide. Never let text touch viewport edges.
- 12 column mental model; common splits 50/50, 60/40, 2/3 + 1/3. Asymmetry adds interest; chaos does not.
- Vertical rhythm: section padding `py-16 sm:py-24` (or `py-20 sm:py-32` for airy designs), consistent across the site. Within sections, spacing steps down predictably (section gap > block gap > element gap), all from Tailwind's 4px scale. Never arbitrary pixel values.
- Breakpoints mobile first: design for 360 to 414px, then `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Most layout changes happen at `md` and `lg`.
- Cards in grids: `grid gap-8 sm:grid-cols-2 lg:grid-cols-3`. Equal heights, aligned baselines, identical internal padding.
- Alternate section backgrounds (white, light neutral, occasional dark or brand section) to create scannable bands. Never two identical adjacent treatments fighting for attention.
- Avoid full width text. Body copy column max `max-w-prose` (around 65ch) even inside wide sections.

---

## 4. Typography

Typefaces:

- Choose exactly two families: a characterful display face for headings and a highly readable body face. A deliberate pairing (e.g. a distinctive grotesque, serif, or geometric display with a neutral body) is a primary way the site avoids looking templated. Load via `next/font`.
- Maximum 3 weights in use across the site (e.g. 400, 600, 700). More weights dilute hierarchy.

Type scale (Tailwind classes, mobile then desktop):

| Element                     | Mobile             | Desktop                               | Weight     | Notes                                                         |
| --------------------------- | ------------------ | ------------------------------------- | ---------- | ------------------------------------------------------------- |
| H1 (hero)                   | `text-4xl` (36px)  | `text-5xl` to `text-6xl` (48 to 60px) | 700 to 800 | `tracking-tight`, `text-balance`, line height 1.1             |
| H1 (subpage)                | `text-3xl` (30px)  | `text-4xl` (36px)                     | 700        | Smaller than home hero                                        |
| H2 (section)                | `text-2xl` (24px)  | `text-3xl` (30px)                     | 700        | Often paired with an eyebrow label                            |
| H3 (subsection, card title) | `text-lg` (18px)   | `text-xl` (20px)                      | 600        |                                                               |
| H4 (minor heading)          | `text-base` (16px) | `text-lg` (18px)                      | 600        | Use sparingly                                                 |
| Eyebrow/kicker              | `text-sm`          | `text-sm`                             | 600        | Uppercase, `tracking-wide`, brand colour; sits above H1/H2    |
| Body                        | `text-base` (16px) | `text-base` to `text-lg`              | 400        | Line height 1.6 to 1.75 (`leading-relaxed`); never below 16px |
| Small/caption               | `text-sm` (14px)   | `text-sm`                             | 400 to 500 | Metadata, captions, legal                                     |
| Blog body                   | `text-lg` (18px)   | `text-lg`                             | 400        | `max-w-prose`, generous leading                               |

Rules:

- Heading levels are semantic (one H1 per page, no skipped levels) and the visual scale matches the semantic order.
- Sentence case for headings and buttons. All caps only for eyebrows and tiny labels, always with letter spacing.
- Line length 45 to 75 characters for body text. Headings wrap to at most 2 to 3 lines (`text-balance` helps).
- Never justify text on the web; left align. Never use thin (100 to 300) weights for body copy.
- Text colour: near black on light (`text-gray-900`), body copy may be `text-gray-600/700`; never pure black on pure white for long passages if the palette has a softer neutral, and never light grey below AA contrast.

---

## 5. Colour System

Define the palette as design tokens before building. Structure:

| Token                   | Role                                                                  | Usage share                           |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `primary`               | Brand colour: primary buttons, key links, active states, eyebrows     | ~10% of any view                      |
| `primary-hover`         | Darker step of primary for hover/active                               |                                       |
| `secondary`             | Supporting brand colour: secondary accents, illustrations, highlights | Sparingly                             |
| `neutral` scale         | Backgrounds, borders, text (50 to 950 steps)                          | ~60% backgrounds, ~30% text/structure |
| `success/warning/error` | Form feedback and alerts only                                         | Functional only                       |

Rules:

- Follow the 60/30/10 balance: mostly neutrals, structured text colour, small doses of brand colour. A page drenched in brand colour looks like a flyer; brand colour gains power through scarcity.
- One accent colour owns "action". Primary buttons and key links use it exclusively, so the eye learns that colour means "clickable and important".
- Contrast minimums (WCAG AA): 4.5:1 body text, 3:1 large text (24px+, or 18.5px bold) and UI components/borders against adjacent colours. Verify brand colours on white, on neutral tints, and on dark sections; adjust the shade rather than breaking contrast.
- Dark sections (footer, occasional feature band) use a very dark neutral, not pure black; text on dark is a light neutral (`text-gray-300`) with white reserved for headings.
- Never rely on colour alone to convey state: pair with icons, text, or underlines (links, errors, charts).
- Gradients: at most one subtle brand gradient treatment, used consistently; avoid rainbow or multi stop gradients on text and buttons.

---

## 6. Buttons and CTAs

Three tiers, used consistently sitewide:

| Tier      | Style                                                                           | Use                                                        |
| --------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Primary   | Solid `primary` background, white text, `rounded-md/lg`, medium shadow optional | The one main action per view ("Get a quote", "Contact us") |
| Secondary | Outline or soft tint (`ring-1 ring-gray-300` or `bg-primary/10 text-primary`)   | Supporting actions ("Learn more", "View pricing")          |
| Tertiary  | Text button with arrow ("Read more →")                                          | Low emphasis, inline and card actions                      |

Rules:

- One primary button per section, one dominant CTA per page. Two primary buttons side by side compete and depress clicks; pair primary with secondary instead.
- Labels are specific verbs, 2 to 4 words, sentence case: "Get a free quote", not "Submit", "Click here", or "Learn more" as the main CTA.
- Sizing: comfortable padding (`px-5 py-3` typical, `px-6 py-3.5 text-base/lg` for hero CTAs), minimum 44x44px touch target, full width on mobile where stacked.
- States are mandatory: hover (darken or lift), focus-visible (2px offset ring in primary colour), active, disabled (reduced opacity, no hover), loading (spinner plus label, button stays same width).
- The same action keeps the same label and style everywhere ("Get a quote" never becomes "Request quote" elsewhere).
- Repeat the primary CTA: hero, mid page after proof, and final band before the footer. Final CTA band is a high contrast section with one heading, one line of support copy, one button.

---

## 7. Links

- Inline links within body copy are underlined and/or in primary colour; they must be distinguishable from surrounding text without colour alone (underline preferred).
- Navigation and card links may drop the underline but need a clear hover state (colour shift, underline appears) and visible focus ring.
- Link text describes the destination ("View our pricing", "Read the full case study"), never "click here" or a bare "here".
- Links navigate; buttons act. Never style a navigation link as a primary button except deliberate nav CTAs ("Contact" as a button in the header is fine, once).
- Whole card click areas: make the entire card clickable (stretched link pattern) while keeping one real anchor for accessibility; show a card level hover state (shadow lift or border colour).
- External links open in the same tab unless leaving mid task; if a new tab is used, indicate it.

---

## 8. Header and Navigation

- Structure: logo left, nav centre or right, one CTA button right. Height 64 to 80px desktop, 56 to 64px mobile.
- Sticky header is recommended: solid or blurred translucent background (`bg-white/80 backdrop-blur` plus border or shadow once scrolled) so text never floats illegibly over content.
- Active page indicated in the nav (colour or underline). Hover states on all items.
- Dropdowns/mega menus (Tailwind Plus flyout menus): open on click, not hover alone; close on Escape and outside click; fully keyboard navigable. Use a mega menu only with 8+ destinations to organise; otherwise simple dropdowns or no nesting.
- Maximum one level of nesting. If the IA needs more, the IA is wrong.
- Mobile menu:
  - Hamburger only below `lg`; never hide nav behind a hamburger on desktop.
  - Use the Tailwind Plus mobile dialog/drawer: full or near full screen panel, large tap targets (48px rows), visible close button in the same corner the opener was, body scroll locked, focus trapped, Escape closes.
  - The header CTA remains visible on mobile next to the hamburger if space allows, or as the first prominent item in the panel.
- The logo always links home. Keep the header light: no phone numbers, social icons, and taglines crowding it; those live in the footer (a slim utility bar above the header is acceptable for contact details if required).

---

## 9. Heroes and Banners

The hero is the thesis of the page: lead with the most characteristic, specific statement of the offer, not a generic slogan.

| Context               | Height                                                                                                               | Content                                                                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home hero             | 70 to 90vh desktop (`min-h-[70vh]` to `min-h-[85vh]`), natural height mobile; never force 100vh with content cut off | Eyebrow (optional), H1, 1 to 2 sentence supporting line, primary + secondary CTA, hero visual, optional trust strip (client logos) directly beneath |
| Subpage banner        | 240 to 400px (`py-16 sm:py-24` band), roughly 30 to 40% of home hero height                                          | H1, one supporting sentence, breadcrumb; CTA optional. Same visual language as home but clearly subordinate                                         |
| Blog index banner     | Compact band, 200 to 300px                                                                                           | H1 ("Insights" or similar), one line description                                                                                                    |
| Blog post header      | No banner band needed: title block (H1, author, date, reading time) then full width cover image 16:9 below           | Keep article start above the fold                                                                                                                   |
| CTA band (pre footer) | `py-16 sm:py-24`                                                                                                     | Dark or brand background, H2, one line, one button                                                                                                  |

Image, overlay, and contrast rules:

- Text over imagery requires a guaranteed contrast device. Options in order of preference: (1) text on a plain panel beside the image (split hero), (2) dark scrim overlay `bg-gray-900/50` to `/70` over the full image, (3) directional gradient scrim (`bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent`) with text confined to the dark side. Test contrast against the lightest area the text can touch.
- Never place text over a busy image with no overlay, and never rely on a text shadow alone.
- Hero image dimensions: full width banners sourced at 2880px wide (2x of 1440 design width); 5:2 ratio (2880x1152) suits shallow banners, 16:9 for taller heroes. Subpage banners can share one consistent ratio (e.g. 4:1 at 2880x720). Export WebP, target under 200KB.
- Keep the focal point of banner images off centre safe areas so cropping at breakpoints never beheads subjects; verify at 360px, 768px, 1440px.
- One hero visual treatment sitewide (photography style, illustration style, or product UI screenshots), not a mix.

---

## 10. Carousels and Marquees

Default position: do not use a carousel. Banner carousels have well documented near zero engagement beyond slide one and they hide content. Prefer a static hero plus distinct sections.

If a carousel is genuinely required (e.g. testimonials, gallery):

- No auto rotation, or rotation that pauses permanently on hover, focus, or first interaction, with a visible pause control.
- Visible previous/next controls (44px targets) and slide position indicators; swipe support on touch.
- All slides server rendered; no H1 inside slides; keyboard accessible; `aria-roledescription="carousel"` with labelled slides.
- Maximum 5 slides; first slide carries the weight.

Marquees (continuous scrolling logo or text strips):

- Acceptable only for low information decorative strips (client logos). Never for copy a visitor must read.
- Must pause on hover and honour `prefers-reduced-motion` by rendering as a static wrapped row.
- Slow speed (full loop 30s+), one per page maximum, duplicate content seamlessly rather than jump cutting.
- A static logo grid is usually the better choice.

---

## 11. Footer

- Structure (Tailwind Plus footer blocks): top area with logo plus short one line description, 3 to 4 link columns (Company, Services, Resources/Blog, Legal or Contact), optional newsletter signup; bottom bar with copyright, legal links, social icons.
- Dark neutral or light neutral background, clearly separated from page content. Link text at AA contrast (`text-gray-300` on dark, hover white).
- Include real contact details (address, phone, email) for local trust and SEO.
- Social icons: monochrome, 20 to 24px, consistent set, footer only (not the header).
- Newsletter form: single email field plus button, one line of expectation copy ("Monthly insights, no spam"), inline success state.
- The footer is a sitemap of substance: every key page linked, nothing linked that does not exist. Never let the footer become a link farm of 50 items.

---

## 12. Page Templates and Section Order

Use Tailwind Plus blocks in this order. Sections alternate background treatments and each flows logically into the next.

**Home page** (the persuasion sequence):

1. Header
2. Hero: offer, audience, primary CTA
3. Trust strip: client/partner logo cloud (static)
4. Value propositions: 3 to 4 feature cards or icon grid answering "what do I get"
5. Featured service/product sections: 1 to 3 alternating image and text splits, each with a tertiary link deeper
6. Proof: testimonials (1 strong quote beats 6 weak ones), stats, or case study highlight
7. Secondary content: process steps, FAQ teaser, or latest blog posts (3 cards)
8. CTA band
9. Footer

**Subpages (services, about, etc.)**:

1. Header
2. Compact banner: H1, one line, breadcrumb
3. Introduction: short framing section, 2 to 3 sentences plus supporting image
4. Core content: feature grids, split sections, detail blocks specific to the page
5. Proof relevant to this page
6. FAQ (accordion) where questions genuinely exist
7. CTA band
8. Footer

**Blog index**: compact banner > optional featured post (large card) > post grid (cover 16:9, tag, title H3, excerpt 1 to 2 lines, author and date) > pagination > newsletter band > footer.

**Blog post**: title block (tag, H1, author, date, reading time) > cover image > article body (`max-w-prose`, styled H2/H3, pull quotes, images with captions) > author bio card > related posts (3) > newsletter or soft CTA band > footer.

Rules:

- Breadcrumbs on all subpages and posts, directly above or within the banner.
- Home is the only page with the full height hero; subordinate pages are visibly subordinate.
- Every page ends with a CTA band before the footer; the blog's is soft (newsletter) rather than hard sell.
- Do not stack two heavy visual sections (e.g. two dark bands or two image splits the same way) back to back; alternate density and direction.

---

## 13. Images

- One photographic/illustrative style sitewide: consistent colour grading, subject style, and crop ratios. Mixing stock styles is a leading "cheap site" signal; prefer fewer, better images.
- Standard ratios: hero per Section 9; cards and blog covers 16:9; team portraits 1:1 or 4:5; gallery 4:3. Crop all instances of a type to the same ratio.
- Every meaningful image has descriptive alt text; decorative images use `alt=""`.
- Rounded corners on imagery follow the global radius token (e.g. `rounded-xl` cards, `rounded-2xl` feature images), identical everywhere.
- Avoid cliched stock (handshakes, headset women, lightbulbs). Real photos, product UI, or a coherent illustration system always outperform.
- Lazy load below the fold (default with the framework image component); blur placeholders for large images; no layout shift, ever.

---

## 14. Icons

- One icon set sitewide, one style (outline or solid, not both interchangeably). Heroicons pairs naturally with Tailwind Plus; outline for feature lists, solid for small UI affordances is an acceptable deliberate split.
- Sizes from the scale: 16/20/24px UI icons, 24px feature list icons, 40 to 48px only within feature cards (often on a tinted `bg-primary/10 rounded-lg` square).
- Icons always accompany a label except universal symbols (close, menu, search, chevron). Icon only buttons require `aria-label`.
- Icons inherit `currentColor`; brand colour for emphasis, neutral for utility. Never multicoloured icon sets.
- Icons support meaning; a grid of abstract icons with vague labels ("Innovation", "Quality") is filler and must be replaced with specific benefits.

---

## 15. Depth: Shadows, Borders, Radii

- Define one elevation scale and apply consistently: flat (borders only) > `shadow-sm` (cards) > `shadow-md/lg` (hover lift, dropdowns) > `shadow-xl` (modals). Never decorative mega shadows on static content.
- Shadows are subtle, neutral, and consistent in direction. If the design direction is flat/bordered, use borders everywhere and shadows only for overlays; do not mix philosophies per section.
- Borders: `border-gray-200` on light, `border-white/10` on dark; 1px standard. Use either a border or a shadow on cards as the default, not both heavily.
- Radius tokens: pick one family and never deviate: e.g. buttons and inputs `rounded-md` or `rounded-lg`, cards `rounded-xl`, imagery `rounded-xl/2xl`, pills `rounded-full`. Mixed radii across similar components reads as sloppy immediately.
- Dividers: prefer spacing and background changes over horizontal rules; use `border-t` dividers sparingly within dense content.

---

## 16. Motion and Scrolling

- Motion is seasoning: micro interactions on hover (150 to 200ms ease transitions on colour, shadow, transform) sitewide, plus at most one orchestrated moment (e.g. a subtle staggered fade up on hero load or first scroll into view).
- Scroll reveals: subtle (8 to 16px translate plus fade, 300 to 500ms, once only, threshold early so content never appears blank). Apply to section level elements, not every paragraph.
- Never hijack scrolling: no scroll jacking, horizontal scroll sections on desktop, or parallax that detaches content from input. Sticky elements limited to header and genuinely useful in page navigation (blog table of contents).
- Respect `prefers-reduced-motion`: all non essential animation disabled, reveals render instantly, marquees become static.
- Smooth scroll for in page anchors only, with scroll margin offsetting the sticky header.
- Back to top button only on long pages (blog posts), appearing after 2 screens, bottom right, 44px target.
- No autoplaying video with sound; background video muted, short loop, compressed, with a static poster on mobile and reduced motion.

---

## 17. Copy Length Guide

| Element              | Length                                                     | Notes                                                                                                      |
| -------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| H1 / hero headline   | 4 to 9 words                                               | Specific value, not slogan: "Joinery grade timber, delivered to site" beats "Building excellence together" |
| Hero supporting line | 1 to 2 sentences, 15 to 25 words                           | Who it is for and the key proof or differentiator                                                          |
| Section heading (H2) | 2 to 7 words                                               | Benefit phrased, scannable                                                                                 |
| Section intro        | 1 to 2 sentences                                           | Optional; only if it adds information                                                                      |
| Feature card         | Title 2 to 5 words; body 1 to 2 sentences (15 to 30 words) | Parallel grammatical structure across cards                                                                |
| Testimonial          | 20 to 50 words                                             | Edited for the strongest line; name, role, company, photo                                                  |
| CTA button           | 2 to 4 words                                               | Verb led                                                                                                   |
| CTA band copy        | Heading max 8 words plus one line                          |                                                                                                            |
| Meta description     | 150 to 160 characters                                      | Per SEO guide                                                                                              |
| Blog post            | 800 to 2,000 words                                         | As long as genuinely useful, no padding; H2 every 250 to 350 words                                         |
| Paragraphs           | 2 to 4 sentences                                           | One idea each; vary length for rhythm                                                                      |

Writing rules: plain verbs, active voice, sentence case, second person ("you"), specifics over adjectives ("dispatched within 24 hours" not "fast, reliable service"). Copy is design material; vague filler copy makes a polished layout look templated. Name things by what visitors recognise, never internal system terms.

---

## 18. Accessibility

- Semantic structure: landmarks, one H1, ordered headings, lists for lists, `<button>`/`<a>` for interactions.
- Contrast per Section 5; verify every text/background pair including text over images and disabled states.
- Keyboard: everything operable, logical tab order, visible `focus-visible` rings (2px, offset, primary colour), skip link, focus trapped in modals/mobile menu and returned on close.
- Touch targets 44x44px minimum with 8px spacing between targets.
- Forms per the development guide: visible labels (placeholders are not labels), grouped errors announced via `role="alert"`, no colour only error indication.
- Motion and autoplay rules per Section 16; pauseable anything that moves.
- `lang` attribute set; icon only controls labelled; decorative SVGs `aria-hidden`.
- Test: keyboard only pass, axe scan, 200% zoom usability, and a 360px viewport pass on every template.

---

## 19. Using Tailwind Plus Correctly

- Choose one visual family of blocks and stay in it. Tailwind Plus offers multiple aesthetics per category; mixing a bordered minimal hero with a glossy gradient feature section produces an incoherent site.
- Recolour every block to the project tokens immediately; default indigo anywhere is a defect. Replace default Inter with the chosen pairing, apply the global radius and shadow tokens, swap placeholder copy and imagery before judging a section.
- Blocks are starting points: adjust spacing, swap imagery treatments, merge or trim columns to fit real content. Content drives the block choice, never the reverse (do not pad weak content to fill an impressive block).
- Keep component variants centralised (a `Button`, `Container`, `SectionHeading` component) so Tailwind Plus markup is wrapped once and reused, not pasted with drifting classes.
- Headless interactive blocks (menus, dialogs, tabs) ship with accessibility; do not strip their ARIA or replace their behaviour with hand rolled toggles.
- The distinctiveness comes from tokens (type, colour, radius, signature element) applied uniformly over well structured blocks, plus one signature treatment the templates do not ship with.

---

## 20. Known UX/UI Pitfalls (Reject in Review)

| Pitfall                                           | Why it fails                                    | Do instead                                  |
| ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| Auto rotating hero carousel                       | Banner blindness; slide 2+ engagement near zero | Static hero, sectioned content              |
| Low contrast grey text                            | Unreadable, fails AA                            | Minimum `text-gray-600` on white at 16px+   |
| Text over busy images without scrim               | Illegible at some viewport                      | Overlay or split layout per Section 9       |
| Multiple competing primary CTAs                   | Choice paralysis, diluted action colour         | One primary per view                        |
| "Click here" / "Submit" / "Learn more" everywhere | No information scent                            | Specific verb labels                        |
| Hamburger menu on desktop                         | Hides navigation, cuts discovery                | Visible nav at `lg+`                        |
| Mystery meat navigation (icons without labels)    | Users will not guess                            | Label everything                            |
| Placeholder text as field label                   | Disappears on input; accessibility failure      | Visible labels                              |
| Entry popups/interstitials                        | Hostile first impression; SEO demotion          | Inline or exit intent only, if at all       |
| Scroll jacking and heavy parallax                 | Motion sickness, broken expectations            | Native scroll, subtle reveals               |
| Fake urgency, countdowns, dark patterns           | Destroys trust, legal risk                      | Honest persuasion via proof                 |
| Wall of text sections                             | Nobody reads it                                 | Chunk per Section 17, add structure         |
| Justified or centred long body text               | Ragged rivers, poor readability                 | Left aligned, centred only for short heroes |
| Inconsistent radii/shadows/buttons across pages   | Reads as unfinished                             | Token system, shared components             |
| Icon grids with vague labels ("Quality")          | Filler content                                  | Specific benefits or cut the section        |
| Carousel of 10 testimonials                       | Hidden proof                                    | 1 to 3 strong static testimonials           |
| Stretched or squashed images, mixed ratios        | Instant credibility loss                        | Fixed ratios, object cover                  |
| 100vh hero clipping content on mobile             | CTA below fold, browser chrome issues           | min height with natural overflow            |
| Disabled zoom or tiny mobile fonts                | Accessibility failure                           | 16px+ body, zoom enabled                    |
| Every section animated                            | Distracting, feels AI generated                 | One signature moment, quiet elsewhere       |

---

## 21. Final Quality Checklist

1. State the design tokens before building: palette (4 to 6 named values), type pairing and scale, radius and shadow tokens, the signature element. Review them once against the brief: if any choice is the generic default for any site of this type, revise it.
2. Build templates in order: header and footer, home, one subpage, blog index, blog post; reuse shared components throughout.
3. Verify every page against: one H1, one primary CTA, section order per Section 12, copy lengths per Section 17.
4. Check consistency: buttons, headings, spacing rhythm, radii, shadows, icons, image ratios identical across all pages.
5. Contrast audit of every text/background combination including over imagery and on dark bands.
6. Responsive pass at 360, 768, 1024, 1440: no clipped heroes, no cramped grids, mobile menu flawless, touch targets adequate.
7. Keyboard and axe pass on every template; reduced motion verified.
8. Read all copy aloud: cut filler, sharpen specifics, confirm consistent vocabulary for repeated actions.
9. Final review against the pitfalls table in Section 20; fix every match.
10. The standout test: name the one thing a visitor would remember about this site. If the answer is "nothing", the signature element is missing; add it without disturbing the discipline around it.
