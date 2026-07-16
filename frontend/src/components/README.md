# Components

Reusable UI components for the Metro CMS frontend.

## Structure

```
components/
├── common/               # App-wide utility components
│   ├── LoadingSpinner.jsx   — Spinning loader (fullscreen or inline)
│   └── ErrorBoundary.jsx    — React error boundary with fallback UI
└── ui/                   # Design system primitives (Milestone 2+)
    ├── Button.jsx
    ├── Badge.jsx
    ├── Card.jsx
    ├── Modal.jsx
    ├── Table.jsx
    └── Tooltip.jsx
```

## Usage Guidelines

- **`common/`** components are global utilities — use anywhere
- **`ui/`** components build the design system — always prefer these over ad-hoc Tailwind utilities
- Keep components **focused and single-responsibility**
- Document props with JSDoc comments
- All interactive elements must have unique `id` attributes for testability

## Example

```jsx
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBoundary from '@/components/common/ErrorBoundary'

<ErrorBoundary>
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    <MyPage />
  </Suspense>
</ErrorBoundary>
```
