/**
 * Modular validation functions for each form step
 * Each validator returns an errors object with field names as keys
 */

// Epsilon for floating-point comparison (handles 99.99 + 0.01 = 100 cases)
const PERCENTAGE_EPSILON = 0.01

// Common validation helpers
export const isRequired = value => {
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined
}

export const isValidZip = zip => /^\d{5}(-\d{4})?$/.test(zip)

// Improved email validation - requires at least 2 chars in TLD
export const isValidEmail = email => {
  if (!email || typeof email !== 'string') return false
  if (email.length > 254) return false // RFC 5321 max length
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// Improved phone validation - accepts common formats
export const isValidPhone = phone => {
  if (!phone || typeof phone !== 'string') return false
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-().]/g, '')
  return /^\d{10}$/.test(cleaned)
}

// Helper to check if two numbers are approximately equal
const isApproximatelyEqual = (a, b, epsilon = PERCENTAGE_EPSILON) => Math.abs(a - b) < epsilon

/**
 * Step 0: Testator Information Validation
 */
export function validateTestator(testator) {
  const errors = {}

  if (!testator) {
    return { testator: 'Testator information is required' }
  }

  // Residence state is required for will jurisdiction
  if (!isRequired(testator.residenceState)) {
    errors.residenceState = 'State of residence is required'
  } else if (testator.residenceState === 'LA') {
    errors.residenceState =
      'Louisiana uses a Civil Law system that differs significantly from other states. Please consult with a Louisiana attorney for will preparation.'
  }

  if (!isRequired(testator.fullName)) {
    errors.fullName = 'Full legal name is required'
  }

  if (!isRequired(testator.address)) {
    errors.address = 'Address is required'
  }

  if (!isRequired(testator.city)) {
    errors.city = 'City is required'
  }

  if (!isRequired(testator.zip)) {
    errors.zip = 'ZIP code is required'
  } else if (!isValidZip(testator.zip)) {
    errors.zip = 'Please enter a valid ZIP code (e.g., 33101 or 33101-1234)'
  }

  if (!isRequired(testator.county)) {
    errors.county = testator.residenceState === 'LA' ? 'Parish is required' : 'County is required'
  }

  if (testator.maritalStatus === 'married' && !isRequired(testator.spouseName)) {
    errors.spouseName = "Spouse's name is required when married"
  }

  return errors
}

/**
 * Step 1: Executor Information Validation
 */
export function validateExecutor(executor) {
  const errors = {}

  if (!executor) {
    return { executor: 'Executor information is required' }
  }

  if (!isRequired(executor.name)) {
    errors.name = 'Personal Representative name is required'
  }

  if (!isRequired(executor.relationship)) {
    errors.relationship = 'Relationship is required'
  }

  if (!isRequired(executor.address)) {
    errors.address = 'Address is required'
  }

  if (!isRequired(executor.city)) {
    errors.city = 'City is required'
  }

  if (!isRequired(executor.state)) {
    errors.state = 'State is required'
  }

  if (!isRequired(executor.zip)) {
    errors.zip = 'ZIP code is required'
  } else if (!isValidZip(executor.zip)) {
    errors.zip = 'Please enter a valid ZIP code (e.g., 33101 or 33101-1234)'
  }

  return errors
}

/**
 * Step 2: Children & Guardian Validation
 */
export function validateChildren(children, guardian) {
  const errors = {}

  // Validate each child has a name
  children.forEach((child, i) => {
    if (!isRequired(child.name)) {
      errors[`child_${i}_name`] = `Child ${i + 1} name is required`
    }
  })

  // If there are minor children, guardian is required
  const hasMinors = children.some(c => c.isMinor)
  if (hasMinors && !isRequired(guardian?.name)) {
    errors['guardian.name'] = 'A guardian is required when you have minor children'
  }

  return errors
}

/**
 * Step 3: Specific Gifts Validation
 */
export function validateGifts(specificGifts) {
  const errors = {}

  if (!Array.isArray(specificGifts)) {
    return errors
  }

  specificGifts.forEach((gift, i) => {
    if (!isRequired(gift.description)) {
      errors[`gift_${i}_description`] = `Gift ${i + 1} description is required`
    }
    if (!isRequired(gift.beneficiary)) {
      errors[`gift_${i}_beneficiary`] = `Gift ${i + 1} beneficiary is required`
    }
  })

  return errors
}

/**
 * Step 4: Estate Distribution Validation
 * @param {Object} residuaryEstate - Distribution settings
 * @param {Object} testator - Testator info (for marital status check)
 * @param {Array} children - Children array (for children distribution check)
 */
