import React, { useState, useEffect } from 'react'
import { Moon, Sun, FileText } from 'lucide-react'
import WillGenerator from './components/WillGenerator'
import ErrorBoundary from './components/ErrorBoundary'
import KofiWidget from './components/KofiWidget'
import PrivacyPolicy from './components/PrivacyPolicy'
import Disclaimer from './components/Disclaimer'
import { STORAGE_KEYS } from './constants'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE)
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash
    if (hash === '#/privacy') return 'privacy'
    if (hash === '#/disclaimer') return 'disclaimer'
    return 'home'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#/privacy') setCurrentPage('privacy')
      else if (hash === '#/disclaimer') setCurrentPage('disclaimer')
      else setCurrentPage('home')
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const navigateHome = () => {
    window.location.hash = ''
    setCurrentPage('home')
  }

  return (
    <div
      className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          focus:absolute focus:top-4 focus:left-4 focus:z-50
          focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white
          focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400
        "
      >
        Skip to main content
      </a>

      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Willful Estate
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Free Will Generator</p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={darkMode}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <main id="main-content" className="max-w-4xl mx-auto px-4 py-8" tabIndex={-1}>
        {currentPage === 'privacy' && <PrivacyPolicy onBack={navigateHome} />}
        {currentPage === 'disclaimer' && <Disclaimer onBack={navigateHome} />}
        {currentPage === 'home' && (
          <ErrorBoundary
            fallbackMessage="An error occurred while generating your will. Your progress has been saved. Please try again."
            clearOnReset={false}
            showHomeButton={true}
          >
            <WillGenerator />
          </ErrorBoundary>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center text-sm text-gray-600 dark:text-gray-300">
        <p>This tool provides a template for informational purposes only, not legal advice.</p>
        <p className="mt-3 space-x-4">
          <a href="#/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline">
            Disclaimer
          </a>
          <span aria-hidden="true">|</span>
          <a href="#/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </a>
          <span aria-hidden="true">|</span>
          <a
            href="https://ko-fi.com/reeseallison"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Support this project
          </a>
        </p>
      </footer>

      <KofiWidget />
    </div>
  )
}

export default App
