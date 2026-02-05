import { describe, it, expect } from 'vitest'
import { validateStep, validateFullForm, isStepComplete } from './validation'

const createEmptyFormData = () => ({
  testator: {
    fullName: '',
    address: '',
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
  },
  children: [],
  guardian: { name: '', relationship: '' },
  specificGifts: [],
  residuaryEstate: {
    distributionType: 'spouse',
    spouseShare: 100,
    childrenShare: 0,
    customBeneficiaries: [],
    perStirpes: true,
  },
  digitalAssets: { include: false, fiduciary: '' },
  pets: { include: false, items: [] },
  funeral: { include: false },
  disinheritance: { include: false, persons: [] },
})

describe('validateStep', () => {
  describe('Step 0 - Testator Info', () => {
    it('returns errors for empty required fields', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(0, formData)

      expect(errors.fullName).toBe('Full legal name is required')
      expect(errors.address).toBe('Address is required')
      expect(errors.city).toBe('City is required')
      expect(errors.zip).toBe('ZIP code is required')
      expect(errors.county).toBe('County is required')
    })

    it('returns no errors when all required fields are filled', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: '33101',
        county: 'Miami-Dade',
      }
      const errors = validateStep(0, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('validates ZIP code format - accepts 5 digits', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: '33101',
        county: 'Miami-Dade',
      }
      const errors = validateStep(0, formData)

      expect(errors.zip).toBeUndefined()
    })

    it('validates ZIP code format - accepts 5+4 digits', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: '33101-1234',
        county: 'Miami-Dade',
      }
      const errors = validateStep(0, formData)

      expect(errors.zip).toBeUndefined()
    })

    it('rejects invalid ZIP code - too short', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: '1234',
        county: 'Miami-Dade',
      }
      const errors = validateStep(0, formData)

      expect(errors.zip).toBe('Please enter a valid ZIP code (e.g., 33101 or 33101-1234)')
    })

    it('rejects invalid ZIP code - letters', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: 'abcde',
        county: 'Miami-Dade',
      }
      const errors = validateStep(0, formData)

      expect(errors.zip).toBe('Please enter a valid ZIP code (e.g., 33101 or 33101-1234)')
    })

    it('requires spouse name when married', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: '33101',
        county: 'Miami-Dade',
        maritalStatus: 'married',
        spouseName: '',
      }
      const errors = validateStep(0, formData)

      expect(errors.spouseName).toBe("Spouse's name is required when married")
    })

    it('does not require spouse name when single', () => {
      const formData = createEmptyFormData()
      formData.testator = {
        ...formData.testator,
        fullName: 'John Smith',
        address: '123 Main St',
        city: 'Miami',
        zip: '33101',
        county: 'Miami-Dade',
        maritalStatus: 'single',
        spouseName: '',
      }
      const errors = validateStep(0, formData)

      expect(errors.spouseName).toBeUndefined()
    })
  })

  describe('Step 1 - Executor Info', () => {
    it('returns errors for empty required fields', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(1, formData)

      expect(errors.name).toBe('Personal Representative name is required')
      expect(errors.relationship).toBe('Relationship is required')
      expect(errors.address).toBe('Address is required')
      expect(errors.city).toBe('City is required')
      expect(errors.state).toBe('State is required')
      expect(errors.zip).toBe('ZIP code is required')
    })

    it('returns no errors when all required fields are filled', () => {
      const formData = createEmptyFormData()
      formData.executor = {
        name: 'Jane Doe',
        relationship: 'Sister',
        address: '456 Oak St',
        city: 'Orlando',
        state: 'Florida',
        zip: '32801',
      }
      const errors = validateStep(1, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })
  })

  describe('Step 2 - Children & Guardian', () => {
    it('returns no errors when no children', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(2, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns error when child has no name', () => {
      const formData = createEmptyFormData()
      formData.children = [{ name: '', isMinor: false }]
      const errors = validateStep(2, formData)

      expect(errors['child_0_name']).toBe('Child 1 name is required')
    })

    it('requires guardian for minor children', () => {
      const formData = createEmptyFormData()
      formData.children = [{ name: 'Tommy', isMinor: true }]
      formData.guardian = { name: '' }
      const errors = validateStep(2, formData)

      expect(errors['guardian.name']).toBe('A guardian is required when you have minor children')
    })

    it('does not require guardian for adult children', () => {
      const formData = createEmptyFormData()
      formData.children = [{ name: 'Adult Child', isMinor: false }]
      formData.guardian = { name: '' }
      const errors = validateStep(2, formData)

      expect(errors['guardian.name']).toBeUndefined()
    })
  })

  describe('Step 3 - Specific Gifts', () => {
    it('returns no errors when no gifts', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(3, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns errors when gift has missing fields', () => {
      const formData = createEmptyFormData()
      formData.specificGifts = [{ description: '', beneficiary: '' }]
      const errors = validateStep(3, formData)

      expect(errors['gift_0_description']).toBe('Gift 1 description is required')
      expect(errors['gift_0_beneficiary']).toBe('Gift 1 beneficiary is required')
    })

    it('returns no errors when gift is complete', () => {
      const formData = createEmptyFormData()
      formData.specificGifts = [{ description: 'Car', beneficiary: 'Son' }]
      const errors = validateStep(3, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })
  })

  describe('Step 4 - Estate Distribution', () => {
    it('returns no errors for spouse distribution when married', () => {
      const formData = createEmptyFormData()
      formData.testator.maritalStatus = 'married'
      formData.testator.spouseName = 'Jane Smith'
      formData.residuaryEstate.distributionType = 'spouse'
      const errors = validateStep(4, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns error for spouse distribution when not married', () => {
      const formData = createEmptyFormData()
      formData.testator.maritalStatus = 'single'
      formData.residuaryEstate.distributionType = 'spouse'
      const errors = validateStep(4, formData)

      expect(errors.distributionType).toBeDefined()
      expect(errors.distributionType).toContain('married status')
    })

    it('returns error when split shares do not total 100', () => {
      const formData = createEmptyFormData()
      formData.testator.maritalStatus = 'married'
      formData.testator.spouseName = 'Jane Smith'
      formData.children = [{ name: 'Child 1' }]
      formData.residuaryEstate = {
        distributionType: 'split',
        spouseShare: 50,
        childrenShare: 30,
      }
      const errors = validateStep(4, formData)

      expect(errors.distribution).toBe('Spouse and children shares must total 100%')
    })

    it('returns no error when split shares total 100', () => {
      const formData = createEmptyFormData()
      formData.testator.maritalStatus = 'married'
      formData.testator.spouseName = 'Jane Smith'
      formData.children = [{ name: 'Child 1' }]
      formData.residuaryEstate = {
        distributionType: 'split',
        spouseShare: 60,
        childrenShare: 40,
      }
      const errors = validateStep(4, formData)

      expect(errors.distribution).toBeUndefined()
    })

    it('returns error when custom distribution has no beneficiaries', () => {
      const formData = createEmptyFormData()
      formData.residuaryEstate = {
        distributionType: 'custom',
        customBeneficiaries: [],
      }
      const errors = validateStep(4, formData)

      expect(errors.customBeneficiaries).toBe('Please add at least one beneficiary')
    })

    it('returns error when custom shares do not total 100', () => {
      const formData = createEmptyFormData()
      formData.residuaryEstate = {
        distributionType: 'custom',
        customBeneficiaries: [
          { name: 'Person A', share: 30 },
          { name: 'Person B', share: 30 },
        ],
      }
      const errors = validateStep(4, formData)

      expect(errors.customBeneficiaries).toBe('Beneficiary shares must total 100%')
    })

    it('returns no error when custom shares total 100', () => {
      const formData = createEmptyFormData()
      formData.residuaryEstate = {
        distributionType: 'custom',
        customBeneficiaries: [
          { name: 'Person A', share: 50 },
          { name: 'Person B', share: 50 },
        ],
      }
      const errors = validateStep(4, formData)

      expect(errors.customBeneficiaries).toBeUndefined()
    })
  })

  describe('Step 5 - Additional Provisions', () => {
    it('returns no errors when provisions are disabled', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(5, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns error when pet has no caretaker', () => {
      const formData = createEmptyFormData()
      formData.pets = {
        include: true,
        items: [{ name: 'Fluffy', caretaker: '' }],
      }
      const errors = validateStep(5, formData)

      expect(errors['pet_0_caretaker']).toBe('Pet 1 caretaker is required')
    })

    it('returns no error when pet has caretaker', () => {
      const formData = createEmptyFormData()
      formData.pets = {
        include: true,
        items: [{ name: 'Fluffy', caretaker: 'Uncle Bob' }],
      }
      const errors = validateStep(5, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })
  })

  describe('Step 6 - Disinheritance', () => {
    it('returns no errors when disinheritance is disabled', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(6, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })

    it('returns errors when disinherited person has missing fields', () => {
      const formData = createEmptyFormData()
      formData.disinheritance = {
        include: true,
        persons: [{ name: '', relationship: '' }],
      }
      const errors = validateStep(6, formData)

      expect(errors['disinherit_0_name']).toBe('Person 1 name is required')
      expect(errors['disinherit_0_relationship']).toBe('Person 1 relationship is required')
    })

    it('returns no errors when disinherited person is complete', () => {
      const formData = createEmptyFormData()
      formData.disinheritance = {
        include: true,
        persons: [{ name: 'John Doe', relationship: 'Brother' }],
      }
      const errors = validateStep(6, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })
  })

  describe('Step 7 - Review', () => {
    it('returns error when testator info is incomplete', () => {
      const formData = createEmptyFormData()
      const errors = validateStep(7, formData)

      expect(errors.testator).toBe('Testator information is incomplete')
    })

    it('returns error when executor info is incomplete', () => {
      const formData = createEmptyFormData()
      formData.testator.fullName = 'John Smith'
      const errors = validateStep(7, formData)

      expect(errors.executor).toBe('Personal Representative information is incomplete')
    })

    it('returns no errors when testator and executor are complete', () => {
      const formData = createEmptyFormData()
      formData.testator.fullName = 'John Smith'
      formData.executor.name = 'Jane Doe'
      const errors = validateStep(7, formData)

      expect(Object.keys(errors)).toHaveLength(0)
    })
  })
})

describe('validateFullForm', () => {
  it('returns all errors across all steps', () => {
    const formData = createEmptyFormData()
    const errors = validateFullForm(formData)

    expect(errors.fullName).toBeDefined()
    expect(errors.name).toBeDefined()
    expect(errors.testator).toBeDefined()
    expect(errors.executor).toBeDefined()
  })

  it('returns empty object when form is complete', () => {
    const formData = createEmptyFormData()
    formData.testator = {
      fullName: 'John Smith',
      address: '123 Main St',
      city: 'Miami',
      state: 'Florida',
      zip: '33101',
      county: 'Miami-Dade',
      maritalStatus: 'single',
      spouseName: '',
      residenceState: 'FL',
    }
    formData.executor = {
      name: 'Jane Doe',
      relationship: 'Sister',
      address: '456 Oak St',
      city: 'Orlando',
      state: 'Florida',
      zip: '32801',
    }
    // Use custom distribution for single testator (spouse distribution requires married)
    formData.residuaryEstate = {
      distributionType: 'custom',
      customBeneficiaries: [{ name: 'Jane Doe', share: 100 }],
    }
    const errors = validateFullForm(formData)

    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('isStepComplete', () => {
  it('returns false when step has errors', () => {
    const formData = createEmptyFormData()
    expect(isStepComplete(0, formData)).toBe(false)
  })

  it('returns true when step has no errors', () => {
    const formData = createEmptyFormData()
    formData.testator = {
      fullName: 'John Smith',
      address: '123 Main St',
      city: 'Miami',
      state: 'Florida',
      zip: '33101',
      county: 'Miami-Dade',
      maritalStatus: 'single',
      spouseName: '',
      residenceState: 'FL',
    }
    expect(isStepComplete(0, formData)).toBe(true)
  })
})
