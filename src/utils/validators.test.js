import { describe, it, expect } from 'vitest'
import {
  isRequired,
  isValidZip,
  isValidEmail,
  isValidPhone,
  validateTestator,
  validateExecutor,
  validateChildren,
  validateGifts,
  validateDistribution,
  validateAdditionalProvisions,
  validateDisinheritance,
  validateReview,
  stepValidators,
} from './validators'

describe('Validation Helpers', () => {
  describe('isRequired', () => {
    it('returns true for non-empty string', () => {
      expect(isRequired('hello')).toBe(true)
    })

    it('returns false for empty string', () => {
      expect(isRequired('')).toBe(false)
    })

    it('returns false for whitespace-only string', () => {
      expect(isRequired('   ')).toBe(false)
    })

    it('returns true for non-empty array', () => {
      expect(isRequired([1, 2, 3])).toBe(true)
    })

    it('returns false for empty array', () => {
      expect(isRequired([])).toBe(false)
    })

    it('returns false for null', () => {
      expect(isRequired(null)).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isRequired(undefined)).toBe(false)
    })

    it('returns true for zero (valid number)', () => {
      expect(isRequired(0)).toBe(true)
    })
  })

  describe('isValidZip', () => {
    it('accepts 5-digit ZIP', () => {
      expect(isValidZip('33101')).toBe(true)
    })

    it('accepts 5+4 digit ZIP', () => {
      expect(isValidZip('33101-1234')).toBe(true)
    })

    it('rejects 4-digit ZIP', () => {
      expect(isValidZip('3310')).toBe(false)
    })

    it('rejects letters', () => {
      expect(isValidZip('abcde')).toBe(false)
    })

    it('rejects malformed ZIP', () => {
      expect(isValidZip('33101-12')).toBe(false)
    })
  })

  describe('isValidEmail', () => {
    it('accepts valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('rejects email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false)
    })

    it('rejects email without domain', () => {
      expect(isValidEmail('test@')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('accepts 10-digit phone', () => {
      expect(isValidPhone('1234567890')).toBe(true)
    })

    it('accepts formatted phone', () => {
      expect(isValidPhone('123-456-7890')).toBe(true)
    })

    it('rejects short phone', () => {
      expect(isValidPhone('123456789')).toBe(false)
    })
  })
})

describe('validateTestator', () => {
  const validTestator = {
    fullName: 'John Smith',
    address: '123 Main St',
    city: 'Miami',
    zip: '33101',
    county: 'Miami-Dade',
    maritalStatus: 'single',
    spouseName: '',
    residenceState: 'FL',
  }

  it('returns no errors for valid testator', () => {
    const errors = validateTestator(validTestator)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires residenceState', () => {
    const errors = validateTestator({ ...validTestator, residenceState: '' })
    expect(errors.residenceState).toBeDefined()
  })

  it('accepts valid state codes', () => {
    const errors = validateTestator({ ...validTestator, residenceState: 'CA' })
    expect(errors.residenceState).toBeUndefined()
  })

  it('shows parish error message for Louisiana', () => {
    const errors = validateTestator({ ...validTestator, residenceState: 'LA', county: '' })
    expect(errors.county).toBe('Parish is required')
  })

  it('requires fullName', () => {
    const errors = validateTestator({ ...validTestator, fullName: '' })
    expect(errors.fullName).toBeDefined()
  })

  it('requires address', () => {
    const errors = validateTestator({ ...validTestator, address: '' })
    expect(errors.address).toBeDefined()
  })

  it('requires city', () => {
    const errors = validateTestator({ ...validTestator, city: '' })
    expect(errors.city).toBeDefined()
  })

  it('requires valid ZIP', () => {
    const errors = validateTestator({ ...validTestator, zip: '1234' })
    expect(errors.zip).toBeDefined()
  })

  it('requires county', () => {
    const errors = validateTestator({ ...validTestator, county: '' })
    expect(errors.county).toBeDefined()
  })

  it('requires spouse name when married', () => {
    const errors = validateTestator({
      ...validTestator,
      maritalStatus: 'married',
      spouseName: '',
    })
    expect(errors.spouseName).toBeDefined()
  })

  it('does not require spouse name when single', () => {
    const errors = validateTestator({
      ...validTestator,
      maritalStatus: 'single',
      spouseName: '',
    })
    expect(errors.spouseName).toBeUndefined()
  })
})

