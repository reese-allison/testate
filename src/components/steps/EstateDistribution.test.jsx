import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { EstateDistribution } from './EstateDistribution'

const defaultData = {
  distributionType: 'spouse',
  spouseShare: 100,
  childrenShare: 0,
  customBeneficiaries: [],
  perStirpes: true,
}

const marriedTestator = {
  fullName: 'John Smith',
  maritalStatus: 'married',
  spouseName: 'Jane Smith',
}

const singleTestator = {
  fullName: 'John Smith',
  maritalStatus: 'single',
  spouseName: '',
}

describe('EstateDistribution', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )
    expect(screen.getByText('Residuary Estate Distribution')).toBeInTheDocument()
  })

  it('shows spouse option when married', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    const select = screen.getByLabelText('Distribution Method')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Everything to my spouse')).toBeInTheDocument()
  })

  it('does not show spouse option when single', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={{ ...defaultData, distributionType: 'custom' }}
        testator={singleTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.queryByText('Everything to my spouse')).not.toBeInTheDocument()
  })

  it('shows children option when children exist', () => {
    const onChange = vi.fn()
    const children = [{ id: '1', name: 'Alice', isMinor: true, relationship: 'biological' }]
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={children}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Everything to my children (equally)')).toBeInTheDocument()
  })

  it('shows split option when married with children', () => {
    const onChange = vi.fn()
    const children = [{ id: '1', name: 'Alice', isMinor: true, relationship: 'biological' }]
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={children}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Split between spouse and children')).toBeInTheDocument()
  })

  it('always shows custom option', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={defaultData}
        testator={singleTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Custom distribution')).toBeInTheDocument()
  })

  it('calls onChange when distribution type changes', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    const select = screen.getByLabelText('Distribution Method')
    fireEvent.change(select, { target: { value: 'custom' } })

    expect(onChange).toHaveBeenCalledWith('residuaryEstate', 'distributionType', 'custom')
  })

  it('shows split percentage fields when split type is selected', () => {
    const onChange = vi.fn()
    const splitData = {
      ...defaultData,
      distributionType: 'split',
      spouseShare: 50,
      childrenShare: 50,
    }
    const children = [{ id: '1', name: 'Alice', isMinor: true, relationship: 'biological' }]
    render(
      <EstateDistribution
        data={splitData}
        testator={marriedTestator}
        children={children}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Percentage Split')).toBeInTheDocument()
    expect(screen.getByLabelText(/To Spouse/)).toBeInTheDocument()
    expect(screen.getByLabelText('To Children (divided equally)')).toBeInTheDocument()
  })

  it('shows custom beneficiary section when custom type is selected', () => {
    const onChange = vi.fn()
    const customData = { ...defaultData, distributionType: 'custom' }
    render(
      <EstateDistribution
        data={customData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Add Beneficiary')).toBeInTheDocument()
  })

  it('calls onChange when add beneficiary is clicked', () => {
    const onChange = vi.fn()
    const customData = { ...defaultData, distributionType: 'custom' }
    render(
      <EstateDistribution
        data={customData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    fireEvent.click(screen.getByText('Add Beneficiary'))
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[1]).toBe('customBeneficiaries')
    expect(call[2][0]).toHaveProperty('id')
    expect(call[2][0]).toHaveProperty('name', '')
    expect(call[2][0]).toHaveProperty('share', 0)
  })

  it('renders custom beneficiary cards', () => {
    const onChange = vi.fn()
    const customData = {
      ...defaultData,
      distributionType: 'custom',
      customBeneficiaries: [{ id: '1', name: 'Charity', relationship: 'organization', share: 100 }],
    }
    render(
      <EstateDistribution
        data={customData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Beneficiary 1')).toBeInTheDocument()
  })

  it('shows total percentage for custom beneficiaries', () => {
    const onChange = vi.fn()
    const customData = {
      ...defaultData,
      distributionType: 'custom',
      customBeneficiaries: [
        { id: '1', name: 'Person A', relationship: '', share: 50 },
        { id: '2', name: 'Person B', relationship: '', share: 30 },
      ],
    }
    render(
      <EstateDistribution
        data={customData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.getByText(/Total: 80%/)).toBeInTheDocument()
    expect(screen.getByText('(Must equal 100%)')).toBeInTheDocument()
  })

  it('shows per stirpes checkbox when children exist', () => {
    const onChange = vi.fn()
    const children = [{ id: '1', name: 'Alice', isMinor: true, relationship: 'biological' }]
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={children}
        onChange={onChange}
      />
    )

    expect(screen.getByText('Per Stirpes Distribution')).toBeInTheDocument()
  })

  it('does not show per stirpes section when no children', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.queryByText('Per Stirpes Distribution')).not.toBeInTheDocument()
  })

  it('shows info alert about residuary estate', () => {
    const onChange = vi.fn()
    render(
      <EstateDistribution
        data={defaultData}
        testator={marriedTestator}
        children={[]}
        onChange={onChange}
      />
    )

    expect(screen.getByText('What is the Residuary Estate?')).toBeInTheDocument()
  })
})
