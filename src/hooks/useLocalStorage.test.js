import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))

    expect(result.current[0]).toBe('initial')
  })

  it('updates state when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))

    act(() => {
      result.current[1]('new value')
    })

    expect(result.current[0]).toBe('new value')
  })

  it('persists value to localStorage', async () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))

    act(() => {
      result.current[1]('new value')
    })

    await waitFor(() => {
      const stored = localStorage.getItem('testKey')
      expect(stored).toBe('"new value"')
    })
  })

  it('handles object values', () => {
    const initialObject = { name: 'John', age: 30 }
    const { result } = renderHook(() => useLocalStorage('testKey', initialObject))

    expect(result.current[0]).toEqual(initialObject)

    act(() => {
      result.current[1]({ name: 'Jane', age: 25 })
    })

    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 })
  })

  it('clears storage and resets to initial value', async () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))

    act(() => {
      result.current[1]('stored')
    })

    expect(result.current[0]).toBe('stored')

    act(() => {
      result.current[2]() // clearStorage
    })

    // Value resets to initial
    expect(result.current[0]).toBe('initial')
    // After the effect runs, localStorage will have the initial value
    // (consistent persistence of current state)
    await waitFor(() => {
      expect(localStorage.getItem('testKey')).toBe('"initial"')
    })
  })

  it('handles invalid data in localStorage gracefully', () => {
    localStorage.setItem('testKey', 'invalid json {{{')

    const { result } = renderHook(() => useLocalStorage('testKey', 'fallback'))

    expect(result.current[0]).toBe('fallback')
  })

  it('handles array values', () => {
    const initialArray = [1, 2, 3]
    const { result } = renderHook(() => useLocalStorage('testKey', initialArray))

    expect(result.current[0]).toEqual(initialArray)

    act(() => {
      result.current[1]([...result.current[0], 4])
    })

    expect(result.current[0]).toEqual([1, 2, 3, 4])
  })

  it('uses functional updates correctly', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1](prev => prev + 5)
    })

    expect(result.current[0]).toBe(6)
  })

  it('reads existing data from localStorage', () => {
    localStorage.setItem('testKey', JSON.stringify({ name: 'Existing' }))

    const { result } = renderHook(() => useLocalStorage('testKey', { name: 'Default' }))

    expect(result.current[0]).toEqual({ name: 'Existing' })
  })

  describe('deep merge with initial value', () => {
    it('adds new fields from initial value when stored data is missing them', async () => {
      // First, create a hook and save some data
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useLocalStorage('testKey', { name: '', age: 0 })
      )

      act(() => {
        result1.current[1]({ name: 'John', age: 30 })
      })

      await waitFor(() => {
        expect(localStorage.getItem('testKey')).not.toBeNull()
      })

      unmount1()

      // Now create a new hook with additional fields in initial value
      const initialValue = {
        name: '',
        age: 0,
        newField: 'default value',
      }

      const { result: result2 } = renderHook(() => useLocalStorage('testKey', initialValue))

      // Should have stored values plus new field with default
      expect(result2.current[0]).toEqual({
        name: 'John',
        age: 30,
        newField: 'default value',
      })
    })

    it('preserves arrays from stored data', async () => {
      // First, create and populate the storage
      const { result: result1, unmount: unmount1 } = renderHook(() =>
        useLocalStorage('testKey', { items: [] })
      )

      act(() => {
        result1.current[1]({ items: [1, 2, 3] })
      })

      await waitFor(() => {
        expect(localStorage.getItem('testKey')).not.toBeNull()
      })

      unmount1()

      // Now access with expanded initial value
      const initialValue = {
        items: [],
        newItems: ['a', 'b'],
      }

      const { result: result2 } = renderHook(() => useLocalStorage('testKey', initialValue))

      expect(result2.current[0]).toEqual({
        items: [1, 2, 3],
        newItems: ['a', 'b'],
      })
    })
  })

  describe('data storage', () => {
    it('stores data as plain JSON', async () => {
      const { result } = renderHook(() => useLocalStorage('testKey', 'secret data'))

      act(() => {
        result.current[1]('sensitive information')
      })

      await waitFor(() => {
        const stored = localStorage.getItem('testKey')
        expect(stored).toBe('"sensitive information"')
      })
    })

    it('reads plain JSON data from localStorage', () => {
      localStorage.setItem('testKey', '"my data"')

      const { result } = renderHook(() => useLocalStorage('testKey', ''))

      expect(result.current[0]).toBe('my data')
    })
  })
})
