import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { FormField } from './FormField'

describe('FormField', () => {
  describe('text input', () => {
    it('renders text input by default', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('renders label associated with input', () => {
      render(<FormField label="Full Name" name="fullName" value="" onChange={() => {}} />)

      expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    })

    it('calls onChange when typing', () => {
      const onChange = vi.fn()
      render(<FormField label="Name" name="name" value="" onChange={onChange} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'John' } })

      expect(onChange).toHaveBeenCalled()
    })

    it('displays placeholder', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          placeholder="Enter your name"
        />
      )

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })
  })

  describe('select', () => {
    const options = [
      { value: '', label: 'Select an option' },
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ]

    it('renders select with options', () => {
      render(
        <FormField
          label="Choice"
          name="choice"
          type="select"
          value=""
          onChange={() => {}}
          options={options}
        />
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()

      expect(screen.getByText('Select an option')).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('calls onChange when selection changes', () => {
      const onChange = vi.fn()
      render(
        <FormField
          label="Choice"
          name="choice"
          type="select"
          value=""
          onChange={onChange}
          options={options}
        />
      )

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'option1' } })

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('textarea', () => {
    it('renders textarea', () => {
      render(
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value=""
          onChange={() => {}}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea.tagName).toBe('TEXTAREA')
    })

    it('applies rows prop', () => {
      render(
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value=""
          onChange={() => {}}
          rows={5}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('applies default rows of 3', () => {
      render(
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value=""
          onChange={() => {}}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '3')
    })
  })

  describe('checkbox', () => {
    it('renders checkbox with inline label', () => {
      render(
        <FormField
          label="I agree to terms"
          name="agree"
          type="checkbox"
          value={false}
          onChange={() => {}}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(screen.getByText('I agree to terms')).toBeInTheDocument()
    })

    it('checkbox is checked when value is true', () => {
      render(
        <FormField label="I agree" name="agree" type="checkbox" value={true} onChange={() => {}} />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })

    it('checkbox is unchecked when value is false', () => {
      render(
        <FormField label="I agree" name="agree" type="checkbox" value={false} onChange={() => {}} />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toBeChecked()
    })

    it('calls onChange when checkbox is clicked', () => {
      const onChange = vi.fn()
      render(
        <FormField label="I agree" name="agree" type="checkbox" value={false} onChange={onChange} />
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(onChange).toHaveBeenCalled()
    })

    it('checkbox label is clickable', () => {
      const onChange = vi.fn()
      render(
        <FormField
          label="Click me"
          name="clickable"
          type="checkbox"
          value={false}
          onChange={onChange}
        />
      )

      const label = screen.getByText('Click me')
      fireEvent.click(label)

      expect(onChange).toHaveBeenCalled()
    })
  })

  describe('error display', () => {
    it('displays error message', () => {
      render(
        <FormField label="Name" name="name" value="" onChange={() => {}} error="Name is required" />
      )

      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })

    it('error message has role="alert"', () => {
      render(
        <FormField label="Name" name="name" value="" onChange={() => {}} error="Name is required" />
      )

      expect(screen.getByRole('alert')).toHaveTextContent('Name is required')
    })

    it('applies error border styling to input', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} error="Error" />)

      const input = screen.getByRole('textbox')
      expect(input.className).toContain('border-red-500')
    })

    it('sets aria-invalid when error exists', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} error="Error" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('sets aria-describedby linking to error message', () => {
      render(
        <FormField label="Name" name="name" value="" onChange={() => {}} error="Error message" />
      )

      const input = screen.getByRole('textbox')
      const errorId = input.getAttribute('aria-describedby')
      const errorElement = document.getElementById(errorId)
      expect(errorElement).toHaveTextContent('Error message')
    })

    it('displays error for checkbox type', () => {
      render(
        <FormField
          label="Agree"
          name="agree"
          type="checkbox"
          value={false}
          onChange={() => {}}
          error="You must agree"
        />
      )

      expect(screen.getByText('You must agree')).toBeInTheDocument()
    })
  })

  describe('required indicator', () => {
    it('shows asterisk when required', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} required />)

      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('asterisk is aria-hidden', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} required />)

      const asterisk = screen.getByText('*')
      expect(asterisk).toHaveAttribute('aria-hidden', 'true')
    })

    it('does not show asterisk when not required', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} />)

      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('sets aria-required when required', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} required />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('tooltip', () => {
    it('renders tooltip button when tooltip prop is provided', () => {
      render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          tooltip="Help text for this field"
        />
      )

      expect(screen.getByLabelText('More information')).toBeInTheDocument()
    })

    it('does not render tooltip when prop is not provided', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} />)

      expect(screen.queryByLabelText('More information')).not.toBeInTheDocument()
    })

    it('renders tooltip for checkbox type', () => {
      render(
        <FormField
          label="Agree"
          name="agree"
          type="checkbox"
          value={false}
          onChange={() => {}}
          tooltip="Checkbox help text"
        />
      )

      expect(screen.getByLabelText('More information')).toBeInTheDocument()
    })
  })

  describe('disabled state', () => {
    it('disables text input', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('disables select', () => {
      const options = [{ value: '1', label: 'Option 1' }]
      render(
        <FormField
          label="Choice"
          name="choice"
          type="select"
          value=""
          onChange={() => {}}
          options={options}
          disabled
        />
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeDisabled()
    })

    it('disables textarea', () => {
      render(
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value=""
          onChange={() => {}}
          disabled
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('disables checkbox', () => {
      render(
        <FormField
          label="Agree"
          name="agree"
          type="checkbox"
          value={false}
          onChange={() => {}}
          disabled
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })
  })

  describe('maxLength enforcement', () => {
    it('applies default maxLength for text input', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '200')
    })

    it('applies custom maxLength when provided', () => {
      render(<FormField label="Name" name="name" value="" onChange={() => {}} maxLength={50} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '50')
    })

    it('applies email maxLength for email type', () => {
      render(<FormField label="Email" name="email" type="email" value="" onChange={() => {}} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '254')
    })

    it('applies textarea maxLength', () => {
      render(
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value=""
          onChange={() => {}}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('maxLength', '5000')
    })

    it('applies custom maxLength to textarea', () => {
      render(
        <FormField
          label="Description"
          name="description"
          type="textarea"
          value=""
          onChange={() => {}}
          maxLength={1000}
        />
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('maxLength', '1000')
    })
  })

  describe('custom className', () => {
    it('applies custom className to wrapper', () => {
      const { container } = render(
        <FormField
          label="Name"
          name="name"
          value=""
          onChange={() => {}}
          className="custom-wrapper"
        />
      )

      expect(container.firstChild.className).toContain('custom-wrapper')
    })
  })
})
