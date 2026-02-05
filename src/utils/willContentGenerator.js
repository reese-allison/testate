import { getStateConfig } from '../constants/stateConfigs'
import { toWords } from './formatters'

/**
 * Generates structured will content from form data.
 * This is the single source of truth for all will content.
 *
 * @param {Object} formData - The form data containing all will information
 * @returns {Object} Structured content object with sections and metadata
 */
export function generateWillContent(formData) {
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

  // Get state configuration
  const stateCode = testator.residenceState || ''
  const stateConfig = getStateConfig(stateCode)
  const stateName = stateConfig?.name || '[STATE NOT SELECTED]'
  const stateFullName = stateConfig?.fullName || '[STATE NOT SELECTED]'
  const countyOrParish = stateCode === 'LA' ? 'Parish' : 'County'
  const numWitnesses = stateConfig?.witnesses || 2
  const utmaAge = stateConfig?.utmaAge || 21

  // Build metadata
  const metadata = {
    stateCode,
    stateName,
    stateFullName,
    countyOrParish,
    numWitnesses,
    utmaAge,
    stateConfig,
  }

  // Collect all sections
  const sections = []
  let articleNumber = 1

  // Title
  sections.push(generateTitle(testator))

  // Preamble
  sections.push(generatePreamble(testator, stateName, countyOrParish))

  // Article I - Family Declaration
  sections.push(generateFamilyDeclaration(testator, children, articleNumber++, guardian))

  // Article - Personal Representative
  sections.push(generatePersonalRepresentative(executor, stateFullName, articleNumber++))

  // Article - Guardian (conditional)
  const minorChildren = children.filter(c => c.isMinor)
  if (minorChildren.length > 0 && guardian.name) {
    sections.push(generateGuardianship(guardian, articleNumber++))
  }

  // Article - Tangible Personal Property
  sections.push(generateTangiblePersonalProperty(articleNumber++))

  // Article - Specific Gifts (conditional)
  if (specificGifts.length > 0) {
    sections.push(generateSpecificGifts(specificGifts, articleNumber++))
  }

  // Article - Real Property (conditional)
  if (realProperty.include && realProperty.items?.length > 0) {
    sections.push(generateRealProperty(realProperty.items, articleNumber++))
  }

  // Article - Residuary Estate
  sections.push(
    generateResiduaryEstate(residuaryEstate, testator, children, stateFullName, articleNumber++)
  )

  // Article - Survivorship Requirement
  sections.push(generateSurvivorshipRequirement(survivorshipPeriod, articleNumber++))

  // Article - Distributions to Minors or Incapacitated Beneficiaries
  sections.push(generateDistributionsToMinors(utmaAge, articleNumber++))

  // Article - Digital Assets (conditional)
  if (digitalAssets.include) {
    sections.push(generateDigitalAssets(digitalAssets, stateConfig, articleNumber++))
  }

  // Article - Pet Care (conditional)
  if (pets.include && pets.items?.length > 0) {
    sections.push(generatePetCare(pets.items, articleNumber++))
  }

  // Article - Funeral Wishes (conditional)
  if (funeral.include) {
    sections.push(generateFuneralWishes(funeral, articleNumber++))
  }

  // Article - Debts and Taxes
  sections.push(generateDebtsAndTaxes(debtsAndTaxes, articleNumber++))

  // Article - Disinheritance (conditional)
  if (disinheritance.include && disinheritance.persons?.length > 0) {
    sections.push(generateDisinheritance(disinheritance.persons, articleNumber++, testator))
  }

  // Article - No Contest Clause (conditional, default true)
  if (noContestClause) {
    sections.push(generateNoContestClause(articleNumber++))
  }

  // Article - Simultaneous Death
  sections.push(generateSimultaneousDeath(stateConfig, articleNumber++))

  // Article - Tax Apportionment
  sections.push(generateTaxApportionment(articleNumber++))

  // Article - Lapsed Gifts
  sections.push(generateLapsedGifts(stateName, stateConfig, articleNumber++))

  // Custom Provisions (conditional, variable count)
  if (customProvisions?.include && customProvisions.items?.length > 0) {
    customProvisions.items.forEach(provision => {
      sections.push(generateCustomProvision(provision, articleNumber++))
    })
  }

  // Article - General Provisions
  sections.push(generateGeneralProvisions(stateName, stateFullName, stateConfig, articleNumber++))

  // Signature Block
  sections.push(generateSignatureBlock(testator, countyOrParish, stateName))

  // Attestation
  sections.push(generateAttestation(numWitnesses))

  // Self-Proving Affidavit
  sections.push(
    generateSelfProvingAffidavit(
      testator,
      stateConfig,
      stateName,
      countyOrParish,
      numWitnesses,
      stateFullName
    )
  )

  // Important Notice / Disclaimer
  sections.push(generateDisclaimer())

  return { sections, metadata }
}