describe('validateExecutor', () => {
  const validExecutor = {
    name: 'Jane Doe',
    relationship: 'Sister',
    address: '456 Oak St',
    city: 'Orlando',
    state: 'FL',
    zip: '32801',
  }

  it('returns no errors for valid executor', () => {
    const errors = validateExecutor(validExecutor)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires name', () => {
    const errors = validateExecutor({ ...validExecutor, name: '' })
    expect(errors.name).toBeDefined()
  })

  it('requires relationship', () => {
    const errors = validateExecutor({ ...validExecutor, relationship: '' })
    expect(errors.relationship).toBeDefined()
  })

  it('requires state', () => {
    const errors = validateExecutor({ ...validExecutor, state: '' })
    expect(errors.state).toBeDefined()
  })
})

describe('validateChildren', () => {
  it('returns no errors for empty children array', () => {
    const errors = validateChildren([], {})
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires child name', () => {
    const errors = validateChildren([{ name: '', isMinor: false }], {})
    expect(errors['child_0_name']).toBeDefined()
  })

  it('recommends guardian for minor children', () => {
    const errors = validateChildren([{ name: 'Child', isMinor: true }], { name: '' })
    expect(errors['guardian.name']).toBeDefined()
  })

  it('does not require guardian for adult children', () => {
    const errors = validateChildren([{ name: 'Adult Child', isMinor: false }], { name: '' })
    expect(errors['guardian.name']).toBeUndefined()
  })
})

describe('validateGifts', () => {
  it('returns no errors for empty gifts array', () => {
    const errors = validateGifts([])
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires gift description', () => {
    const errors = validateGifts([{ description: '', beneficiary: 'John' }])
    expect(errors['gift_0_description']).toBeDefined()
  })

  it('requires gift beneficiary', () => {
    const errors = validateGifts([{ description: 'Car', beneficiary: '' }])
    expect(errors['gift_0_beneficiary']).toBeDefined()
  })

  it('validates multiple gifts', () => {
    const errors = validateGifts([
      { description: '', beneficiary: '' },
      { description: '', beneficiary: '' },
    ])
    expect(errors['gift_0_description']).toBeDefined()
    expect(errors['gift_1_description']).toBeDefined()
  })
})

