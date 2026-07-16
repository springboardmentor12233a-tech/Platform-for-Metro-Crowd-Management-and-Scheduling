/**
 * LoadingSpinner — Animated spinner for async operations.
 *
 * Props:
 *  - fullScreen {boolean} — if true, renders a full-viewport overlay (default: false)
 *  - size       {'sm'|'md'|'lg'} — spinner diameter (default: 'md')
 *  - label      {string}  — optional accessible label text shown below spinner
 */
export default function LoadingSpinner({
  fullScreen = false,
  size = 'md',
  label = 'Loading Metro CMS...',
}) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={`${sizeClasses[size]} border-slate-700 border-t-cyan-500 rounded-full animate-spin`}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-50 gap-4">
        {/* Subtle gradient glow behind spinner */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08),_transparent_60%)]" />
        <div className="relative">
          {spinner}
        </div>
        <p className="text-slate-400 text-sm animate-pulse font-medium">{label}</p>
        <p className="text-slate-600 text-xs">Metro Crowd Management System</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      {spinner}
      {size !== 'sm' && (
        <p className="text-slate-500 text-xs">{label}</p>
      )}
    </div>
  )
}
