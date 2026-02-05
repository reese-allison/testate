import React, { useState, useId, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { HelpCircle } from 'lucide-react'

export function Tooltip({ content, className = '' }) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipId = useId()

  const showTooltip = useCallback(() => setIsVisible(true), [])
  const hideTooltip = useCallback(() => setIsVisible(false), [])
  const toggleTooltip = useCallback(() => setIsVisible(prev => !prev), [])

  // Handle Escape key to close tooltip
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsVisible(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={toggleTooltip}
        className="text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
        aria-label="More information"
        aria-describedby={isVisible ? tooltipId : undefined}
        aria-expanded={isVisible}
      >
        <HelpCircle className="w-4 h-4" aria-hidden="true" />
      </button>
      {isVisible && (
        <div
          id={tooltipId}
          className="
            absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-2 max-w-xs
            bg-gray-900 dark:bg-gray-700
            text-white text-sm
            rounded-lg shadow-lg
            whitespace-normal
          "
          role="tooltip"
        >
          {content}
          <div
            className="
              absolute top-full left-1/2 -translate-x-1/2
              border-4 border-transparent border-t-gray-900 dark:border-t-gray-700
            "
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
}

Tooltip.propTypes = {
  content: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default Tooltip
