import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Save, AlertCircle } from 'lucide-react'
import { ProgressStepper, Alert } from './ui'
import {
  TestatorInfo,
  ExecutorInfo,
  ChildrenGuardian,
  SpecificGifts,
  EstateDistribution,
  AdditionalProvisions,
  CustomProvisions,
  Disinheritance,
  ReviewGenerate
} from './steps'
import { useWillState } from '../hooks/useWillState'
import { validateStep } from '../utils/validation'
import { getStateConfig } from '../constants'

const STEPS = [
  { label: 'Your Information', shortLabel: 'You', component: 'testator' },
  { label: 'Personal Representative', shortLabel: 'Executor', component: 'executor' },
  { label: 'Children & Guardian', shortLabel: 'Children', component: 'children' },
  { label: 'Specific Gifts', shortLabel: 'Gifts', component: 'gifts' },
  { label: 'Estate Distribution', shortLabel: 'Estate', component: 'estate' },
  { label: 'Additional Provisions', shortLabel: 'More', component: 'additional' },
  { label: 'Disinheritance', shortLabel: 'Disinherit', component: 'disinherit' },
  { label: 'Review & Generate', shortLabel: 'Review', component: 'review' }
]

export function WillGenerator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [showSaveNotice, setShowSaveNotice] = useState(false)
  const {
    formData,
    updateField,
    updateSection,
    updateArray,
    resetForm
  } = useWillState()

  // Get state configuration for current residence state
  const stateConfig = getStateConfig(formData.testator?.residenceState || 'FL')

  // Calculate validation status for all steps (for progress indicator)
  const stepValidationStatus = useMemo(() => {
    return STEPS.map((_, index) => {
      const stepErrors = validateStep(index, formData)
      return Object.keys(stepErrors).length === 0
    })
  }, [formData])

  // Clear specific error when field value changes
  const clearFieldError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  // Wrapper for updateField that clears errors on change
  const handleFieldChange = (section, field, value) => {
    updateField(section, field, value)
    clearFieldError(field)
  }

  // Wrapper for updateArray that clears related errors on change
  const handleArrayChange = (section, newArray) => {
    updateArray(section, newArray)
    // Clear any array-related errors (e.g., child_0_name, gift_1_description)
    setErrors(prev => {
      const newErrors = { ...prev }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('child_') || key.startsWith('gift_') ||
            key.startsWith('pet_') || key.startsWith('disinherit_') ||
            key.startsWith('custom_') || key.startsWith('customProvision_') ||
            key === 'customBeneficiaries' || key === 'distribution') {
          delete newErrors[key]
        }
      })
      return newErrors
    })
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setErrors({})
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleStepClick = (stepIndex) => {
    // Don't do anything if clicking the current step
    if (stepIndex === currentStep) {
      return
    }

    // Going backwards - always allowed, clear errors
    if (stepIndex < currentStep) {
      setErrors({})
      setCurrentStep(stepIndex)
      window.scrollTo(0, 0)
      return
    }

    // Going forwards - validate current step but allow navigation anyway
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      // Show errors but still allow navigation (user's choice)
      setErrors(stepErrors)
      // Use confirm dialog to let user decide
      const proceed = confirm(
        'There are validation errors on the current step. Do you want to continue anyway?\n\n' +
        'Note: You will need to fix these errors before generating your will.'
      )
      if (!proceed) {
        return
      }
    }

    // Navigate to the target step
    setErrors({})
    setCurrentStep(stepIndex)
    window.scrollTo(0, 0)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to start over? All your information will be cleared.')) {
      resetForm()
      setCurrentStep(0)
      setErrors({})
    }
  }

  const handleSave = () => {
    setShowSaveNotice(true)
    setTimeout(() => setShowSaveNotice(false), 3000)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TestatorInfo
            data={formData.testator}
            onChange={handleFieldChange}
            errors={errors}
          />
        )
      case 1:
        return (
          <ExecutorInfo
            data={formData.executor}
            onChange={handleFieldChange}
            errors={errors}
          />
        )
      case 2:
        return (
          <ChildrenGuardian
            data={formData.children}
            guardian={formData.guardian}
            onChange={handleFieldChange}
            onArrayChange={handleArrayChange}
            errors={errors}
          />
        )
      case 3:
        return (
          <SpecificGifts
            data={formData.specificGifts}
            onChange={handleArrayChange}
            errors={errors}
          />
        )
      case 4:
        return (
          <EstateDistribution
            data={formData.residuaryEstate}
            testator={formData.testator}
            children={formData.children}
            onChange={handleFieldChange}
            errors={errors}
          />
        )
      case 5:
        return (
          <>
            <AdditionalProvisions
              data={{
                digitalAssets: formData.digitalAssets,
                pets: formData.pets,
                funeral: formData.funeral,
                realProperty: formData.realProperty,
                debtsAndTaxes: formData.debtsAndTaxes
              }}
              onChange={handleFieldChange}
              errors={errors}
              residenceState={formData.testator?.residenceState}
            />
            <div className="mt-6">
              <CustomProvisions
                data={formData.customProvisions}
                onChange={handleFieldChange}
                errors={errors}
              />
            </div>
          </>
        )
      case 6:
        return (
          <Disinheritance
            data={formData.disinheritance}
            onChange={handleFieldChange}
            errors={errors}
            residenceState={formData.testator?.residenceState}
          />
        )
      case 7:
        return (
          <ReviewGenerate
            formData={formData}
            onReset={handleReset}
          />
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* Progress Stepper */}
      <ProgressStepper
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        stepValidation={stepValidationStatus}
      />

      {/* Save Notice */}
      {showSaveNotice && (
        <Alert variant="success" className="mb-4">
          Your progress is automatically saved to your browser.
        </Alert>
      )}

      {/* Auto-save notice on first visit */}
      {currentStep === 0 && (
        <Alert variant="info" className="mb-6">
          <div className="flex items-start gap-2">
            <Save className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Auto-Save Enabled:</strong> Your progress is automatically saved to your
              browser. You can close this page and return later to continue where you left off.
            </div>
          </div>
        </Alert>
      )}

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert variant="error" className="mb-6" title="Please fix the following errors:">
          <ul className="list-disc list-inside mt-2">
            {Object.values(errors).map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Step Content */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {currentStep < STEPS.length - 1 && (
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`
              py-3 px-6 rounded-lg font-medium
              flex items-center gap-2 transition-colors
              ${currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="
              py-3 px-6 rounded-lg font-medium
              bg-blue-600 text-white hover:bg-blue-700
              flex items-center gap-2 transition-colors
            "
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Legal Disclaimer Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Disclaimer:</strong> This tool provides a template for informational purposes
            only and does not constitute legal advice. The use of this tool does not create an
            attorney-client relationship. For complex estates or specific legal questions, please
            consult a licensed attorney in your state.
          </p>
        </div>
      </div>
    </div>
  )
}

export default WillGenerator
