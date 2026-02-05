import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { WillGenerator } from './WillGenerator'

// Mock the useWillState hook
vi.mock('../hooks/useWillState', () => ({
  useWillState: () => ({
    formData: {
      testator: {
        fullName: '',
        address: '',
        city: '',
        state: 'Florida',
        zip: '',
        county: '',
        maritalStatus: 'single',
        spouseName: '',
      },
      executor: {
        name: '',
        relationship: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        alternateName: '',
        alternateRelationship: '',
        alternateAddress: '',
        alternateCity: '',
        alternateState: '',
        alternateZip: '',
        bondRequired: false,
      },
      children: [],
      guardian: {
        name: '',
        relationship: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        alternateName: '',
        alternateRelationship: '',
        alternateAddress: '',
        alternateCity: '',
        alternateState: '',
        alternateZip: '',
      },
      specificGifts: [],
      residuaryEstate: {
        distributionType: 'spouse',
        spouseShare: 100,
        childrenShare: 0,
        customBeneficiaries: [],
        perStirpes: true,
      },
      digitalAssets: { include: false },
      pets: { include: false, items: [] },
      funeral: { include: false },
      realProperty: { include: false, items: [] },
      debtsAndTaxes: { include: false },
      customProvisions: { include: false, items: [] },
      disinheritance: { include: false, persons: [] },
      survivorshipPeriod: 30,
      noContestClause: true,
    },
    updateField: vi.fn(),
    updateSection: vi.fn(),
    updateArray: vi.fn(),
    resetForm: vi.fn(),
  }),
}))

describe('WillGenerator Step Navigation', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the progress stepper with all steps', () => {
    render(<WillGenerator />)

    // Check that progress stepper step labels are visible
    expect(screen.getByText('You')).toBeInTheDocument()
    expect(screen.getByText('Executor')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
    expect(screen.getByText('Gifts')).toBeInTheDocument()
    expect(screen.getByText('Estate')).toBeInTheDocument()
    expect(screen.getByText('More')).toBeInTheDocument()
    expect(screen.getByText('Disinherit')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
  })

  it('starts at step 1', () => {
    render(<WillGenerator />)
    expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
  })

  it('allows clicking on a future step and shows validation errors with confirm dialog', () => {
    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Should show validation errors since step 1 is incomplete
    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument()

    // Should show confirm dialog
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Continue with Errors?')).toBeInTheDocument()
  })

  it('navigates forward when user confirms despite validation errors', async () => {
    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Click the confirm button in dialog
    const confirmButton = screen.getByText('Continue Anyway')
    fireEvent.click(confirmButton)

    // Should navigate to step 2
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 8')).toBeInTheDocument()
    })
  })

  it('does not navigate forward when user cancels', async () => {
    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Click the cancel button in dialog
    const cancelButton = screen.getByText('Stay Here')
    fireEvent.click(cancelButton)

    // Should stay on step 1
    expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
    // Dialog should be closed
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('clicking current step does nothing', async () => {
    render(<WillGenerator />)

    // Click on step 1 (current step)
    const step1Button = screen.getByText('You').closest('button')
    fireEvent.click(step1Button)

    // Should stay on step 1
    expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
    // No dialog should appear
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('closes dialog when escape key is pressed', async () => {
    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Dialog should be open
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' })

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  it('closes dialog when backdrop is clicked', async () => {
    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Dialog should be open
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    // Click the backdrop (the div with role="presentation" contains it)
    const presentationDiv = screen.getByRole('presentation')
    const backdrop = presentationDiv.querySelector('.bg-black\\/50')
    fireEvent.click(backdrop)

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })
})

describe('WillGenerator Backward Navigation', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('allows navigating backward without validation', async () => {
    render(<WillGenerator />)

    // Navigate forward to step 2
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Confirm in dialog
    const confirmButton = screen.getByText('Continue Anyway')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 8')).toBeInTheDocument()
    })

    // Navigate back to step 1
    const step1Button = screen.getByText('You').closest('button')
    fireEvent.click(step1Button)

    // Should navigate without any dialog
    await waitFor(() => {
      expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
    })
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })
})

describe('WillGenerator Previous/Next Buttons', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('Previous button is disabled on first step', () => {
    render(<WillGenerator />)

    const previousButton = screen.getByText('Previous').closest('button')
    expect(previousButton).toBeDisabled()
  })

  it('Next button is visible on non-final steps', () => {
    render(<WillGenerator />)

    expect(screen.getByText('Next')).toBeInTheDocument()
  })

  it('clicking Next validates current step', () => {
    render(<WillGenerator />)

    const nextButton = screen.getByText('Next').closest('button')
    fireEvent.click(nextButton)

    // Should show validation errors since step 1 is incomplete
    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument()
  })
})

describe('ConfirmDialog Accessibility', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('has proper ARIA attributes', async () => {
    render(<WillGenerator />)

    // Open dialog
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'confirm-dialog-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'confirm-dialog-message')
  })

  it('focuses cancel button when dialog opens', async () => {
    render(<WillGenerator />)

    // Open dialog
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    await waitFor(() => {
      expect(screen.getByText('Stay Here')).toHaveFocus()
    })
  })
})
