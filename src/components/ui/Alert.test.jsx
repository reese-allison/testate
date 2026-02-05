import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Alert } from './Alert'

describe('Alert', () => {
  describe('variants', () => {
    it('renders info variant by default', () => {
      render(<Alert>Info message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert.className).toContain('bg-blue-50')
    })

    it('renders info variant explicitly', () => {
      render(<Alert variant="info">Info message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-blue-50')
      expect(alert.className).toContain('border-blue-200')
    })

    it('renders success variant', () => {
      render(<Alert variant="success">Success message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-green-50')
      expect(alert.className).toContain('border-green-200')
    })

    it('renders warning variant', () => {
      render(<Alert variant="warning">Warning message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-yellow-50')
      expect(alert.className).toContain('border-yellow-200')
    })

    it('renders error variant', () => {
      render(<Alert variant="error">Error message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('bg-red-50')
      expect(alert.className).toContain('border-red-200')
    })
  })

  describe('title', () => {
    it('renders without title', () => {
      render(<Alert>Message without title</Alert>)

      expect(screen.getByText('Message without title')).toBeInTheDocument()
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('renders with title', () => {
      render(<Alert title="Alert Title">Message with title</Alert>)

      expect(screen.getByText('Alert Title')).toBeInTheDocument()
      expect(screen.getByText('Message with title')).toBeInTheDocument()
    })

    it('renders title as h4 element', () => {
      render(<Alert title="My Title">Content</Alert>)

      const title = screen.getByText('My Title')
      expect(title.tagName).toBe('H4')
    })
  })

  describe('dismiss button', () => {
    it('does not show dismiss button when onClose is not provided', () => {
      render(<Alert>Message</Alert>)

      expect(screen.queryByLabelText('Dismiss alert')).not.toBeInTheDocument()
    })

    it('shows dismiss button when onClose is provided', () => {
      const onClose = vi.fn()
      render(<Alert onClose={onClose}>Message</Alert>)

      expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument()
    })

    it('calls onClose when dismiss button is clicked', () => {
      const onClose = vi.fn()
      render(<Alert onClose={onClose}>Message</Alert>)

      const dismissButton = screen.getByLabelText('Dismiss alert')
      fireEvent.click(dismissButton)

      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('has role="alert"', () => {
      render(<Alert>Accessible message</Alert>)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('has aria-hidden on decorative icon', () => {
      render(<Alert>Message</Alert>)

      const alert = screen.getByRole('alert')
      const icon = alert.querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('dismiss button has aria-label', () => {
      const onClose = vi.fn()
      render(<Alert onClose={onClose}>Message</Alert>)

      const dismissButton = screen.getByLabelText('Dismiss alert')
      expect(dismissButton).toHaveAttribute('aria-label', 'Dismiss alert')
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      render(<Alert className="custom-class">Message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('custom-class')
    })

    it('preserves default classes with custom className', () => {
      render(
        <Alert className="custom-class" variant="error">
          Message
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert.className).toContain('custom-class')
      expect(alert.className).toContain('bg-red-50')
    })
  })

  describe('children content', () => {
    it('renders text children', () => {
      render(<Alert>Simple text content</Alert>)

      expect(screen.getByText('Simple text content')).toBeInTheDocument()
    })

    it('renders JSX children', () => {
      render(
        <Alert>
          <span data-testid="custom-content">Custom JSX content</span>
        </Alert>
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    })
  })
})
