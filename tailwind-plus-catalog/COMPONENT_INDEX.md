# Tailwind UI Component Index

Total Components: **657 React components**

## Directory Structure

```
components/
├── marketing/           # Marketing website components
├── application-ui/      # App interface components
├── ecommerce/          # E-commerce components
├── templates/          # Custom templates
└── ui/                 # Custom UI components
```

## Marketing Components (71 components)

### Sections
- **heroes/** - Hero sections for landing pages
- **feature-sections/** - Feature showcases
- **cta-sections/** - Call-to-action sections
- **bento-grids/** - Modern grid layouts
- **pricing/** - Pricing tables and cards
- **header/** - Page headers
- **newsletter-sections/** - Newsletter signup forms
- **stats-sections/** - Statistics displays
- **testimonials/** - Customer testimonials
- **blog-sections/** - Blog layouts
- **contact-sections/** - Contact forms
- **team-sections/** - Team member displays
- **content-sections/** - General content layouts
- **logo-clouds/** - Partner/client logos
- **faq-sections/** - FAQ accordions
- **footers/** - Page footers

### Elements
- **headers/** - Navigation headers
- **flyout-menus/** - Dropdown menus
- **banners/** - Announcement banners

### Feedback
- **404-pages/** - Error pages

### Page Examples
- **landing-pages/** - Complete landing page templates
- **pricing-pages/** - Full pricing page templates
- **about-pages/** - About page templates

## Application UI Components (469 components)

### Application Shells
- **stacked/** - Stacked layout shells (9 variants)
- **sidebar/** - Sidebar layout shells (8 variants)
- **multi-column/** - Multi-column layouts (6 variants)

### Headings
- **page-headings/** - Page-level headings
- **card-headings/** - Card headers
- **section-headings/** - Section titles

### Data Display
- **description-lists/** - Key-value data displays
- **stats/** - Statistics and metrics
- **calendars/** - Calendar components (8 variants)

### Lists
- **stacked-lists/** - Vertical lists
- **tables/** - Data tables
- **grid-lists/** - Grid-based lists
- **feeds/** - Activity feeds

### Forms
- **form-layouts/** - Complete form layouts
- **input-groups/** - Text input fields
- **select-menus/** - Dropdown selectors
- **sign-in-forms/** - Authentication forms
- **textareas/** - Multi-line text inputs
- **radio-groups/** - Radio button groups
- **checkboxes/** - Checkbox inputs
- **toggles/** - Toggle switches
- **action-panels/** - Form action areas
- **comboboxes/** - Searchable select menus

### Feedback
- **alerts/** - Alert messages
- **empty-states/** - Empty state placeholders

### Navigation
- **navbars/** - Top navigation bars
- **pagination/** - Page navigation
- **tabs/** - Tabbed interfaces
- **vertical-navigation/** - Vertical nav menus
- **sidebar-navigation/** - Sidebar menus
- **breadcrumbs/** - Breadcrumb trails
- **progress-bars/** - Progress indicators
- **command-palettes/** - Command search interfaces

### Overlays
- **modal-dialogs/** - Modal windows
- **drawers/** - Slide-out panels
- **notifications/** - Toast notifications

### Elements
- **avatars/** - User avatars (15 variants)
- **badges/** - Status badges
- **dropdowns/** - Dropdown menus
- **buttons/** - Button styles (10 variants)
- **button-groups/** - Button groups

### Layout
- **containers/** - Container components
- **cards/** - Card components
- **list-containers/** - List wrappers
- **media-objects/** - Media+text layouts
- **dividers/** - Section dividers

### Page Examples
- **home-screens/** - Dashboard home pages
- **detail-screens/** - Detail view pages
- **settings-screens/** - Settings pages

## E-commerce Components (117 components)

### Components
- **product-overviews/** - Product detail views
- **product-lists/** - Product grid/list views
- **category-previews/** - Category showcases
- **shopping-carts/** - Shopping cart interfaces
- **category-filters/** - Product filters
- **product-quickviews/** - Quick view modals
- **product-features/** - Feature highlights
- **store-navigation/** - Store navigation menus
- **promo-sections/** - Promotional banners
- **checkout-forms/** - Checkout interfaces
- **reviews/** - Product reviews
- **order-summaries/** - Order summary displays
- **order-history/** - Order history lists
- **incentives/** - Promotional incentives

### Page Examples
- **storefront-pages/** - Store homepage templates
- **product-pages/** - Product detail page templates
- **category-pages/** - Category page templates
- **shopping-cart-pages/** - Cart page templates
- **checkout-pages/** - Checkout page templates
- **order-detail-pages/** - Order confirmation pages
- **order-history-pages/** - Order history pages

## Usage

All components are exported as default exports with auto-generated names based on their path:

```jsx
// Example component path:
// components/application-ui/elements/buttons/primary_buttons.jsx

// Usage in your app:
import PrimaryButtons from '@/components/application-ui/elements/buttons/primary_buttons';

export default function Page() {
  return <PrimaryButtons />;
}
```

## Component Naming Convention

Components are automatically named using this pattern:
- Path: `application-ui/elements/buttons/primary_buttons.jsx`
- Component Name: `ElementsButtonsPrimaryButtons`

## Notes

1. **Client Components**: Most components with interactivity will need `"use client"` directive
2. **Dependencies**: All components use `@headlessui/react` and `@heroicons/react`
3. **Styling**: Components use Tailwind CSS v4 utility classes
4. **Customization**: Feel free to modify components to match your design system

## Finding Components

To find a specific component type, use grep:

```bash
# Find all button components
find components -name "*button*" -type f

# Find all form components
find components/application-ui/forms -name "*.jsx"

# Search by category
ls components/marketing/sections/
```
