import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { getStateConfig } from '../../constants/stateConfigs'
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

// Article component that tries to stay together
const Article = ({ title, children, articleNum }) => (
  <View style={styles.article} wrap={false}>
    <Text style={styles.articleTitle}>
      ARTICLE {toRoman(articleNum)} - {title}
    </Text>
    {children}
  </View>
)

// For longer articles that may need to wrap
const ArticleLong = ({ title, children, articleNum }) => (
  <View style={styles.article}>
    <Text style={styles.articleTitle} minPresenceAhead={50}>
      ARTICLE {toRoman(articleNum)} - {title}
    </Text>
    {children}
  </View>
)

// Helper to ensure a value is a non-empty string, or return a fallback
const safeText = (value, fallback = '[Not provided]') => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }
  return String(value)
}

function WillDocument({ formData }) {
  const {
    testator = {},
    executor = {},
    children = [],
    guardian = {},
    specificGifts = [],
    residuaryEstate = {},
    digitalAssets = {},
    pets = {},
    funeral = {},
    realProperty = {},
    debtsAndTaxes = {},
    customProvisions = {},
    disinheritance = {},
    survivorshipPeriod = 30,
    noContestClause = true,
  } = formData || {}

  // Get state configuration - residenceState is required
  const stateCode = testator.residenceState
  const stateConfig = getStateConfig(stateCode)
  const countyOrParish = stateCode === 'LA' ? 'Parish' : 'County'

  let articleNumber = 1
  const minorChildren = children.filter(c => c.isMinor)

  // Pre-calculate article numbers for each section
  const customProvisionItems =
    customProvisions?.include && customProvisions.items?.length > 0 ? customProvisions.items : []

  const articleNums = {
    family: articleNumber++,
    representative: articleNumber++,
    guardian: minorChildren.length > 0 && guardian.name ? articleNumber++ : null,
    gifts: specificGifts.length > 0 ? articleNumber++ : null,
    realProperty: realProperty?.include && realProperty.items?.length > 0 ? articleNumber++ : null,
    residuary: articleNumber++,
    survivorship: articleNumber++,
    digital: digitalAssets.include ? articleNumber++ : null,
    pets: pets.include && pets.items?.length > 0 ? articleNumber++ : null,
    funeral: funeral.include ? articleNumber++ : null,
    debts: articleNumber++,
    disinherit:
      disinheritance.include && disinheritance.persons?.length > 0 ? articleNumber++ : null,
    noContest: noContestClause ? articleNumber++ : null,
    simultaneousDeath: articleNumber++,
    taxApportionment: articleNumber++,
    lapsedGifts: articleNumber++,
    // Custom provisions - each gets its own article number
    customProvisions: customProvisionItems.map(() => articleNumber++),
    general: articleNumber++,
  }

  // Generate witness placeholders for affidavit based on state requirement
  const witnessPlaceholders = Array(stateConfig.witnesses)
    .fill('_________________________')
    .join(', and ')

  return (
    <Document>
      {/* Main Content Pages - flows naturally */}
      <Page size="LETTER" style={styles.page} wrap>
        {/* Title */}
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.title}>LAST WILL AND TESTAMENT</Text>
          <Text style={styles.subtitle}>
            OF {safeText(testator.fullName, 'TESTATOR').toUpperCase()}
          </Text>
        </View>

        {/* Preamble */}
        <Text style={styles.paragraph}>
          I, {safeText(testator.fullName)}, a resident of {safeText(testator.county)}{' '}
          {countyOrParish}, {stateConfig.name}, residing at {safeText(testator.address)},{' '}
          {safeText(testator.city)}, {stateConfig.name} {safeText(testator.zip)}, being of sound
          mind and disposing memory, do hereby declare this to be my Last Will and Testament, and I
          hereby revoke all wills and codicils previously made by me.
        </Text>

        {/* Article - Family Declaration */}
        <Article title="FAMILY DECLARATION" articleNum={articleNums.family}>
          <Text style={styles.paragraph}>
            {testator.maritalStatus === 'married'
              ? `I am married to ${safeText(testator.spouseName, 'my spouse')}, hereinafter referred to as "my spouse."`
              : testator.maritalStatus === 'divorced'
                ? 'I am divorced and currently unmarried.'
                : testator.maritalStatus === 'widowed'
                  ? 'I am a widow/widower and currently unmarried.'
                  : 'I am not currently married.'}
          </Text>
          {children.length > 0 ? (
            <View>
              <Text style={styles.paragraph}>
                I have the following {children.length === 1 ? 'child' : 'children'}:
              </Text>
              {children.map((child, i) => (
                <Text key={i} style={styles.listItem}>
                  {child.name}
                  {child.relationship === 'adopted' ? ' (legally adopted)' : ''}
                  {child.relationship === 'stepchild' ? ' (stepchild)' : ''}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.paragraph}>I have no children.</Text>
          )}
        </Article>

        {/* Article - Personal Representative */}
        <Article title="PERSONAL REPRESENTATIVE" articleNum={articleNums.representative}>
          <Text style={styles.paragraph}>
            I appoint {safeText(executor.name)}
            {executor.relationship ? `, my ${executor.relationship},` : ''} as the Personal
            Representative of my estate.
          </Text>
          {executor.alternateName && (
            <Text style={styles.paragraph}>
              If {safeText(executor.name)} is unable or unwilling to serve, I appoint{' '}
              {safeText(executor.alternateName)}
              {executor.alternateRelationship ? `, my ${executor.alternateRelationship},` : ''} as
              alternate Personal Representative.
            </Text>
          )}
          <Text style={styles.paragraph}>
            {executor.bondRequired
              ? 'My Personal Representative shall be required to post a bond.'
              : 'My Personal Representative shall serve without bond.'}
          </Text>
          <Text style={styles.paragraph}>
            I grant my Personal Representative full power and authority to:
          </Text>
          <Text style={styles.listItem}>(a) Take possession of and manage all my property;</Text>
          <Text style={styles.listItem}>
            (b) Sell, lease, or mortgage any real or personal property;
          </Text>
          <Text style={styles.listItem}>
            (c) Pay all debts, taxes, and expenses of administration;
          </Text>
          <Text style={styles.listItem}>(d) Distribute my estate according to this Will;</Text>
          <Text style={styles.listItem}>
            (e) Perform all acts necessary for proper estate administration.
          </Text>
        </Article>

        {/* Article - Guardian */}
        {articleNums.guardian && (
          <Article title="GUARDIAN OF MINOR CHILDREN" articleNum={articleNums.guardian}>
            <Text style={styles.paragraph}>
              If at my death I have any minor children and their other parent is unable or unwilling
              to care for them, I appoint {guardian.name}
              {guardian.relationship ? `, ${guardian.relationship},` : null} as guardian of the
              person of my minor children.
            </Text>
            {guardian.alternateName && (
              <Text style={styles.paragraph}>
                If {guardian.name} is unable or unwilling to serve, I appoint{' '}
                {guardian.alternateName}
                {guardian.alternateRelationship ? `, ${guardian.alternateRelationship},` : null} as
                alternate guardian.
              </Text>
            )}
          </Article>
        )}

        {/* Article - Specific Gifts */}
        {articleNums.gifts && (
          <ArticleLong title="SPECIFIC GIFTS" articleNum={articleNums.gifts}>
            <Text style={styles.paragraph}>I make the following specific gifts:</Text>
            {specificGifts.map((gift, i) => (
              <View key={i} style={{ marginBottom: 8 }} wrap={false}>
                <Text style={styles.paragraph}>
                  {i + 1}. I give {gift.description} to {gift.beneficiary}
                  {gift.beneficiaryRelationship ? ` (${gift.beneficiaryRelationship})` : null}.
                </Text>
                {gift.alternativeBeneficiary && (
                  <Text style={[styles.paragraph, styles.indent]}>
                    If {gift.beneficiary} does not survive me, this gift shall pass to{' '}
                    {gift.alternativeBeneficiary}.
                  </Text>
                )}
                {gift.conditions && (
                  <Text style={[styles.paragraph, styles.indent]}>
                    Conditions: {gift.conditions}
                  </Text>
                )}
              </View>
            ))}
          </ArticleLong>
        )}

        {/* Article - Real Property */}
        {articleNums.realProperty && (
          <ArticleLong title="REAL PROPERTY" articleNum={articleNums.realProperty}>
            {realProperty.items.map((property, i) => (
              <View key={i} style={{ marginBottom: 8 }} wrap={false}>
                <Text style={styles.paragraph}>
                  {i + 1}. The property located at {property.address}
                  {property.description ? ` (${property.description})` : null} shall pass to{' '}
                  {property.beneficiary}.
                </Text>
                {property.instructions && (
                  <Text style={[styles.paragraph, styles.indent]}>
                    Special instructions: {property.instructions}
                  </Text>
                )}
              </View>
            ))}
          </ArticleLong>
        )}

        {/* Article - Residuary Estate */}
        <Article title="RESIDUARY ESTATE" articleNum={articleNums.residuary}>
          <Text style={styles.paragraph}>
            I give all the rest, residue, and remainder of my estate, whether real, personal, or
            mixed, and wherever situated, including any property over which I may have power of
            appointment (hereinafter referred to as my "residuary estate"), as follows:
          </Text>
          {residuaryEstate.distributionType === 'spouse' &&
            testator.maritalStatus === 'married' && (
              <Text style={styles.paragraph}>
                To my spouse, {safeText(testator.spouseName, 'my spouse')}, if my spouse survives me
                by {survivorshipPeriod} days.
              </Text>
            )}
          {residuaryEstate.distributionType === 'children' && children.length > 0 && (
            <Text style={styles.paragraph}>
              To my children, in equal shares{residuaryEstate.perStirpes ? ', per stirpes' : ''}.
            </Text>
          )}
          {residuaryEstate.distributionType === 'split' &&
            testator.maritalStatus === 'married' &&
            children.length > 0 && (
              <Text style={styles.paragraph}>
                {residuaryEstate.spouseShare}% to my spouse,{' '}
                {safeText(testator.spouseName, 'my spouse')}, and {residuaryEstate.childrenShare}%
                to my children, in equal shares{residuaryEstate.perStirpes ? ', per stirpes' : ''}.
              </Text>
            )}
          {residuaryEstate.distributionType === 'custom' &&
            residuaryEstate.customBeneficiaries?.length > 0 && (
              <View>
                {residuaryEstate.customBeneficiaries.map((b, i) => (
                  <Text key={i} style={styles.listItem}>
                    {b.share}% to {b.name}
                    {b.relationship ? ` (${b.relationship})` : null}
                  </Text>
                ))}
              </View>
            )}
          {/* Fallback for mismatched distribution configuration */}
          {!(
            (residuaryEstate.distributionType === 'spouse' &&
              testator.maritalStatus === 'married') ||
            (residuaryEstate.distributionType === 'children' && children.length > 0) ||
            (residuaryEstate.distributionType === 'split' &&
              testator.maritalStatus === 'married' &&
              children.length > 0) ||
            (residuaryEstate.distributionType === 'custom' &&
              residuaryEstate.customBeneficiaries?.length > 0)
          ) && (
            <Text style={styles.paragraph}>
              To be distributed according to the intestacy laws of the {stateConfig.fullName}.
            </Text>
          )}
          {residuaryEstate.perStirpes && children.length > 0 && (
            <Text style={styles.paragraph}>
              If any beneficiary named above does not survive me, their share shall pass to their
              descendants, per stirpes.
            </Text>
          )}
        </Article>

        {/* Article - Survivorship */}
        <Article title="SURVIVORSHIP REQUIREMENT" articleNum={articleNums.survivorship}>
          <Text style={styles.paragraph}>
            No beneficiary shall be entitled to receive any benefit under this Will unless such
            beneficiary survives me by {survivorshipPeriod} days. If a beneficiary fails to survive
            me by such period, such beneficiary shall be deemed to have predeceased me for all
            purposes of this Will.
          </Text>
        </Article>

        {/* Article - Digital Assets */}
        {articleNums.digital && (
          <Article title="DIGITAL ASSETS" articleNum={articleNums.digital}>
            <Text style={styles.paragraph}>
              Pursuant to the {stateConfig.digitalAssetsAct}, I authorize my Personal Representative
              to access, manage, and dispose of my digital assets.
            </Text>
            {digitalAssets.fiduciary && (
              <Text style={styles.paragraph}>
                I specifically authorize {digitalAssets.fiduciary} to serve as my digital fiduciary
                with full power to access my digital accounts and assets.
              </Text>
            )}
            <Text style={styles.paragraph}>Instructions for digital assets:</Text>
            <Text style={styles.listItem}>
              Social media accounts:{' '}
              {digitalAssets.socialMedia === 'delete'
                ? 'Delete'
                : digitalAssets.socialMedia === 'memorialize'
                  ? 'Memorialize (if available)'
                  : 'Transfer to fiduciary'}
            </Text>
            <Text style={styles.listItem}>
              Email accounts:{' '}
              {digitalAssets.email === 'delete'
                ? 'Delete'
                : digitalAssets.email === 'archive'
                  ? 'Archive contents then delete'
                  : 'Transfer access'}
            </Text>
            <Text style={styles.listItem}>
              Cloud storage:{' '}
              {digitalAssets.cloudStorage === 'delete'
                ? 'Delete'
                : digitalAssets.cloudStorage === 'download'
                  ? 'Download and distribute'
                  : 'Transfer to fiduciary'}
            </Text>
            {digitalAssets.cryptocurrency && (
              <Text style={styles.paragraph}>
                Cryptocurrency/Digital Wallets: {digitalAssets.cryptocurrency}
              </Text>
            )}
          </Article>
        )}

        {/* Article - Pet Care */}
        {articleNums.pets && (
          <Article title="PET CARE PROVISIONS" articleNum={articleNums.pets}>
            {pets.items.map((pet, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={styles.paragraph}>
                  {i + 1}. My {pet.type || 'pet'}
                  {pet.name ? ` named ${pet.name}` : null}:
                </Text>
                <Text style={styles.listItem}>I designate {pet.caretaker} as the caretaker.</Text>
                {pet.alternateCaretaker && (
                  <Text style={styles.listItem}>
                    If {pet.caretaker} is unable to serve, I designate {pet.alternateCaretaker} as
                    alternate.
                  </Text>
                )}
                {pet.funds && (
                  <Text style={styles.listItem}>
                    I set aside {pet.funds} for the care of this pet.
                  </Text>
                )}
                {pet.instructions && (
                  <Text style={styles.listItem}>Care instructions: {pet.instructions}</Text>
                )}
              </View>
            ))}
          </Article>
        )}

        {/* Article - Funeral Wishes */}
        {articleNums.funeral && (
          <Article title="FUNERAL AND BURIAL WISHES" articleNum={articleNums.funeral}>
            <Text style={styles.paragraph}>
              I express the following wishes regarding my funeral and final disposition:
            </Text>
            {funeral.preference && (
              <Text style={styles.listItem}>
                Disposition:{' '}
                {funeral.preference === 'burial'
                  ? 'Traditional burial'
                  : funeral.preference === 'cremation'
                    ? 'Cremation'
                    : funeral.preference === 'green'
                      ? 'Green/natural burial'
                      : funeral.preference === 'donation'
                        ? 'Donation to science'
                        : funeral.preference}
              </Text>
            )}
            {funeral.serviceType && (
              <Text style={styles.listItem}>
                Service:{' '}
                {funeral.serviceType === 'traditional'
                  ? 'Traditional funeral service'
                  : funeral.serviceType === 'memorial'
                    ? 'Memorial service'
                    : funeral.serviceType === 'celebration'
                      ? 'Celebration of life'
                      : funeral.serviceType === 'private'
                        ? 'Private family-only'
                        : funeral.serviceType === 'none'
                          ? 'No formal service'
                          : funeral.serviceType}
              </Text>
            )}
            {funeral.location && <Text style={styles.listItem}>Location: {funeral.location}</Text>}
            {funeral.memorialDonations && (
              <Text style={styles.listItem}>Memorial donations: {funeral.memorialDonations}</Text>
            )}
            <Text style={[styles.paragraph, { marginTop: 8 }]}>
              These wishes are expressions of my desires and are not legally binding. I request that
              my Personal Representative and family honor these wishes to the extent practicable.
            </Text>
          </Article>
        )}

        {/* Article - Debts and Expenses */}
        <Article title="DEBTS AND EXPENSES" articleNum={articleNums.debts}>
          {debtsAndTaxes.include ? (
            <View>
              {debtsAndTaxes.paymentOrder === 'residuary' && (
                <Text style={styles.paragraph}>
                  All of my legally enforceable debts, funeral expenses, costs of administration,
                  and any applicable taxes shall be paid from my residuary estate before
                  distribution.
                </Text>
              )}
              {debtsAndTaxes.paymentOrder === 'proportional' && (
                <Text style={styles.paragraph}>
                  All of my legally enforceable debts, funeral expenses, costs of administration,
                  and any applicable taxes shall be paid proportionally from all assets of my
                  estate.
                </Text>
              )}
              {debtsAndTaxes.paymentOrder === 'specific' && debtsAndTaxes.specificInstructions && (
                <Text style={styles.paragraph}>
                  My debts, expenses, and taxes shall be paid as follows:{' '}
                  {debtsAndTaxes.specificInstructions}
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.paragraph}>
              I direct my Personal Representative to pay all of my legally enforceable debts,
              funeral expenses, and costs of administration from my residuary estate.
            </Text>
          )}
        </Article>

        {/* Article - Disinheritance */}
        {articleNums.disinherit && (
          <Article title="DISINHERITANCE" articleNum={articleNums.disinherit}>
            <Text style={styles.paragraph}>
              I have intentionally and with full knowledge of the consequences omitted to provide
              for the following persons who might otherwise claim to be entitled to a share of my
              estate:
            </Text>
            {disinheritance.persons.map((person, i) => (
              <View key={i}>
                <Text style={styles.listItem}>
                  {i + 1}. {person.name}
                  {person.relationship ? ` (${person.relationship})` : null} shall receive no
                  benefit from my estate.
                </Text>
                {person.reason && (
                  <Text style={[styles.listItem, styles.indent]}>Reason: {person.reason}</Text>
                )}
              </View>
            ))}
            <Text style={[styles.paragraph, { marginTop: 8 }]}>
              This omission is intentional and not made by accident or mistake.
            </Text>
          </Article>
        )}

        {/* Article - No Contest Clause */}
        {articleNums.noContest && (
          <Article title="NO CONTEST CLAUSE" articleNum={articleNums.noContest}>
            <Text style={styles.paragraph}>
              If any beneficiary under this Will, directly or indirectly, contests or attacks this
              Will or any of its provisions, any share or interest in my estate given to that
              contesting beneficiary under this Will is revoked and shall be disposed of as if that
              contesting beneficiary had predeceased me without issue.
            </Text>
          </Article>
        )}

        {/* Article - Simultaneous Death */}
        <Article title="SIMULTANEOUS DEATH" articleNum={articleNums.simultaneousDeath}>
          <Text style={styles.paragraph}>
            If any beneficiary and I should die simultaneously, or under circumstances where it is
            difficult or impossible to determine who died first, it shall be conclusively presumed
            that such beneficiary predeceased me. This provision applies to all beneficiaries,
            including my spouse, in accordance with the
            {stateConfig.simultaneousDeathAct}.
          </Text>
        </Article>

        {/* Article - Tax Apportionment */}
        <Article title="TAX APPORTIONMENT" articleNum={articleNums.taxApportionment}>
          <Text style={styles.paragraph}>
            All estate, inheritance, succession, and other death taxes payable by reason of my death
            shall be paid from my residuary estate as an expense of administration, without
            apportionment and without reimbursement from any recipient of property included in my
            taxable estate.
          </Text>
        </Article>

        {/* Article - Lapsed Gifts */}
        <Article title="LAPSED GIFTS" articleNum={articleNums.lapsedGifts}>
          <Text style={styles.paragraph}>
            If any specific gift fails for any reason, including the beneficiary's death,
            disclaimer, or non-existence of the property, such gift shall lapse and become part of
            my residuary estate, unless an alternate beneficiary is designated or unless{' '}
            {stateConfig.name}'s anti-lapse statute ({stateConfig.antiLapseStatute}) applies.
          </Text>
        </Article>

        {/* Custom Provisions - Each as its own article */}
        {customProvisionItems.map((provision, i) => (
          <ArticleLong
            key={i}
            title={(provision.title || 'CUSTOM PROVISION').toUpperCase()}
            articleNum={articleNums.customProvisions[i]}
          >
            <Text style={styles.paragraph}>{provision.content}</Text>
          </ArticleLong>
        ))}

        {/* Article - General Provisions */}
        <ArticleLong title="GENERAL PROVISIONS" articleNum={articleNums.general}>
          <Text style={styles.paragraph}>
            A. Governing Law: This Will shall be governed by the laws of the {stateConfig.fullName}.
          </Text>
          <Text style={styles.paragraph}>
            B. Severability: If any provision is held invalid, the remaining provisions shall
            continue in full force and effect.
          </Text>
          <Text style={styles.paragraph}>
            C. Gender and Number: The masculine, feminine, or neuter gender and the singular or
            plural number shall include the others as context indicates.
          </Text>
          <Text style={styles.paragraph}>
            D. Definitions: "Descendants" means children, grandchildren, and more remote
            descendants. "Per stirpes" means a predeceased beneficiary's share passes to their
            descendants by right of representation.
          </Text>
          {stateConfig.homesteadProvisions && (
            <Text style={styles.paragraph}>
              E. {stateConfig.name} Homestead: I am aware {stateConfig.name} law provides special
              protections for homestead property which may supersede provisions of this Will
              regarding such property.
            </Text>
          )}
          {stateConfig.communityProperty && (
            <Text style={styles.paragraph}>
              {stateConfig.homesteadProvisions ? 'F' : 'E'}. Community Property: I am aware that{' '}
              {stateConfig.name} is a community property state. Property acquired during marriage
              may be subject to community property laws, which may affect the disposition of certain
              assets under this Will.
            </Text>
          )}
        </ArticleLong>

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

        <Text style={styles.paragraph}>
          IN WITNESS WHEREOF, I have signed this Last Will and Testament on this _____ day of
          _________________, 20_____, at {safeText(testator.county)} {countyOrParish},{' '}
          {stateConfig.name}.
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>{safeText(testator.fullName)}, Testator</Text>
        </View>

        <View style={{ marginTop: 60 }}>
          <Text style={[styles.articleTitle, { marginTop: 0 }]}>ATTESTATION CLAUSE</Text>
          <Text style={styles.paragraph}>
            We, the undersigned witnesses, declare that the person who signed this Will, or asked
            another to sign for them, did so in our presence, and that we believe this person to be
            of sound mind. We have signed this Will as witnesses in the presence of the Testator and
            in the presence of each other.
          </Text>
        </View>

        {/* Witness signature blocks - dynamically based on state requirement */}
        {stateConfig.witnesses === 2 ? (
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
        <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 4 }]}>
          SELF-PROVING AFFIDAVIT
        </Text>
        <Text style={[styles.legalNotice, { marginBottom: 12 }]}>
          (Pursuant to {stateConfig.affidavitStatute})
        </Text>
        <View style={[styles.separator, { marginBottom: 16, marginTop: 0 }]} />

        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold', marginRight: 40 }}>
            STATE OF {stateConfig.name.toUpperCase()}
          </Text>
          <Text style={{ fontWeight: 'bold' }}>
            {countyOrParish.toUpperCase()} OF{' '}
            {safeText(testator.county, '____________').toUpperCase()}
          </Text>
        </View>

        <Text style={[styles.paragraph, { marginBottom: 8 }]}>
          We, {safeText(testator.fullName)}, {witnessPlaceholders}, the Testator and the witnesses,
          respectively, whose names are signed to the foregoing instrument, being first duly sworn,
          do hereby declare to the undersigned authority that the Testator signed and executed the
          instrument as the Testator's Last Will and that the Testator signed it willingly, or
          directed another to sign for the Testator, and that each of the witnesses, in the presence
          and at the request of the Testator, signed the Will as witness in the Testator's presence
          and in the presence of each other, and that the Testator was at that time eighteen years
          of age or older, of sound mind, and under no constraint or undue influence.
        </Text>

        <View style={{ marginTop: 20 }}>
          <View style={[styles.signatureLine, { marginTop: 16 }]} />
          <Text style={styles.signatureLabel}>{safeText(testator.fullName)}, Testator</Text>
        </View>

        {/* Affidavit witness blocks - dynamically based on state requirement */}
        {stateConfig.witnesses === 2 ? (
          <View style={[styles.witnessRow, { marginTop: 20 }]}>
            <View style={styles.witnessBlock}>
              <View style={[styles.signatureLineShort, { marginTop: 16 }]} />
              <Text style={styles.signatureLabel}>Witness 1</Text>
            </View>
            <View style={styles.witnessBlock}>
              <View style={[styles.signatureLineShort, { marginTop: 16 }]} />
              <Text style={styles.signatureLabel}>Witness 2</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.witnessRow, { marginTop: 20 }]}>
            {[1, 2, 3].map(num => (
              <View key={num} style={styles.witnessBlockThird}>
                <View style={[styles.signatureLineShort, { marginTop: 16, width: 140 }]} />
                <Text style={styles.signatureLabel}>Witness {num}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 24 }}>
          <Text style={[styles.paragraph, { marginBottom: 6 }]}>
            Subscribed, sworn to and acknowledged before me by {safeText(testator.fullName)}, the
            Testator, and subscribed and sworn to before me by {witnessPlaceholders}, the witnesses,
            this _____ day of _________________, 20_____.
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={[styles.signatureLine, { marginTop: 12, width: 240 }]} />
          <Text style={styles.signatureLabel}>Notary Public, {stateConfig.fullName}</Text>
          <Text style={[styles.smallText, { marginTop: 12 }]}>
            My Commission Expires: ___________________
          </Text>
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

export default WillDocument
