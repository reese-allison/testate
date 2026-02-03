import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArrayField } from './useArrayField'

describe('useArrayField', () => {
  const createItem = () => ({ id: Date.now(), name: '' })

  it('returns initial items', () => {
    const items = [{ id: 1, name: 'Item 1' }]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    expect(result.current.items).toEqual(items)
    expect(result.current.count).toBe(1)
    expect(result.current.isEmpty).toBe(false)
  })

  it('reports isEmpty correctly', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField([], onChange, createItem))

    expect(result.current.isEmpty).toBe(true)
    expect(result.current.count).toBe(0)
  })

  it('adds new item', () => {
    const items = [{ id: 1, name: 'Item 1' }]
    const onChange = vi.fn()
    const mockCreateItem = vi.fn(() => ({ id: 2, name: 'New Item' }))
    const { result } = renderHook(() => useArrayField(items, onChange, mockCreateItem))

    act(() => {
      result.current.add()
    })

    expect(mockCreateItem).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalledWith([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'New Item' }
    ])
  })

  it('updates item field', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    act(() => {
      result.current.update(1, 'name', 'Updated Item 2')
    })

    expect(onChange).toHaveBeenCalledWith([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Updated Item 2' }
    ])
  })

  it('updates item with multiple fields', () => {
    const items = [{ id: 1, name: 'Item 1', value: 10 }]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    act(() => {
      result.current.updateItem(0, { name: 'New Name', value: 20 })
    })

    expect(onChange).toHaveBeenCalledWith([
      { id: 1, name: 'New Name', value: 20 }
    ])
  })

  it('removes item by index', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    act(() => {
      result.current.remove(1)
    })

    expect(onChange).toHaveBeenCalledWith([
      { id: 1, name: 'Item 1' },
      { id: 3, name: 'Item 3' }
    ])
  })

  it('moves item up in list', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    act(() => {
      result.current.move(2, 0)
    })

    expect(onChange).toHaveBeenCalledWith([
      { id: 3, name: 'Item 3' },
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ])
  })

  it('does not move item to invalid index', () => {
    const items = [{ id: 1, name: 'Item 1' }]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    act(() => {
      result.current.move(0, -1)
    })

    expect(onChange).not.toHaveBeenCalled()

    act(() => {
      result.current.move(0, 5)
    })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('clears all items', () => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]
    const onChange = vi.fn()
    const { result } = renderHook(() => useArrayField(items, onChange, createItem))

    act(() => {
      result.current.clear()
    })

    expect(onChange).toHaveBeenCalledWith([])
  })
})
