import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Check, AlertTriangle } from 'lucide-react'

export const ProgressStepper = memo(function ProgressStepper({
  steps,
  currentStep,
  onStepClick,
  stepValidation = [],
}) {
  const progress = (currentStep / (steps.length - 1)) * 100

  const handleStepClick = index => {
    if (onStepClick) {
      onStepClick(index)
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleStepClick(index)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (index > 0) {
        handleStepClick(index - 1)
      }
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (index < steps.length - 1) {
        handleStepClick(index + 1)
      }
    }
  }

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Form progress: step ${currentStep + 1} of ${steps.length}`}
          />
        </div>
      </div>

      {/* Step indicators - horizontal scrollable on mobile */}
      <div
        className="flex overflow-x-auto pt-2 pb-2 gap-1 md:gap-0 md:justify-between scrollbar-hide"
        role="navigation"
        aria-label="Form progress"
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isValid = stepValidation[index] !== false
          const hasError = isCompleted && !isValid

          return (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              onKeyDown={e => handleKeyDown(e, index)}
              aria-label={`${step.label}, Step ${index + 1} of ${steps.length}${isCompleted ? (hasError ? ', has errors' : ', completed') : isCurrent ? ', current step' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex flex-col items-center min-w-[80px] md:min-w-0 md:flex-1 cursor-pointer group focus:outline-none"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-medium text-sm transition-all duration-200
                  group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-blue-500
                  dark:group-focus:ring-offset-gray-900
                  ${
                    hasError
                      ? 'bg-amber-500 text-white group-hover:bg-amber-600 group-hover:scale-110'
                      : isCompleted
                        ? 'bg-blue-600 text-white group-hover:bg-blue-700 group-hover:scale-110'
                        : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900 group-hover:bg-blue-700'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 group-hover:scale-105'
                  }
                `}
              >
                {hasError ? (
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                ) : isCompleted ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs text-center whitespace-nowrap transition-colors duration-200
                  ${
                    isCurrent
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : isCompleted
                        ? 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        : 'text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }
                `}
              >
                {step.shortLabel || step.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Current step info with aria-live for screen readers */}
      <div className="mt-4 text-center" aria-live="polite" aria-atomic="true">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
})

ProgressStepper.displayName = 'ProgressStepper'

ProgressStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      shortLabel: PropTypes.string,
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func,
  stepValidation: PropTypes.arrayOf(PropTypes.bool),
}
