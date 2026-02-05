import React from 'react'
import PropTypes from 'prop-types'

export function Card({ children, className = '', title, description, show = true }) {
  if (!show) return null

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-xl shadow-sm
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{description}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  show: PropTypes.bool,
}
