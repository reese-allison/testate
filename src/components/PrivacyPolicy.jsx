import React from 'react'
import { ArrowLeft, Shield } from 'lucide-react'

function PrivacyPolicy({ onBack }) {
  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to Will Generator
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h2>
        </div>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No Data Collection
            </h3>
            <p>
              Willful Estate does not collect, store, or transmit any personal information to
              external servers. Your privacy is protected by design.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Local Storage Only
            </h3>
            <p>
              All form data you enter is stored exclusively in your browser's local storage. This
              means:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Your data never leaves your device</li>
              <li>No information is sent to any server</li>
              <li>Your will details remain completely private</li>
              <li>Data persists only in your browser until you clear it</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clearing Your Data
            </h3>
            <p>You can clear all stored data at any time by:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Using the "Start Over" button in the application</li>
              <li>Clearing your browser's local storage or site data</li>
              <li>Using your browser's private/incognito mode (data is not persisted)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Third-Party Services
            </h3>
            <p>
              This site includes a Ko-fi donation widget for optional support. Ko-fi may set its own
              cookies and has its own privacy practices. For more information, see{' '}
              <a
                href="https://ko-fi.com/home/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ko-fi's Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Generation</h3>
            <p>
              When you generate a PDF, the document is created entirely in your browser using
              JavaScript. No data is sent to any external service for PDF generation.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
            <p>
              If you have questions about this privacy policy, you can reach out via the{' '}
              <a
                href="https://ko-fi.com/reeseallison"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ko-fi page
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-gray-600 dark:text-gray-300 pt-4 border-t border-gray-200 dark:border-gray-700">
            Last updated: February 2026
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