// --- Section Generators ---

function generateTitle(testator) {
  return {
    type: 'title',
    content: [
      { type: 'heading', text: 'LAST WILL AND TESTAMENT' },
      { type: 'subheading', text: `OF ${(testator.fullName || '').toUpperCase()}` },
    ],
  }
}

function generatePreamble(testator, stateName, countyOrParish) {
  const text =
    `I, ${testator.fullName || '[NAME]'}, a resident of ${testator.county || '[COUNTY]'} ${countyOrParish}, ${stateName}, ` +
    `residing at ${testator.address || '[ADDRESS]'}, ${testator.city || '[CITY]'}, ${stateName} ${testator.zip || '[ZIP]'}, ` +
    `being of sound mind and disposing memory, do hereby declare this to be my Last Will and Testament, ` +
    `and I hereby revoke all wills and codicils previously made by me.`

  return {
    type: 'preamble',
    content: [{ type: 'paragraph', text }],
  }
}

function generateFamilyDeclaration(testator, children, articleNumber, _guardian = {}) {
  const content = []

  // Marital status
  let maritalText
  if (testator.maritalStatus === 'married') {
    maritalText = `I am married to ${testator.spouseName}, hereinafter referred to as "my spouse."`
  } else if (testator.maritalStatus === 'divorced') {
    maritalText = `I am divorced and currently unmarried.`
  } else if (testator.maritalStatus === 'widowed') {
    maritalText = `I am widowed and currently unmarried.`
  } else {
    maritalText = `I am not currently married.`
  }
  content.push({ type: 'paragraph', text: maritalText })

  // Children
  if (children.length > 0) {
    content.push({
      type: 'paragraph',
      text: `I have the following ${children.length === 1 ? 'child' : 'children'}:`,
    })
    const childList = children.map(child => {
      const relationship =
        child.relationship === 'biological'
          ? ''
          : child.relationship === 'adopted'
            ? ' (legally adopted)'
            : ' (stepchild)'
      return `${child.name}${relationship}`
    })
    content.push({ type: 'list', items: childList })
  } else {
    content.push({ type: 'paragraph', text: `I have no children.` })
  }

  return {
    type: 'article',
    title: 'FAMILY DECLARATION',
    articleNumber,
    content,
  }
}

function generatePersonalRepresentative(executor, stateFullName, articleNumber) {
  const content = []

  // Appointment
  content.push({
    type: 'paragraph',
    text:
      `I appoint ${executor.name}${executor.relationship ? `, my ${executor.relationship},` : ''} ` +
      `as the Personal Representative of my estate.`,
  })

  // Alternate
  if (executor.alternateName) {
    content.push({
      type: 'paragraph',
      text:
        `If ${executor.name} is unable or unwilling to serve, I appoint ` +
        `${executor.alternateName}${executor.alternateRelationship ? `, my ${executor.alternateRelationship},` : ''} ` +
        `as alternate Personal Representative.`,
    })
  }

  // Bond
  if (executor.bondRequired) {
    content.push({
      type: 'paragraph',
      text: `My Personal Representative shall be required to post a bond.`,
    })
  } else {
    content.push({
      type: 'paragraph',
      text: `To the extent permitted by law, I request that no bond or other security be required of my Personal Representative.`,
    })
  }

  // Independent administration paragraph
  content.push({
    type: 'paragraph',
    text:
      `To the extent permitted by the laws of the ${stateFullName}, I authorize my ` +
      `Personal Representative to administer my estate independently, without court supervision. ` +
      `After probate of this Will, no further court proceedings shall be required except as ` +
      `required by law.`,
  })

  // Powers
  content.push({
    type: 'paragraph',
    text:
      `I grant my Personal Representative all powers conferred by the laws of the ${stateFullName}, ` +
      `including the power to:`,
  })

  const powers = [
    `Take possession of, manage, and control all estate property;`,
    `Sell, exchange, or invest estate property, for cash or on credit;`,
    `Borrow money and use estate property as security;`,
    `Lease property for any term;`,
    `Divide and distribute property in cash or in kind;`,
    `Settle claims for or against my estate;`,
    `Execute deeds, contracts, and other documents;`,
    `Employ attorneys, accountants, and other professionals;`,
    `Pay debts, taxes, and administration expenses;`,
    `Distribute my estate according to this Will.`,
  ]

  content.push({ type: 'lettered-list', items: powers })

  content.push({
    type: 'paragraph',
    text:
      `The term "Personal Representative" as used in this Will includes any executor, ` +
      `administrator, or personal representative serving at any time.`,
  })

  return {
    type: 'article',
    title: 'PERSONAL REPRESENTATIVE',
    articleNumber,
    content,
  }
}

