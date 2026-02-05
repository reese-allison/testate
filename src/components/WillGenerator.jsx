import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { ProgressStepper, Alert, ConfirmDialog } from './ui'
import {
  TestatorInfo,
  ExecutorInfo,
  ChildrenGuardian,
  SpecificGifts,
  EstateDistribution,
  AdditionalProvisions,
  CustomProvisions,
  Disinheritance,
  ReviewGenerate,
} from './steps'
import { useWillState } from '../hooks/useWillState'
import { validateStep } from '../utils/validation'

const STEPS = [
  { label: 'Your Information', shortLabel: 'You', component: 'testator' },
  { label: 'Personal Representative', shortLabel: 'Executor', component: 'executor' },
  { label: 'Children & Guardian', shortLabel: 'Children', component: 'children' },
  { label: 'Specific Gifts', shortLabel: 'Gifts', component: 'gifts' },
  { label: 'Estate Distribution', shortLabel: 'Estate', component: 'estate' },
  { label: 'Additional Provisions', shortLabel: 'More', component: 'additional' },
  { label: 'Disinheritance', shortLabel: 'Disinherit', component: 'disinherit' },
  { label: 'Review & Generate', shortLabel: 'Review', component: 'review' },
]

export function WillGenerator() {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState({})
  const { formData, setFormData, updateField, updateArray, resetForm } = useWillState()

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'default',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: () => {},
  })

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  }, [])

  // Ref for error alert - focus when errors appear for accessibility
  const errorAlertRef = useRef(null)
  // Ref for step heading - focus after navigation for accessibility
  const stepHeadingRef = useRef(null)

  // Focus error alert when errors change (for screen reader accessibility)
  // But only if dialog is not open (dialog has its own focus management)
  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorAlertRef.current && !confirmDialog.isOpen) {
      errorAlertRef.current.focus()
    }
  }, [errors, confirmDialog.isOpen])

  // Calculate validation status for all visited steps
  const stepValidationStatus = useMemo(() => {
    return STEPS.map((_, index) => {
      if (index > currentStep) {
        return true // Assume valid until visited
      }
      const stepErrors = validateStep(index, formData)
      return Object.keys(stepErrors).length === 0
    })
  }, [formData, currentStep])

  // Clear specific error when field value changes
  const clearFieldError = useCallback(fieldName => {
    setErrors(prev => {
      if (prev[fieldName]) {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      }
      return prev
    })
  }, [])

  // Wrapper for updateField that clears errors on change
  const handleFieldChange = useCallback(
    (section, field, value) => {
      updateField(section, field, value)
      clearFieldError(field)
    },
    [updateField, clearFieldError]
  )

  // Wrapper for updateArray that clears errors on change
  const handleArrayChange = useCallback(
    (section, newArray) => {
      updateArray(section, newArray)
      // Clear errors when array data changes
      setErrors({})
    },
    [updateArray]
  )

  // Handler for top-level form fields (like survivorshipPeriod)
  const handleTopLevelChange = useCallback(
    (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))
    },
    [setFormData]
  )

  const handleNext = useCallback(() => {
    const stepErrors = validateStep(currentStep, formData)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setErrors({})
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
      // Focus the step heading after navigation for screen readers
      setTimeout(() => stepHeadingRef.current?.focus(), 0)
    }
  }, [currentStep, formData])

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setErrors({})
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
      // Focus the step heading after navigation for screen readers
      setTimeout(() => stepHeadingRef.current?.focus(), 0)
    }
  }, [currentStep])

  const handleStepClick = useCallback(
    stepIndex => {
      // Don't do anything if clicking the current step
      if (stepIndex === currentStep) {
        return
      }

      // Going backwards - always allowed, clear errors
      if (stepIndex < currentStep) {
        setErrors({})
        setCurrentStep(stepIndex)
        window.scrollTo(0, 0)
        setTimeout(() => stepHeadingRef.current?.focus(), 0)
        return
      }

      // Going forwards - validate current step but allow navigation anyway
      const stepErrors = validateStep(currentStep, formData)
      if (Object.keys(stepErrors).length > 0) {
        // Show errors but still allow navigation (user's choice)
        setErrors(stepErrors)
        // Use confirm dialog to let user decide
        setConfirmDialog({
          isOpen: true,
          title: 'Continue with Errors?',
          message:
            'There are validation errors on the current step. Do you want to continue anyway?\n\nNote: You will need to fix these errors before generating your will.',
          variant: 'warning',
          confirmLabel: 'Continue Anyway',
          cancelLabel: 'Stay Here',
          onConfirm: () => {
            setConfirmDialog(prev => ({ ...prev, isOpen: false }))
            setErrors({})
            setCurrentStep(stepIndex)
            window.scrollTo(0, 0)
          },
        })
        return
      }

      // Navigate to the target step
      setErrors({})
      setCurrentStep(stepIndex)
      window.scrollTo(0, 0)
      setTimeout(() => stepHeadingRef.current?.focus(), 0)
    },
    [currentStep, formData]
  )

  const handleReset = useCallback(() => {
    setConfirmDialog({
      isOpen: true,
      title: 'Start Over?',
      message:
        'Are you sure you want to start over? All your information will be cleared.\n\nThis action cannot be undone.',
      variant: 'destructive',
      confirmLabel: 'Yes, Start Over',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
        resetForm()
        setCurrentStep(0)
        setErrors({})
      },
    })
  }, [resetForm])

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <TestatorInfo data={formData.testator} onChange={handleFieldChange} errors={errors} />
        )
      case 1:
        return (
          <ExecutorInfo data={formData.executor} onChange={handleFieldChange} errors={errors} />
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
                debtsAndTaxes: formData.debtsAndTaxes,
                survivorshipPeriod: formData.survivorshipPeriod,
              }}
              onChange={handleFieldChange}
              onTopLevelChange={handleTopLevelChange}
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
        return <ReviewGenerate formData={formData} onReset={handleReset} />
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

      {/* Auto-save notice on first visit */}
      {currentStep === 0 && (
        <Alert variant="info" className="mb-6">
          <div className="flex items-start gap-2">
            <Save className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong>Auto-Save Enabled:</strong> Your progress is automatically saved to your
              browser. You can close this page and return later to continue where you left off.
            </div>
          </div>
        </Alert>
      )}

      {/* Validation Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorAlertRef}
          tabIndex={-1}
          className="focus:ring-2 focus:ring-red-500 focus:outline-none rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          <Alert variant="error" className="mb-6" title="Please fix the following errors:">
            <ul className="list-disc list-inside mt-2">
              {Object.values(errors).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </Alert>
        </div>
      )}

      {/* Step Title */}
      <h2
        ref={stepHeadingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6 focus:outline-none"
      >
        {STEPS[currentStep].label}
      </h2>

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation Buttons */}
      {currentStep < STEPS.length - 1 && (
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            aria-label={currentStep === 0 ? 'Previous step (disabled)' : 'Go to previous step'}
            className={`
              py-3 px-6 rounded-lg font-medium
              flex items-center gap-2 transition-colors
              ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Go to next step"
            className="
              py-3 px-6 rounded-lg font-medium
              bg-blue-600 text-white hover:bg-blue-700
              flex items-center gap-2 transition-colors
            "
          >
            Next
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={confirmDialog.cancelLabel}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />
    </div>
  )
}

export default WillGenerator
