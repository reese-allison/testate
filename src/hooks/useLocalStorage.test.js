import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initial')
    )

    expect(result.current[0]).toBe('initial')
  })

  it('returns stored value when localStorage has data', () => {
    localStorage.setItem('testKey', JSON.stringify('stored value'))

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initial')
    )

    expect(result.current[0]).toBe('stored value')
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initial')
    )

    act(() => {
      result.current[1]('new value')
    })

    expect(result.current[0]).toBe('new value')
    expect(JSON.parse(localStorage.getItem('testKey'))).toBe('new value')
  })

  it('handles object values', () => {
    const initialObject = { name: 'John', age: 30 }
    const { result } = renderHook(() =>
      useLocalStorage('testKey', initialObject)
    )

    expect(result.current[0]).toEqual(initialObject)

    act(() => {
      result.current[1]({ name: 'Jane', age: 25 })
    })

    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 })
  })

  it('clears storage and resets to initial value', () => {
    localStorage.setItem('testKey', JSON.stringify('stored'))

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initial')
    )

    expect(result.current[0]).toBe('stored')

    act(() => {
      result.current[2]() // clearStorage
    })

    // Value resets to initial
    expect(result.current[0]).toBe('initial')
    // Note: useEffect will re-sync 'initial' back to localStorage
    expect(JSON.parse(localStorage.getItem('testKey'))).toBe('initial')
  })

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('testKey', 'invalid json {')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'fallback')
    )

    expect(result.current[0]).toBe('fallback')
    consoleSpy.mockRestore()
  })

  it('handles array values', () => {
    const initialArray = [1, 2, 3]
    const { result } = renderHook(() =>
      useLocalStorage('testKey', initialArray)
    )

    expect(result.current[0]).toEqual(initialArray)

    act(() => {
      result.current[1]([...result.current[0], 4])
    })

    expect(result.current[0]).toEqual([1, 2, 3, 4])
  })

  it('uses functional updates correctly', () => {
    const { result } = renderHook(() =>
      useLocalStorage('counter', 0)
    )

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1](prev => prev + 5)
    })

    expect(result.current[0]).toBe(6)
  })
})
