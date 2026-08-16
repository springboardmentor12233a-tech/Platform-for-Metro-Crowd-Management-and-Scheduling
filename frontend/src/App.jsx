import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

/**
 * Root App component.
 * Composes: BrowserRouter → AuthProvider → AppRoutes
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* =========================================================
            GLOBAL THEME WRAPPER
            This ensures the background and text colors change 
            across every single page in your app.
        ========================================================== */}
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-200">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App