import React, { useState, useMemo, useCallback } from 'react'
import { Download, RotateCcw, AlertCircle } from 'lucide-react'
import { Card, Alert } from '../ui'
import { generateWillText } from '../../utils/willTextGenerator'
import { validateFullForm } from '../../utils/validation'
import { getStateConfig, DEFAULT_STATE } from '../../constants'

function Section({ title, children, show = true }) {
  if (!show) return null
  return (
    <div className="py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</h4>
      <div className="text-gray-900 dark:text-white">{children}</div>
    </div>
  )
}

export function ReviewGenerate({ formData, onReset }) {
  const stateConfig = getStateConfig(formData.testator?.residenceState || DEFAULT_STATE)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [showThankYou, setShowThankYou] = useState(false)

  // Memoize validation errors
  const validationErrors = useMemo(() => validateFullForm(formData), [formData])
  const hasErrors = Object.keys(validationErrors).length > 0

  // Memoize will text generation
  const willText = useMemo(() => generateWillText(formData), [formData])

  // Lazy load PDF generation for bundle optimization
  const handleGeneratePDF = useCallback(async () => {
    // Prevent PDF generation if there are validation errors
    if (hasErrors) {
      setError(
        'Please fix all validation errors before generating your will. Go back to previous steps and complete all required fields.'
      )
      return
    }

    setIsGenerating(true)
    setError(null)
    setShowThankYou(false)
    try {
      // Lazy load the PDF generator module
      const { generatePDF } = await import('../../utils/pdfGenerator')
      await generatePDF(formData)
      setShowThankYou(true)
    } catch (err) {
      console.error('PDF generation error:', err)
      setError('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }, [formData, hasErrors])

  const {
    testator,
    executor,
    children,
    guardian,
    specificGifts,
    residuaryEstate,
    digitalAssets,
    pets,
    funeral,
    disinheritance,
  } = formData

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="error" title="Validation Errors Found">
          <p>Please go back and fix the following issues before generating your will:</p>
          <ul className="list-disc list-inside mt-2">
            {Object.values(validationErrors).map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Alert variant="warning" title="Review Carefully Before Generating">
        Please review all information below. Once generated, you'll need to print, sign, and have
        the will properly witnessed according to {stateConfig.name} law ({stateConfig.witnesses}{' '}
        witnesses and a notary for the self-proving affidavit).
      </Alert>

      {/* Summary Cards */}
      <Card title="Testator Information">
        <Section title="Full Legal Name">{testator.fullName || 'Not provided'}</Section>
        <Section title="Address">
          {testator.address}, {testator.city}, {testator.state} {testator.zip}
        </Section>
        <Section title="County">{testator.county}</Section>
        <Section title="Marital Status">
          {testator.maritalStatus === 'married'
            ? `Married to ${testator.spouseName}`
            : testator.maritalStatus
              ? testator.maritalStatus.charAt(0).toUpperCase() + testator.maritalStatus.slice(1)
              : 'Not specified'}
        </Section>
      </Card>

      <Card title="Personal Representative (Executor)">
        <Section title="Primary">
          {executor.name} ({executor.relationship})
        </Section>
        <Section title="Alternate" show={!!executor.alternateName}>
          {executor.alternateName} ({executor.alternateRelationship})
        </Section>
        <Section title="Bond Required">{executor.bondRequired ? 'Yes' : 'No (waived)'}</Section>
      </Card>

      <Card title="Children & Guardian" show={children.length > 0}>
        <Section title="Children">
          <ul className="list-disc list-inside">
            {children.map((child, i) => (
              <li key={child.id || i}>
                {child.name} ({child.relationship}
                {child.isMinor ? ', minor' : ''})
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Guardian" show={!!guardian.name && children.some(c => c.isMinor)}>
          {guardian.name} ({guardian.relationship})
          {guardian.alternateName && (
            <span className="text-sm text-gray-600 ml-2">Alt: {guardian.alternateName}</span>
          )}
        </Section>
      </Card>

      <Card title="Specific Gifts" show={specificGifts.length > 0}>
        {specificGifts.map((gift, i) => (
          <Section key={gift.id || i} title={`Gift ${i + 1}`}>
            <p>
              <strong>To:</strong> {gift.beneficiary}
            </p>
            <p>
              <strong>Item:</strong> {gift.description}
            </p>
            {gift.conditions && (
              <p>
                <strong>Conditions:</strong> {gift.conditions}
              </p>
            )}
          </Section>
        ))}
      </Card>

      <Card title="Residuary Estate Distribution">
        <Section title="Distribution Method">
          {residuaryEstate.distributionType === 'spouse' && 'Everything to spouse'}
          {residuaryEstate.distributionType === 'children' && 'Everything to children equally'}
          {residuaryEstate.distributionType === 'split' &&
            `${residuaryEstate.spouseShare}% to spouse, ${residuaryEstate.childrenShare}% to children`}
          {residuaryEstate.distributionType === 'custom' && 'Custom distribution'}
        </Section>
        {residuaryEstate.distributionType === 'custom' && residuaryEstate.customBeneficiaries && (
          <Section title="Custom Beneficiaries">
            <ul className="list-disc list-inside">
              {residuaryEstate.customBeneficiaries.map((b, i) => (
                <li key={b.id || i}>
                  {b.name}: {b.share}%
                </li>
              ))}
            </ul>
          </Section>
        )}
        <Section title="Per Stirpes">{residuaryEstate.perStirpes ? 'Yes' : 'No'}</Section>
      </Card>

      <Card
        title="Additional Provisions"
        show={digitalAssets.include || pets.include || funeral.include}
      >
        <Section title="Digital Assets" show={digitalAssets.include}>
          Fiduciary: {digitalAssets.fiduciary || 'Not specified'}
        </Section>
        <Section title="Pet Care" show={pets.include && pets.items?.length > 0}>
          {pets.items?.length} pet(s) with designated caretakers
        </Section>
        <Section title="Funeral Wishes" show={funeral.include}>
          {funeral.preference} - {funeral.serviceType}
        </Section>
      </Card>

      <Card
        title="Disinheritance"
        show={disinheritance.include && disinheritance.persons?.length > 0}
      >
        <ul className="list-disc list-inside">
          {disinheritance.persons?.map((p, i) => (
            <li key={p.id || i}>
              {p.name} ({p.relationship})
            </li>
          ))}
        </ul>
      </Card>

      {/* Will Preview */}
      <Card title="Will Document Preview">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 dark:text-gray-200">
            {willText}
          </pre>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleGeneratePDF}
          disabled={isGenerating || hasErrors}
          aria-label={
            hasErrors ? 'Fix validation errors before downloading' : 'Download will as PDF'
          }
          className={`
            flex-1 py-3 px-6 rounded-lg
            text-white font-medium
            flex items-center justify-center gap-2
            transition-colors
            ${
              hasErrors
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
            }
          `}
        >
          {isGenerating ? (
            <>
              <div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                role="status"
                aria-label="Generating PDF"
              />
              Generating...
            </>
          ) : hasErrors ? (
            <>
              <AlertCircle className="w-5 h-5" aria-hidden="true" />
              Fix Errors First
            </>
          ) : (
            <>
              <Download className="w-5 h-5" aria-hidden="true" />
              Download PDF
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          aria-label="Start over and clear all form data"
          className="
            py-3 px-6 rounded-lg
            border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800
            font-medium
            flex items-center justify-center gap-2
            transition-colors
          "
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
          Start Over
        </button>
      </div>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {showThankYou && (
        <Alert variant="success" title="Download Complete">
          <p>Your will document has been downloaded successfully.</p>
          <p className="mt-2 text-sm">
            If this tool was helpful, consider{' '}
            <a
              href="https://ko-fi.com/reeseallison"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              supporting the project
            </a>{' '}
            to help keep it free and maintained.
          </p>
        </Alert>
      )}

      {/* Legal Disclaimer */}
      <Alert variant="info" title="Important Legal Information">
        <div className="space-y-2 mt-2">
          <p>
            <strong>This is a template tool, not legal advice.</strong> The generated document is
            provided for informational purposes only.
          </p>
          <p>To make this will legally valid in {stateConfig.name}, you must:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be at least 18 years old and of sound mind</li>
            <li>Sign the will in the presence of {stateConfig.witnesses} witnesses</li>
            <li>Have all witnesses sign in your presence and each other's presence</li>
            <li>For the self-proving affidavit: sign before a notary public with witnesses</li>
          </ul>
          <p className="font-medium mt-3">
            For complex estates, blended families, or business interests, consult a licensed
            attorney in {stateConfig.name}.
          </p>
        </div>
      </Alert>
    </div>
  )
}
