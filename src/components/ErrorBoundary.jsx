import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { STORAGE_KEYS } from '../constants'

/**
 * Error Boundary component to catch and handle React rendering errors
 * Prevents the entire app from crashing due to component errors
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  handleReset = () => {
    // Optionally clear localStorage if form data might be corrupted
    if (this.props.clearOnReset) {
      localStorage.removeItem(STORAGE_KEYS.FORM_DATA)
    }

    // If reloadOnReset is explicitly requested, reload the page
    if (this.props.reloadOnReset) {
      window.location.reload()
      return
    }

    // Reset error state to attempt graceful recovery
    this.setState({ hasError: false, error: null, errorInfo: null })

    // Call optional onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-red-500" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {this.props.fallbackMessage ||
                'An unexpected error occurred. Your data has been saved and you can try again.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-300">
                  Error details (development only)
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </button>
              {this.props.showHomeButton && (
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Go Home
                </a>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
