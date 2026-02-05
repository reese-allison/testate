import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { AdditionalProvisions } from './AdditionalProvisions'

const defaultData = {
  digitalAssets: {
    include: false,
    fiduciary: '',
    socialMedia: 'delete',
    email: 'delete',
    cloudStorage: 'transfer',
    cryptocurrency: '',
    passwordManager: '',
    instructions: '',
  },
  pets: {
    include: false,
    items: [],
  },
  funeral: {
    include: false,
    preference: '',
    serviceType: '',
    location: '',
    memorialDonations: '',
    prePaidArrangements: false,
    prePaidDetails: '',
    additionalWishes: '',
  },
  realProperty: {
    include: false,
    items: [],
  },
  debtsAndTaxes: {
    include: false,
    paymentOrder: 'residuary',
    specificInstructions: '',
  },
}

describe('AdditionalProvisions', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(<AdditionalProvisions data={defaultData} onChange={onChange} />)
    expect(screen.getByText('Digital Assets')).toBeInTheDocument()
  })

  it('displays all section cards', () => {
    const onChange = vi.fn()
    render(<AdditionalProvisions data={defaultData} onChange={onChange} />)

    expect(screen.getByText('Digital Assets')).toBeInTheDocument()
    expect(screen.getByText('Pet Care Provisions')).toBeInTheDocument()
    expect(screen.getByText('Funeral & Burial Wishes')).toBeInTheDocument()
    expect(screen.getByText('Real Property Details')).toBeInTheDocument()
    expect(screen.getByText('Debts & Taxes')).toBeInTheDocument()
  })

  it('shows digital assets checkbox', () => {
    const onChange = vi.fn()
    render(<AdditionalProvisions data={defaultData} onChange={onChange} />)

    expect(
      screen.getByLabelText('Include digital assets provisions in my will')
    ).toBeInTheDocument()
  })

  it('expands digital assets section when checkbox is checked', () => {
    const onChange = vi.fn()
    const dataWithDigital = {
      ...defaultData,
      digitalAssets: { ...defaultData.digitalAssets, include: true },
    }
    render(<AdditionalProvisions data={dataWithDigital} onChange={onChange} />)

    expect(
      screen.getByLabelText('Digital Fiduciary (Person to manage digital assets)')
    ).toBeInTheDocument()
  })

  it('calls onChange when digital assets checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<AdditionalProvisions data={defaultData} onChange={onChange} />)

    const checkbox = screen.getByLabelText('Include digital assets provisions in my will')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('digitalAssets', 'include', true)
  })

  it('shows pet section when expanded', () => {
    const onChange = vi.fn()
    const dataWithPets = {
      ...defaultData,
      pets: { ...defaultData.pets, include: true },
    }
    render(<AdditionalProvisions data={dataWithPets} onChange={onChange} />)

    expect(screen.getByText('Add Pet')).toBeInTheDocument()
  })

  it('calls onChange when add pet is clicked', () => {
    const onChange = vi.fn()
    const dataWithPets = {
      ...defaultData,
      pets: { include: true, items: [] },
    }
    render(<AdditionalProvisions data={dataWithPets} onChange={onChange} />)

    fireEvent.click(screen.getByText('Add Pet'))
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[0]).toBe('pets')
    expect(call[1]).toBe('items')
    expect(call[2][0]).toHaveProperty('id')
    expect(call[2][0]).toHaveProperty('name', '')
  })

  it('renders pet cards when pets exist', () => {
    const onChange = vi.fn()
    const dataWithPets = {
      ...defaultData,
      pets: {
        include: true,
        items: [
          {
            id: '1',
            name: 'Max',
            type: 'Dog',
            caretaker: '',
            alternateCaretaker: '',
            funds: '',
            instructions: '',
          },
        ],
      },
    }
    render(<AdditionalProvisions data={dataWithPets} onChange={onChange} />)

    expect(screen.getByText('Pet 1')).toBeInTheDocument()
  })

  it('shows funeral section when expanded', () => {
    const onChange = vi.fn()
    const dataWithFuneral = {
      ...defaultData,
      funeral: { ...defaultData.funeral, include: true },
    }
    render(<AdditionalProvisions data={dataWithFuneral} onChange={onChange} />)

    expect(screen.getByLabelText('Preference')).toBeInTheDocument()
    expect(screen.getByLabelText('Service Type')).toBeInTheDocument()
  })

  it('shows pre-paid details when pre-paid is checked', () => {
    const onChange = vi.fn()
    const dataWithPrePaid = {
      ...defaultData,
      funeral: { ...defaultData.funeral, include: true, prePaidArrangements: true },
    }
    render(<AdditionalProvisions data={dataWithPrePaid} onChange={onChange} />)

    expect(screen.getByLabelText('Pre-paid Arrangement Details')).toBeInTheDocument()
  })

  it('shows real property section when expanded', () => {
    const onChange = vi.fn()
    const dataWithProperty = {
      ...defaultData,
      realProperty: { include: true, items: [] },
    }
    render(<AdditionalProvisions data={dataWithProperty} onChange={onChange} />)

    expect(screen.getByText('Add Property')).toBeInTheDocument()
  })

  it('calls onChange when add property is clicked', () => {
    const onChange = vi.fn()
    const dataWithProperty = {
      ...defaultData,
      realProperty: { include: true, items: [] },
    }
    render(<AdditionalProvisions data={dataWithProperty} onChange={onChange} />)

    fireEvent.click(screen.getByText('Add Property'))
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[0]).toBe('realProperty')
    expect(call[1]).toBe('items')
    expect(call[2][0]).toHaveProperty('id')
    expect(call[2][0]).toHaveProperty('address', '')
  })

  it('shows debts and taxes section when expanded', () => {
    const onChange = vi.fn()
    const dataWithDebts = {
      ...defaultData,
      debtsAndTaxes: { ...defaultData.debtsAndTaxes, include: true },
    }
    render(<AdditionalProvisions data={dataWithDebts} onChange={onChange} />)

    expect(screen.getByLabelText('Payment Order')).toBeInTheDocument()
  })

  it('shows info alert about optional provisions', () => {
    const onChange = vi.fn()
    render(<AdditionalProvisions data={defaultData} onChange={onChange} />)

    expect(screen.getByText('These Provisions Are Optional')).toBeInTheDocument()
  })
})
