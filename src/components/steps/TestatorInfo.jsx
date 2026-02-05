import React from 'react'
import { Card, FormField, Alert } from '../ui'
import {
  FLORIDA_COUNTIES,
  MARITAL_STATUS_OPTIONS,
  US_STATES,
  getStateConfig,
} from '../../constants'

export function TestatorInfo({ data, onChange, errors = {} }) {
  const handleChange = e => {
    const { name, value } = e.target
    onChange('testator', name, value)

    // When residence state changes, also update the address state field
    // and clear county since it may not apply to the new state
    if (name === 'residenceState') {
      const stateConfig = getStateConfig(value)
      onChange('testator', 'state', stateConfig.name)
      // Clear county when state changes since Florida counties won't apply
      if (value !== 'FL') {
        onChange('testator', 'county', '')
      }
    }
  }

  const selectedStateConfig = getStateConfig(data.residenceState || 'FL')
  const isFloridaResident = data.residenceState === 'FL' || !data.residenceState

  return (
    <div className="space-y-6">
      <Card
        title="State of Residence"
        description="Select the state where you legally reside. Your will must comply with your state's laws."
      >
        <FormField
          label="State of Residence"
          name="residenceState"
          type="select"
          value={data.residenceState || 'FL'}
          onChange={handleChange}
          required
          error={errors.residenceState}
          options={[
            { value: '', label: 'Select your state...' },
            ...US_STATES.map(s => ({ value: s.value, label: s.label })),
          ]}
          tooltip="Select the state where you currently legally reside. This determines which state's laws will govern your will."
        />

        {selectedStateConfig.communityProperty && (
          <Alert variant="info" title="Community Property State" className="mt-4">
            {selectedStateConfig.name} is a community property state. Property acquired during
            marriage is generally considered jointly owned by both spouses. This may affect how you
            can distribute certain assets in your will.
          </Alert>
        )}

        {selectedStateConfig.witnesses === 3 && (
          <Alert variant="info" title="Witness Requirement" className="mt-4">
            {selectedStateConfig.name} requires {selectedStateConfig.witnesses} witnesses for a
            valid will, which is more than most states.
          </Alert>
        )}
      </Card>

      <Card
        title="Your Information"
        description="Enter your personal details as they will appear on your will."
      >
        <div className="space-y-4">
          <FormField
            label="Full Legal Name"
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="e.g., John Michael Smith"
            required
            error={errors.fullName}
            tooltip="Enter your complete legal name as it appears on official documents. Include any suffixes like Jr., Sr., III, etc."
          />

          <FormField
            label="Street Address"
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="123 Main Street"
            required
            error={errors.address}
            tooltip="Your current primary residence address."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              label="City"
              name="city"
              value={data.city}
              onChange={handleChange}
              placeholder="City"
              required
              error={errors.city}
              className="col-span-2 md:col-span-1"
            />

            <FormField
              label="State"
              name="state"
              type="select"
              value={data.state}
              onChange={handleChange}
              options={[{ value: selectedStateConfig.name, label: selectedStateConfig.name }]}
              disabled
              className="col-span-1"
            />

            <FormField
              label="ZIP Code"
              name="zip"
              value={data.zip}
              onChange={handleChange}
              placeholder="12345"
              required
              error={errors.zip}
              className="col-span-1"
            />
          </div>

          {isFloridaResident ? (
            <FormField
              label="County"
              name="county"
              type="select"
              value={data.county}
              onChange={handleChange}
              required
              error={errors.county}
              options={[
                { value: '', label: 'Select your county...' },
                ...FLORIDA_COUNTIES.map(c => ({ value: c, label: c })),
              ]}
              tooltip="Select the Florida county where you currently reside."
            />
          ) : (
            <FormField
              label="County/Parish"
              name="county"
              value={data.county}
              onChange={handleChange}
              placeholder={data.residenceState === 'LA' ? 'Enter your parish' : 'Enter your county'}
              required
              error={errors.county}
              tooltip={`Enter the ${data.residenceState === 'LA' ? 'parish' : 'county'} where you currently reside in ${selectedStateConfig.name}.`}
            />
          )}
        </div>
      </Card>

      <Card
        title="Marital Status"
        description="Your marital status affects how your will is structured."
      >
        <div className="space-y-4">
          <FormField
            label="Current Marital Status"
            name="maritalStatus"
            type="select"
            value={data.maritalStatus}
            onChange={handleChange}
            required
            options={MARITAL_STATUS_OPTIONS}
            tooltip="Select your current legal marital status."
          />

          {data.maritalStatus === 'married' && (
            <FormField
              label="Spouse's Full Legal Name"
              name="spouseName"
              value={data.spouseName}
              onChange={handleChange}
              placeholder="e.g., Jane Elizabeth Smith"
              required
              error={errors.spouseName}
              tooltip="Enter your spouse's complete legal name."
            />
          )}
        </div>
      </Card>

      <Alert variant="info" title={`${selectedStateConfig.name} Residency`}>
        This will is governed by {selectedStateConfig.name} law. The will must be executed according
        to {selectedStateConfig.name} requirements, including being signed by you and witnessed by{' '}
        {selectedStateConfig.witnesses}{' '}
        {selectedStateConfig.witnesses === 1 ? 'witness' : 'witnesses'}.
        {!isFloridaResident &&
          ' For state-specific legal advice, consult a licensed attorney in your state.'}
      </Alert>
    </div>
  )
}
