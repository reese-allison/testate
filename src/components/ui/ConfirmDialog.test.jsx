import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up body styles that might be set by the component
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.overflow = ''
  })

  describe('rendering', () => {
    it('renders when isOpen is true', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText('Confirm Action')).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
      render(<ConfirmDialog {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('renders confirm and cancel buttons', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByText('Confirm')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('renders custom button labels', () => {
      render(
        <ConfirmDialog {...defaultProps} confirmLabel="Yes, Delete" cancelLabel="No, Keep It" />
      )

      expect(screen.getByText('Yes, Delete')).toBeInTheDocument()
      expect(screen.getByText('No, Keep It')).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('renders default variant', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const confirmButton = screen.getByText('Confirm')
      expect(confirmButton.className).toContain('bg-blue-600')
    })

    it('renders destructive variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="destructive" />)

      const confirmButton = screen.getByText('Confirm')
      expect(confirmButton.className).toContain('bg-red-600')
    })

    it('renders warning variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="warning" />)

      const confirmButton = screen.getByText('Confirm')
      expect(confirmButton.className).toContain('bg-yellow-600')
    })

    it('falls back to default for unknown variant', () => {
      render(<ConfirmDialog {...defaultProps} variant="unknown" />)

      const confirmButton = screen.getByText('Confirm')
      expect(confirmButton.className).toContain('bg-blue-600')
    })
  })

  describe('callbacks', () => {
    it('calls onConfirm when confirm button is clicked', () => {
      const onConfirm = vi.fn()
      render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)

      fireEvent.click(screen.getByText('Confirm'))

      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when cancel button is clicked', () => {
      const onCancel = vi.fn()
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

      fireEvent.click(screen.getByText('Cancel'))

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onCancel when backdrop is clicked', () => {
      const onCancel = vi.fn()
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

      // The backdrop has aria-hidden="true"
      const backdrop = document.querySelector('[aria-hidden="true"]')
      fireEvent.click(backdrop)

      expect(onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('escape key', () => {
    it('calls onCancel when Escape key is pressed', () => {
      const onCancel = vi.fn()
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

      fireEvent.keyDown(document, { key: 'Escape' })

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('does not call onCancel for other keys', () => {
      const onCancel = vi.fn()
      render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)

      fireEvent.keyDown(document, { key: 'Enter' })
      fireEvent.keyDown(document, { key: 'a' })

      expect(onCancel).not.toHaveBeenCalled()
    })
  })

  describe('focus trap', () => {
    it('focuses cancel button when dialog opens', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const cancelButton = screen.getByText('Cancel')
      expect(document.activeElement).toBe(cancelButton)
    })

    it('traps focus within dialog when tabbing forward from last element', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const confirmButton = screen.getByText('Confirm')
      const cancelButton = screen.getByText('Cancel')

      // Focus the confirm button (last focusable element)
      confirmButton.focus()

      // Tab from the last element should wrap to first
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: false })

      // Focus should be on cancel button (first focusable)
      expect(document.activeElement).toBe(cancelButton)
    })

    it('traps focus within dialog when tabbing backward from first element', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const confirmButton = screen.getByText('Confirm')
      const cancelButton = screen.getByText('Cancel')

      // Focus the cancel button (first focusable element)
      cancelButton.focus()

      // Shift+Tab from first element should wrap to last
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

      // Focus should be on confirm button (last focusable)
      expect(document.activeElement).toBe(confirmButton)
    })
  })

  describe('accessibility', () => {
    it('has role="alertdialog"', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('has aria-modal="true"', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const dialog = screen.getByRole('alertdialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby pointing to title', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const dialog = screen.getByRole('alertdialog')
      const labelId = dialog.getAttribute('aria-labelledby')
      const titleElement = document.getElementById(labelId)

      expect(titleElement).toHaveTextContent('Confirm Action')
    })

    it('has aria-describedby pointing to message', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const dialog = screen.getByRole('alertdialog')
      const describedById = dialog.getAttribute('aria-describedby')
      const messageElement = document.getElementById(describedById)

      expect(messageElement).toHaveTextContent('Are you sure you want to proceed?')
    })

    it('backdrop has aria-hidden', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const backdrop = document.querySelector('[aria-hidden="true"]')
      expect(backdrop).toBeInTheDocument()
    })

    it('icon is aria-hidden', () => {
      render(<ConfirmDialog {...defaultProps} />)

      const dialog = screen.getByRole('alertdialog')
      const icon = dialog.querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('body scroll lock', () => {
    it('locks body scroll when dialog opens', () => {
      render(<ConfirmDialog {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('unlocks body scroll when dialog closes', () => {
      const { rerender } = render(<ConfirmDialog {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')

      rerender(<ConfirmDialog {...defaultProps} isOpen={false} />)

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('focus restoration', () => {
    it('restores focus to previously focused element when dialog closes', () => {
      // Create a button to focus before dialog opens
      const beforeButton = document.createElement('button')
      beforeButton.textContent = 'Before Button'
      document.body.appendChild(beforeButton)
      beforeButton.focus()

      const { rerender } = render(<ConfirmDialog {...defaultProps} />)

      // Dialog should have moved focus
      expect(document.activeElement).not.toBe(beforeButton)

      // Close the dialog
      rerender(<ConfirmDialog {...defaultProps} isOpen={false} />)

      // Focus should be restored
      expect(document.activeElement).toBe(beforeButton)

      // Cleanup
      document.body.removeChild(beforeButton)
    })
  })

  describe('message formatting', () => {
    it('preserves whitespace in message', () => {
      render(<ConfirmDialog {...defaultProps} message="Line 1\nLine 2\nLine 3" />)

      const message = screen.getByText((content, element) => {
        return element.id === 'confirm-dialog-message' && content.includes('Line 1')
      })
      expect(message.className).toContain('whitespace-pre-line')
    })
  })
})
