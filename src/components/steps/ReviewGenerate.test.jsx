import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { ReviewGenerate } from './ReviewGenerate'

// Mock the pdfGenerator module
vi.mock('../../utils/pdfGenerator', () => ({
  generatePDF: vi.fn().mockResolvedValue(undefined),
}))

const validFormData = {
  testator: {
    fullName: 'John Smith',
    address: '123 Main St',
    city: 'Miami',
    state: 'Florida',
    zip: '33101',
    county: 'Miami-Dade',
    maritalStatus: 'married',
    spouseName: 'Jane Smith',
    residenceState: 'FL',
  },
  executor: {
    name: 'Bob Johnson',
    relationship: 'Brother',
    address: '456 Oak Ave',
    city: 'Orlando',
    state: 'Florida',
    zip: '32801',
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
}

const invalidFormData = {
  ...validFormData,
  testator: {
    ...validFormData.testator,
    fullName: '', // Missing required field
  },
}

describe('ReviewGenerate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders without errors', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)
    expect(screen.getByText('Testator Information')).toBeInTheDocument()
  })

  it('displays testator information', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    // Use getAllBy for text that may appear in multiple places (summary + preview)
    expect(screen.getAllByText(/John Smith/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/123 Main St/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Miami-Dade/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Married to Jane Smith/).length).toBeGreaterThan(0)
  })

  it('displays executor information', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Personal Representative (Executor)')).toBeInTheDocument()
    expect(screen.getByText(/Bob Johnson \(Brother\)/)).toBeInTheDocument()
  })

  it('displays residuary estate information', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Residuary Estate Distribution')).toBeInTheDocument()
    expect(screen.getByText('Everything to spouse')).toBeInTheDocument()
  })

  it('shows will document preview', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Will Document Preview')).toBeInTheDocument()
  })

  it('shows download button when no validation errors', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Download PDF')).toBeInTheDocument()
  })

  it('shows fix errors button when validation errors exist', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={invalidFormData} onReset={onReset} />)

    expect(screen.getByText('Fix Errors First')).toBeInTheDocument()
  })

  it('shows validation errors alert when errors exist', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={invalidFormData} onReset={onReset} />)

    expect(screen.getByText('Validation Errors Found')).toBeInTheDocument()
  })

  it('shows warning alert about review', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Review Carefully Before Generating')).toBeInTheDocument()
  })

  it('shows legal information alert', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Important Legal Information')).toBeInTheDocument()
  })

  it('shows start over button', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    expect(screen.getByText('Start Over')).toBeInTheDocument()
  })

  it('calls onReset when start over is clicked', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    fireEvent.click(screen.getByText('Start Over'))
    expect(onReset).toHaveBeenCalled()
  })

  it('shows children card when children exist', () => {
    const onReset = vi.fn()
    const dataWithChildren = {
      ...validFormData,
      children: [{ id: '1', name: 'Alice Smith', isMinor: true, relationship: 'biological' }],
    }
    render(<ReviewGenerate formData={dataWithChildren} onReset={onReset} />)

    expect(screen.getByText('Children & Guardian')).toBeInTheDocument()
    expect(screen.getAllByText(/Alice Smith/).length).toBeGreaterThan(0)
  })

  it('shows specific gifts card when gifts exist', () => {
    const onReset = vi.fn()
    const dataWithGifts = {
      ...validFormData,
      specificGifts: [
        {
          id: '1',
          type: 'cash',
          description: '$5000',
          beneficiary: 'Nephew Bob',
          beneficiaryRelationship: 'nephew',
          alternativeBeneficiary: '',
          conditions: '',
        },
      ],
    }
    render(<ReviewGenerate formData={dataWithGifts} onReset={onReset} />)

    expect(screen.getByText('Specific Gifts')).toBeInTheDocument()
    expect(screen.getAllByText(/Nephew Bob/).length).toBeGreaterThan(0)
  })

  it('shows additional provisions card when any provisions are included', () => {
    const onReset = vi.fn()
    const dataWithProvisions = {
      ...validFormData,
      digitalAssets: { include: true, fiduciary: 'Tech Person' },
    }
    render(<ReviewGenerate formData={dataWithProvisions} onReset={onReset} />)

    expect(screen.getByText('Additional Provisions')).toBeInTheDocument()
    expect(screen.getAllByText(/Tech Person/).length).toBeGreaterThan(0)
  })

  it('shows disinheritance card when disinheritance is included', () => {
    const onReset = vi.fn()
    const dataWithDisinheritance = {
      ...validFormData,
      disinheritance: {
        include: true,
        persons: [{ id: '1', name: 'Bad Actor', relationship: 'Sibling', reason: '' }],
      },
    }
    render(<ReviewGenerate formData={dataWithDisinheritance} onReset={onReset} />)

    expect(screen.getByText('Disinheritance')).toBeInTheDocument()
    expect(screen.getAllByText(/Bad Actor/).length).toBeGreaterThan(0)
  })

  it('disables download button when generating', async () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={validFormData} onReset={onReset} />)

    const downloadButton = screen.getByText('Download PDF').closest('button')
    fireEvent.click(downloadButton)

    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument()
    })
  })

  it('disables download button when validation errors exist', () => {
    const onReset = vi.fn()
    render(<ReviewGenerate formData={invalidFormData} onReset={onReset} />)

    const button = screen.getByText('Fix Errors First').closest('button')
    expect(button).toBeDisabled()
  })
})
