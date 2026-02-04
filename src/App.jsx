import React, { useState, useEffect } from 'react'
import { Moon, Sun, FileText } from 'lucide-react'
import WillGenerator from './components/WillGenerator'
import ErrorBoundary from './components/ErrorBoundary'
import KofiWidget from './components/KofiWidget'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('willGenerator_darkMode')
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('willGenerator_darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Willful Estate
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Free Will Generator
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <ErrorBoundary
          fallbackMessage="An error occurred while generating your will. Your progress has been saved. Please try again."
          clearOnReset={false}
          showHomeButton={true}
        >
          <WillGenerator />
        </ErrorBoundary>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>This tool generates a template for informational purposes only.</p>
        <p className="mt-1">Consult a licensed attorney in your state for legal advice.</p>
        <p className="mt-3">
          <a
            href="https://ko-fi.com/reeseallison"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 dark:text-blue-400 hover:underline"
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
