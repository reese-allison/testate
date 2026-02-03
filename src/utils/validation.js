import { stepValidators } from './validators'

/**
 * Validate a specific step of the form
 * Uses modular validators from validators.js
 *
 * @param {number} stepIndex - The step to validate (0-7)
 * @param {Object} formData - The complete form data
 * @returns {Object} Errors object with field names as keys
 */
export function validateStep(stepIndex, formData) {
  const validator = stepValidators[stepIndex]
  if (validator) {
    return validator(formData)
  }
  return {}
}

export function validateFullForm(formData) {
  let allErrors = {}

  for (let i = 0; i < 8; i++) {
    const stepErrors = validateStep(i, formData)
    allErrors = { ...allErrors, ...stepErrors }
  }

  return allErrors
}

export function isStepComplete(stepIndex, formData) {
  const errors = validateStep(stepIndex, formData)
  return Object.keys(errors).length === 0
}

export default validateStep