function generateGuardianship(guardian, articleNumber) {
  const content = []

  content.push({
    type: 'paragraph',
    text:
      `If at my death I have any minor children and their surviving parent is deceased, ` +
      `legally incapacitated, has had parental rights terminated, or is otherwise unable ` +
      `or unwilling to care for them, I appoint ${guardian.name}${guardian.relationship ? `, ${guardian.relationship},` : ''} ` +
      `as guardian of the person of my minor children.`,
  })

  if (guardian.alternateName) {
    content.push({
      type: 'paragraph',
      text:
        `If ${guardian.name} is unable or unwilling to serve, I appoint ` +
        `${guardian.alternateName}${guardian.alternateRelationship ? `, ${guardian.alternateRelationship},` : ''} ` +
        `as alternate guardian.`,
    })
  }

  return {
    type: 'article',
    title: 'GUARDIAN OF MINOR CHILDREN',
    articleNumber,
    content,
  }
}

function generateTangiblePersonalProperty(articleNumber) {
  return {
    type: 'article',
    title: 'TANGIBLE PERSONAL PROPERTY',
    articleNumber,
    content: [
      {
        type: 'paragraph',
        text:
          `All tangible personal property I own at my death, including furniture, household items, ` +
          `jewelry, clothing, automobiles, and personal effects, not otherwise disposed of by this ` +
          `Will, shall be distributed as part of my residuary estate.`,
      },
    ],
  }
}

function generateSpecificGifts(specificGifts, articleNumber) {
  const content = []

  content.push({ type: 'paragraph', text: `I make the following specific gifts:` })

  const giftItems = []
  specificGifts.forEach((gift, index) => {
    const giftContent = []
    giftContent.push({
      type: 'paragraph',
      text:
        `${index + 1}. I give ${gift.description || '[DESCRIPTION]'} to ${gift.beneficiary || '[BENEFICIARY]'}` +
        `${gift.beneficiaryRelationship ? ` (${gift.beneficiaryRelationship})` : ''}.`,
    })

    if (gift.alternativeBeneficiary) {
      giftContent.push({
        type: 'paragraph',
        indent: true,
        text:
          `If ${gift.beneficiary || '[BENEFICIARY]'} does not survive me, this gift shall pass to ` +
          `${gift.alternativeBeneficiary}.`,
      })
    }

    if (gift.conditions) {
      giftContent.push({
        type: 'paragraph',
        indent: true,
        text: `Conditions: ${gift.conditions}`,
      })
    }

    giftItems.push({ type: 'gift-block', content: giftContent })
  })

  content.push({ type: 'gift-list', items: giftItems })

  return {
    type: 'article',
    title: 'SPECIFIC GIFTS',
    articleNumber,
    content,
  }
}

function generateRealProperty(items, articleNumber) {
  const content = []

  items.forEach((property, index) => {
    content.push({
      type: 'paragraph',
      text:
        `${index + 1}. The property located at ${property.address || '[ADDRESS]'}` +
        `${property.description ? ` (${property.description})` : ''} ` +
        `shall pass to ${property.beneficiary || '[BENEFICIARY]'}.`,
    })

    if (property.instructions) {
      content.push({
        type: 'paragraph',
        indent: true,
        text: `Special instructions: ${property.instructions}`,
      })
    }
  })

  return {
    type: 'article',
    title: 'REAL PROPERTY',
    articleNumber,
    content,
  }
}

