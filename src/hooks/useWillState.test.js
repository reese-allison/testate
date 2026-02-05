import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWillState } from './useWillState'

describe('useWillState', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with correct default state structure', () => {
    const { result } = renderHook(() => useWillState())

    expect(result.current.formData).toBeDefined()
    expect(result.current.formData.testator).toBeDefined()
    expect(result.current.formData.testator.fullName).toBe('')
    expect(result.current.formData.testator.residenceState).toBe('') // No default state - user must select
    expect(result.current.formData.testator.maritalStatus).toBe('') // No default - user must select
    expect(result.current.formData.executor).toBeDefined()
    expect(result.current.formData.children).toEqual([])
    expect(result.current.formData.specificGifts).toEqual([])
  })

  it('updateField updates a nested field correctly', () => {
    const { result } = renderHook(() => useWillState())

    act(() => {
      result.current.updateField('testator', 'fullName', 'John Doe')
    })

    expect(result.current.formData.testator.fullName).toBe('John Doe')
  })

  it('updateField preserves other fields in the section', () => {
    const { result } = renderHook(() => useWillState())

    act(() => {
      result.current.updateField('testator', 'fullName', 'John Doe')
    })

    act(() => {
      result.current.updateField('testator', 'city', 'Miami')
    })

    expect(result.current.formData.testator.fullName).toBe('John Doe')
    expect(result.current.formData.testator.city).toBe('Miami')
  })

  it('updateSection merges data into a section', () => {
    const { result } = renderHook(() => useWillState())

    act(() => {
      result.current.updateSection('executor', {
        name: 'Jane Smith',
        relationship: 'Sister',
      })
    })

    expect(result.current.formData.executor.name).toBe('Jane Smith')
    expect(result.current.formData.executor.relationship).toBe('Sister')
  })

  it('updateArray replaces entire array', () => {
    const { result } = renderHook(() => useWillState())

    const children = [
      { name: 'Child 1', isMinor: true },
      { name: 'Child 2', isMinor: false },
    ]

    act(() => {
      result.current.updateArray('children', children)
    })

    expect(result.current.formData.children).toEqual(children)
  })

  it('resetForm clears to initial state', () => {
    const { result } = renderHook(() => useWillState())

    act(() => {
      result.current.updateField('testator', 'fullName', 'John Doe')
      result.current.updateArray('children', [{ name: 'Child 1' }])
    })

    expect(result.current.formData.testator.fullName).toBe('John Doe')
    expect(result.current.formData.children).toHaveLength(1)

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.formData.testator.fullName).toBe('')
    expect(result.current.formData.children).toEqual([])
  })

  it('persists state changes to localStorage (after debounce)', () => {
    const { result } = renderHook(() => useWillState())

    act(() => {
      result.current.updateField('testator', 'fullName', 'John Doe')
    })

    // Advance timers to trigger debounced write
    act(() => {
      vi.advanceTimersByTime(600)
    })

    // localStorage should have encrypted data
    expect(localStorage.getItem('willGenerator_formData')).not.toBeNull()
  })

  it('loads existing state from localStorage on init (migrates unencrypted data)', () => {
    // This tests migration from old unencrypted JSON data
    const existingData = {
      testator: {
        fullName: 'Existing User',
        address: '123 Main St',
        city: '',
        state: 'Florida',
        zip: '',
        county: '',
        maritalStatus: 'single',
        spouseName: '',
        residenceState: 'FL',
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
      digitalAssets: {
        include: false,
        fiduciary: '',
        socialMedia: 'delete',
        email: 'delete',
        cloudStorage: 'transfer',
        cryptocurrency: '',
        passwordManager: '',
        instructions: '',
      },
      pets: { include: false, items: [] },
      funeral: {
        include: false,
        preference: '',
        serviceType: '',
        location: '',
        memorialDonations: '',
        prePaidArrangements: false,
        prePaidDetails: '',
        additionalWishes: '',
      },
      realProperty: { include: false, items: [] },
      debtsAndTaxes: {
        include: false,
        paymentOrder: 'residuary',
        specificInstructions: '',
      },
      customProvisions: { include: false, items: [] },
      disinheritance: { include: false, persons: [] },
      survivorshipPeriod: 30,
      noContestClause: true,
    }

    localStorage.setItem('willGenerator_formData', JSON.stringify(existingData))

    const { result } = renderHook(() => useWillState())

    expect(result.current.formData.testator.fullName).toBe('Existing User')
    expect(result.current.formData.testator.address).toBe('123 Main St')
  })

  it('deep merges localStorage data with defaults for new fields', () => {
    // Simulate old data that might be missing new fields
    const oldData = {
      testator: {
        fullName: 'Old User',
        address: '456 Old St',
        // Missing residenceState and other new fields
      },
      executor: { name: 'Old Executor' },
      children: [{ name: 'Old Child' }],
      // Missing other sections
    }

    localStorage.setItem('willGenerator_formData', JSON.stringify(oldData))

    const { result } = renderHook(() => useWillState())

    // Should preserve old data
    expect(result.current.formData.testator.fullName).toBe('Old User')
    expect(result.current.formData.testator.address).toBe('456 Old St')
    expect(result.current.formData.executor.name).toBe('Old Executor')
    expect(result.current.formData.children[0].name).toBe('Old Child')

    // Should have new fields with defaults
    expect(result.current.formData.testator.residenceState).toBe('') // No default state
    expect(result.current.formData.customProvisions).toBeDefined()
    expect(result.current.formData.disinheritance).toBeDefined()
  })
})