export function validateDistribution(residuaryEstate, testator = {}, children = []) {
  const errors = {}

  if (!residuaryEstate) {
    return errors
  }

  const isMarried = testator.maritalStatus === 'married'
  const hasChildren = children.length > 0

  // Validate distribution type matches testator situation
  if (residuaryEstate.distributionType === 'spouse' && !isMarried) {
    errors.distributionType =
      'Spouse distribution requires married status. Please update your marital status or choose a different distribution method.'
  }

  if (residuaryEstate.distributionType === 'children' && !hasChildren) {
    errors.distributionType =
      'Children distribution requires at least one child. Please add children or choose a different distribution method.'
  }

  if (residuaryEstate.distributionType === 'split') {
    if (!isMarried) {
      errors.distributionType =
        'Split distribution requires married status. Please update your marital status or choose a different distribution method.'
    } else if (!hasChildren) {
      errors.distributionType =
        'Split distribution requires at least one child. Please add children or choose a different distribution method.'
    } else {
      const spouseShare = Number(residuaryEstate.spouseShare) || 0
      const childrenShare = Number(residuaryEstate.childrenShare) || 0
      const total = spouseShare + childrenShare

      // Validate shares are positive
      if (spouseShare <= 0 || childrenShare <= 0) {
        errors.distribution = 'Both spouse and children shares must be greater than 0%'
      } else if (!isApproximatelyEqual(total, 100)) {
        errors.distribution = 'Spouse and children shares must total 100%'
      }
    }
  }

  if (residuaryEstate.distributionType === 'custom') {
    const beneficiaries = residuaryEstate.customBeneficiaries || []
    const customTotal = beneficiaries.reduce((sum, b) => sum + (Number(b.share) || 0), 0)

    if (beneficiaries.length === 0) {
      errors.customBeneficiaries = 'Please add at least one beneficiary'
    } else {
      // Check for duplicate beneficiary names first
      const names = beneficiaries.map(b => b.name?.toLowerCase().trim()).filter(Boolean)
      const uniqueNames = new Set(names)
      if (names.length !== uniqueNames.size) {
        errors.customBeneficiaries = 'Beneficiary names must be unique to avoid legal ambiguity'
      } else if (!isApproximatelyEqual(customTotal, 100)) {
        errors.customBeneficiaries = 'Beneficiary shares must total 100%'
      }
    }

    beneficiaries.forEach((b, i) => {
      if (!isRequired(b.name)) {
        errors[`custom_${i}_name`] = `Beneficiary ${i + 1} name is required`
      }
      const share = Number(b.share) || 0
      if (share <= 0) {
        errors[`custom_${i}_share`] = `Beneficiary ${i + 1} share must be greater than 0%`
      }
    })
  }

  return errors
}

/**
 * Step 5: Additional Provisions Validation
 */
export function validateAdditionalProvisions(formData) {
  const errors = {}

  if (!formData) {
    return errors
  }

  const { pets, realProperty, customProvisions } = formData

  // Digital assets validation (optional but if included, fiduciary recommended)
  // Currently no required fields

  // Pet validation - caretaker required if pets included
  if (pets?.include) {
    pets.items?.forEach((pet, i) => {
      if (!isRequired(pet.caretaker)) {
        errors[`pet_${i}_caretaker`] = `Pet ${i + 1} caretaker is required`
      }
    })
  }

  // Real property validation
  if (realProperty?.include) {
    realProperty.items?.forEach((property, i) => {
      if (!isRequired(property.address)) {
        errors[`property_${i}_address`] = `Property ${i + 1} address is required`
      }
      if (!isRequired(property.beneficiary)) {
        errors[`property_${i}_beneficiary`] = `Property ${i + 1} beneficiary is required`
      }
    })
  }

  // Custom provisions validation - title and content required if include is true
  if (customProvisions?.include) {
    customProvisions.items?.forEach((provision, i) => {
      if (!isRequired(provision.title)) {
        errors[`customProvision_${i}_title`] = `Custom provision ${i + 1} title is required`
      }
      if (!isRequired(provision.content)) {
        errors[`customProvision_${i}_content`] = `Custom provision ${i + 1} content is required`
      }
    })
  }

  return errors
}

/**
 * Step 6: Disinheritance Validation
 */
export function validateDisinheritance(disinheritance) {
  const errors = {}

  if (disinheritance?.include) {
    disinheritance.persons?.forEach((person, i) => {
      if (!isRequired(person.name)) {
        errors[`disinherit_${i}_name`] = `Person ${i + 1} name is required`
      }
      if (!isRequired(person.relationship)) {
        errors[`disinherit_${i}_relationship`] = `Person ${i + 1} relationship is required`
      }
    })
  }

  return errors
}

/**
 * Step 7: Review - Final validation check
 */