function generateResiduaryEstate(
  residuaryEstate,
  testator,
  children,
  stateFullName,
  articleNumber
) {
  const content = []

  content.push({
    type: 'paragraph',
    text:
      `I give all the rest of my estate, both real and personal, ` +
      `that I own at the time of my death, including any property over which I may have a power of ` +
      `appointment (my "residuary estate"), as follows:`,
  })

  // Handle distribution based on type
  let distributionHandled = false

  if (residuaryEstate.distributionType === 'spouse' && testator.maritalStatus === 'married') {
    content.push({
      type: 'paragraph',
      text: `(a) To my spouse, ${testator.spouseName || '[SPOUSE]'}.`,
    })
    distributionHandled = true
  } else if (residuaryEstate.distributionType === 'children' && children.length > 0) {
    content.push({
      type: 'paragraph',
      text: `(a) To my children, in equal shares${residuaryEstate.perStirpes ? ' (per stirpes)' : ''}.`,
    })
    distributionHandled = true
  } else if (
    residuaryEstate.distributionType === 'split' &&
    testator.maritalStatus === 'married' &&
    children.length > 0
  ) {
    content.push({
      type: 'paragraph',
      text:
        `(a) ${toWords(residuaryEstate.spouseShare)} percent to my spouse, ${testator.spouseName || '[SPOUSE]'}, ` +
        `and ${toWords(residuaryEstate.childrenShare)} percent to my children, in equal shares` +
        `${residuaryEstate.perStirpes ? ' (per stirpes)' : ''}.`,
    })
    distributionHandled = true
  } else if (
    residuaryEstate.distributionType === 'custom' &&
    residuaryEstate.customBeneficiaries?.length > 0
  ) {
    content.push({
      type: 'paragraph',
      text: `(a) To the following beneficiaries:`,
    })
    const beneficiaryList = residuaryEstate.customBeneficiaries.map(
      beneficiary =>
        `${toWords(beneficiary.share || 0)} percent to ${beneficiary.name || '[BENEFICIARY]'}` +
        `${beneficiary.relationship ? ` (${beneficiary.relationship})` : ''}`
    )
    content.push({ type: 'list', items: beneficiaryList, indent: true })
    distributionHandled = true
  }

  // Add anti-lapse provision
  if (distributionHandled) {
    content.push({
      type: 'paragraph',
      text:
        `(b) If any of the beneficiaries named above shall not survive me, decline the gift, ` +
        `or are no longer in existence (together referred to as "predeceased"), then their share ` +
        `shall pass to the surviving children of the predeceased beneficiary, if any, in equal shares` +
        `${residuaryEstate.perStirpes ? ' (per stirpes)' : ''}. If the predeceased beneficiary has no ` +
        `surviving children, then their share shall pass equally to the other beneficiaries named above ` +
        `who survive me.`,
    })

    content.push({
      type: 'paragraph',
      text:
        `(c) If none of the beneficiaries described in clauses (a) and (b) above shall survive me, ` +
        `decline the gift, or are no longer in existence, then I give my residuary estate to those ` +
        `who would take from me as if I were then to die without a will, unmarried, and the absolute ` +
        `owner of my residuary estate, and a resident of the ${stateFullName}.`,
    })
  } else {
    // Fallback if no distribution was specified
    content.push({
      type: 'paragraph',
      text: `To be distributed according to the intestacy laws of the ${stateFullName}.`,
    })
    content.push({
      type: 'paragraph',
      text:
        `[NOTE: The distribution settings in this will may be incomplete. Please review ` +
        `the Estate Distribution section to ensure your wishes are properly specified.]`,
    })
  }

  return {
    type: 'article',
    title: 'RESIDUARY ESTATE',
    articleNumber,
    content,
  }
}

function generateSurvivorshipRequirement(survivorshipPeriod, articleNumber) {
  return {
    type: 'article',
    title: 'SURVIVORSHIP REQUIREMENT',
    articleNumber,
    content: [
      {
        type: 'paragraph',
        text:
          `A beneficiary must survive me by ${toWords(survivorshipPeriod)} days to receive any benefit under ` +
          `this Will. A beneficiary who does not survive me by that period is treated as having ` +
          `predeceased me.`,
      },
    ],
  }
}

function generateDistributionsToMinors(utmaAge, articleNumber) {
  const content = []

  content.push({
    type: 'paragraph',
    text:
      `If any beneficiary is a minor, legally incapacitated, or in my Personal Representative's ` +
      `judgment unable to manage their own affairs, my Personal Representative may distribute ` +
      `that beneficiary's share in any of the following ways:`,
  })

  const options = [
    `Directly to the beneficiary;`,
    `To the beneficiary's legal guardian or conservator;`,
    `To a parent or person with whom the beneficiary resides;`,
    `If the beneficiary is under ${toWords(utmaAge)} years of age, to a custodian under the Uniform Transfers to Minors Act;`,
    `By spending funds directly for the beneficiary's benefit.`,
  ]

  content.push({ type: 'lettered-list', items: options })

  content.push({
    type: 'paragraph',
    text: `Any receipt from such distribution is a complete discharge to my Personal Representative.`,
  })

  return {
    type: 'article',
    title: 'DISTRIBUTIONS TO MINORS OR INCAPACITATED BENEFICIARIES',
    articleNumber,
    content,
  }
}

