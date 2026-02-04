import { useState, useEffect } from 'react'

// Deep merge helper to combine stored data with initial state
// This ensures new fields are added when the app updates
function deepMerge(initial, stored) {
  if (stored === null || stored === undefined) {
    return initial
  }
  if (typeof initial !== 'object' || initial === null) {
    return stored
  }
  if (Array.isArray(initial)) {
    return Array.isArray(stored) ? stored : initial
  }

  const result = { ...initial }
  for (const key of Object.keys(stored)) {
    if (key in initial) {
      result[key] = deepMerge(initial[key], stored[key])
    } else {
      result[key] = stored[key]
    }
  }
  return result
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        // Merge stored value with initial value to handle new fields
        return deepMerge(initialValue, parsed)
      }
      return initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [key, storedValue])

  const clearStorage = () => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }

  return [storedValue, setStoredValue, clearStorage]
}

export default useLocalStorage
