import React from 'react'
import PropTypes from 'prop-types'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

const variants = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: Info,
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: AlertCircle,
  },
}

export function Alert({ variant = 'info', title, children, onClose, className = '' }) {
  const style = variants[variant]
  const Icon = style.icon

  return (
    <div
      className={`
        rounded-lg border p-4
        ${style.bg} ${style.border}
        ${className}
      `}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 ${style.text}`} aria-hidden="true" />
        <div className="flex-1">
          {title && <h4 className={`font-medium ${style.text}`}>{title}</h4>}
          <div className={`text-sm ${style.text} ${title ? 'mt-1' : ''}`}>{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`flex-shrink-0 ${style.text} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded`}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

Alert.propTypes = {
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  className: PropTypes.string,
}