function generateDigitalAssets(digitalAssets, stateConfig, articleNumber) {
  const content = []

  content.push({
    type: 'paragraph',
    text:
      `Pursuant to the ${stateConfig?.digitalAssetsAct || 'Revised Uniform Fiduciary Access to Digital Assets Act'}, I authorize my Personal Representative to access, manage, and dispose of ` +
      `my digital assets.`,
  })

  if (digitalAssets.fiduciary) {
    content.push({
      type: 'paragraph',
      text:
        `I specifically authorize ${digitalAssets.fiduciary} to serve as my digital ` +
        `fiduciary with authority to access my digital accounts and assets. The digital ` +
        `fiduciary shall act under the general supervision of my Personal Representative ` +
        `and shall coordinate with my Personal Representative regarding any digital assets ` +
        `of financial value.`,
    })
  }

  content.push({ type: 'paragraph', text: `Instructions for digital assets:` })

  const instructions = []
  if (digitalAssets.socialMedia) {
    const socialText =
      digitalAssets.socialMedia === 'delete'
        ? 'Delete'
        : digitalAssets.socialMedia === 'memorialize'
          ? 'Memorialize (if available)'
          : 'Transfer to fiduciary'
    instructions.push(`Social media accounts: ${socialText}`)
  }
  if (digitalAssets.email) {
    const emailText =
      digitalAssets.email === 'delete'
        ? 'Delete'
        : digitalAssets.email === 'archive'
          ? 'Archive contents then delete'
          : 'Transfer access to fiduciary'
    instructions.push(`Email accounts: ${emailText}`)
  }
  if (digitalAssets.cloudStorage) {
    const cloudText =
      digitalAssets.cloudStorage === 'delete'
        ? 'Delete'
        : digitalAssets.cloudStorage === 'download'
          ? 'Download contents and distribute'
          : 'Transfer to fiduciary'
    instructions.push(`Cloud storage: ${cloudText}`)
  }

  if (instructions.length > 0) {
    content.push({ type: 'list', items: instructions })
  }

  if (digitalAssets.cryptocurrency) {
    content.push({
      type: 'paragraph',
      text: `Cryptocurrency/Digital Wallets: ${digitalAssets.cryptocurrency}`,
    })
  }

  if (digitalAssets.passwordManager) {
    content.push({
      type: 'paragraph',
      text: `Access Information: ${digitalAssets.passwordManager}`,
    })
  }

  if (digitalAssets.instructions) {
    content.push({
      type: 'paragraph',
      text: `Additional Instructions: ${digitalAssets.instructions}`,
    })
  }

  return {
    type: 'article',
    title: 'DIGITAL ASSETS',
    articleNumber,
    content,
  }
}

function generatePetCare(pets, articleNumber) {
  const content = []

  pets.forEach((pet, index) => {
    content.push({
      type: 'paragraph',
      text: `${index + 1}. My ${pet.type || 'pet'}${pet.name ? ` named ${pet.name}` : ''}:`,
    })
    content.push({
      type: 'paragraph',
      indent: true,
      text: `I designate ${pet.caretaker} as the caretaker.`,
    })

    if (pet.alternateCaretaker) {
      content.push({
        type: 'paragraph',
        indent: true,
        text: `If ${pet.caretaker} is unable to serve, I designate ${pet.alternateCaretaker} as alternate.`,
      })
    }

    if (pet.funds) {
      content.push({
        type: 'paragraph',
        indent: true,
        text: `I set aside ${pet.funds} for the care of this pet.`,
      })
    }

    if (pet.instructions) {
      content.push({
        type: 'paragraph',
        indent: true,
        text: `Care instructions: ${pet.instructions}`,
      })
    }
  })

  // Add pet care disclaimer
  content.push({
    type: 'paragraph',
    text: `These pet care provisions are expressions of my wishes. I request that my Personal Representative and the designated caretakers honor these wishes to the extent practicable. The designated caretaker is not legally obligated to accept responsibility for any pet.`,
  })

  return {
    type: 'article',
    title: 'PET CARE PROVISIONS',
    articleNumber,
    content,
  }
}

