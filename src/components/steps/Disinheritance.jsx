import React from 'react'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import { Card, FormField, Alert } from '../ui'

export function Disinheritance({ data, onChange, errors = {} }) {
  const addPerson = () => {
    const current = data.persons || []
    onChange('disinheritance', 'persons', [
      ...current,
      { name: '', relationship: '', reason: '' }
    ])
  }

  const updatePerson = (index, field, value) => {
    const updated = [...data.persons]
    updated[index] = { ...updated[index], [field]: value }
    onChange('disinheritance', 'persons', updated)
  }

  const removePerson = (index) => {
    onChange('disinheritance', 'persons', data.persons.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Alert variant="warning" title="Important: Disinheritance Considerations">
        <p className="mt-1">
          Disinheritance is a serious decision with potential legal implications. In Florida:
        </p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>A surviving spouse has rights to a portion of the estate regardless of the will (elective share)</li>
          <li>Pretermitted (accidentally omitted) children may have claims</li>
          <li>Explicitly naming and disinheriting someone can help prevent will contests</li>
        </ul>
        <p className="mt-2 font-medium">
          Consider consulting an attorney before disinheriting close family members.
        </p>
      </Alert>

      <Card
        title="Disinheritance Clause"
        description="Explicitly exclude specific individuals from receiving any part of your estate."
      >
        <div className="space-y-4">
          <FormField
            type="checkbox"
            name="disinheritance-include"
            label="I want to explicitly disinherit one or more persons"
            value={data.include}
            onChange={(e) => onChange('disinheritance', 'include', e.target.checked)}
          />

          {data.include && (
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By explicitly naming individuals you wish to disinherit, you make clear that
                the omission is intentional, which can help prevent challenges to your will.
              </p>

              {(data.persons || []).map((person, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Disinherited Person {index + 1}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePerson(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Full Legal Name"
                      name={`disinherit-${index}-name`}
                      value={person.name}
                      onChange={(e) => updatePerson(index, 'name', e.target.value)}
                      placeholder="Full legal name of person"
                      required
                      tooltip="Use the person's full legal name to avoid confusion."
                    />

                    <FormField
                      label="Relationship to You"
                      name={`disinherit-${index}-relationship`}
                      value={person.relationship}
                      onChange={(e) => updatePerson(index, 'relationship', e.target.value)}
                      placeholder="e.g., Son, Daughter, Sibling"
                      required
                      tooltip="Clearly state the relationship to help identify the person."
                    />
                  </div>

                  <FormField
                    label="Reason (Optional but Recommended)"
                    name={`disinherit-${index}-reason`}
                    type="textarea"
                    value={person.reason}
                    onChange={(e) => updatePerson(index, 'reason', e.target.value)}
                    placeholder="You may state your reason, though it's not legally required..."
                    rows={2}
                    tooltip="While not required, stating a reason can help prevent claims that the omission was unintentional. Keep it factual and avoid inflammatory language."
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addPerson}
                className="
                  w-full py-3 px-4 rounded-lg border-2 border-dashed
                  border-red-300 dark:border-red-700
                  text-red-600 dark:text-red-400
                  hover:border-red-500 hover:text-red-500
                  transition-colors flex items-center justify-center gap-2
                "
              >
                <Plus className="w-5 h-5" />
                Add Person to Disinherit
              </button>
            </div>
          )}
        </div>
      </Card>

      {!data.include && (
        <Card title="No Disinheritance">
          <p className="text-gray-600 dark:text-gray-400">
            If you don't need to explicitly disinherit anyone, you can proceed to the next step.
            Your estate will be distributed according to your other instructions, and anyone
            not named as a beneficiary simply won't receive anything.
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            However, if you have family members who might expect to inherit (especially children
            or a spouse) and you don't want them to, it's safer to explicitly disinherit them
            to prevent potential will contests.
          </p>
        </Card>
      )}

      <Alert variant="info" title="Florida Law on Spousal Rights">
        <p className="mt-1">
          In Florida, you cannot completely disinherit a surviving spouse. The spouse has a
          right to an "elective share" of approximately 30% of the estate, regardless of what
          the will says. If you wish to limit your spouse's inheritance, consult with a
          Florida estate planning attorney about options such as prenuptial agreements.
        </p>
      </Alert>
    </div>
  )
}

export default Disinheritance
