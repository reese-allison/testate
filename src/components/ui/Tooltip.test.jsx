import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  describe('visibility', () => {
    it('does not show tooltip content initially', () => {
      render(<Tooltip content="Help text" />)

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('shows tooltip on click', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)

      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText('Help text')).toBeInTheDocument()
    })

    it('hides tooltip on second click (toggle)', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      fireEvent.click(button)
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('shows tooltip on mouse enter', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.mouseEnter(button)

      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('hides tooltip on mouse leave', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.mouseEnter(button)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      fireEvent.mouseLeave(button)
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('shows tooltip on focus', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.focus(button)

      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('hides tooltip on blur', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.focus(button)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      fireEvent.blur(button)
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  describe('escape key', () => {
    it('hides tooltip on Escape key press', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)
      expect(screen.getByRole('tooltip')).toBeInTheDocument()

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    it('does not respond to other keys', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)

      fireEvent.keyDown(document, { key: 'Enter' })
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('button has aria-label', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      expect(button).toHaveAttribute('aria-label', 'More information')
    })

    it('button has aria-expanded attribute', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      expect(button).toHaveAttribute('aria-expanded', 'false')

      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('button has aria-describedby when tooltip is visible', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      expect(button).not.toHaveAttribute('aria-describedby')

      fireEvent.click(button)
      const tooltipId = button.getAttribute('aria-describedby')
      expect(tooltipId).toBeTruthy()

      const tooltip = document.getElementById(tooltipId)
      expect(tooltip).toHaveTextContent('Help text')
    })

    it('tooltip has role="tooltip"', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)

      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    it('icon is aria-hidden', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      const icon = button.querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('button is type="button" to prevent form submission', () => {
      render(<Tooltip content="Help text" />)

      const button = screen.getByLabelText('More information')
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('content', () => {
    it('displays text content', () => {
      render(<Tooltip content="Simple help text" />)

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)

      expect(screen.getByText('Simple help text')).toBeInTheDocument()
    })

    it('displays JSX content', () => {
      render(
        <Tooltip
          content={
            <span data-testid="jsx-content">
              <strong>Bold</strong> text
            </span>
          }
        />
      )

      const button = screen.getByLabelText('More information')
      fireEvent.click(button)

      expect(screen.getByTestId('jsx-content')).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(<Tooltip content="Help" className="custom-class" />)

      expect(container.firstChild.className).toContain('custom-class')
    })

    it('preserves default classes with custom className', () => {
      const { container } = render(<Tooltip content="Help" className="custom-class" />)

      expect(container.firstChild.className).toContain('custom-class')
      expect(container.firstChild.className).toContain('relative')
      expect(container.firstChild.className).toContain('inline-block')
    })
  })
})