function generateFuneralWishes(funeral, articleNumber) {
  const content = []

  content.push({
    type: 'paragraph',
    text: `I express the following wishes regarding my funeral and final disposition:`,
  })

  const wishes = []

  if (funeral.preference) {
    const prefText = {
      burial: 'traditional burial',
      cremation: 'cremation',
      green: 'green/natural burial',
      donation: 'donation of my body to science',
    }
    wishes.push(`Disposition: I prefer ${prefText[funeral.preference] || funeral.preference}`)
  }

  if (funeral.serviceType) {
    const serviceText = {
      traditional: 'a traditional funeral service',
      memorial: 'a memorial service',
      celebration: 'a celebration of life',
      private: 'a private family-only service',
      none: 'no formal service',
    }
    wishes.push(`Service: I request ${serviceText[funeral.serviceType] || funeral.serviceType}`)
  }

  if (funeral.location) {
    wishes.push(`Location: ${funeral.location}`)
  }

  if (funeral.memorialDonations) {
    wishes.push(`Memorial donations: ${funeral.memorialDonations}`)
  }

  if (funeral.prePaidArrangements && funeral.prePaidDetails) {
    wishes.push(`Pre-paid arrangements: ${funeral.prePaidDetails}`)
  }

  if (wishes.length > 0) {
    content.push({ type: 'list', items: wishes })
  }

  if (funeral.additionalWishes) {
    content.push({
      type: 'paragraph',
      text: `Additional wishes: ${funeral.additionalWishes}`,
    })
  }

  content.push({
    type: 'paragraph',
    text:
      `These wishes are expressions of my desires and are not legally binding. I request ` +
      `that my Personal Representative and family honor these wishes to the extent practicable.`,
  })

  return {
    type: 'article',
    title: 'FUNERAL AND BURIAL WISHES',
    articleNumber,
    content,
  }
}

function generateDebtsAndTaxes(debtsAndTaxes, articleNumber) {
  const content = []

  if (debtsAndTaxes.include) {
    if (debtsAndTaxes.paymentOrder === 'residuary') {
      content.push({
        type: 'paragraph',
        text:
          `All of my legally enforceable debts, funeral expenses, costs of administration, ` +
          `and any applicable taxes shall be paid from my residuary estate before distribution.`,
      })
    } else if (debtsAndTaxes.paymentOrder === 'proportional') {
      content.push({
        type: 'paragraph',
        text:
          `All of my legally enforceable debts, funeral expenses, costs of administration, ` +
          `and any applicable taxes shall be paid proportionally from all assets of my estate.`,
      })
    } else if (debtsAndTaxes.paymentOrder === 'specific') {
      content.push({
        type: 'paragraph',
        text: `My debts, expenses, and taxes shall be paid as follows:`,
      })
      if (debtsAndTaxes.specificInstructions) {
        content.push({
          type: 'paragraph',
          text: debtsAndTaxes.specificInstructions,
        })
      }
    }

    return {
      type: 'article',
      title: 'DEBTS AND TAXES',
      articleNumber,
      content,
    }
  } else {
    content.push({
      type: 'paragraph',
      text:
        `I direct my Personal Representative to pay all of my legally enforceable debts, ` +
        `funeral expenses, and costs of administration from my residuary estate.`,
    })

    return {
      type: 'article',
      title: 'DEBTS AND EXPENSES',
      articleNumber,
      content,
    }
  }
}

function generateDisinheritance(persons, articleNumber, testator = {}) {
  const content = []

  content.push({
    type: 'paragraph',
    text: `I intentionally omit the following persons from any share of my estate:`,
  })

  persons.forEach((person, index) => {
    content.push({
      type: 'paragraph',
      text:
        `${index + 1}. ${person.name || '[NAME]'}${person.relationship ? ` (${person.relationship})` : ''} ` +
        `shall receive no benefit from my estate.`,
    })
    if (person.reason) {
      content.push({
        type: 'paragraph',
        indent: true,
        text: `Reason: ${person.reason}`,
      })
    }
  })

  // Check if spouse is being disinherited
  const disinheritingSpouse =
    testator.maritalStatus === 'married' &&
    persons.some(
      p =>
        p.relationship?.toLowerCase().includes('spouse') ||
        p.name?.toLowerCase().trim() === testator.spouseName?.toLowerCase().trim()
    )

  if (disinheritingSpouse) {
    content.push({
      type: 'paragraph',
      text:
        `I am aware that ${testator.residenceState ? 'state law may provide' : 'many states provide'} ` +
        `a surviving spouse with an elective share of the estate regardless of the provisions of this Will. ` +
        `This disinheritance is made with full knowledge that it may be subject to the statutory rights ` +
        `of my surviving spouse under applicable law.`,
    })
  }

  content.push({
    type: 'paragraph',
    text: `This omission is intentional and not made by accident or mistake.`,
  })

  return {
    type: 'article',
    title: 'DISINHERITANCE',
    articleNumber,
    content,
  }
}

