import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ErrorBoundary } from './ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Normal content</div>
}

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })
  afterEach(() => {
    console.error = originalError
  })

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('renders error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('shows custom fallback message', () => {
    render(
      <ErrorBoundary fallbackMessage="Custom error message">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('shows home button when showHomeButton is true', () => {
    render(
      <ErrorBoundary showHomeButton={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Go Home')).toBeInTheDocument()
  })

  it('does not show home button by default', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.queryByText('Go Home')).not.toBeInTheDocument()
  })

  it('clears localStorage on reset when clearOnReset is true', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
    const reloadSpy = vi.fn()

    // Mock window.location.reload
    const originalLocation = window.location
    delete window.location
    window.location = { reload: reloadSpy }

    render(
      <ErrorBoundary clearOnReset={true}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Try Again'))

    expect(removeItemSpy).toHaveBeenCalledWith('willGenerator_formData')
    expect(reloadSpy).toHaveBeenCalled()

    // Restore
    window.location = originalLocation
    removeItemSpy.mockRestore()
  })

  it('does not clear localStorage when clearOnReset is false', () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
    const reloadSpy = vi.fn()

    const originalLocation = window.location
    delete window.location
    window.location = { reload: reloadSpy }

    render(
      <ErrorBoundary clearOnReset={false}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    fireEvent.click(screen.getByText('Try Again'))

    expect(removeItemSpy).not.toHaveBeenCalled()
    expect(reloadSpy).toHaveBeenCalled()

    window.location = originalLocation
    removeItemSpy.mockRestore()
  })

  it('displays AlertTriangle icon in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // The lucide-react icon should be rendered
    const icon = document.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})
