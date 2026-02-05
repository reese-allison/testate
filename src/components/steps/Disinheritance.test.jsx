import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Disinheritance } from './Disinheritance'

const defaultData = {
  include: false,
  persons: [],
}

describe('Disinheritance', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(<Disinheritance data={defaultData} onChange={onChange} />)
    expect(screen.getByText('Disinheritance Clause')).toBeInTheDocument()
  })

  it('shows warning alert about disinheritance', () => {
    const onChange = vi.fn()
    render(<Disinheritance data={defaultData} onChange={onChange} />)

    expect(screen.getByText('Important: Disinheritance Considerations')).toBeInTheDocument()
  })

  it('shows include checkbox', () => {
    const onChange = vi.fn()
    render(<Disinheritance data={defaultData} onChange={onChange} />)

    expect(
      screen.getByLabelText('I want to explicitly disinherit one or more persons')
    ).toBeInTheDocument()
  })

  it('calls onChange when checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<Disinheritance data={defaultData} onChange={onChange} />)

    const checkbox = screen.getByLabelText('I want to explicitly disinherit one or more persons')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('disinheritance', 'include', true)
  })

  it('shows no disinheritance card when not included', () => {
    const onChange = vi.fn()
    render(<Disinheritance data={defaultData} onChange={onChange} />)

    expect(screen.getByText('No Disinheritance')).toBeInTheDocument()
  })

  it('hides no disinheritance card when included', () => {
    const onChange = vi.fn()
    const dataIncluded = { include: true, persons: [] }
    render(<Disinheritance data={dataIncluded} onChange={onChange} />)

    expect(screen.queryByText('No Disinheritance')).not.toBeInTheDocument()
  })

  it('shows add person button when included', () => {
    const onChange = vi.fn()
    const dataIncluded = { include: true, persons: [] }
    render(<Disinheritance data={dataIncluded} onChange={onChange} />)

    expect(screen.getByText('Add Person to Disinherit')).toBeInTheDocument()
  })

  it('calls onChange when add person is clicked', () => {
    const onChange = vi.fn()
    const dataIncluded = { include: true, persons: [] }
    render(<Disinheritance data={dataIncluded} onChange={onChange} />)

    fireEvent.click(screen.getByText('Add Person to Disinherit'))
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[0]).toBe('disinheritance')
    expect(call[1]).toBe('persons')
    expect(call[2][0]).toHaveProperty('id')
    expect(call[2][0]).toHaveProperty('name', '')
    expect(call[2][0]).toHaveProperty('relationship', '')
    expect(call[2][0]).toHaveProperty('reason', '')
  })

  it('renders person cards when persons exist', () => {
    const onChange = vi.fn()
    const dataWithPersons = {
      include: true,
      persons: [{ id: '1', name: 'John Doe', relationship: 'Son', reason: '' }],
    }
    render(<Disinheritance data={dataWithPersons} onChange={onChange} />)

    expect(screen.getByText('Disinherited Person 1')).toBeInTheDocument()
  })

  it('displays person name and relationship fields', () => {
    const onChange = vi.fn()
    const dataWithPersons = {
      include: true,
      persons: [{ id: '1', name: '', relationship: '', reason: '' }],
    }
    render(<Disinheritance data={dataWithPersons} onChange={onChange} />)

    expect(screen.getByLabelText(/Full Legal Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Relationship to You/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Reason/)).toBeInTheDocument()
  })

  it('calls onChange when name is updated', () => {
    const onChange = vi.fn()
    const dataWithPersons = {
      include: true,
      persons: [{ id: '1', name: '', relationship: '', reason: '' }],
    }
    render(<Disinheritance data={dataWithPersons} onChange={onChange} />)

    const nameInput = screen.getByLabelText(/Full Legal Name/)
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } })

    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[2][0].name).toBe('Jane Smith')
  })

  it('shows remove button with accessible label', () => {
    const onChange = vi.fn()
    const dataWithPersons = {
      include: true,
      persons: [{ id: '1', name: 'John Doe', relationship: 'Son', reason: '' }],
    }
    render(<Disinheritance data={dataWithPersons} onChange={onChange} />)

    expect(screen.getByLabelText('Remove disinherited person 1: John Doe')).toBeInTheDocument()
  })

  it('calls onChange when remove is clicked', () => {
    const onChange = vi.fn()
    const dataWithPersons = {
      include: true,
      persons: [{ id: '1', name: 'John Doe', relationship: 'Son', reason: '' }],
    }
    render(<Disinheritance data={dataWithPersons} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Remove disinherited person 1: John Doe'))
    expect(onChange).toHaveBeenCalledWith('disinheritance', 'persons', [])
  })

  it('shows spousal rights info alert', () => {
    const onChange = vi.fn()
    render(<Disinheritance data={defaultData} onChange={onChange} />)

    expect(screen.getByText(/Law on Spousal Rights/)).toBeInTheDocument()
  })

  it('uses danger variant styling for person cards', () => {
    const onChange = vi.fn()
    const dataWithPersons = {
      include: true,
      persons: [{ id: '1', name: 'John Doe', relationship: 'Son', reason: '' }],
    }
    render(<Disinheritance data={dataWithPersons} onChange={onChange} />)

    // Find the card container - it should have red border styling
    const headerElement = screen.getByText('Disinherited Person 1')
    // Navigate up to find the card wrapper
    const card = headerElement.closest('.border-red-200, [class*="border-red"]')
    expect(card).not.toBeNull()
  })
})
