import { useCallback } from 'react'

/**
 * Custom hook for managing array fields in forms
 * Reduces boilerplate for add/update/remove operations
 *
 * @param {Array} items - Current array items
 * @param {Function} onChange - Callback when array changes
 * @param {Function} createItem - Factory function to create new item
 * @returns {Object} Array management functions
 */
export function useArrayField(items, onChange, createItem) {
  const add = useCallback(() => {
    onChange([...items, createItem()])
  }, [items, onChange, createItem])

  const update = useCallback((index, field, value) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }, [items, onChange])

  const updateItem = useCallback((index, updates) => {
    const updated = [...items]
    updated[index] = { ...updated[index], ...updates }
    onChange(updated)
  }, [items, onChange])

  const remove = useCallback((index) => {
    onChange(items.filter((_, i) => i !== index))
  }, [items, onChange])

  const move = useCallback((fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= items.length) return
    const updated = [...items]
    const [removed] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, removed)
    onChange(updated)
  }, [items, onChange])

  const clear = useCallback(() => {
    onChange([])
  }, [onChange])

  return {
    items,
    add,
    update,
    updateItem,
    remove,
    move,
    clear,
    isEmpty: items.length === 0,
    count: items.length
  }
}

export default useArrayField
