import React from 'react'
import { Check, AlertTriangle } from 'lucide-react'

export function ProgressStepper({ steps, currentStep, onStepClick, stepValidation = [] }) {
  const progress = ((currentStep) / (steps.length - 1)) * 100

  const handleStepClick = (index) => {
    if (onStepClick) {
      onStepClick(index)
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleStepClick(index)
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
          />
        </div>
      </div>

      {/* Step indicators - horizontal scrollable on mobile */}
      <div
        className="flex overflow-x-auto pb-2 gap-1 md:gap-0 md:justify-between scrollbar-hide"
        role="navigation"
        aria-label="Form progress"
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isFuture = index > currentStep
          const isValid = stepValidation[index] !== false
          const hasError = isCompleted && !isValid

          return (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`${step.label}, Step ${index + 1} of ${steps.length}${isCompleted ? (hasError ? ', has errors' : ', completed') : isCurrent ? ', current step' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
              className={`
                flex flex-col items-center min-w-[80px] md:min-w-0 md:flex-1
                cursor-pointer group focus:outline-none
                ${isFuture ? 'opacity-60 hover:opacity-80' : ''}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-medium text-sm transition-all duration-200
                  group-focus:ring-2 group-focus:ring-offset-2 group-focus:ring-blue-500
                  dark:group-focus:ring-offset-gray-900
                  ${hasError
                    ? 'bg-amber-500 text-white group-hover:bg-amber-600 group-hover:scale-110'
                    : isCompleted
                      ? 'bg-blue-600 text-white group-hover:bg-blue-700 group-hover:scale-110'
                      : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900 group-hover:bg-blue-700'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 group-hover:scale-105'
                  }
                `}
              >
                {hasError ? <AlertTriangle className="w-4 h-4" /> : isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`
                  mt-2 text-xs text-center whitespace-nowrap transition-colors duration-200
                  ${isCurrent
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : isCompleted
                      ? 'text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }
                `}
              >
                {step.shortLabel || step.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Current step info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
}

export default ProgressStepper