function generateNoContestClause(articleNumber) {
  return {
    type: 'article',
    title: 'NO CONTEST CLAUSE',
    articleNumber,
    content: [
      {
        type: 'paragraph',
        text:
          `If any beneficiary contests this Will or any of its provisions, that beneficiary's ` +
          `share is revoked and distributed as if that beneficiary had predeceased me without descendants.`,
      },
      {
        type: 'paragraph',
        text:
          `Note: No-contest clause enforceability varies by state. This clause is enforced ` +
          `to the fullest extent permitted by law.`,
      },
    ],
  }
}

function generateSimultaneousDeath(stateConfig, articleNumber) {
  return {
    type: 'article',
    title: 'SIMULTANEOUS DEATH',
    articleNumber,
    content: [
      {
        type: 'paragraph',
        text:
          `If any beneficiary and I die simultaneously, or if it cannot be determined who died ` +
          `first, that beneficiary is treated as having predeceased me. This applies to all ` +
          `beneficiaries, including my spouse, under the ${stateConfig?.simultaneousDeathAct || 'Uniform Simultaneous Death Act'}.`,
      },
    ],
  }
}

function generateTaxApportionment(articleNumber) {
  return {
    type: 'article',
    title: 'TAX APPORTIONMENT',
    articleNumber,
    content: [
      {
        type: 'paragraph',
        text:
          `All estate, inheritance, and death taxes payable because of my death shall be paid ` +
          `from my residuary estate as an administration expense. No beneficiary shall be required ` +
          `to reimburse the estate for taxes on property they receive, including non-probate assets.`,
      },
    ],
  }
}

function generateLapsedGifts(stateName, stateConfig, articleNumber) {
  return {
    type: 'article',
    title: 'LAPSED GIFTS',
    articleNumber,
    content: [
      {
        type: 'paragraph',
        text:
          `If any specific gift fails because the beneficiary predeceased me, disclaimed the gift, ` +
          `or the property no longer exists, the gift becomes part of my residuary estate. However, ` +
          `if the beneficiary is my descendant, ${stateName}'s anti-lapse statute ` +
          `(${stateConfig?.antiLapseStatute || 'the applicable state anti-lapse statute'}) applies.`,
      },
    ],
  }
}

function generateCustomProvision(provision, articleNumber) {
  return {
    type: 'article',
    title: (provision.title || 'CUSTOM PROVISION').toUpperCase(),
    articleNumber,
    content: [{ type: 'paragraph', text: provision.content }],
  }
}

function generateGeneralProvisions(stateName, stateFullName, stateConfig, articleNumber) {
  const content = []

  content.push({
    type: 'paragraph',
    text: `A. Governing Law: This Will is governed by the laws of the ${stateFullName}.`,
  })

  content.push({
    type: 'paragraph',
    text: `B. Severability: If any provision of this Will is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.`,
  })

  content.push({
    type: 'paragraph',
    text: `C. Headings: Article headings are for convenience only and do not affect interpretation.`,
  })

  content.push({
    type: 'paragraph',
    text: `D. Gender and Number: Words of any gender or number include all genders and numbers when the context requires.`,
  })

  content.push({
    type: 'paragraph',
    text: `E. Definitions: As used in this Will, "descendants" means children, grandchildren, and more remote descendants, and "per stirpes" means that if any beneficiary predeceases me, that beneficiary's share passes to their descendants by right of representation.`,
  })

  // State-specific property notice
  let nextLetter = 'F'
  if (stateConfig?.homesteadProvisions) {
    content.push({
      type: 'paragraph',
      text: `${nextLetter}. ${stateName} Homestead: I am aware that ${stateName} law provides special protections for homestead property. If I own homestead property at my death, such property shall pass in accordance with ${stateName} law, which may supersede the provisions of this Will regarding such property.`,
    })
    nextLetter = 'G'
  }

  // Community property notice
  if (stateConfig?.communityProperty) {
    content.push({
      type: 'paragraph',
      text: `${nextLetter}. Community Property: I am aware that ${stateName} is a community property state. Property acquired during marriage may be subject to community property laws, which may affect the disposition of certain assets under this Will.`,
    })
  }

  // Marital property notice (Wisconsin)
  if (stateConfig?.maritalProperty) {
    content.push({
      type: 'paragraph',
      text: `${nextLetter}. Marital Property: I am aware that ${stateName} is a marital property state. Property acquired during marriage may be subject to marital property laws, which may affect the disposition of certain assets under this Will.`,
    })
  }

  return {
    type: 'article',
    title: 'GENERAL PROVISIONS',
    articleNumber,
    content,
  }
}