export function validateReview(formData) {
  const errors = {}

  // Final validation - check all required fields
  if (!isRequired(formData.testator?.fullName)) {
    errors.testator = 'Testator information is incomplete'
  }

  if (!isRequired(formData.executor?.name)) {
    errors.executor = 'Personal Representative information is incomplete'
  }

  return errors
}

/**
 * Map of step index to validator function
 */
export const stepValidators = {
  0: formData => validateTestator(formData.testator),
  1: formData => validateExecutor(formData.executor),
  2: formData => validateChildren(formData.children, formData.guardian),
  3: formData => validateGifts(formData.specificGifts),
  4: formData =>
    validateDistribution(formData.residuaryEstate, formData.testator, formData.children),
  5: formData => validateAdditionalProvisions(formData),
  6: formData => validateDisinheritance(formData.disinheritance),
  7: formData => validateReview(formData),
}

/**
 * Step 2 Extended: Children Warnings
 * Returns warnings (not errors) for stepchildren
 */
export function getChildrenWarnings(formData) {
  const warnings = []
  const { children } = formData

  // Warning: Stepchildren included
  const hasStepchildren = children?.some(c => c.relationship === 'stepchild')
  if (hasStepchildren) {
    warnings.push({
      field: 'stepchildren',
      message:
        'Stepchildren do not have automatic inheritance rights unless legally adopted. If you want your stepchildren to inherit, you must explicitly name them as beneficiaries in the estate distribution or specific gifts sections.',
    })
  }

  return warnings
}

/**
 * Step 4 Extended: Estate Distribution Warnings
 * Returns warnings (not errors) for conflict situations
 */
export function getDistributionWarnings(formData) {
  const warnings = []
  const { residuaryEstate, executor } = formData

  // Warning: Executor is primary beneficiary
  if (residuaryEstate?.distributionType === 'custom') {
    const executorIsBeneficiary = residuaryEstate.customBeneficiaries?.some(
      b => b.name?.toLowerCase().trim() === executor?.name?.toLowerCase().trim()
    )
    if (executorIsBeneficiary) {
      warnings.push({
        field: 'executor_beneficiary',
        message:
          'Your Personal Representative is also a primary beneficiary. While this is legally permitted in most states, it may create a potential conflict of interest.',
      })
    }
  }

  return warnings
}

/**
 * Step 6 Extended: Disinheritance Warnings
 * Returns warnings for spouse disinheritance and general guidance
 */
export function getDisinheritanceWarnings(formData) {
  const warnings = []
  const { disinheritance, testator } = formData

  if (!disinheritance?.include || !disinheritance?.persons?.length) {
    return warnings
  }

  // Warning: Spouse disinheritance
  const disinheritingSpouse =
    testator?.maritalStatus === 'married' &&
    disinheritance.persons.some(
      p =>
        p.relationship?.toLowerCase().includes('spouse') ||
        p.name?.toLowerCase().trim() === testator?.spouseName?.toLowerCase().trim()
    )

  if (disinheritingSpouse) {
    warnings.push({
      field: 'spouse_disinheritance',
      message:
        'Disinheriting a spouse may be ineffective. Most states grant surviving spouses an "elective share" (typically 30-50% of the estate) that overrides will provisions. The will text will include a disclaimer acknowledging this.',
    })
  }

  // General warning about beneficiary conflicts
  warnings.push({
    field: 'beneficiary_disinheritance_conflict',
    message:
      'Do not list someone as both a beneficiary and a disinherited person. This creates a legal contradiction that would invalidate those provisions.',
  })

  return warnings
}

/**
 * Map of step index to warning function
 */
export const stepWarnings = {
  2: formData => getChildrenWarnings(formData),
  4: formData => getDistributionWarnings(formData),
  6: formData => getDisinheritanceWarnings(formData),
}

/**
 * Validates that the will text does not contain unresolved placeholders
 * @param {string} willText - The generated will text to check
 * @returns {Object} errors object with placeholder field if issues found
 */
export function validateNoPlaceholders(willText) {
  const errors = {}
  if (!willText || typeof willText !== 'string') {
    return errors
  }

  const placeholderPattern = /\[([A-Z_\s]+)\]/g
  const matches = willText.match(placeholderPattern)

  if (matches && matches.length > 0) {
    // Filter out intentional placeholders like [NOTARY SEAL]
    const ignoredPlaceholders = ['NOTARY SEAL']
    const realPlaceholders = matches.filter(
      m => !ignoredPlaceholders.includes(m.replace(/[[\]]/g, ''))
    )

    if (realPlaceholders.length > 0) {
      const uniquePlaceholders = [...new Set(realPlaceholders)]
      errors.placeholders = `Your will contains incomplete fields: ${uniquePlaceholders.join(', ')}. Please go back and fill in all required information.`
    }
  }
  return errors
}
