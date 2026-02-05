import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { AlertTriangle, Info } from 'lucide-react'

const variants = {
  default: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    confirmBtn: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  },
  destructive: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    icon: AlertTriangle,
    iconColor: 'text-red-600 dark:text-red-400',
    confirmBtn: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    confirmBtn: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
  },
}

/**
 * A modal confirmation dialog that replaces native browser confirm().
 *
 * Features:
 * - Accessible: uses alertdialog role, focus trap, escape to close
 * - Dark mode support
 * - Multiple variants: default, destructive, warning
 * - Customizable button labels
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const confirmButtonRef = useRef(null)
  const cancelButtonRef = useRef(null)

  const style = variants[variant] || variants.default
  const Icon = style.icon

  // Focus management and escape key handling
  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    const previouslyFocused = document.activeElement

    // Focus the cancel button when dialog opens (safer default)
    cancelButtonRef.current?.focus()

    // Handle escape key
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        onCancel()
      }

      // Focus trap - keep focus within dialog
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll('button:not([disabled])')
        if (!focusableElements || focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Prevent body scroll when dialog is open
    // Save current scroll position and lock the body
    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore body scroll
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      // Restore scroll position
      window.scrollTo(0, scrollY)
      // Restore focus when dialog closes
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className={`
          relative w-full max-w-md rounded-lg shadow-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
        `}
      >
        {/* Header with icon */}
        <div className={`p-4 rounded-t-lg ${style.bg}`}>
          <div className="flex items-center gap-3">
            <div
              className={`
              flex-shrink-0 w-10 h-10 rounded-full
              flex items-center justify-center
              bg-white dark:bg-gray-800
            `}
            >
              <Icon className={`w-5 h-5 ${style.iconColor}`} aria-hidden="true" />
            </div>
            <h2
              id="confirm-dialog-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
          </div>
        </div>

        {/* Message */}
        <div className="p-4">
          <p
            id="confirm-dialog-message"
            className="text-gray-700 dark:text-gray-300 whitespace-pre-line"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              bg-gray-100 text-gray-700 hover:bg-gray-200
              dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
              focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
              dark:focus:ring-offset-gray-800
            `}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${style.confirmBtn}
              focus:outline-none focus:ring-2 focus:ring-offset-2
              dark:focus:ring-offset-gray-800
            `}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive', 'warning']),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
