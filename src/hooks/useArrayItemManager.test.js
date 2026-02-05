import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useArrayItemManager, itemFactories } from './useArrayItemManager'

describe('useArrayItemManager', () => {
  let mockOnChange

  beforeEach(() => {
    mockOnChange = vi.fn()
    vi.clearAllMocks()
  })

  describe('itemFactories', () => {
    it('creates gift item with correct structure', () => {
      const gift = itemFactories.gift()
      expect(gift).toMatchObject({
        type: 'cash',
        description: '',
        beneficiary: '',
        beneficiaryRelationship: '',
        alternativeBeneficiary: '',
        conditions: '',
      })
      expect(gift.id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('creates child item with correct structure', () => {
      const child = itemFactories.child()
      expect(child).toMatchObject({
        name: '',
        dateOfBirth: '',
        isMinor: true,
        relationship: 'biological',
      })
      expect(child.id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('creates pet item with correct structure', () => {
      const pet = itemFactories.pet()
      expect(pet).toMatchObject({
        name: '',
        type: '',
        caretaker: '',
        alternateCaretaker: '',
        funds: '',
        instructions: '',
      })
      expect(pet.id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('creates property item with correct structure', () => {
      const property = itemFactories.property()
      expect(property).toMatchObject({
        address: '',
        description: '',
        beneficiary: '',
        instructions: '',
      })
      expect(property.id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('creates customBeneficiary item with correct structure', () => {
      const beneficiary = itemFactories.customBeneficiary()
      expect(beneficiary).toMatchObject({
        name: '',
        relationship: '',
        share: '',
      })
      expect(beneficiary.id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('creates customProvision item with correct structure', () => {
      const provision = itemFactories.customProvision()
      expect(provision).toMatchObject({
        title: '',
        content: '',
      })
      expect(provision.id).toMatch(/^\d+-[a-z0-9]+$/)
    })

    it('creates disinheritPerson item with correct structure', () => {
      const person = itemFactories.disinheritPerson()
      expect(person).toMatchObject({
        name: '',
        relationship: '',
        reason: '',
      })
      expect(person.id).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('addItem', () => {
    it('adds child item to empty array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', [], mockOnChange, 'child')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [
        expect.objectContaining({
          name: '',
          dateOfBirth: '',
          isMinor: true,
          relationship: 'biological',
        }),
      ])
    })

    it('adds gift item to existing array', () => {
      const existingGifts = [{ id: 'existing-1', description: 'Existing gift' }]
      const { result } = renderHook(() =>
        useArrayItemManager('specificGifts', existingGifts, mockOnChange, 'gift')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('specificGifts', [
        { id: 'existing-1', description: 'Existing gift' },
        expect.objectContaining({
          type: 'cash',
          description: '',
          beneficiary: '',
        }),
      ])
    })

    it('adds pet item with nestedField', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('pets', [], mockOnChange, 'pet', 'items')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('pets', 'items', [
        expect.objectContaining({
          name: '',
          type: '',
          caretaker: '',
        }),
      ])
    })

    it('adds property item (realProperty)', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('realProperty', [], mockOnChange, 'property', 'items')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('realProperty', 'items', [
        expect.objectContaining({
          address: '',
          description: '',
          beneficiary: '',
        }),
      ])
    })

    it('adds customProvision item', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('customProvisions', [], mockOnChange, 'customProvision', 'items')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('customProvisions', 'items', [
        expect.objectContaining({
          title: '',
          content: '',
        }),
      ])
    })

    it('adds customBeneficiary item', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('residuaryEstate', [], mockOnChange, 'customBeneficiary')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('residuaryEstate', [
        expect.objectContaining({
          name: '',
          relationship: '',
          share: '',
        }),
      ])
    })

    it('adds disinheritPerson item', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('disinheritance', [], mockOnChange, 'disinheritPerson', 'persons')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('disinheritance', 'persons', [
        expect.objectContaining({
          name: '',
          relationship: '',
          reason: '',
        }),
      ])
    })

    it('throws error for unknown itemType', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('section', [], mockOnChange, 'unknownType')
      )

      expect(() => {
        act(() => {
          result.current.addItem()
        })
      }).toThrow('Unknown item type: unknownType')
    })

    it('handles null data array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', null, mockOnChange, 'child')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [expect.objectContaining({ name: '' })])
    })

    it('handles undefined data array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', undefined, mockOnChange, 'child')
      )

      act(() => {
        result.current.addItem()
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [expect.objectContaining({ name: '' })])
    })
  })

  describe('updateItem', () => {
    it('updates specific field at given index', () => {
      const existingChildren = [
        { id: '1', name: 'Child 1', isMinor: true },
        { id: '2', name: 'Child 2', isMinor: false },
      ]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.updateItem(0, 'name', 'Updated Child 1')
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [
        { id: '1', name: 'Updated Child 1', isMinor: true },
        { id: '2', name: 'Child 2', isMinor: false },
      ])
    })

    it('updates item at last index', () => {
      const existingGifts = [
        { id: '1', description: 'Gift 1' },
        { id: '2', description: 'Gift 2' },
        { id: '3', description: 'Gift 3' },
      ]

      const { result } = renderHook(() =>
        useArrayItemManager('specificGifts', existingGifts, mockOnChange, 'gift')
      )

      act(() => {
        result.current.updateItem(2, 'description', 'Updated Gift 3')
      })

      expect(mockOnChange).toHaveBeenCalledWith('specificGifts', [
        { id: '1', description: 'Gift 1' },
        { id: '2', description: 'Gift 2' },
        { id: '3', description: 'Updated Gift 3' },
      ])
    })

    it('updates with nestedField', () => {
      const existingPets = [{ id: '1', name: 'Fluffy', caretaker: '' }]

      const { result } = renderHook(() =>
        useArrayItemManager('pets', existingPets, mockOnChange, 'pet', 'items')
      )

      act(() => {
        result.current.updateItem(0, 'caretaker', 'John Smith')
      })

      expect(mockOnChange).toHaveBeenCalledWith('pets', 'items', [
        { id: '1', name: 'Fluffy', caretaker: 'John Smith' },
      ])
    })

    it('does not call onChange for invalid index', () => {
      const existingChildren = [{ id: '1', name: 'Child 1' }]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.updateItem(5, 'name', 'Should not update')
      })

      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('does not call onChange for negative index', () => {
      const existingChildren = [{ id: '1', name: 'Child 1' }]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.updateItem(-1, 'name', 'Should not update')
      })

      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('handles null data array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', null, mockOnChange, 'child')
      )

      act(() => {
        result.current.updateItem(0, 'name', 'Test')
      })

      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('handles empty array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', [], mockOnChange, 'child')
      )

      act(() => {
        result.current.updateItem(0, 'name', 'Test')
      })

      expect(mockOnChange).not.toHaveBeenCalled()
    })
  })

  describe('removeItem', () => {
    it('removes item at specific index', () => {
      const existingChildren = [
        { id: '1', name: 'Child 1' },
        { id: '2', name: 'Child 2' },
        { id: '3', name: 'Child 3' },
      ]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.removeItem(1)
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [
        { id: '1', name: 'Child 1' },
        { id: '3', name: 'Child 3' },
      ])
    })

    it('removes first item', () => {
      const existingGifts = [
        { id: '1', description: 'Gift 1' },
        { id: '2', description: 'Gift 2' },
      ]

      const { result } = renderHook(() =>
        useArrayItemManager('specificGifts', existingGifts, mockOnChange, 'gift')
      )

      act(() => {
        result.current.removeItem(0)
      })

      expect(mockOnChange).toHaveBeenCalledWith('specificGifts', [
        { id: '2', description: 'Gift 2' },
      ])
    })

    it('removes last item', () => {
      const existingGifts = [
        { id: '1', description: 'Gift 1' },
        { id: '2', description: 'Gift 2' },
      ]

      const { result } = renderHook(() =>
        useArrayItemManager('specificGifts', existingGifts, mockOnChange, 'gift')
      )

      act(() => {
        result.current.removeItem(1)
      })

      expect(mockOnChange).toHaveBeenCalledWith('specificGifts', [
        { id: '1', description: 'Gift 1' },
      ])
    })

    it('removes with nestedField', () => {
      const existingPets = [
        { id: '1', name: 'Fluffy' },
        { id: '2', name: 'Buddy' },
      ]

      const { result } = renderHook(() =>
        useArrayItemManager('pets', existingPets, mockOnChange, 'pet', 'items')
      )

      act(() => {
        result.current.removeItem(0)
      })

      expect(mockOnChange).toHaveBeenCalledWith('pets', 'items', [{ id: '2', name: 'Buddy' }])
    })

    it('removes single item leaving empty array', () => {
      const existingChildren = [{ id: '1', name: 'Only Child' }]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.removeItem(0)
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [])
    })

    it('handles null data array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', null, mockOnChange, 'child')
      )

      act(() => {
        result.current.removeItem(0)
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [])
    })

    it('handles empty array', () => {
      const { result } = renderHook(() =>
        useArrayItemManager('children', [], mockOnChange, 'child')
      )

      act(() => {
        result.current.removeItem(0)
      })

      expect(mockOnChange).toHaveBeenCalledWith('children', [])
    })

    it('handles out of bounds index gracefully', () => {
      const existingChildren = [{ id: '1', name: 'Child 1' }]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.removeItem(10)
      })

      // Should still call onChange with filtered array (filter just returns original)
      expect(mockOnChange).toHaveBeenCalledWith('children', [{ id: '1', name: 'Child 1' }])
    })
  })

  describe('edge cases', () => {
    it('preserves immutability - does not mutate original array', () => {
      const existingChildren = [{ id: '1', name: 'Child 1' }]
      const originalRef = existingChildren[0]

      const { result } = renderHook(() =>
        useArrayItemManager('children', existingChildren, mockOnChange, 'child')
      )

      act(() => {
        result.current.updateItem(0, 'name', 'Updated Name')
      })

      // Original array should be unchanged
      expect(existingChildren[0].name).toBe('Child 1')
      expect(existingChildren[0]).toBe(originalRef)
    })

    it('handles multiple operations sequentially', () => {
      let data = []

      const { result, rerender } = renderHook(
        ({ currentData }) => useArrayItemManager('children', currentData, mockOnChange, 'child'),
        { initialProps: { currentData: data } }
      )

      // Add item
      act(() => {
        result.current.addItem()
      })

      // Get the new data from the mock call
      data = mockOnChange.mock.calls[0][1]
      rerender({ currentData: data })

      // Update item
      act(() => {
        result.current.updateItem(0, 'name', 'Test Child')
      })

      data = mockOnChange.mock.calls[1][1]
      rerender({ currentData: data })

      // Verify state progression
      expect(mockOnChange).toHaveBeenCalledTimes(2)
      expect(mockOnChange.mock.calls[1][1][0].name).toBe('Test Child')
    })

    it('uses memoized callbacks', () => {
      const existingChildren = [{ id: '1', name: 'Child 1' }]

      const { result, rerender } = renderHook(
        ({ data }) => useArrayItemManager('children', data, mockOnChange, 'child'),
        { initialProps: { data: existingChildren } }
      )

      const firstAddItem = result.current.addItem
      const firstUpdateItem = result.current.updateItem
      const firstRemoveItem = result.current.removeItem

      // Re-render with same data
      rerender({ data: existingChildren })

      // Callbacks should be stable when dependencies don't change
      expect(result.current.addItem).toBe(firstAddItem)
      expect(result.current.updateItem).toBe(firstUpdateItem)
      expect(result.current.removeItem).toBe(firstRemoveItem)
    })

    it('updates callbacks when data changes', () => {
      const initialChildren = [{ id: '1', name: 'Child 1' }]
      const newChildren = [
        { id: '1', name: 'Child 1' },
        { id: '2', name: 'Child 2' },
      ]

      const { result, rerender } = renderHook(
        ({ data }) => useArrayItemManager('children', data, mockOnChange, 'child'),
        { initialProps: { data: initialChildren } }
      )

      const firstAddItem = result.current.addItem

      // Re-render with different data
      rerender({ data: newChildren })

      // Callbacks should update when data changes
      expect(result.current.addItem).not.toBe(firstAddItem)
    })
  })
})
