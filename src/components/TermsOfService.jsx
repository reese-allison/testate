import React from 'react'
import PropTypes from 'prop-types'
import { ArrowLeft } from 'lucide-react'
import { Card } from './ui'

function TermsOfService({ onBack }) {
  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to Will Generator
      </button>

      <Card title="Terms of Service">
        <div className="prose dark:prose-invert max-w-none space-y-6 text-sm">
          <p className="font-semibold text-gray-900 dark:text-white">
            By using this site, you agree to these terms.
          </p>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">What This Is</h3>
            <p>
              Willful Estate provides will document templates for informational and educational
              purposes. This is a personal project, not a law firm or legal service. No legal advice
              is provided, and no attorney-client relationship is created.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">No Warranties</h3>
            <p>
              This service is provided "as is" without warranties of any kind. I make no guarantees
              that generated documents are legally valid, complete, accurate, or suitable for your
              situation.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, I am not liable for any damages arising from
              your use of this service, including but not limited to invalid documents, court
              rejection, legal disputes, or any other consequences of relying on generated
              templates.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">Your Responsibility</h3>
            <p>You are solely responsible for:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Verifying that any document meets your state's legal requirements</li>
              <li>Proper execution (signing, witnessing, notarization)</li>
              <li>Deciding whether to consult an attorney</li>
            </ul>
            <p className="font-semibold mt-2">You use this service at your own risk.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">Class Action Waiver</h3>
            <p>
              Any disputes will be resolved on an individual basis only. You waive any right to
              participate in a class action lawsuit.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">Governing Law</h3>
            <p>
              These terms are governed by Florida law. Any disputes must be brought in Florida
              courts.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mt-4 mb-2">Severability</h3>
            <p>If any part of these terms is unenforceable, the rest remains in effect.</p>
          </section>

          <p className="text-gray-500 dark:text-gray-400 text-xs mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            Last updated: February 2026
          </p>
        </div>
      </Card>
    </div>
  )
}

TermsOfService.propTypes = {
  onBack: PropTypes.func.isRequired,
}

export default TermsOfService
