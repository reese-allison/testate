import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Card, FormField, Alert } from '../ui'
import { getStateConfig } from '../../constants'

export function AdditionalProvisions({ data, onChange, errors = {}, residenceState = 'FL' }) {
  const { digitalAssets, pets, funeral, realProperty, debtsAndTaxes } = data
  const stateConfig = getStateConfig(residenceState)

  const handleDigitalAssetsChange = (field, value) => {
    onChange('digitalAssets', field, value)
  }

  const handleFuneralChange = (field, value) => {
    onChange('funeral', field, value)
  }

  const handleDebtsChange = (field, value) => {
    onChange('debtsAndTaxes', field, value)
  }

  // Pet handlers
  const addPet = () => {
    const current = pets.items || []
    onChange('pets', 'items', [
      ...current,
      { name: '', type: '', caretaker: '', alternatCaretaker: '', funds: '', instructions: '' }
    ])
  }

  const updatePet = (index, field, value) => {
    const updated = [...pets.items]
    updated[index] = { ...updated[index], [field]: value }
    onChange('pets', 'items', updated)
  }

  const removePet = (index) => {
    onChange('pets', 'items', pets.items.filter((_, i) => i !== index))
  }

  // Real property handlers
  const addProperty = () => {
    const current = realProperty.items || []
    onChange('realProperty', 'items', [
      ...current,
      { address: '', description: '', beneficiary: '', instructions: '' }
    ])
  }

  const updateProperty = (index, field, value) => {
    const updated = [...realProperty.items]
    updated[index] = { ...updated[index], [field]: value }
    onChange('realProperty', 'items', updated)
  }

  const removeProperty = (index) => {
    onChange('realProperty', 'items', realProperty.items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Digital Assets Section */}
      <Card
        title="Digital Assets"
        description="Provide instructions for your online accounts, cryptocurrency, and digital property."
      >
        <div className="space-y-4">
          <FormField
            type="checkbox"
            name="digitalAssets-include"
            label="Include digital assets provisions in my will"
            value={digitalAssets.include}
            onChange={(e) => handleDigitalAssetsChange('include', e.target.checked)}
          />

          {digitalAssets.include && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <FormField
                label="Digital Fiduciary (Person to manage digital assets)"
                name="digitalAssets-fiduciary"
                value={digitalAssets.fiduciary}
                onChange={(e) => handleDigitalAssetsChange('fiduciary', e.target.value)}
                placeholder="Full name of person to manage your digital assets"
                tooltip="This person will have authority to access, manage, and dispose of your digital assets."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Social Media Accounts"
                  name="digitalAssets-socialMedia"
                  type="select"
                  value={digitalAssets.socialMedia}
                  onChange={(e) => handleDigitalAssetsChange('socialMedia', e.target.value)}
                  options={[
                    { value: 'delete', label: 'Delete accounts' },
                    { value: 'memorialize', label: 'Memorialize (if available)' },
                    { value: 'transfer', label: 'Transfer to fiduciary' }
                  ]}
                />

                <FormField
                  label="Email Accounts"
                  name="digitalAssets-email"
                  type="select"
                  value={digitalAssets.email}
                  onChange={(e) => handleDigitalAssetsChange('email', e.target.value)}
                  options={[
                    { value: 'delete', label: 'Delete accounts' },
                    { value: 'transfer', label: 'Transfer access' },
                    { value: 'archive', label: 'Archive contents then delete' }
                  ]}
                />

                <FormField
                  label="Cloud Storage"
                  name="digitalAssets-cloudStorage"
                  type="select"
                  value={digitalAssets.cloudStorage}
                  onChange={(e) => handleDigitalAssetsChange('cloudStorage', e.target.value)}
                  options={[
                    { value: 'transfer', label: 'Transfer to fiduciary' },
                    { value: 'download', label: 'Download and distribute' },
                    { value: 'delete', label: 'Delete all contents' }
                  ]}
                />
              </div>

              <FormField
                label="Cryptocurrency / Digital Wallets"
                name="digitalAssets-cryptocurrency"
                type="textarea"
                value={digitalAssets.cryptocurrency}
                onChange={(e) => handleDigitalAssetsChange('cryptocurrency', e.target.value)}
                placeholder="Describe any cryptocurrency holdings and how they should be handled (DO NOT include private keys or seed phrases here)"
                rows={2}
                tooltip="Describe generally what you own. Store actual access credentials securely and separately."
              />

              <FormField
                label="Password Manager / Access Instructions"
                name="digitalAssets-passwordManager"
                type="textarea"
                value={digitalAssets.passwordManager}
                onChange={(e) => handleDigitalAssetsChange('passwordManager', e.target.value)}
                placeholder="e.g., I use LastPass. Master password and recovery key are in my safe deposit box at XYZ Bank."
                rows={2}
                tooltip="Don't put actual passwords here. Instead, explain where secure access information is stored."
              />

              <FormField
                label="Additional Digital Asset Instructions"
                name="digitalAssets-instructions"
                type="textarea"
                value={digitalAssets.instructions}
                onChange={(e) => handleDigitalAssetsChange('instructions', e.target.value)}
                placeholder="Any other instructions for handling digital assets..."
                rows={3}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Pet Care Section */}
      <Card
        title="Pet Care Provisions"
        description="Ensure your pets will be cared for by designating a caretaker and funds."
      >
        <div className="space-y-4">
          <FormField
            type="checkbox"
            name="pets-include"
            label="Include pet care provisions in my will"
            value={pets.include}
            onChange={(e) => onChange('pets', 'include', e.target.checked)}
          />

          {pets.include && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {(pets.items || []).map((pet, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">Pet {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removePet(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Pet Name"
                      name={`pet-${index}-name`}
                      value={pet.name}
                      onChange={(e) => updatePet(index, 'name', e.target.value)}
                      placeholder="e.g., Max"
                    />
                    <FormField
                      label="Type/Description"
                      name={`pet-${index}-type`}
                      value={pet.type}
                      onChange={(e) => updatePet(index, 'type', e.target.value)}
                      placeholder="e.g., Golden Retriever, 5 years old"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Designated Caretaker"
                      name={`pet-${index}-caretaker`}
                      value={pet.caretaker}
                      onChange={(e) => updatePet(index, 'caretaker', e.target.value)}
                      placeholder="Full name of caretaker"
                    />
                    <FormField
                      label="Alternate Caretaker"
                      name={`pet-${index}-alternate`}
                      value={pet.alternateCaretaker}
                      onChange={(e) => updatePet(index, 'alternateCaretaker', e.target.value)}
                      placeholder="Backup caretaker"
                    />
                  </div>

                  <FormField
                    label="Funds for Pet Care"
                    name={`pet-${index}-funds`}
                    value={pet.funds}
                    onChange={(e) => updatePet(index, 'funds', e.target.value)}
                    placeholder="e.g., $5,000 for lifetime care"
                    tooltip="Specify an amount to be set aside for your pet's care."
                  />

                  <FormField
                    label="Care Instructions"
                    name={`pet-${index}-instructions`}
                    type="textarea"
                    value={pet.instructions}
                    onChange={(e) => updatePet(index, 'instructions', e.target.value)}
                    placeholder="Dietary needs, medical conditions, preferred vet, etc."
                    rows={2}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addPet}
                className="
                  w-full py-3 px-4 rounded-lg border-2 border-dashed
                  border-gray-300 dark:border-gray-600
                  text-gray-600 dark:text-gray-400
                  hover:border-blue-500 hover:text-blue-500
                  transition-colors flex items-center justify-center gap-2
                "
              >
                <Plus className="w-5 h-5" />
                Add Pet
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Funeral & Burial Wishes */}
      <Card
        title="Funeral & Burial Wishes"
        description="Express your preferences for final arrangements."
      >
        <div className="space-y-4">
          <FormField
            type="checkbox"
            name="funeral-include"
            label="Include funeral/burial wishes in my will"
            value={funeral.include}
            onChange={(e) => handleFuneralChange('include', e.target.checked)}
          />

          {funeral.include && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Preference"
                  name="funeral-preference"
                  type="select"
                  value={funeral.preference}
                  onChange={(e) => handleFuneralChange('preference', e.target.value)}
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'burial', label: 'Traditional burial' },
                    { value: 'cremation', label: 'Cremation' },
                    { value: 'green', label: 'Green/natural burial' },
                    { value: 'donation', label: 'Body donation to science' },
                    { value: 'other', label: 'Other (specify below)' }
                  ]}
                />

                <FormField
                  label="Service Type"
                  name="funeral-serviceType"
                  type="select"
                  value={funeral.serviceType}
                  onChange={(e) => handleFuneralChange('serviceType', e.target.value)}
                  options={[
                    { value: '', label: 'Select...' },
                    { value: 'traditional', label: 'Traditional funeral service' },
                    { value: 'memorial', label: 'Memorial service' },
                    { value: 'celebration', label: 'Celebration of life' },
                    { value: 'private', label: 'Private family only' },
                    { value: 'none', label: 'No service requested' }
                  ]}
                />
              </div>

              <FormField
                label="Preferred Location/Facility"
                name="funeral-location"
                value={funeral.location}
                onChange={(e) => handleFuneralChange('location', e.target.value)}
                placeholder="e.g., St. Mary's Church, Miami; burial at Graceland Cemetery"
              />

              <FormField
                label="Memorial Donations"
                name="funeral-memorialDonations"
                value={funeral.memorialDonations}
                onChange={(e) => handleFuneralChange('memorialDonations', e.target.value)}
                placeholder="e.g., In lieu of flowers, donations to American Heart Association"
              />

              <FormField
                type="checkbox"
                name="funeral-prePaid"
                label="I have pre-paid funeral arrangements"
                value={funeral.prePaidArrangements}
                onChange={(e) => handleFuneralChange('prePaidArrangements', e.target.checked)}
              />

              {funeral.prePaidArrangements && (
                <FormField
                  label="Pre-paid Arrangement Details"
                  name="funeral-prePaidDetails"
                  type="textarea"
                  value={funeral.prePaidDetails}
                  onChange={(e) => handleFuneralChange('prePaidDetails', e.target.value)}
                  placeholder="e.g., Arrangements with Dignity Memorial, Contract #12345, paid in full"
                  rows={2}
                />
              )}

              <FormField
                label="Additional Wishes"
                name="funeral-additionalWishes"
                type="textarea"
                value={funeral.additionalWishes}
                onChange={(e) => handleFuneralChange('additionalWishes', e.target.value)}
                placeholder="Any other specific wishes or instructions..."
                rows={3}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Real Property */}
      <Card
        title="Real Property Details"
        description="Provide specific instructions for real estate not covered in specific gifts."
      >
        <div className="space-y-4">
          <FormField
            type="checkbox"
            name="realProperty-include"
            label="Include specific real property provisions"
            value={realProperty.include}
            onChange={(e) => onChange('realProperty', 'include', e.target.checked)}
          />

          {realProperty.include && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {(realProperty.items || []).map((property, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 dark:text-white">Property {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeProperty(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <FormField
                    label="Property Address"
                    name={`property-${index}-address`}
                    value={property.address}
                    onChange={(e) => updateProperty(index, 'address', e.target.value)}
                    placeholder="Full address including city, state, ZIP"
                  />

                  <FormField
                    label="Description"
                    name={`property-${index}-description`}
                    value={property.description}
                    onChange={(e) => updateProperty(index, 'description', e.target.value)}
                    placeholder="e.g., Primary residence, Vacation home, Rental property"
                  />

                  <FormField
                    label="Beneficiary"
                    name={`property-${index}-beneficiary`}
                    value={property.beneficiary}
                    onChange={(e) => updateProperty(index, 'beneficiary', e.target.value)}
                    placeholder="Who should receive this property?"
                  />

                  <FormField
                    label="Special Instructions"
                    name={`property-${index}-instructions`}
                    type="textarea"
                    value={property.instructions}
                    onChange={(e) => updateProperty(index, 'instructions', e.target.value)}
                    placeholder="e.g., Should be sold and proceeds divided, or may remain in property with life estate"
                    rows={2}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addProperty}
                className="
                  w-full py-3 px-4 rounded-lg border-2 border-dashed
                  border-gray-300 dark:border-gray-600
                  text-gray-600 dark:text-gray-400
                  hover:border-blue-500 hover:text-blue-500
                  transition-colors flex items-center justify-center gap-2
                "
              >
                <Plus className="w-5 h-5" />
                Add Property
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Debts and Taxes */}
      <Card
        title="Debts & Taxes"
        description="Specify how debts and taxes should be paid from your estate."
      >
        <div className="space-y-4">
          <FormField
            type="checkbox"
            name="debtsAndTaxes-include"
            label="Include specific debt and tax payment instructions"
            value={debtsAndTaxes.include}
            onChange={(e) => handleDebtsChange('include', e.target.checked)}
          />

          {debtsAndTaxes.include && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <FormField
                label="Payment Order"
                name="debtsAndTaxes-paymentOrder"
                type="select"
                value={debtsAndTaxes.paymentOrder}
                onChange={(e) => handleDebtsChange('paymentOrder', e.target.value)}
                options={[
                  { value: 'residuary', label: 'Pay from residuary estate first' },
                  { value: 'proportional', label: 'Pay proportionally from all assets' },
                  { value: 'specific', label: 'Pay from specific assets (specify below)' }
                ]}
                tooltip="Determines which assets are used to pay debts, taxes, and expenses."
              />

              <FormField
                label="Specific Instructions"
                name="debtsAndTaxes-specificInstructions"
                type="textarea"
                value={debtsAndTaxes.specificInstructions}
                onChange={(e) => handleDebtsChange('specificInstructions', e.target.value)}
                placeholder="e.g., Mortgage should be paid from proceeds of life insurance policy; credit card debt from checking account..."
                rows={3}
              />
            </div>
          )}
        </div>
      </Card>

      <Alert variant="info" title="These Provisions Are Optional">
        You don't need to complete all sections. Only include provisions that are relevant
        to your situation. If you leave a section unchecked, standard {stateConfig.name} probate rules
        will apply.
      </Alert>
    </div>
  )
}

export default AdditionalProvisions
