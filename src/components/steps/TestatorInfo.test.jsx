import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { TestatorInfo } from './TestatorInfo'

const defaultData = {
  fullName: '',
  address: '',
  city: '',
  state: 'Florida',
  zip: '',
  county: '',
  maritalStatus: 'single',
  spouseName: '',
  residenceState: 'FL',
}

describe('TestatorInfo', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(<TestatorInfo data={defaultData} onChange={onChange} />)
    expect(screen.getByText('Your Information')).toBeInTheDocument()
  })

  it('displays state of residence selector', () => {
    const onChange = vi.fn()
    render(<TestatorInfo data={defaultData} onChange={onChange} />)
    expect(screen.getByRole('heading', { name: /State of Residence/ })).toBeInTheDocument()
  })

  it('displays all required fields', () => {
    const onChange = vi.fn()
    render(<TestatorInfo data={defaultData} onChange={onChange} />)

    expect(screen.getByLabelText(/Full Legal Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Street Address/)).toBeInTheDocument()
    expect(screen.getByLabelText(/City/)).toBeInTheDocument()
    expect(screen.getByLabelText(/ZIP Code/)).toBeInTheDocument()
    expect(screen.getByLabelText(/County/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Current Marital Status/)).toBeInTheDocument()
  })

  it('calls onChange when full name is entered', () => {
    const onChange = vi.fn()
    render(<TestatorInfo data={defaultData} onChange={onChange} />)

    const nameInput = screen.getByLabelText(/Full Legal Name/)
    fireEvent.change(nameInput, { target: { name: 'fullName', value: 'John Smith' } })

    expect(onChange).toHaveBeenCalledWith('testator', 'fullName', 'John Smith')
  })

  it('shows spouse name field when married is selected', () => {
    const onChange = vi.fn()
    const marriedData = { ...defaultData, maritalStatus: 'married' }
    render(<TestatorInfo data={marriedData} onChange={onChange} />)

    expect(screen.getByLabelText(/Spouse's Full Legal Name/)).toBeInTheDocument()
  })

  it('does not show spouse name field when single', () => {
    const onChange = vi.fn()
    render(<TestatorInfo data={defaultData} onChange={onChange} />)

    expect(screen.queryByLabelText(/Spouse's Full Legal Name/)).not.toBeInTheDocument()
  })

  it('displays error messages when provided', () => {
    const onChange = vi.fn()
    const errors = { fullName: 'Full name is required' }
    render(<TestatorInfo data={defaultData} onChange={onChange} errors={errors} />)

    expect(screen.getByText('Full name is required')).toBeInTheDocument()
  })

  it('shows county dropdown for all states', () => {
    const onChange = vi.fn()
    render(<TestatorInfo data={defaultData} onChange={onChange} />)

    const countySelect = screen.getByLabelText(/County/)
    expect(countySelect.tagName).toBe('SELECT')
    expect(screen.getByText('Select your county...')).toBeInTheDocument()
  })

  it('shows county dropdown for non-FL states', () => {
    const onChange = vi.fn()
    const caData = { ...defaultData, residenceState: 'CA', state: 'California' }
    render(<TestatorInfo data={caData} onChange={onChange} />)

    const countySelect = screen.getByLabelText(/County/)
    expect(countySelect.tagName).toBe('SELECT')
  })

  it('shows parish label for Louisiana', () => {
    const onChange = vi.fn()
    const laData = { ...defaultData, residenceState: 'LA', state: 'Louisiana' }
    render(<TestatorInfo data={laData} onChange={onChange} />)

    expect(screen.getByLabelText(/Parish/)).toBeInTheDocument()
    expect(screen.getByText('Select your parish...')).toBeInTheDocument()
  })

  it('shows community property warning for community property states', () => {
    const onChange = vi.fn()
    const caData = { ...defaultData, residenceState: 'CA', state: 'California' }
    render(<TestatorInfo data={caData} onChange={onChange} />)

    expect(screen.getByText('Community Property State')).toBeInTheDocument()
  })
})
