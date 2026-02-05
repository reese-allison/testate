import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, FormField, Alert } from '../ui'
import { useArrayItemManager } from '../../hooks/useArrayItemManager'

const GIFT_TYPES = [
  { value: 'cash', label: 'Cash/Money' },
  { value: 'property', label: 'Real Property (House, Land)' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'art', label: 'Art/Collectibles' },
  { value: 'furniture', label: 'Furniture/Household Items' },
  { value: 'investment', label: 'Investment Accounts' },
  { value: 'other', label: 'Other Personal Property' },
]

export function SpecificGifts({ data, onChange, errors = {} }) {
  const {
    addItem: addGift,
    updateItem: updateGift,
    removeItem: removeGift,
  } = useArrayItemManager('specificGifts', data, onChange, 'gift')

  const getPlaceholder = type => {
    switch (type) {
      case 'cash':
        return 'e.g., $10,000 (ten thousand dollars)'
      case 'property':
        return 'e.g., My home located at 123 Main Street, Miami, FL 33101'
      case 'vehicle':
        return 'e.g., My 2022 Toyota Camry, VIN: ABC123456789'
      case 'jewelry':
        return 'e.g., My diamond engagement ring and gold watch collection'
      case 'art':
        return 'e.g., My collection of original oil paintings'
      case 'investment':
        return 'e.g., My Fidelity brokerage account #12345'
      default:
        return 'Describe the specific item(s) in detail'
    }
  }

  return (
    <div className="space-y-6">
      <Card
        title="Specific Gifts"
        description="Leave specific items or amounts to particular people or organizations. These gifts are distributed first, before the rest of your estate."
      >
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center py-4">
              No specific gifts added. Click the button below to add a gift, or proceed to the next
              step to distribute your entire estate.
            </p>
          ) : (
            data.map((gift, index) => (
              <div
                key={gift.id || index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Gift {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeGift(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label={`Remove gift ${index + 1}${gift.beneficiary ? ` to ${gift.beneficiary}` : ''}`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <FormField
                  label="Type of Gift"
                  name={`gift-${index}-type`}
                  type="select"
                  value={gift.type}
                  onChange={e => updateGift(index, 'type', e.target.value)}
                  options={GIFT_TYPES}
                />

                <FormField
                  label="Description"
                  name={`gift-${index}-description`}
                  type="textarea"
                  value={gift.description}
                  onChange={e => updateGift(index, 'description', e.target.value)}
                  placeholder={getPlaceholder(gift.type)}
                  required
                  rows={2}
                  tooltip="Be as specific as possible to avoid confusion. Include identifying details like addresses, serial numbers, or account numbers."
                  error={errors[`gift_${index}_description`]}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Beneficiary Name"
                    name={`gift-${index}-beneficiary`}
                    value={gift.beneficiary}
                    onChange={e => updateGift(index, 'beneficiary', e.target.value)}
                    placeholder="Full legal name of recipient"
                    required
                    tooltip="Enter the full legal name of the person or organization to receive this gift."
                    error={errors[`gift_${index}_beneficiary`]}
                  />

                  <FormField
                    label="Relationship to You"
                    name={`gift-${index}-relationship`}
                    value={gift.beneficiaryRelationship}
                    onChange={e => updateGift(index, 'beneficiaryRelationship', e.target.value)}
                    placeholder="e.g., Nephew, Charity, Friend"
                  />
                </div>

                <FormField
                  label="Alternative Beneficiary (Optional)"
                  name={`gift-${index}-alternative`}
                  value={gift.alternativeBeneficiary}
                  onChange={e => updateGift(index, 'alternativeBeneficiary', e.target.value)}
                  placeholder="Who should receive this if the primary beneficiary predeceases you?"
                  tooltip="If the primary beneficiary dies before you, this person will receive the gift instead."
                />

                <FormField
                  label="Conditions (Optional)"
                  name={`gift-${index}-conditions`}
                  type="textarea"
                  value={gift.conditions}
                  onChange={e => updateGift(index, 'conditions', e.target.value)}
                  placeholder="e.g., To be received upon reaching age 25"
                  rows={2}
                  tooltip="Any conditions that must be met for the beneficiary to receive this gift."
                />
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addGift}
            aria-label="Add a new specific gift to your will"
            className="
              w-full py-3 px-4 rounded-lg border-2 border-dashed
              border-gray-300 dark:border-gray-600
              text-gray-600 dark:text-gray-300
              hover:border-blue-500 hover:text-blue-500
              dark:hover:border-blue-400 dark:hover:text-blue-400
              transition-colors flex items-center justify-center gap-2
            "
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
            Add Specific Gift
          </button>
        </div>
      </Card>

      <Alert variant="info" title="Tips for Specific Gifts">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Be specific - describe items clearly so there's no confusion</li>
          <li>For real estate, include the full address and legal description if possible</li>
          <li>For vehicles, include year, make, model, and VIN</li>
          <li>For bank/investment accounts, include account numbers</li>
          <li>Consider what happens if the item no longer exists when you pass</li>
        </ul>
      </Alert>

      <Alert variant="warning" title="About Beneficiary Designations">
        Some assets pass outside your will through beneficiary designations (life insurance,
        retirement accounts, TOD/POD accounts). Review these designations to ensure they align with
        your wishes. This will only controls assets in your name without a designated beneficiary.
      </Alert>
    </div>
  )
}
