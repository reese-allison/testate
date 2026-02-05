import { toRoman } from './formatters'

/**
 * Renders structured will content to plain text format.
 *
 * @param {Object} content - The structured content from generateWillContent
 * @returns {string} Plain text representation of the will
 */
export function renderWillToText(content) {
  const { sections } = content
  const lines = []

  for (const section of sections) {
    renderSection(section, lines)
  }

  return lines.join('\n')
}

function renderSection(section, lines) {
  switch (section.type) {
    case 'title':
      renderTitle(section, lines)
      break
    case 'preamble':
      renderPreamble(section, lines)
      break
    case 'article':
      renderArticle(section, lines)
      break
    case 'signature':
      renderSignature(section, lines)
      break
    case 'attestation':
      renderAttestation(section, lines)
      break
    case 'affidavit':
      renderAffidavit(section, lines)
      break
    case 'disclaimer':
      renderDisclaimer(section, lines)
      break
    default:
      // Unknown section type, skip
      break
  }
}

function renderTitle(section, lines) {
  for (const item of section.content) {
    if (item.type === 'heading') {
      lines.push(item.text)
    } else if (item.type === 'subheading') {
      lines.push(item.text)
    }
  }
  lines.push('')
}

function renderPreamble(section, lines) {
  for (const item of section.content) {
    if (item.type === 'paragraph') {
      lines.push(item.text)
    }
  }
  lines.push('')
}

function renderArticle(section, lines) {
  lines.push(`ARTICLE ${toRoman(section.articleNumber)} - ${section.title}`)
  lines.push('')

  renderContent(section.content, lines)
  lines.push('')
}

function renderContent(contentItems, lines) {
  for (const item of contentItems) {
    switch (item.type) {
      case 'paragraph':
        if (item.indent) {
          lines.push(`   ${item.text}`)
        } else {
          lines.push(item.text)
        }
        break

      case 'list':
        for (const listItem of item.items) {
          if (item.indent) {
            lines.push(`    - ${listItem}`)
          } else {
            lines.push(`  - ${listItem}`)
          }
        }
        break

      case 'lettered-list':
        item.items.forEach((listItem, index) => {
          const letter = String.fromCharCode(97 + index) // a, b, c, ...
          lines.push(`  (${letter}) ${listItem}`)
        })
        break

      case 'numbered-list':
        item.items.forEach((listItem, index) => {
          lines.push(`${index + 1}. ${listItem}`)
        })
        break

      case 'gift-list':
        for (const giftBlock of item.items) {
          if (giftBlock.type === 'gift-block') {
            renderContent(giftBlock.content, lines)
            lines.push('')
          }
        }
        break

      case 'heading':
        lines.push(item.text)
        break

      case 'subheading':
        lines.push(item.text)
        break

      case 'separator':
        lines.push('='.repeat(60))
        break

      case 'signature-line':
        lines.push('')
        lines.push('_________________________________________')
        lines.push(item.label)
        lines.push('')
        break

      case 'witness-block':
        lines.push('')
        lines.push('_________________________________________')
        lines.push(`Witness ${item.witnessNumber} Signature`)
        lines.push('')
        lines.push('_________________________________________')
        lines.push(`Witness ${item.witnessNumber} Printed Name`)
        lines.push('')
        lines.push('_________________________________________')
        lines.push('Date')
        lines.push('')
        lines.push('_________________________________________')
        lines.push('Address')
        lines.push('')
        lines.push('_________________________________________')
        lines.push('City, State, ZIP')
        lines.push('')
        break

      default:
        // Unknown content type, skip
        break
    }
  }
}

function renderSignature(section, lines) {
  renderContent(section.content, lines)
  lines.push('')
}

function renderAttestation(section, lines) {
  renderContent(section.content, lines)
  lines.push('')
}

function renderAffidavit(section, lines) {
  renderContent(section.content, lines)
}

function renderDisclaimer(section, lines) {
  lines.push('')
  renderContent(section.content, lines)
  lines.push('')
}
