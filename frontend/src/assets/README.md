# Assets

Static assets for the Metro CMS frontend application.

## Contents

| Directory/File | Description |
|----------------|-------------|
| `images/` | Raster images (PNG, JPEG) |
| `icons/` | Custom SVG icon files |
| `logos/` | Metro CMS brand logos |
| `fonts/` | Local font files (if not using Google Fonts CDN) |

## Usage

Import assets directly in JSX:

```jsx
import logoUrl from '@/assets/logos/metro-logo.svg'

<img src={logoUrl} alt="Metro CMS Logo" />
```

## Notes

- Prefer SVG for logos and icons (scalable, small size)
- Compress all raster images before committing
- Use the `@/assets/` alias for clean imports
- Google Fonts (Inter) is loaded via CDN in `index.html`
