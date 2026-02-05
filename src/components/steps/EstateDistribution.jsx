import React from 'react'
import PropTypes from 'prop-types'
import { Plus, Trash2 } from 'lucide-react'
import { Card, FormField, Alert } from '../ui'

export function EstateDistribution({ data, testator, children, onChange }) {
  const isMarried = testator.maritalStatus === 'married'
  const hasChildren = children.length > 0

  const handleChange = (field, value) => {
    onChange('residuaryEstate', field, value)
  }

  const handleDistributionTypeChange = e => {
    const newType = e.target.value
    handleChange('distributionType', newType)

    // Set default shares based on type
    if (newType === 'spouse') {
      handleChange('spouseShare', 100)
      handleChange('childrenShare', 0)
    } else if (newType === 'children') {
      handleChange('spouseShare', 0)
      handleChange('childrenShare', 100)
    } else if (newType === 'split') {
      handleChange('spouseShare', 50)
      handleChange('childrenShare', 50)
    }
  }

  const addCustomBeneficiary = () => {
    const current = data.customBeneficiaries || []
    onChange('residuaryEstate', 'customBeneficiaries', [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        name: '',
        relationship: '',
        share: 0,
      },
    ])
  }

  const updateCustomBeneficiary = (index, field, value) => {
    const updated = [...data.customBeneficiaries]
    updated[index] = { ...updated[index], [field]: value }
    onChange('residuaryEstate', 'customBeneficiaries', updated)
  }

  const removeCustomBeneficiary = index => {
    onChange(
      'residuaryEstate',
      'customBeneficiaries',
      data.customBeneficiaries.filter((_, i) => i !== index)
    )
  }

  const getTotalCustomShare = () => {
    if (!data.customBeneficiaries) return 0
    return data.customBeneficiaries.reduce((sum, b) => sum + (Number(b.share) || 0), 0)
  }

  const getDistributionOptions = () => {
    const options = [{ value: '', label: 'Select distribution method...' }]

    if (isMarried) {
      options.push({ value: 'spouse', label: 'Everything to my spouse' })
    }

    if (hasChildren) {
      options.push({ value: 'children', label: 'Everything to my children (equally)' })
    }

    if (isMarried && hasChildren) {
      options.push({ value: 'split', label: 'Split between spouse and children' })
    }

    options.push({ value: 'custom', label: 'Custom distribution' })

    return options
  }

  return (
    <div className="space-y-6">
      <Card
        title="Residuary Estate Distribution"
        description="After specific gifts are distributed and debts are paid, how should the remainder of your estate be divided?"
      >
        <div className="space-y-6">
          <FormField
            label="Distribution Method"
            name="distributionType"
            type="select"
            value={data.distributionType}
            onChange={handleDistributionTypeChange}
            options={getDistributionOptions()}
            tooltip="The residuary estate is everything left after specific gifts and debts."
          />

          {data.distributionType === 'split' && isMarried && hasChildren && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white">Percentage Split</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label={`To Spouse (${testator.spouseName || 'spouse'})`}
                  name="spouseShare"
                  type="number"
                  value={data.spouseShare}
                  onChange={e => {
                    const spouseShare = Number(e.target.value)
                    handleChange('spouseShare', spouseShare)
                    handleChange('childrenShare', 100 - spouseShare)
                  }}
                  placeholder="50"
                  min={0}
                  max={100}
                  step={1}
                />
                <FormField
                  label="To Children (divided equally)"
                  name="childrenShare"
                  type="number"
                  value={data.childrenShare}
                  onChange={e => {
                    const childrenShare = Number(e.target.value)
                    handleChange('childrenShare', childrenShare)
                    handleChange('spouseShare', 100 - childrenShare)
                  }}
                  placeholder="50"
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
                Total: {Number(data.spouseShare) + Number(data.childrenShare)}%
                {Number(data.spouseShare) + Number(data.childrenShare) !== 100 && (
                  <span className="text-red-500 ml-2" role="alert">
                    (Must equal 100%)
                  </span>
                )}
              </p>
            </div>
          )}

          {data.distributionType === 'custom' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Add beneficiaries and specify what percentage each should receive. Percentages must
                total 100%.
              </p>

              {(data.customBeneficiaries || []).map((beneficiary, index) => (
                <div
                  key={beneficiary.id || index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Beneficiary {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeCustomBeneficiary(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                      aria-label={`Remove beneficiary ${index + 1}${beneficiary.name ? `: ${beneficiary.name}` : ''}`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="Name"
                      name={`custom-${index}-name`}
                      value={beneficiary.name}
                      onChange={e => updateCustomBeneficiary(index, 'name', e.target.value)}
                      placeholder="Full legal name"
                      required
                    />
                    <FormField
                      label="Relationship"
                      name={`custom-${index}-relationship`}
                      value={beneficiary.relationship}
                      onChange={e => updateCustomBeneficiary(index, 'relationship', e.target.value)}
                      placeholder="e.g., Sibling, Charity"
                    />
                    <FormField
                      label="Percentage"
                      name={`custom-${index}-share`}
                      type="number"
                      value={beneficiary.share}
                      onChange={e => updateCustomBeneficiary(index, 'share', e.target.value)}
                      placeholder="25"
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addCustomBeneficiary}
                aria-label="Add a custom beneficiary to your estate distribution"
                className="
                  w-full py-3 px-4 rounded-lg border-2 border-dashed
                  border-gray-300 dark:border-gray-600
                  text-gray-600 dark:text-gray-300
                  hover:border-blue-500 hover:text-blue-500
                  transition-colors flex items-center justify-center gap-2
                "
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
                Add Beneficiary
              </button>

              {data.customBeneficiaries && data.customBeneficiaries.length > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
                  Total: {getTotalCustomShare()}%
                  {getTotalCustomShare() !== 100 && (
                    <span className="text-red-500 ml-2" role="alert">
                      (Must equal 100%)
                    </span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {hasChildren && (
        <Card title="Per Stirpes Distribution">
          <FormField
            type="checkbox"
            name="perStirpes"
            label="If a beneficiary predeceases me, their share passes to their descendants (per stirpes)"
            value={data.perStirpes}
            onChange={e => handleChange('perStirpes', e.target.checked)}
            tooltip="Per stirpes means if one of your children dies before you, their share goes to their children (your grandchildren) instead of being redistributed among your surviving children."
          />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {data.perStirpes
              ? 'If a beneficiary predeceases you, their descendants will inherit their share.'
              : 'If a beneficiary predeceases you, their share will be redistributed among the surviving beneficiaries.'}
          </p>
        </Card>
      )}

      <Alert variant="info" title="What is the Residuary Estate?">
        <p className="mt-1">The residuary estate is everything you own that:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Is not specifically gifted to someone in this will</li>
          <li>Doesn't pass by beneficiary designation (life insurance, retirement accounts)</li>
          <li>Doesn't pass by joint ownership</li>
        </ul>
        <p className="mt-2">This "catch-all" provision ensures nothing is left unaccounted for.</p>
      </Alert>
    </div>
  )
}

EstateDistribution.propTypes = {
  data: PropTypes.shape({
    distributionType: PropTypes.string,
    spouseShare: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    childrenShare: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    perStirpes: PropTypes.bool,
    customBeneficiaries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        relationship: PropTypes.string,
        share: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  }).isRequired,
  testator: PropTypes.shape({
    maritalStatus: PropTypes.string,
    spouseName: PropTypes.string,
  }).isRequired,
  children: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}
