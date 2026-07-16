import { Component } from 'react'

/**
 * ErrorBoundary — Class component that catches unhandled render errors.
 * Renders a styled error UI instead of a blank screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 * Props:
 *  - children    {ReactNode}
 *  - fallback    {ReactNode} — optional custom fallback UI
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error)
    console.error('Component stack:', info.componentStack)
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Allow consumer to override the fallback UI
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
          <div className="glass-card p-10 max-w-md w-full text-center animate-fade-in">
            {/* Error icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">
              Something went wrong
            </h2>

            <p className="text-slate-400 text-sm mb-2 leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred in the application.'}
            </p>

            <p className="text-slate-600 text-xs mb-8">
              Please reload the page. If this issue persists, contact the system administrator.
            </p>

            <div className="flex flex-col gap-3">
              <button
                className="btn-primary"
                onClick={this.handleReset}
              >
                Reload Application
              </button>
              <button
                className="btn-secondary text-sm"
                onClick={() => (window.location.href = '/')}
              >
                Go to Dashboard
              </button>
            </div>

            {/* Debug info in development */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-400">
                  Debug Info (dev only)
                </summary>
                <pre className="mt-2 text-red-400 text-xs overflow-auto bg-slate-900 rounded-lg p-3 max-h-40">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
