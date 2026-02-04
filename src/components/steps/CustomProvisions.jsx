import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, FormField, Alert } from '../ui'

export function CustomProvisions({ data, onChange, errors = {} }) {
  const { include, items } = data

  const handleIncludeChange = (e) => {
    onChange('customProvisions', 'include', e.target.checked)
  }

  const addProvision = () => {
    const current = items || []
    onChange('customProvisions', 'items', [
      ...current,
      { title: '', content: '' }
    ])
  }

  const updateProvision = (index, field, value) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange('customProvisions', 'items', updated)
  }

  const removeProvision = (index) => {
    onChange('customProvisions', 'items', items.filter((_, i) => i !== index))
  }

  return (
    <Card
      title="Custom Provisions"
      description="Add your own custom clauses or provisions to your will."
    >
      <div className="space-y-4">
        <FormField
          type="checkbox"
          name="customProvisions-include"
          label="Include custom provisions in my will"
          value={include}
          onChange={handleIncludeChange}
        />

        {include && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Alert variant="info">
              Custom provisions allow you to add specific clauses that are not covered by the
              standard sections. Each provision will appear as a separate article in your will.
            </Alert>

            {(items || []).map((provision, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Custom Provision {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeProvision(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label={`Remove provision ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <FormField
                  label="Provision Title"
                  name={`customProvision-${index}-title`}
                  value={provision.title}
                  onChange={(e) => updateProvision(index, 'title', e.target.value)}
                  placeholder="e.g., Specific Business Instructions, Family Heirloom Distribution"
                  required
                  error={errors[`customProvision_${index}_title`]}
                />

                <FormField
                  label="Provision Content"
                  name={`customProvision-${index}-content`}
                  type="textarea"
                  value={provision.content}
                  onChange={(e) => updateProvision(index, 'content', e.target.value)}
                  placeholder="Enter the full text of your custom provision..."
                  rows={4}
                  required
                  error={errors[`customProvision_${index}_content`]}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addProvision}
              className="
                w-full py-3 px-4 rounded-lg border-2 border-dashed
                border-gray-300 dark:border-gray-600
                text-gray-600 dark:text-gray-400
                hover:border-blue-500 hover:text-blue-500
                transition-colors flex items-center justify-center gap-2
              "
            >
              <Plus className="w-5 h-5" />
              Add Custom Provision
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default CustomProvisions
