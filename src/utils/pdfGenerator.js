import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { createElement } from 'react'
import WillDocument from '../components/pdf/WillDocument'

/**
 * Sanitize a string for use in a filename
 * Removes special characters that could cause issues or security problems
 */
function sanitizeFilename(name) {
  if (!name || typeof name !== 'string') {
    return 'Unknown'
  }
  return (
    name
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .slice(0, 50) // Limit length
      .trim() || 'Will'
  )
}

export async function generatePDF(formData) {
  const doc = createElement(WillDocument, { formData })
  const blob = await pdf(doc).toBlob()

  const safeName = sanitizeFilename(formData.testator?.fullName)
  const fileName = `Will_${safeName}_${new Date().toISOString().split('T')[0]}.pdf`

  saveAs(blob, fileName)
}
