# Components Directory

This directory contains UI components and templates from Tailwind UI and custom components.

## Directory Structure

```
components/
├── ui/              # Reusable UI components (buttons, forms, cards, etc.)
├── templates/       # Full page templates and layouts
└── README.md        # This file
```

## Adding Tailwind UI Components

### Step 1: Copy Component from Tailwind UI

1. Log in to https://tailwindcss.com/plus/ui-blocks
2. Find the component you want to use
3. Click "View Code" and copy the React code

### Step 2: Determine Component Type

- **UI Components**: Small, reusable pieces (buttons, dropdowns, modals, cards)
  - Place in `components/ui/`
  - Example: `components/ui/dropdown-menu.tsx`

- **Templates**: Full page layouts or large composed sections
  - Place in `components/templates/`
  - Example: `components/templates/dashboard-layout.tsx`

### Step 3: Create Component File

Create a new file in the appropriate directory with a descriptive name using kebab-case:

```typescript
// components/ui/example-component.tsx
import { classNames } from "@/lib/utils";

export default function ExampleComponent() {
  // Component code from Tailwind UI
  return (
    // JSX here
  );
}
```

### Step 4: Update Imports

Make sure to use the project's import alias:

```typescript
import { classNames } from "@/lib/utils";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
```

## Naming Conventions

- **Files**: Use kebab-case (e.g., `dropdown-menu.tsx`, `user-profile-card.tsx`)
- **Components**: Use PascalCase (e.g., `DropdownMenu`, `UserProfileCard`)
- **Export**: Use default exports for main components

## Available Utilities

### classNames()

The standard Tailwind UI utility for conditional classes:

```typescript
import { classNames } from "@/lib/utils";

className={classNames(
  item.current ? "bg-gray-900 text-white" : "text-gray-300",
  "rounded-md px-3 py-2"
)}
```

### cn()

An enhanced utility using `clsx` and `tailwind-merge` for better class merging:

```typescript
import { cn } from "@/lib/utils";

className={cn(
  "base-classes",
  condition && "conditional-classes",
  props.className
)}
```

## Installed Dependencies

The following packages are installed for Tailwind UI compatibility:

- `@headlessui/react` - Unstyled, accessible UI components
- `@heroicons/react` - Icon library
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Utility for merging Tailwind classes

## Tips

1. **Remove example data**: Tailwind UI components include placeholder data. Extract this to props or separate data files.

2. **Add TypeScript types**: Define proper prop types for your components:
   ```typescript
   interface ComponentProps {
     title: string;
     items: Array<{ name: string; href: string }>;
   }

   export default function Component({ title, items }: ComponentProps) {
     // ...
   }
   ```

3. **Make components flexible**: Convert hard-coded values to props for reusability.

4. **Extract repeated patterns**: If you see the same pattern multiple times, consider creating a shared component.

5. **Use Server Components by default**: Since this is a Next.js App Router project, components are Server Components unless you add `"use client"` directive.
