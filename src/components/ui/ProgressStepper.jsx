import React from 'react'
import { Check } from 'lucide-react'

export function ProgressStepper({ steps, currentStep, onStepClick }) {
  const progress = ((currentStep) / (steps.length - 1)) * 100

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
      <div className="flex overflow-x-auto pb-2 gap-1 md:gap-0 md:justify-between scrollbar-hide">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = index <= currentStep

          return (
            <button
              key={index}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={`
                flex flex-col items-center min-w-[80px] md:min-w-0 md:flex-1
                ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  font-medium text-sm transition-colors
                  ${isCompleted
                    ? 'bg-blue-600 text-white'
                    : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`
                  mt-2 text-xs text-center whitespace-nowrap
                  ${isCurrent
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
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
