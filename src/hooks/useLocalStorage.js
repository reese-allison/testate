import { useState, useEffect, useCallback } from 'react'

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
      if (!item) {
        return initialValue
      }
      const parsed = JSON.parse(item)
      return deepMerge(initialValue, parsed)
    } catch {
      return initialValue
    }
  })

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Ignore write errors (e.g., quota exceeded)
    }
  }, [key, storedValue])

  const clearStorage = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {
      // Ignore errors
    }
  }, [key, initialValue])

  return [storedValue, setStoredValue, clearStorage]
}
