# UI Components

Design system primitives for the Metro CMS frontend.

## Purpose

This directory contains reusable, composable UI components that implement the Metro CMS design system.
All components should use the CSS utilities defined in `src/styles/index.css` rather than ad-hoc Tailwind classes.

## Planned Components (Milestone 2+)

| Component | Description |
|-----------|-------------|
| `Button.jsx` | Primary, secondary, danger, and ghost button variants |
| `Badge.jsx` | Severity and status badge with color variants |
| `Card.jsx` | Glassmorphism card with header/body/footer slots |
| `Modal.jsx` | Accessible dialog/modal with backdrop |
| `Table.jsx` | Sortable data table with pagination |
| `Tooltip.jsx` | Hover tooltip with positioning |
| `Select.jsx` | Styled dropdown select |
| `Input.jsx` | Text input with validation states |
| `Spinner.jsx` | Loading spinner variants |
| `Alert.jsx` | Inline alert with severity variants |

## Design Tokens

Colours are defined in `tailwind.config.js`:

```js
navy:  { 900: '#0f172a', 800: '#1e293b' }
metro: { cyan: '#06b6d4', blue: '#0ea5e9', red: '#ef4444', green: '#22c55e' }
```

## Status

Planned for Milestone 2. Common utilities (`LoadingSpinner`, `ErrorBoundary`) are already in `common/`.
