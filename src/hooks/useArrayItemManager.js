import { useCallback } from 'react'

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

/**
 * Item factory functions for creating new array items with proper structure
 */
export const itemFactories = {
  gift: () => ({
    id: generateId(),
    type: 'cash',
    description: '',
    beneficiary: '',
    beneficiaryRelationship: '',
    alternativeBeneficiary: '',
    conditions: '',
  }),

  child: () => ({
    id: generateId(),
    name: '',
    dateOfBirth: '',
    isMinor: true,
    relationship: 'biological',
  }),

  pet: () => ({
    id: generateId(),
    name: '',
    type: '',
    caretaker: '',
    alternateCaretaker: '',
    funds: '',
    instructions: '',
  }),

  property: () => ({
    id: generateId(),
    address: '',
    description: '',
    beneficiary: '',
    instructions: '',
  }),

  customBeneficiary: () => ({
    id: generateId(),
    name: '',
    relationship: '',
    share: '',
  }),

  customProvision: () => ({
    id: generateId(),
    title: '',
    content: '',
  }),

  disinheritPerson: () => ({
    id: generateId(),
    name: '',
    relationship: '',
    reason: '',
  }),
}

/**
 * Custom hook to manage array items (add, update, remove)
 * Reduces code duplication across step components
 *
 * @param {string} section - The form section key (e.g., 'specificGifts', 'children')
 * @param {Array} data - Current array data
 * @param {Function} onChange - Callback to update the array (typically from WillGenerator)
 * @param {string} itemType - Type of item to create (key in itemFactories)
 * @param {string} [nestedField] - Optional nested field name for patterns like onChange('pets', 'items', [...])
 * @returns {Object} Object with addItem, updateItem, removeItem functions
 */
export function useArrayItemManager(section, data, onChange, itemType, nestedField = null) {
  // Helper to call onChange with correct arguments based on whether nestedField is used
  const callOnChange = useCallback(
    newArray => {
      if (nestedField) {
        onChange(section, nestedField, newArray)
      } else {
        onChange(section, newArray)
      }
    },
    [section, nestedField, onChange]
  )

  const addItem = useCallback(() => {
    const factory = itemFactories[itemType]
    if (!factory) {
      throw new Error(`Unknown item type: ${itemType}`)
    }
    const newItem = factory()
    callOnChange([...(data || []), newItem])
  }, [data, itemType, callOnChange])

  const updateItem = useCallback(
    (index, field, value) => {
      const updated = [...(data || [])]
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value }
        callOnChange(updated)
      }
    },
    [data, callOnChange]
  )

  const removeItem = useCallback(
    index => {
      callOnChange((data || []).filter((_, i) => i !== index))
    },
    [data, callOnChange]
  )

  return { addItem, updateItem, removeItem }
}
