import React, { useState } from 'react'
import { HelpCircle } from 'lucide-react'

export function Tooltip({ content, className = '' }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {isVisible && (
        <div
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
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip
