import React from 'react'
import PropTypes from 'prop-types'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { generateWillContent } from '../../utils/willContentGenerator'
import { toRoman } from '../../utils/formatters'

// Register fonts
Font.register({
  family: 'Times-Roman',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times%20New%20Roman.ttf',
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/@canvas-fonts/times-new-roman@1.0.4/Times%20New%20Roman%20Bold.ttf',
      fontWeight: 'bold',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 72, // 1 inch margins
    paddingBottom: 80, // Extra bottom padding for page numbers
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 28,
  },
  article: {
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  indent: {
    marginLeft: 24,
  },
  listItem: {
    marginBottom: 4,
    marginLeft: 24,
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureLine: {
    width: 280,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 30,
    marginBottom: 4,
  },
  signatureLineShort: {
    width: 220,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginTop: 24,
    marginBottom: 4,
  },
  signatureLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  witnessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
  },
  witnessBlock: {
    width: '45%',
  },
  witnessBlockThird: {
    width: '30%',
  },
  separator: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginBottom: 30,
    marginTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#444',
  },
  smallText: {
    fontSize: 10,
  },
  centered: {
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  legalNotice: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
})

// Render content items to PDF elements
function renderContentToPDF(contentItems, keyPrefix = '') {
  const elements = []

  contentItems.forEach((item, index) => {
    const key = `${keyPrefix}-${index}`

    switch (item.type) {
      case 'paragraph':
        elements.push(
          <Text key={key} style={[styles.paragraph, item.indent && styles.indent]}>
            {item.text}
          </Text>
        )
        break

      case 'list':
        item.items.forEach((listItem, listIndex) => {
          elements.push(
            <Text
              key={`${key}-list-${listIndex}`}
              style={[styles.listItem, item.indent && styles.indent]}
            >
              - {listItem}
            </Text>
          )
        })
        break

      case 'lettered-list':
        item.items.forEach((listItem, listIndex) => {
          const letter = String.fromCharCode(97 + listIndex)
          elements.push(
            <Text key={`${key}-letter-${listIndex}`} style={styles.listItem}>
              ({letter}) {listItem}
            </Text>
          )
        })
        break

      case 'numbered-list':
        item.items.forEach((listItem, listIndex) => {
          elements.push(
            <Text key={`${key}-num-${listIndex}`} style={styles.listItem}>
              {listIndex + 1}. {listItem}
            </Text>
          )
        })
        break

      case 'gift-list':
        item.items.forEach((giftBlock, giftIndex) => {
          if (giftBlock.type === 'gift-block') {
            elements.push(
              <View key={`${key}-gift-${giftIndex}`} style={{ marginBottom: 8 }} wrap={false}>
                {renderContentToPDF(giftBlock.content, `${key}-gift-${giftIndex}`)}
              </View>
            )
          }
        })
        break

      case 'heading':
        elements.push(
          <Text key={key} style={[styles.articleTitle, { marginTop: 0 }]}>
            {item.text}
          </Text>
        )
        break

      case 'subheading':
        elements.push(
          <Text key={key} style={styles.legalNotice}>
            {item.text}
          </Text>
        )
        break

      case 'separator':
        elements.push(<View key={key} style={styles.separator} />)
        break

      case 'signature-line':
        elements.push(
          <View key={key} style={{ marginTop: 20 }}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>{item.label}</Text>
          </View>
        )
        break

      case 'witness-block':
        elements.push(
          <View key={key} style={{ marginTop: 20 }}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Witness {item.witnessNumber} Signature</Text>
            <View style={[styles.signatureLine, { marginTop: 16 }]} />
            <Text style={styles.signatureLabel}>Witness {item.witnessNumber} Printed Name</Text>
            <View style={[styles.signatureLine, { marginTop: 16 }]} />
            <Text style={styles.signatureLabel}>Date</Text>
            <View style={[styles.signatureLine, { marginTop: 16 }]} />
            <Text style={styles.signatureLabel}>Address</Text>
            <View style={[styles.signatureLine, { marginTop: 16 }]} />
            <Text style={styles.signatureLabel}>City, State, ZIP</Text>
          </View>
        )
        break

      default:
        // Unknown content type, skip
        break
    }
  })

  return elements
}

// Article component that tries to stay together
function Article({ title, children, articleNum }) {
  return (
    <View style={styles.article} wrap={false}>
      <Text style={styles.articleTitle}>
        ARTICLE {toRoman(articleNum)} - {title}
      </Text>
      {children}
    </View>
  )
}

Article.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  articleNum: PropTypes.number.isRequired,
}

// For longer articles that may need to wrap
function ArticleLong({ title, children, articleNum }) {
  return (
    <View style={styles.article}>
      <Text style={styles.articleTitle} minPresenceAhead={50}>
        ARTICLE {toRoman(articleNum)} - {title}
      </Text>
      {children}
    </View>
  )
}

ArticleLong.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  articleNum: PropTypes.number.isRequired,
}

function WillDocument({ formData }) {
  // Generate structured content using the single source of truth
  const { sections, metadata } = generateWillContent(formData)
  const { numWitnesses } = metadata

  // Separate sections into pages
  const titleSection = sections.find(s => s.type === 'title')
  const preambleSection = sections.find(s => s.type === 'preamble')
  const articleSections = sections.filter(s => s.type === 'article')
  const signatureSection = sections.find(s => s.type === 'signature')
  const attestationSection = sections.find(s => s.type === 'attestation')
  const affidavitSection = sections.find(s => s.type === 'affidavit')

  // Determine which articles are "long" (have lists or multiple paragraphs)
  const isLongArticle = section => {
    const contentTypes = section.content.map(c => c.type)
    return (
      contentTypes.includes('gift-list') ||
      contentTypes.includes('lettered-list') ||
      section.content.length > 5
    )
  }

  return (
    <Document>
      {/* Main Content Pages - flows naturally */}
      <Page size="LETTER" style={styles.page} wrap>
        {/* Title */}
        {titleSection && (
          <View style={{ marginBottom: 24 }}>
            {titleSection.content.map((item, i) => {
              if (item.type === 'heading') {
                return (
                  <Text key={i} style={styles.title}>
                    {item.text}
                  </Text>
                )
              }
              if (item.type === 'subheading') {
                return (
                  <Text key={i} style={styles.subtitle}>
                    {item.text}
                  </Text>
                )
              }
              return null
            })}
          </View>
        )}

        {/* Preamble */}
        {preambleSection && <View>{renderContentToPDF(preambleSection.content, 'preamble')}</View>}

        {/* Articles */}
        {articleSections.map((section, index) => {
          const ArticleComponent = isLongArticle(section) ? ArticleLong : Article
          return (
            <ArticleComponent
              key={`article-${index}`}
              title={section.title}
              articleNum={section.articleNumber}
            >
              {renderContentToPDF(section.content, `article-${index}`)}
            </ArticleComponent>
          )
        })}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>

      {/* Signature Page - Always on its own page */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>SIGNATURE PAGE</Text>
        <View style={styles.separator} />

        {signatureSection && (
          <View>
            {signatureSection.content
              .filter(item => item.type === 'paragraph')
              .map((item, i) => (
                <Text key={i} style={styles.paragraph}>
                  {item.text}
                </Text>
              ))}
            {signatureSection.content
              .filter(item => item.type === 'signature-line')
              .map((item, i) => (
                <View key={`sig-${i}`} style={styles.signatureSection}>
                  <View style={styles.signatureLine} />
                  <Text style={styles.signatureLabel}>{item.label}</Text>
                </View>
              ))}
          </View>
        )}

        {attestationSection && (
          <View style={{ marginTop: 60 }}>
            <Text style={[styles.articleTitle, { marginTop: 0 }]}>ATTESTATION CLAUSE</Text>
            {attestationSection.content
              .filter(item => item.type === 'paragraph')
              .map((item, i) => (
                <Text key={i} style={styles.paragraph}>
                  {item.text}
                </Text>
              ))}
          </View>
        )}

        {/* Witness signature blocks - dynamically based on state requirement */}
        {numWitnesses === 2 ? (
          <View style={styles.witnessRow}>
            <View style={styles.witnessBlock}>
              <View style={styles.signatureLineShort} />
              <Text style={styles.signatureLabel}>Witness 1 Signature</Text>
              <View style={[styles.signatureLineShort, { marginTop: 20 }]} />
              <Text style={styles.signatureLabel}>Printed Name</Text>
              <View style={[styles.signatureLineShort, { marginTop: 20 }]} />
              <Text style={styles.signatureLabel}>Address</Text>
            </View>
            <View style={styles.witnessBlock}>
              <View style={styles.signatureLineShort} />
              <Text style={styles.signatureLabel}>Witness 2 Signature</Text>
              <View style={[styles.signatureLineShort, { marginTop: 20 }]} />
              <Text style={styles.signatureLabel}>Printed Name</Text>
              <View style={[styles.signatureLineShort, { marginTop: 20 }]} />
              <Text style={styles.signatureLabel}>Address</Text>
            </View>
          </View>
        ) : (
          /* For 3 witnesses (SC, VT) */
          <View style={[styles.witnessRow, { flexWrap: 'wrap' }]}>
            {[1, 2, 3].map(num => (
              <View key={num} style={[styles.witnessBlockThird, { marginBottom: 20 }]}>
                <View style={[styles.signatureLineShort, { width: 150 }]} />
                <Text style={styles.signatureLabel}>Witness {num} Signature</Text>
                <View style={[styles.signatureLineShort, { marginTop: 16, width: 150 }]} />
                <Text style={styles.signatureLabel}>Printed Name</Text>
                <View style={[styles.signatureLineShort, { marginTop: 16, width: 150 }]} />
                <Text style={styles.signatureLabel}>Address</Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>

      {/* Self-Proving Affidavit - Always on its own page */}
      <Page size="LETTER" style={styles.page}>
        {affidavitSection && (
          <View>
            {affidavitSection.content.map((item, index) => {
              const key = `affidavit-${index}`
              switch (item.type) {
                case 'separator':
                  return index === 0 ? null : (
                    <View
                      key={key}
                      style={[styles.separator, { marginBottom: 16, marginTop: 0 }]}
                    />
                  )
                case 'heading':
                  return (
                    <Text
                      key={key}
                      style={[styles.sectionTitle, { marginTop: 0, marginBottom: 4 }]}
                    >
                      {item.text}
                    </Text>
                  )
                case 'subheading':
                  return (
                    <Text key={key} style={[styles.legalNotice, { marginBottom: 12 }]}>
                      {item.text}
                    </Text>
                  )
                case 'paragraph':
                  // Check if it's the state/county header
                  if (
                    item.text.startsWith('STATE OF') ||
                    item.text.includes('COUNTY OF') ||
                    item.text.includes('PARISH OF')
                  ) {
                    return (
                      <Text key={key} style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {item.text}
                      </Text>
                    )
                  }
                  return (
                    <Text key={key} style={[styles.paragraph, { marginBottom: 8 }]}>
                      {item.text}
                    </Text>
                  )
                case 'signature-line':
                  return (
                    <View key={key} style={{ marginTop: 20 }}>
                      <View style={[styles.signatureLine, { marginTop: 12, width: 240 }]} />
                      <Text style={styles.signatureLabel}>{item.label}</Text>
                    </View>
                  )
                default:
                  return null
              }
            })}
          </View>
        )}

        {/* Notary commission expiration */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.smallText}>My Commission Expires: ___________________</Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

WillDocument.propTypes = {
  formData: PropTypes.shape({
    testator: PropTypes.object,
    executor: PropTypes.object,
    children: PropTypes.array,
    guardian: PropTypes.object,
    specificGifts: PropTypes.array,
    residuaryEstate: PropTypes.object,
    digitalAssets: PropTypes.object,
    pets: PropTypes.object,
    funeral: PropTypes.object,
    realProperty: PropTypes.object,
    debtsAndTaxes: PropTypes.object,
    customProvisions: PropTypes.object,
    disinheritance: PropTypes.object,
    survivorshipPeriod: PropTypes.number,
    noContestClause: PropTypes.bool,
  }),
}

export default WillDocument
