import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Card } from './Card'

describe('Card', () => {
  describe('children', () => {
    it('renders children content', () => {
      render(<Card>Card content</Card>)

      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('renders JSX children', () => {
      render(
        <Card>
          <div data-testid="child-element">Complex child</div>
        </Card>
      )

      expect(screen.getByTestId('child-element')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <Card>
          <p>First child</p>
          <p>Second child</p>
        </Card>
      )

      expect(screen.getByText('First child')).toBeInTheDocument()
      expect(screen.getByText('Second child')).toBeInTheDocument()
    })
  })

  describe('title and description', () => {
    it('renders without title and description', () => {
      render(<Card>Content only</Card>)

      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('renders with title only', () => {
      render(<Card title="Card Title">Content</Card>)

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card Title').tagName).toBe('H3')
    })

    it('renders with description only', () => {
      render(<Card description="Card description">Content</Card>)

      expect(screen.getByText('Card description')).toBeInTheDocument()
    })

    it('renders with both title and description', () => {
      render(
        <Card title="Card Title" description="Card description">
          Content
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description')).toBeInTheDocument()
    })

    it('renders title as h3 element', () => {
      render(<Card title="My Title">Content</Card>)

      const title = screen.getByText('My Title')
      expect(title.tagName).toBe('H3')
    })

    it('renders description as p element', () => {
      render(<Card description="My description">Content</Card>)

      const description = screen.getByText('My description')
      expect(description.tagName).toBe('P')
    })

    it('renders header section with border when title or description exists', () => {
      const { container } = render(<Card title="Title">Content</Card>)

      // Find the header div (has border-b class)
      const headerDiv = container.querySelector('.border-b')
      expect(headerDiv).toBeInTheDocument()
    })

    it('does not render header section without title or description', () => {
      const { container } = render(<Card>Content only</Card>)

      // Should not have a header div with border
      const headerDiv = container.querySelector('.px-6.py-4.border-b')
      expect(headerDiv).not.toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)

      const card = container.firstChild
      expect(card.className).toContain('custom-class')
    })

    it('preserves default classes with custom className', () => {
      const { container } = render(<Card className="my-custom-class">Content</Card>)

      const card = container.firstChild
      expect(card.className).toContain('my-custom-class')
      expect(card.className).toContain('bg-white')
      expect(card.className).toContain('rounded-xl')
      expect(card.className).toContain('shadow-sm')
    })

    it('applies empty className by default', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild
      expect(card.className).toContain('bg-white')
    })
  })

  describe('styling', () => {
    it('has base card styling', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild
      expect(card.className).toContain('bg-white')
      expect(card.className).toContain('rounded-xl')
      expect(card.className).toContain('shadow-sm')
      expect(card.className).toContain('border')
    })

    it('has dark mode classes', () => {
      const { container } = render(<Card>Content</Card>)

      const card = container.firstChild
      expect(card.className).toContain('dark:bg-gray-800')
      expect(card.className).toContain('dark:border-gray-700')
    })
  })
})
