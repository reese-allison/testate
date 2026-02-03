import React from 'react'
import { Card, FormField, Alert } from '../ui'
import { FLORIDA_COUNTIES, MARITAL_STATUS_OPTIONS } from '../../constants'

export function TestatorInfo({ data, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange('testator', name, value)
  }

  return (
    <div className="space-y-6">
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
              placeholder="Miami"
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
              options={[{ value: 'Florida', label: 'Florida' }]}
              disabled
              className="col-span-1"
            />

            <FormField
              label="ZIP Code"
              name="zip"
              value={data.zip}
              onChange={handleChange}
              placeholder="33101"
              required
              error={errors.zip}
              className="col-span-1"
            />
          </div>

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
              ...FLORIDA_COUNTIES.map(c => ({ value: c, label: c }))
            ]}
            tooltip="Select the Florida county where you currently reside."
          />
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

      <Alert variant="info" title="Florida Residency Requirement">
        This will generator is designed specifically for Florida residents. Florida law
        governs the validity and interpretation of wills executed by Florida residents.
        If you are not a Florida resident, consult an attorney in your state.
      </Alert>
    </div>
  )
}

export default TestatorInfo