function generateSignatureBlock(testator, countyOrParish, stateName) {
  return {
    type: 'signature',
    content: [
      { type: 'separator' },
      {
        type: 'paragraph',
        text: `IN WITNESS WHEREOF, I have signed this Last Will and Testament on this _____ day of _________________, 20_____, at ${testator.county || '[COUNTY]'} ${countyOrParish}, ${stateName}.`,
      },
      { type: 'signature-line', label: `${testator.fullName || '[NAME]'}, Testator` },
    ],
  }
}

function generateAttestation(numWitnesses) {
  const content = []

  content.push({ type: 'heading', text: 'ATTESTATION OF WITNESSES' })

  content.push({
    type: 'paragraph',
    text:
      `We, the undersigned witnesses, at the Testator's request, sign our names to this ` +
      `instrument, being first duly sworn, and do hereby declare to any authority that may be ` +
      `concerned that the Testator signed and executed this instrument as the Testator's Last ` +
      `Will and Testament, and that the Testator signed it willingly, and that each of us, in ` +
      `the presence and hearing of the Testator, hereby signs this Will as witness to the ` +
      `Testator's signing.`,
  })

  content.push({
    type: 'paragraph',
    text:
      `We further declare that to the best of our knowledge the Testator is eighteen years ` +
      `of age or older, of sound mind, and under no constraint or undue influence.`,
  })

  // Generate witness signature blocks
  for (let i = 1; i <= numWitnesses; i++) {
    content.push({
      type: 'witness-block',
      witnessNumber: i,
      fields: ['Signature', 'Printed Name', 'Date', 'Address', 'City, State, ZIP'],
    })
  }

  return {
    type: 'attestation',
    content,
  }
}

function generateSelfProvingAffidavit(
  testator,
  stateConfig,
  stateName,
  countyOrParish,
  numWitnesses,
  stateFullName
) {
  const content = []

  content.push({ type: 'separator' })
  content.push({ type: 'heading', text: 'SELF-PROVING AFFIDAVIT' })
  content.push({
    type: 'subheading',
    text: `(Pursuant to ${stateConfig?.affidavitStatute || '[STATE AFFIDAVIT STATUTE]'})`,
  })
  content.push({ type: 'separator' })

  content.push({ type: 'paragraph', text: `STATE OF ${stateName.toUpperCase()}` })
  content.push({
    type: 'paragraph',
    text: `${countyOrParish.toUpperCase()} OF ${(testator.county || '[COUNTY]').toUpperCase()}`,
  })

  // Generate witness placeholders
  const witnessPlaceholders = Array(numWitnesses).fill('_________________________').join(', and ')

  content.push({
    type: 'paragraph',
    text:
      `We, ${testator.fullName || '[NAME]'}, ${witnessPlaceholders}, ` +
      `the Testator and the witnesses, respectively, whose names are signed to the foregoing ` +
      `instrument, being first duly sworn, do hereby declare to the undersigned authority that ` +
      `the Testator signed and executed the instrument as the Testator's Last Will and that the ` +
      `Testator signed it willingly, or directed another to sign for the Testator, and that each ` +
      `of the witnesses, in the presence and at the request of the Testator, signed the Will as ` +
      `witness in the Testator's presence and in the presence of each other, and that the ` +
      `Testator was at that time eighteen years of age or older, of sound mind, and under no ` +
      `constraint or undue influence.`,
  })

  content.push({ type: 'signature-line', label: `${testator.fullName || '[NAME]'}, Testator` })

  // Affidavit witness signature blocks
  for (let i = 1; i <= numWitnesses; i++) {
    content.push({ type: 'signature-line', label: `Witness ${i}` })
  }

  content.push({
    type: 'paragraph',
    text:
      `Subscribed, sworn to and acknowledged before me by ${testator.fullName || '[NAME]'}, the ` +
      `Testator, and subscribed and sworn to before me by ${witnessPlaceholders}, the witnesses, this _____ day of _________________, 20_____.`,
  })

  content.push({ type: 'signature-line', label: `Notary Public, ${stateFullName}` })
  content.push({ type: 'paragraph', text: `My Commission Expires: ___________________` })
  content.push({ type: 'paragraph', text: `[NOTARY SEAL]` })

  return {
    type: 'affidavit',
    content,
  }
}

function generateDisclaimer() {
  return {
    type: 'disclaimer',
    content: [
      { type: 'separator' },
      { type: 'heading', text: 'IMPORTANT NOTICE' },
      {
        type: 'paragraph',
        text:
          `This document was generated using an online template service and is provided ` +
          `for informational purposes only. It does not constitute legal advice and should ` +
          `not be relied upon without review by a licensed attorney in your state of residence. ` +
          `Estate planning laws vary by state, and a licensed attorney can ensure this document ` +
          `complies with all applicable requirements for validity and execution.`,
      },
    ],
  }
}
