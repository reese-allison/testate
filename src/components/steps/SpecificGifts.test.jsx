import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { SpecificGifts } from './SpecificGifts'

describe('SpecificGifts', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(<SpecificGifts data={[]} onChange={onChange} />)
    expect(screen.getByText('Specific Gifts')).toBeInTheDocument()
  })

  it('shows empty state when no gifts', () => {
    const onChange = vi.fn()
    render(<SpecificGifts data={[]} onChange={onChange} />)

    expect(
      screen.getByText(/No specific gifts added. Click the button below to add a gift/)
    ).toBeInTheDocument()
  })

  it('shows add gift button', () => {
    const onChange = vi.fn()
    render(<SpecificGifts data={[]} onChange={onChange} />)

    expect(screen.getByText('Add Specific Gift')).toBeInTheDocument()
  })

  it('calls onChange when add gift is clicked', () => {
    const onChange = vi.fn()
    render(<SpecificGifts data={[]} onChange={onChange} />)

    fireEvent.click(screen.getByText('Add Specific Gift'))
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[0]).toBe('specificGifts')
    expect(call[1][0]).toHaveProperty('id')
    expect(call[1][0]).toHaveProperty('type', 'cash')
    expect(call[1][0]).toHaveProperty('description', '')
    expect(call[1][0]).toHaveProperty('beneficiary', '')
  })

  it('renders gift cards when gifts exist', () => {
    const onChange = vi.fn()
    const gifts = [
      {
        id: '1',
        type: 'cash',
        description: '$5000',
        beneficiary: 'John',
        beneficiaryRelationship: 'nephew',
        alternativeBeneficiary: '',
        conditions: '',
      },
    ]
    render(<SpecificGifts data={gifts} onChange={onChange} />)

    expect(screen.getByText('Gift 1')).toBeInTheDocument()
  })

  it('displays gift type selector', () => {
    const onChange = vi.fn()
    const gifts = [
      {
        id: '1',
        type: 'cash',
        description: '',
        beneficiary: '',
        beneficiaryRelationship: '',
        alternativeBeneficiary: '',
        conditions: '',
      },
    ]
    render(<SpecificGifts data={gifts} onChange={onChange} />)

    expect(screen.getByLabelText('Type of Gift')).toBeInTheDocument()
  })

  it('calls onChange when gift type is changed', () => {
    const onChange = vi.fn()
    const gifts = [
      {
        id: '1',
        type: 'cash',
        description: '',
        beneficiary: '',
        beneficiaryRelationship: '',
        alternativeBeneficiary: '',
        conditions: '',
      },
    ]
    render(<SpecificGifts data={gifts} onChange={onChange} />)

    const typeSelect = screen.getByLabelText('Type of Gift')
    fireEvent.change(typeSelect, { target: { value: 'vehicle' } })

    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[1][0].type).toBe('vehicle')
  })

  it('shows remove button with accessible label', () => {
    const onChange = vi.fn()
    const gifts = [
      {
        id: '1',
        type: 'cash',
        description: '$5000',
        beneficiary: 'John Doe',
        beneficiaryRelationship: 'nephew',
        alternativeBeneficiary: '',
        conditions: '',
      },
    ]
    render(<SpecificGifts data={gifts} onChange={onChange} />)

    expect(screen.getByLabelText('Remove gift 1 to John Doe')).toBeInTheDocument()
  })

  it('calls onChange when remove is clicked', () => {
    const onChange = vi.fn()
    const gifts = [
      {
        id: '1',
        type: 'cash',
        description: '$5000',
        beneficiary: 'John Doe',
        beneficiaryRelationship: 'nephew',
        alternativeBeneficiary: '',
        conditions: '',
      },
    ]
    render(<SpecificGifts data={gifts} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Remove gift 1 to John Doe'))
    expect(onChange).toHaveBeenCalledWith('specificGifts', [])
  })

  it('displays tips alert', () => {
    const onChange = vi.fn()
    render(<SpecificGifts data={[]} onChange={onChange} />)

    expect(screen.getByText('Tips for Specific Gifts')).toBeInTheDocument()
  })

  it('displays beneficiary designations warning', () => {
    const onChange = vi.fn()
    render(<SpecificGifts data={[]} onChange={onChange} />)

    expect(screen.getByText('About Beneficiary Designations')).toBeInTheDocument()
  })

  it('shows placeholder text based on gift type', () => {
    const onChange = vi.fn()
    const gifts = [
      {
        id: '1',
        type: 'vehicle',
        description: '',
        beneficiary: '',
        beneficiaryRelationship: '',
        alternativeBeneficiary: '',
        conditions: '',
      },
    ]
    render(<SpecificGifts data={gifts} onChange={onChange} />)

    const descriptionField = screen.getByLabelText(/Description/)
    expect(descriptionField.placeholder).toContain('Toyota Camry')
  })
})
