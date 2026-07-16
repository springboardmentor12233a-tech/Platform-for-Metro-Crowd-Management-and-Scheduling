/**
 * 404 Not Found Page
 * Custom metro-themed page for unmatched routes.
 */
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.06),_transparent_70%)] pointer-events-none" />

      <div className="text-center max-w-lg relative z-10">
        {/* Big 404 */}
        <div className="text-[8rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 mb-2 select-none">
          404
        </div>

        <div className="text-6xl mb-6">🚇</div>

        <h1 className="text-2xl font-bold text-white mb-3">Station Not Found</h1>
        <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm mx-auto">
          This route doesn't exist on the Metro network.
          Please check your destination and try again — or head back to the Dashboard.
        </p>

        {/* Metro line decoration */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500'].map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`w-8 h-2 ${c} rounded-full`} />
              {i < 3 && <div className="w-2 h-0.5 bg-slate-700" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link id="back-home" to="/" className="btn-primary flex items-center gap-2">
            <Home size={16} /> Back to Dashboard
          </Link>
          <button
            id="go-back"
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
