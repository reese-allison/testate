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
        spouseName: ''
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
        bondRequired: false
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
        alternateZip: ''
      },
      specificGifts: [],
      residuaryEstate: {
        distributionType: 'spouse',
        spouseShare: 100,
        childrenShare: 0,
        customBeneficiaries: [],
        perStirpes: true
      },
      digitalAssets: { include: false },
      pets: { include: false, items: [] },
      funeral: { include: false },
      realProperty: { include: false, items: [] },
      debtsAndTaxes: { include: false },
      customProvisions: { include: false, items: [] },
      disinheritance: { include: false, persons: [] },
      survivorshipPeriod: 30,
      noContestClause: true
    },
    updateField: vi.fn(),
    updateSection: vi.fn(),
    updateArray: vi.fn(),
    resetForm: vi.fn()
  })
}))

describe('WillGenerator Step Navigation', () => {
  let confirmSpy

  beforeEach(() => {
    // Mock window.confirm
    confirmSpy = vi.spyOn(window, 'confirm')
    // Mock window.scrollTo
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    confirmSpy.mockRestore()
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

  it('allows clicking on a future step and shows validation errors', () => {
    confirmSpy.mockReturnValue(false) // User clicks Cancel

    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Should show validation errors since step 1 is incomplete
    expect(screen.getByText('Please fix the following errors:')).toBeInTheDocument()
  })

  it('navigates forward when user confirms despite validation errors', async () => {
    confirmSpy.mockReturnValue(true) // User clicks OK

    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Should navigate to step 2
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 8')).toBeInTheDocument()
    })
  })

  it('does not navigate forward when user cancels', async () => {
    confirmSpy.mockReturnValue(false) // User clicks Cancel

    render(<WillGenerator />)

    // Try to click on step 2 (Executor)
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    // Should stay on step 1
    expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
  })

  it('clicking current step does nothing', async () => {
    render(<WillGenerator />)

    // Click on step 1 (current step)
    const step1Button = screen.getByText('You').closest('button')
    fireEvent.click(step1Button)

    // Should stay on step 1
    expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
    // No confirmation dialog should appear
    expect(confirmSpy).not.toHaveBeenCalled()
  })
})

describe('WillGenerator Backward Navigation', () => {
  let confirmSpy

  beforeEach(() => {
    confirmSpy = vi.spyOn(window, 'confirm')
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    confirmSpy.mockRestore()
  })

  it('allows navigating backward without validation', async () => {
    confirmSpy.mockReturnValue(true) // For forward navigation

    render(<WillGenerator />)

    // Navigate forward to step 2
    const step2Button = screen.getByText('Executor').closest('button')
    fireEvent.click(step2Button)

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 8')).toBeInTheDocument()
    })

    // Reset confirm spy
    confirmSpy.mockClear()

    // Navigate back to step 1
    const step1Button = screen.getByText('You').closest('button')
    fireEvent.click(step1Button)

    // Should navigate without confirmation
    await waitFor(() => {
      expect(screen.getByText('Step 1 of 8')).toBeInTheDocument()
    })
    expect(confirmSpy).not.toHaveBeenCalled()
  })
})

describe('WillGenerator Previous/Next Buttons', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
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
