import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { CustomProvisions } from './CustomProvisions'

const defaultData = {
  include: false,
  items: [],
}

describe('CustomProvisions', () => {
  it('renders without errors', () => {
    const onChange = vi.fn()
    render(<CustomProvisions data={defaultData} onChange={onChange} />)
    expect(screen.getByText('Custom Provisions')).toBeInTheDocument()
  })

  it('shows include checkbox', () => {
    const onChange = vi.fn()
    render(<CustomProvisions data={defaultData} onChange={onChange} />)

    expect(screen.getByLabelText('Include custom provisions in my will')).toBeInTheDocument()
  })

  it('calls onChange when checkbox is clicked', () => {
    const onChange = vi.fn()
    render(<CustomProvisions data={defaultData} onChange={onChange} />)

    const checkbox = screen.getByLabelText('Include custom provisions in my will')
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledWith('customProvisions', 'include', true)
  })

  it('shows add provision button when included', () => {
    const onChange = vi.fn()
    const dataIncluded = { include: true, items: [] }
    render(<CustomProvisions data={dataIncluded} onChange={onChange} />)

    expect(screen.getByText('Add Custom Provision')).toBeInTheDocument()
  })

  it('does not show add button when not included', () => {
    const onChange = vi.fn()
    render(<CustomProvisions data={defaultData} onChange={onChange} />)

    expect(screen.queryByText('Add Custom Provision')).not.toBeInTheDocument()
  })

  it('shows info alert when included', () => {
    const onChange = vi.fn()
    const dataIncluded = { include: true, items: [] }
    render(<CustomProvisions data={dataIncluded} onChange={onChange} />)

    expect(
      screen.getByText(/Custom provisions allow you to add specific clauses/)
    ).toBeInTheDocument()
  })

  it('calls onChange when add provision is clicked', () => {
    const onChange = vi.fn()
    const dataIncluded = { include: true, items: [] }
    render(<CustomProvisions data={dataIncluded} onChange={onChange} />)

    fireEvent.click(screen.getByText('Add Custom Provision'))
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[0]).toBe('customProvisions')
    expect(call[1]).toBe('items')
    expect(call[2][0]).toHaveProperty('id')
    expect(call[2][0]).toHaveProperty('title', '')
    expect(call[2][0]).toHaveProperty('content', '')
  })

  it('renders provision cards when provisions exist', () => {
    const onChange = vi.fn()
    const dataWithItems = {
      include: true,
      items: [{ id: '1', title: 'Business Instructions', content: 'Details here...' }],
    }
    render(<CustomProvisions data={dataWithItems} onChange={onChange} />)

    expect(screen.getByText('Custom Provision 1')).toBeInTheDocument()
  })

  it('displays provision title and content fields', () => {
    const onChange = vi.fn()
    const dataWithItems = {
      include: true,
      items: [{ id: '1', title: '', content: '' }],
    }
    render(<CustomProvisions data={dataWithItems} onChange={onChange} />)

    expect(screen.getByLabelText(/Provision Title/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Provision Content/)).toBeInTheDocument()
  })

  it('calls onChange when title is updated', () => {
    const onChange = vi.fn()
    const dataWithItems = {
      include: true,
      items: [{ id: '1', title: '', content: '' }],
    }
    render(<CustomProvisions data={dataWithItems} onChange={onChange} />)

    const titleInput = screen.getByLabelText(/Provision Title/)
    fireEvent.change(titleInput, { target: { value: 'New Title' } })

    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0]
    expect(call[2][0].title).toBe('New Title')
  })

  it('shows remove button with accessible label', () => {
    const onChange = vi.fn()
    const dataWithItems = {
      include: true,
      items: [{ id: '1', title: 'Business Instructions', content: 'Details...' }],
    }
    render(<CustomProvisions data={dataWithItems} onChange={onChange} />)

    expect(screen.getByLabelText('Remove provision 1: Business Instructions')).toBeInTheDocument()
  })

  it('calls onChange when remove is clicked', () => {
    const onChange = vi.fn()
    const dataWithItems = {
      include: true,
      items: [{ id: '1', title: 'Business Instructions', content: 'Details...' }],
    }
    render(<CustomProvisions data={dataWithItems} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('Remove provision 1: Business Instructions'))
    expect(onChange).toHaveBeenCalledWith('customProvisions', 'items', [])
  })

  it('displays error messages when provided', () => {
    const onChange = vi.fn()
    const dataWithItems = {
      include: true,
      items: [{ id: '1', title: '', content: '' }],
    }
    const errors = { customProvision_0_title: 'Title is required' }
    render(<CustomProvisions data={dataWithItems} onChange={onChange} errors={errors} />)

    expect(screen.getByText('Title is required')).toBeInTheDocument()
  })
})