describe('validateDistribution', () => {
  const marriedTestator = { maritalStatus: 'married', spouseName: 'Jane Smith' }
  const singleTestator = { maritalStatus: 'single' }
  const childrenArray = [{ name: 'Child 1' }, { name: 'Child 2' }]

  it('returns no errors for spouse distribution when married', () => {
    const errors = validateDistribution({ distributionType: 'spouse' }, marriedTestator, [])
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('returns error for spouse distribution when not married', () => {
    const errors = validateDistribution({ distributionType: 'spouse' }, singleTestator, [])
    expect(errors.distributionType).toBeDefined()
    expect(errors.distributionType).toContain('married status')
  })

  it('returns error for children distribution when no children', () => {
    const errors = validateDistribution({ distributionType: 'children' }, singleTestator, [])
    expect(errors.distributionType).toBeDefined()
    expect(errors.distributionType).toContain('at least one child')
  })

  it('returns no errors for children distribution when has children', () => {
    const errors = validateDistribution(
      { distributionType: 'children' },
      singleTestator,
      childrenArray
    )
    expect(errors.distributionType).toBeUndefined()
  })

  it('returns error for split distribution when not married', () => {
    const errors = validateDistribution(
      { distributionType: 'split', spouseShare: 50, childrenShare: 50 },
      singleTestator,
      childrenArray
    )
    expect(errors.distributionType).toBeDefined()
    expect(errors.distributionType).toContain('married status')
  })

  it('returns error for split distribution when no children', () => {
    const errors = validateDistribution(
      { distributionType: 'split', spouseShare: 50, childrenShare: 50 },
      marriedTestator,
      []
    )
    expect(errors.distributionType).toBeDefined()
    expect(errors.distributionType).toContain('at least one child')
  })

  it('validates split shares total 100 when valid situation', () => {
    const errors = validateDistribution(
      { distributionType: 'split', spouseShare: 50, childrenShare: 30 },
      marriedTestator,
      childrenArray
    )
    expect(errors.distribution).toBeDefined()
  })

  it('accepts split shares totaling 100 when valid situation', () => {
    const errors = validateDistribution(
      { distributionType: 'split', spouseShare: 60, childrenShare: 40 },
      marriedTestator,
      childrenArray
    )
    expect(errors.distribution).toBeUndefined()
    expect(errors.distributionType).toBeUndefined()
  })

  it('requires at least one custom beneficiary', () => {
    const errors = validateDistribution(
      { distributionType: 'custom', customBeneficiaries: [] },
      singleTestator,
      []
    )
    expect(errors.customBeneficiaries).toBeDefined()
  })

  it('validates custom shares total 100', () => {
    const errors = validateDistribution(
      {
        distributionType: 'custom',
        customBeneficiaries: [
          { name: 'Person A', share: 30 },
          { name: 'Person B', share: 30 },
        ],
      },
      singleTestator,
      []
    )
    expect(errors.customBeneficiaries).toBeDefined()
  })

  it('requires beneficiary names', () => {
    const errors = validateDistribution(
      { distributionType: 'custom', customBeneficiaries: [{ name: '', share: 100 }] },
      singleTestator,
      []
    )
    expect(errors['custom_0_name']).toBeDefined()
  })

  it('works with default parameters for backward compatibility', () => {
    // Should not throw when called with just residuaryEstate
    const errors = validateDistribution({ distributionType: 'custom', customBeneficiaries: [] })
    expect(errors.customBeneficiaries).toBeDefined()
  })
})

describe('validateAdditionalProvisions', () => {
  it('returns no errors when provisions are disabled', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      customProvisions: { include: false },
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires pet caretaker when pets included', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: true, items: [{ name: 'Fluffy', caretaker: '' }] },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      customProvisions: { include: false },
    })
    expect(errors['pet_0_caretaker']).toBeDefined()
  })

  it('requires property address and beneficiary', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: true, items: [{ address: '', beneficiary: '' }] },
      debtsAndTaxes: { include: false },
      customProvisions: { include: false },
    })
    expect(errors['property_0_address']).toBeDefined()
    expect(errors['property_0_beneficiary']).toBeDefined()
  })

  it('requires custom provision title and content when enabled', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      customProvisions: { include: true, items: [{ title: '', content: '' }] },
    })
    expect(errors['customProvision_0_title']).toBeDefined()
    expect(errors['customProvision_0_content']).toBeDefined()
  })

  it('returns no errors for valid custom provisions', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      customProvisions: {
        include: true,
        items: [{ title: 'Business Instructions', content: 'My business shall be handled...' }],
      },
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('validates multiple custom provisions', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      customProvisions: {
        include: true,
        items: [
          { title: '', content: 'Some content' },
          { title: 'Valid Title', content: '' },
        ],
      },
    })
    expect(errors['customProvision_0_title']).toBeDefined()
    expect(errors['customProvision_0_content']).toBeUndefined()
    expect(errors['customProvision_1_title']).toBeUndefined()
    expect(errors['customProvision_1_content']).toBeDefined()
  })

  it('returns no errors when custom provisions disabled even with invalid items', () => {
    const errors = validateAdditionalProvisions({
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      customProvisions: { include: false, items: [{ title: '', content: '' }] },
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('validateDisinheritance', () => {
  it('returns no errors when disabled', () => {
    const errors = validateDisinheritance({ include: false })
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('requires person name and relationship when enabled', () => {
    const errors = validateDisinheritance({
      include: true,
      persons: [{ name: '', relationship: '' }],
    })
    expect(errors['disinherit_0_name']).toBeDefined()
    expect(errors['disinherit_0_relationship']).toBeDefined()
  })
})

describe('validateReview', () => {
  it('requires testator name', () => {
    const errors = validateReview({
      testator: { fullName: '' },
      executor: { name: 'Jane' },
    })
    expect(errors.testator).toBeDefined()
  })

  it('requires executor name', () => {
    const errors = validateReview({
      testator: { fullName: 'John' },
      executor: { name: '' },
    })
    expect(errors.executor).toBeDefined()
  })

  it('returns no errors when both present', () => {
    const errors = validateReview({
      testator: { fullName: 'John' },
      executor: { name: 'Jane' },
    })
    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('stepValidators', () => {
  it('has validators for all 8 steps', () => {
    expect(stepValidators[0]).toBeDefined()
    expect(stepValidators[1]).toBeDefined()
    expect(stepValidators[2]).toBeDefined()
    expect(stepValidators[3]).toBeDefined()
    expect(stepValidators[4]).toBeDefined()
    expect(stepValidators[5]).toBeDefined()
    expect(stepValidators[6]).toBeDefined()
    expect(stepValidators[7]).toBeDefined()
  })

  it('step validators are callable functions', () => {
    const mockFormData = {
      testator: { fullName: '' },
      executor: { name: '' },
      children: [],
      guardian: {},
      specificGifts: [],
      residuaryEstate: { distributionType: 'spouse' },
      digitalAssets: { include: false },
      pets: { include: false },
      funeral: { include: false },
      realProperty: { include: false },
      debtsAndTaxes: { include: false },
      disinheritance: { include: false },
    }

    for (let i = 0; i < 8; i++) {
      const result = stepValidators[i](mockFormData)
      expect(typeof result).toBe('object')
    }
  })
})
