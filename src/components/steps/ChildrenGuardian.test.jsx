import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ChildrenGuardian } from './ChildrenGuardian'

const defaultGuardian = {
  name: '',
  relationship: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  alternateName: '',
  alternateRelationship: '',
  alternateAddress: '',
  alternateCity: '',
  alternateState: '',
  alternateZip: '',
}

describe('ChildrenGuardian', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    render(
      <ChildrenGuardian
        data={[]}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('shows empty state when no children', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    render(
      <ChildrenGuardian
        data={[]}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(
      screen.getByText('No children added. Click the button below to add a child.')
    ).toBeInTheDocument()
  })

  it('shows add child button', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    render(
      <ChildrenGuardian
        data={[]}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(screen.getByText('Add Child')).toBeInTheDocument()
  })

  it('calls onArrayChange when add child is clicked', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    render(
      <ChildrenGuardian
        data={[]}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    fireEvent.click(screen.getByText('Add Child'))
    expect(onArrayChange).toHaveBeenCalled()
    const call = onArrayChange.mock.calls[0]
    expect(call[0]).toBe('children')
    expect(call[1][0]).toHaveProperty('id')
    expect(call[1][0]).toHaveProperty('name', '')
    expect(call[1][0]).toHaveProperty('isMinor', true)
  })

  it('renders child cards when children exist', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: true, relationship: 'biological' },
      { id: '2', name: 'Bob', dateOfBirth: '', isMinor: false, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('shows guardian section when minor children exist', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: true, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(screen.getByText('Guardian for Minor Children')).toBeInTheDocument()
  })

  it('does not show guardian section when no minor children', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: false, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(screen.queryByText('Guardian for Minor Children')).not.toBeInTheDocument()
  })

  it('calls onChange when guardian name is entered', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: true, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    // The guardian name input may appear multiple times, get the first one
    const guardianNameInputs = screen.getAllByLabelText(/Guardian.*Full Legal Name/)
    fireEvent.change(guardianNameInputs[0], { target: { name: 'name', value: 'Mary Smith' } })

    expect(onChange).toHaveBeenCalledWith('guardian', 'name', 'Mary Smith')
  })

  it('shows remove button with accessible label', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: true, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(screen.getByLabelText('Remove child 1: Alice')).toBeInTheDocument()
  })

  it('calls onArrayChange when remove is clicked', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: true, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    fireEvent.click(screen.getByLabelText('Remove child 1: Alice'))
    expect(onArrayChange).toHaveBeenCalledWith('children', [])
  })

  it('shows alternate guardian section', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    const children = [
      { id: '1', name: 'Alice', dateOfBirth: '', isMinor: true, relationship: 'biological' },
    ]
    render(
      <ChildrenGuardian
        data={children}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(screen.getByText('Alternate Guardian')).toBeInTheDocument()
  })

  it('shows info alert when no children', () => {
    const onChange = vi.fn()
    const onArrayChange = vi.fn()
    render(
      <ChildrenGuardian
        data={[]}
        guardian={defaultGuardian}
        onChange={onChange}
        onArrayChange={onArrayChange}
      />
    )

    expect(
      screen.getByText(/If you have no children, you can proceed to the next step/)
    ).toBeInTheDocument()
  })
})
