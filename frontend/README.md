# Frontend — Metro CMS

React + Vite + Tailwind CSS frontend for the Metro Crowd Management and Scheduling platform.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 5.2.12 | Build tool and dev server |
| Tailwind CSS | 3.4.4 | Utility-first CSS framework |
| React Router DOM | 6.23.1 | Client-side routing |
| Axios | 1.7.2 | HTTP client with interceptors |
| Lucide React | 0.383.0 | Icon library |

## Project Structure

```
src/
├── assets/           # Static assets (images, icons, logos)
├── components/
│   ├── common/       # LoadingSpinner, ErrorBoundary
│   └── ui/           # Design system primitives (Milestone 2+)
├── layouts/
│   ├── MainLayout.jsx   # App shell with sidebar + navbar
│   ├── Sidebar.jsx      # Collapsible navigation sidebar
│   ├── Navbar.jsx       # Top header bar
│   └── Footer.jsx       # Bottom status bar
├── pages/
│   ├── Dashboard.jsx       # KPIs, crowd overview, alerts
│   ├── Login.jsx           # JWT-backed login page
│   ├── CrowdMonitoring.jsx # Station density cards with filters
│   ├── TrainStatus.jsx     # Live train positions and status
│   ├── Schedules.jsx       # Train schedule table
│   ├── Analytics.jsx       # Traffic charts and KPIs
│   ├── Alerts.jsx          # Alert management
│   ├── Settings.jsx        # User preferences
│   └── NotFound.jsx        # 404 page
├── routes/
│   └── AppRoutes.jsx    # Route definitions + protected route
├── services/
│   ├── api.js           # Axios instance with interceptors
│   ├── authService.js   # Auth API calls
│   ├── crowdService.js  # Crowd monitoring API calls
│   └── trainService.js  # Train, schedule, alert API calls
├── hooks/
│   ├── useAuth.js          # Auth hook
│   └── useLocalStorage.js  # Synced localStorage hook
├── context/
│   └── AuthContext.jsx  # JWT auth state and actions
├── utils/
│   └── helpers.js       # Formatting and utility functions
├── constants/
│   └── routes.js        # Route path constants
└── styles/
    └── index.css        # Global styles + Tailwind directives
```

## Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

## Running

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | http://localhost:8000/api/v1 | Backend API base URL |
| `VITE_APP_NAME` | Metro CMS | Application name |
| `VITE_APP_VERSION` | 1.0.0 | App version |

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | JWT authentication with demo credentials |
| Dashboard | `/` | Real-time KPIs and overview |
| Crowd Monitoring | `/crowd-monitoring` | Per-station density with filters |
| Train Status | `/train-status` | Live train positions and delays |
| Schedules | `/schedules` | Train schedule table |
| Analytics | `/analytics` | Charts, KPIs, heatmap |
| Alerts | `/alerts` | Alert management with resolve |
| Settings | `/settings` | Profile and preferences |
| 404 | `*` | Custom not-found page |

## Design System

- **Theme**: Dark metro (slate-900 background, cyan/blue accents)
- **Typography**: Inter (Google Fonts)
- **Components**: Glassmorphism cards, gradient buttons, animated transitions
- **CSS utilities**: `glass-card`, `stat-card`, `btn-primary`, `badge-*`, `nav-link`

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@metro.com` | `admin123` |
| Operator | `operator@metro.com` | `operator123` |

> **Note**: The backend must be running at `http://localhost:8000` for login to work.
> All pages display static data if the backend is unavailable.
