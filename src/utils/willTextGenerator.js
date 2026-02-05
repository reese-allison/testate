import { generateWillContent } from './willContentGenerator'
import { renderWillToText } from './willTextRenderer'

/**
 * Generates plain text will content from form data.
 * This is a thin wrapper that uses the unified content generator.
 *
 * @param {Object} formData - The form data containing all will information
 * @returns {string} Plain text representation of the will
 */
export function generateWillText(formData) {
  const content = generateWillContent(formData)
  return renderWillToText(content)
}
