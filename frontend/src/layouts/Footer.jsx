/**
 * Footer — Slim status bar at the bottom of the app shell.
 * Shows copyright and live system operational indicator.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="h-10 bg-slate-900/50 border-t border-slate-700/30 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: copyright */}
      <span className="text-slate-600 text-xs">
        © {year} Metro Crowd Management System — v1.0.0
      </span>

      {/* Right: operational status */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-600 text-xs">API Connected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-slate-600 text-xs">System Operational</span>
        </div>
      </div>
    </footer>
  )
}
