import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Tooltip from './Tooltip'

// Default max lengths to prevent DoS from extremely long inputs
const MAX_LENGTHS = {
  text: 200,
  email: 254,
  tel: 20,
  textarea: 5000,
  default: 500,
}

export const FormField = memo(function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  tooltip,
  options,
  rows = 3,
  disabled = false,
  className = '',
  maxLength,
  min,
  max,
  step,
}) {
  const errorId = error ? `${name}-error` : undefined
  const baseInputClass = `
    w-full px-3 py-2 rounded-lg border transition-colors
    bg-white dark:bg-gray-800
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${
      error
        ? 'border-red-500 dark:border-red-400'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
    }
  `

  const renderInput = () => {
    const commonAriaProps = {
      'aria-invalid': error ? 'true' : undefined,
      'aria-describedby': errorId,
      'aria-required': required ? 'true' : undefined,
    }

    if (type === 'select' && options) {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseInputClass}
          {...commonAriaProps}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength || MAX_LENGTHS.textarea}
          className={`${baseInputClass} resize-none`}
          {...commonAriaProps}
        />
      )
    }

    if (type === 'checkbox') {
      // For checkbox, the label is rendered inline with the input
      // No separate label element is needed
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value}
            onChange={onChange}
            disabled={disabled}
            className="custom-checkbox"
            {...commonAriaProps}
          />
          <label htmlFor={name} className="text-sm text-gray-700 dark:text-gray-200 cursor-pointer">
            {label}
          </label>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
      )
    }

    return (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength || MAX_LENGTHS[type] || MAX_LENGTHS.default}
        min={min}
        max={max}
        step={step}
        className={baseInputClass}
        {...commonAriaProps}
      />
    )
  }

  // Checkbox has its own label handling inside renderInput
  if (type === 'checkbox') {
    return (
      <div className={`${className}`}>
        {renderInput()}
        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-1 mb-1">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && (
            <span className="text-red-600 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      {renderInput()}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

FormField.displayName = 'FormField'

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'text',
    'email',
    'tel',
    'textarea',
    'select',
    'checkbox',
    'number',
    'date',
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  tooltip: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
}
