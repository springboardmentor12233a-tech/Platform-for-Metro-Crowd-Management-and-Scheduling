import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * MainLayout — The authenticated shell shared by all protected pages.
 *
 * Structure:
 *   ┌─────────────┬──────────────────────────────────┐
 *   │  Sidebar    │  Navbar                          │
 *   │  (fixed)    │─────────────────────────────────-│
 *   │             │  <Outlet /> (page content)       │
 *   │             │─────────────────────────────────-│
 *   │             │  Footer                          │
 *   └─────────────┴──────────────────────────────────┘
 *
 * The sidebar can be collapsed to icon-only mode (72px wide).
 */
export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* ── Main column ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarCollapsed((c) => !c)} />

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}
