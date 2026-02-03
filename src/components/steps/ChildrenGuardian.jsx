import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, FormField, Alert } from '../ui'
import { US_STATES, CHILD_RELATIONSHIP_OPTIONS } from '../../constants'

export function ChildrenGuardian({ data, guardian, onChange, onArrayChange, errors = {} }) {
  const handleGuardianChange = (e) => {
    const { name, value } = e.target
    onChange('guardian', name, value)
  }

  const addChild = () => {
    onArrayChange('children', [
      ...data,
      { name: '', dateOfBirth: '', isMinor: true, relationship: 'biological' }
    ])
  }

  const updateChild = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onArrayChange('children', updated)
  }

  const removeChild = (index) => {
    onArrayChange('children', data.filter((_, i) => i !== index))
  }

  const hasMinorChildren = data.some(child => child.isMinor)

  return (
    <div className="space-y-6">
      <Card
        title="Children"
        description="List all of your children, including adult children. This ensures they are properly identified in your will."
      >
        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No children added. Click the button below to add a child.
            </p>
          ) : (
            data.map((child, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Child {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeChild(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="Remove child"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    name={`child-${index}-name`}
                    value={child.name}
                    onChange={(e) => updateChild(index, 'name', e.target.value)}
                    placeholder="Child's full legal name"
                    required
                  />

                  <FormField
                    label="Date of Birth"
                    name={`child-${index}-dob`}
                    type="date"
                    value={child.dateOfBirth}
                    onChange={(e) => updateChild(index, 'dateOfBirth', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Relationship"
                    name={`child-${index}-relationship`}
                    type="select"
                    value={child.relationship}
                    onChange={(e) => updateChild(index, 'relationship', e.target.value)}
                    options={CHILD_RELATIONSHIP_OPTIONS}
                  />

                  <div className="flex items-end">
                    <FormField
                      type="checkbox"
                      name={`child-${index}-minor`}
                      label="This child is currently a minor (under 18)"
                      value={child.isMinor}
                      onChange={(e) => updateChild(index, 'isMinor', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}

          <button
            type="button"
            onClick={addChild}
            className="
              w-full py-3 px-4 rounded-lg border-2 border-dashed
              border-gray-300 dark:border-gray-600
              text-gray-600 dark:text-gray-400
              hover:border-blue-500 hover:text-blue-500
              dark:hover:border-blue-400 dark:hover:text-blue-400
              transition-colors flex items-center justify-center gap-2
            "
          >
            <Plus className="w-5 h-5" />
            Add Child
          </button>
        </div>
      </Card>

      {hasMinorChildren && (
        <>
          <Card
            title="Guardian for Minor Children"
            description="Designate who will care for your minor children if you and the other parent are unable to."
          >
            <div className="space-y-4">
              <FormField
                label="Guardian's Full Legal Name"
                name="name"
                value={guardian.name}
                onChange={handleGuardianChange}
                placeholder="e.g., Mary Elizabeth Johnson"
                required
                error={errors['guardian.name']}
                tooltip="This person will have physical custody and make decisions about your minor children's upbringing."
              />

              <FormField
                label="Relationship to Children"
                name="relationship"
                value={guardian.relationship}
                onChange={handleGuardianChange}
                placeholder="e.g., Aunt, Grandmother, Family Friend"
                required
              />

              <FormField
                label="Street Address"
                name="address"
                value={guardian.address}
                onChange={handleGuardianChange}
                placeholder="321 Elm Street"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  label="City"
                  name="city"
                  value={guardian.city}
                  onChange={handleGuardianChange}
                  placeholder="Jacksonville"
                  className="col-span-2 md:col-span-1"
                />

                <FormField
                  label="State"
                  name="state"
                  type="select"
                  value={guardian.state}
                  onChange={handleGuardianChange}
                  options={[
                    { value: '', label: 'Select...' },
                    ...US_STATES
                  ]}
                  className="col-span-1"
                />

                <FormField
                  label="ZIP Code"
                  name="zip"
                  value={guardian.zip}
                  onChange={handleGuardianChange}
                  placeholder="32099"
                  className="col-span-1"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Alternate Guardian"
            description="If your first choice cannot serve as guardian."
          >
            <div className="space-y-4">
              <FormField
                label="Alternate Guardian's Full Legal Name"
                name="alternateName"
                value={guardian.alternateName}
                onChange={handleGuardianChange}
                placeholder="e.g., Thomas David Johnson"
                tooltip="Naming an alternate ensures your children will be cared for by someone you trust even if your first choice is unavailable."
              />

              <FormField
                label="Relationship to Children"
                name="alternateRelationship"
                value={guardian.alternateRelationship}
                onChange={handleGuardianChange}
                placeholder="e.g., Uncle"
              />

              {guardian.alternateName && (
                <>
                  <FormField
                    label="Street Address"
                    name="alternateAddress"
                    value={guardian.alternateAddress}
                    onChange={handleGuardianChange}
                    placeholder="654 Maple Drive"
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      label="City"
                      name="alternateCity"
                      value={guardian.alternateCity}
                      onChange={handleGuardianChange}
                      placeholder="Fort Lauderdale"
                      className="col-span-2 md:col-span-1"
                    />

                    <FormField
                      label="State"
                      name="alternateState"
                      type="select"
                      value={guardian.alternateState}
                      onChange={handleGuardianChange}
                      options={[
                        { value: '', label: 'Select...' },
                        ...US_STATES
                      ]}
                      className="col-span-1"
                    />

                    <FormField
                      label="ZIP Code"
                      name="alternateZip"
                      value={guardian.alternateZip}
                      onChange={handleGuardianChange}
                      placeholder="33301"
                      className="col-span-1"
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          <Alert variant="warning" title="Important Note About Guardianship">
            Your guardian nomination is a strong recommendation to the court, but the court
            will make the final decision based on the best interests of the child. The other
            surviving parent typically has priority unless there are circumstances that would
            make that inappropriate.
          </Alert>
        </>
      )}

      {data.length === 0 && (
        <Alert variant="info">
          If you have no children, you can proceed to the next step. Your estate will be
          distributed according to your instructions without guardian provisions.
        </Alert>
      )}
    </div>
  )
}

export default ChildrenGuardian
