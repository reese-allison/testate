import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ExecutorInfo } from './ExecutorInfo'

const defaultData = {
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
  bondRequired: false,
}

describe('ExecutorInfo', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)
    expect(screen.getByText('Personal Representative (Executor)')).toBeInTheDocument()
  })

  it('displays all required primary executor fields', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    // Use getAllBy and check first match since there may be multiple
    const nameInputs = screen.getAllByLabelText(/Full Legal Name/)
    expect(nameInputs.length).toBeGreaterThan(0)
    const relationshipInputs = screen.getAllByLabelText(/Relationship to You/)
    expect(relationshipInputs.length).toBeGreaterThan(0)
    const addressInputs = screen.getAllByLabelText(/Street Address/)
    expect(addressInputs.length).toBeGreaterThan(0)
  })

  it('calls onChange when executor name is entered', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    // Get the first (primary executor) name input
    const nameInputs = screen.getAllByLabelText(/Full Legal Name/)
    fireEvent.change(nameInputs[0], { target: { name: 'name', value: 'Jane Doe' } })

    expect(onChange).toHaveBeenCalledWith('executor', 'name', 'Jane Doe')
  })

  it('displays alternate executor section', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    expect(screen.getByText('Alternate Personal Representative')).toBeInTheDocument()
  })

  it('shows alternate address fields when alternate name is provided', () => {
    const onChange = vi.fn()
    const dataWithAlternate = { ...defaultData, alternateName: 'John Backup' }
    render(<ExecutorInfo data={dataWithAlternate} onChange={onChange} />)

    // Should show alternate address fields
    const addressInputs = screen.getAllByLabelText(/Street Address/)
    expect(addressInputs.length).toBeGreaterThanOrEqual(2)
  })

  it('does not show alternate address fields when alternate name is empty', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    // There should be only one street address field (primary executor)
    const addressInputs = screen.getAllByLabelText(/Street Address/)
    expect(addressInputs.length).toBe(1)
  })

  it('displays bond requirement checkbox', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    expect(
      screen.getByLabelText('Require the Personal Representative to post a bond')
    ).toBeInTheDocument()
  })

  it('calls onChange with checkbox value when bond is toggled', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    const checkbox = screen.getByLabelText('Require the Personal Representative to post a bond')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('executor', 'bondRequired', true)
  })

  it('shows bond required message when bondRequired is true', () => {
    const onChange = vi.fn()
    const dataWithBond = { ...defaultData, bondRequired: true }
    render(<ExecutorInfo data={dataWithBond} onChange={onChange} />)

    expect(screen.getByText(/A bond will be required/)).toBeInTheDocument()
  })

  it('shows no bond message when bondRequired is false', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    expect(screen.getByText(/No bond will be required/)).toBeInTheDocument()
  })

  it('displays informational alert about executor duties', () => {
    const onChange = vi.fn()
    render(<ExecutorInfo data={defaultData} onChange={onChange} />)

    expect(screen.getByText('What Does a Personal Representative Do?')).toBeInTheDocument()
  })

  it('displays error messages when provided', () => {
    const onChange = vi.fn()
    const errors = { name: 'Executor name is required' }
    render(<ExecutorInfo data={defaultData} onChange={onChange} errors={errors} />)

    expect(screen.getByText('Executor name is required')).toBeInTheDocument()
  })
})
