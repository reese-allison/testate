import React from 'react'
import { Card, FormField, Alert } from '../ui'
import { US_STATES } from '../../constants'

export function ExecutorInfo({ data, onChange, errors = {} }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    onChange('executor', name, type === 'checkbox' ? checked : value)
  }

  return (
    <div className="space-y-6">
      <Card
        title="Personal Representative (Executor)"
        description="This person will manage your estate and carry out the instructions in your will."
      >
        <div className="space-y-4">
          <FormField
            label="Full Legal Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="e.g., Robert James Smith"
            required
            error={errors.name}
            tooltip="Choose someone trustworthy who is capable of handling financial and legal matters. This person must be at least 18 years old."
          />

          <FormField
            label="Relationship to You"
            name="relationship"
            value={data.relationship}
            onChange={handleChange}
            placeholder="e.g., Brother, Friend, Attorney"
            required
            error={errors.relationship}
            tooltip="Describe how this person is related or connected to you."
          />

          <FormField
            label="Street Address"
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="456 Oak Avenue"
            required
            error={errors.address}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField
              label="City"
              name="city"
              value={data.city}
              onChange={handleChange}
              placeholder="Orlando"
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
              required
              options={[
                { value: '', label: 'Select...' },
                ...US_STATES
              ]}
              className="col-span-1"
            />

            <FormField
              label="ZIP Code"
              name="zip"
              value={data.zip}
              onChange={handleChange}
              placeholder="32801"
              required
              error={errors.zip}
              className="col-span-1"
            />
          </div>
        </div>
      </Card>

      <Card
        title="Alternate Personal Representative"
        description="If your first choice cannot or will not serve, this person will act as backup."
      >
        <div className="space-y-4">
          <FormField
            label="Full Legal Name"
            name="alternateName"
            value={data.alternateName}
            onChange={handleChange}
            placeholder="e.g., Sarah Anne Smith"
            error={errors.alternateName}
            tooltip="Recommended but not required. If your primary executor cannot serve, this person will take over."
          />

          <FormField
            label="Relationship to You"
            name="alternateRelationship"
            value={data.alternateRelationship}
            onChange={handleChange}
            placeholder="e.g., Sister, Friend"
          />

          {data.alternateName && (
            <>
              <FormField
                label="Street Address"
                name="alternateAddress"
                value={data.alternateAddress}
                onChange={handleChange}
                placeholder="789 Pine Street"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  label="City"
                  name="alternateCity"
                  value={data.alternateCity}
                  onChange={handleChange}
                  placeholder="Tampa"
                  className="col-span-2 md:col-span-1"
                />

                <FormField
                  label="State"
                  name="alternateState"
                  type="select"
                  value={data.alternateState}
                  onChange={handleChange}
                  options={[
                    { value: '', label: 'Select...' },
                    ...US_STATES
                  ]}
                  className="col-span-1"
                />

                <FormField
                  label="ZIP Code"
                  name="alternateZip"
                  value={data.alternateZip}
                  onChange={handleChange}
                  placeholder="33601"
                  className="col-span-1"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      <Card title="Bond Requirement">
        <FormField
          type="checkbox"
          name="bondRequired"
          label="Require the Personal Representative to post a bond"
          value={data.bondRequired}
          onChange={handleChange}
          tooltip="A bond is a type of insurance that protects your estate if the executor mismanages funds. Most people waive this requirement to save costs, especially when appointing a trusted family member."
        />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {data.bondRequired
            ? 'A bond will be required. This provides additional protection but may slow down the probate process and incur costs.'
            : 'No bond will be required. This is the most common choice when appointing a trusted family member or friend.'}
        </p>
      </Card>

      <Alert variant="info" title="What Does a Personal Representative Do?">
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Files your will with the probate court</li>
          <li>Inventories and protects your assets</li>
          <li>Pays your debts and final expenses</li>
          <li>Distributes assets to beneficiaries</li>
          <li>Files final tax returns</li>
        </ul>
      </Alert>
    </div>
  )
}

export default ExecutorInfo
