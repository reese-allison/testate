import { getStateConfig } from '../constants/stateConfigs'
import { toRoman, toWords } from './formatters'

export function generateWillText(formData) {
  const {
    testator,
    executor,
    children,
    guardian,
    specificGifts,
    residuaryEstate,
    digitalAssets,
    pets,
    funeral,
    realProperty,
    debtsAndTaxes,
    customProvisions,
    disinheritance,
    survivorshipPeriod = 30,
    noContestClause = true,
  } = formData

  // Get state configuration - residenceState is required
  const stateCode = testator.residenceState || ''
  const stateConfig = getStateConfig(stateCode)
  const stateName = stateConfig?.name || '[STATE NOT SELECTED]'
  const stateFullName = stateConfig?.fullName || '[STATE NOT SELECTED]'
  const countyOrParish = stateCode === 'LA' ? 'Parish' : 'County'

  const lines = []
  let articleNumber = 1

  // Title
  lines.push('LAST WILL AND TESTAMENT')
  lines.push(`OF ${(testator.fullName || '').toUpperCase()}`)
  lines.push('')

  // Preamble
  lines.push(
    `I, ${testator.fullName || '[NAME]'}, a resident of ${testator.county || '[COUNTY]'} ${countyOrParish}, ${stateName}, ` +
      `residing at ${testator.address || '[ADDRESS]'}, ${testator.city || '[CITY]'}, ${stateName} ${testator.zip || '[ZIP]'}, ` +
      `being of sound mind and disposing memory, do hereby declare this to be my Last Will and Testament, ` +
      `and I hereby revoke all wills and codicils previously made by me.`
  )
  lines.push('')

  // Article I - Family Declaration
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - FAMILY DECLARATION`)
  lines.push('')

  if (testator.maritalStatus === 'married') {
    lines.push(`I am married to ${testator.spouseName}, hereinafter referred to as "my spouse."`)
  } else if (testator.maritalStatus === 'divorced') {
    lines.push(`I am divorced and currently unmarried.`)
  } else if (testator.maritalStatus === 'widowed') {
    lines.push(`I am a widow/widower and currently unmarried.`)
  } else {
    lines.push(`I am not currently married.`)
  }

  if (children.length > 0) {
    lines.push('')
    lines.push(`I have the following ${children.length === 1 ? 'child' : 'children'}:`)
    children.forEach(child => {
      const relationship =
        child.relationship === 'biological'
          ? ''
          : child.relationship === 'adopted'
            ? ' (legally adopted)'
            : ' (stepchild)'
      lines.push(`  - ${child.name}${relationship}`)
    })
  } else {
    lines.push('')
    lines.push(`I have no children.`)
  }
  lines.push('')

  // Article - Personal Representative
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - PERSONAL REPRESENTATIVE`)
  lines.push('')
  lines.push(
    `I appoint ${executor.name}${executor.relationship ? `, my ${executor.relationship},` : ''} ` +
      `as the Personal Representative of my estate.`
  )

  if (executor.alternateName) {
    lines.push('')
    lines.push(
      `If ${executor.name} is unable or unwilling to serve, I appoint ` +
        `${executor.alternateName}${executor.alternateRelationship ? `, my ${executor.alternateRelationship},` : ''} ` +
        `as alternate Personal Representative.`
    )
  }

  lines.push('')
  if (executor.bondRequired) {
    lines.push(`My Personal Representative shall be required to post a bond.`)
  } else {
    lines.push(
      `No bond or surety or other security shall be required of any Personal Representative ` +
        `serving hereunder.`
    )
  }

  lines.push('')
  lines.push(
    `To the extent permitted by the laws of the ${stateFullName}, this Will is ` +
      `intended as and shall be construed to be a nonintervention will, and after the probate ` +
      `of this Will, no further proceedings in court shall be necessary other than to comply ` +
      `with applicable statutes. The decision to administer my estate independently or under ` +
      `court supervision shall be made solely by my Personal Representative.`
  )

  lines.push('')
  lines.push(
    `I grant my Personal Representative all powers conferred on personal representatives ` +
      `and executors under the laws of the ${stateFullName}, including but not limited to the power to:`
  )
  lines.push(`  (a) Take possession of, manage, and control all property of my estate;`)
  lines.push(
    `  (b) Retain, sell at public or private sale, exchange, grant options on, invest and ` +
      `reinvest in any kind of property, real or personal, for cash or on credit;`
  )
  lines.push(`  (c) Borrow money and encumber or pledge any property of my estate to secure loans;`)
  lines.push(
    `  (d) Lease any real or personal property for any term, even beyond estate administration;`
  )
  lines.push(`  (e) Hold property in bearer form or in the name of a nominee;`)
  lines.push(`  (f) Divide and distribute property in cash or in kind, or partly in each;`)
  lines.push(`  (g) Exercise all powers of an absolute owner of property;`)
  lines.push(`  (h) Compromise, settle, and release claims in favor of or against my estate;`)
  lines.push(`  (i) Execute and deliver deeds, contracts, and other instruments;`)
  lines.push(`  (j) Employ attorneys, accountants, investment advisors, and other professionals;`)
  lines.push(`  (k) Pay all debts, taxes, and expenses of administration;`)
  lines.push(`  (l) Distribute my estate according to this Will.`)
  lines.push('')
  lines.push(
    `The term "Personal Representative" wherever used herein shall include any executor, ` +
      `executrix, administrator, or personal representative serving from time to time.`
  )
  lines.push('')

  // Article - Guardian (if minor children)
  const minorChildren = children.filter(c => c.isMinor)
  if (minorChildren.length > 0 && guardian.name) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - GUARDIAN OF MINOR CHILDREN`)
    lines.push('')
    lines.push(
      `If at my death I have any minor children and their other parent is unable or ` +
        `unwilling to care for them, I appoint ${guardian.name}${guardian.relationship ? `, ${guardian.relationship},` : ''} ` +
        `as guardian of the person of my minor children.`
    )

    if (guardian.alternateName) {
      lines.push('')
      lines.push(
        `If ${guardian.name} is unable or unwilling to serve, I appoint ` +
          `${guardian.alternateName}${guardian.alternateRelationship ? `, ${guardian.alternateRelationship},` : ''} ` +
          `as alternate guardian.`
      )
    }
    lines.push('')
  }

  // Article - Tangible Personal Property
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - TANGIBLE PERSONAL PROPERTY`)
  lines.push('')
  lines.push(
    `All tangible personal property owned by me at the time of my death, including but not ` +
      `limited to furniture, furnishings, household items, jewelry, clothing, automobiles, and ` +
      `other personal effects, not otherwise specifically disposed of by this Will or by any ` +
      `written memorandum, shall be distributed as part of my residuary estate as provided herein.`
  )
  lines.push('')

  // Article - Specific Gifts
  if (specificGifts.length > 0) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - SPECIFIC GIFTS`)
    lines.push('')
    lines.push(`I make the following specific gifts:`)
    lines.push('')

    specificGifts.forEach((gift, index) => {
      lines.push(
        `${index + 1}. I give ${gift.description || '[DESCRIPTION]'} to ${gift.beneficiary || '[BENEFICIARY]'}` +
          `${gift.beneficiaryRelationship ? ` (${gift.beneficiaryRelationship})` : ''}.`
      )

      if (gift.alternativeBeneficiary) {
        lines.push(
          `   If ${gift.beneficiary || '[BENEFICIARY]'} does not survive me, this gift shall pass to ` +
            `${gift.alternativeBeneficiary}.`
        )
      }

      if (gift.conditions) {
        lines.push(`   Conditions: ${gift.conditions}`)
      }
      lines.push('')
    })
  }

  // Article - Real Property
  if (realProperty.include && realProperty.items?.length > 0) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - REAL PROPERTY`)
    lines.push('')

    realProperty.items.forEach((property, index) => {
      lines.push(
        `${index + 1}. The property located at ${property.address || '[ADDRESS]'}` +
          `${property.description ? ` (${property.description})` : ''} ` +
          `shall pass to ${property.beneficiary || '[BENEFICIARY]'}.`
      )
      if (property.instructions) {
        lines.push(`   Special instructions: ${property.instructions}`)
      }
      lines.push('')
    })
  }

  // Article - Residuary Estate
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - RESIDUARY ESTATE`)
  lines.push('')
  lines.push(
    `I give all the rest, residue, and remainder of my estate, both real and personal, ` +
      `of whatever kind and wherever situated, that I own or to which I shall be in any manner ` +
      `entitled at the time of my death, including any property over which I may have power of ` +
      `appointment (collectively referred to as my "residuary estate"), as follows:`
  )
  lines.push('')

  // Handle distribution based on type, with fallback for mismatched configurations
  let distributionHandled = false

  if (residuaryEstate.distributionType === 'spouse' && testator.maritalStatus === 'married') {
    lines.push(
      `(a) To my spouse, ${testator.spouseName || '[SPOUSE]'}, if my spouse survives me by ${toWords(survivorshipPeriod)} days.`
    )
    distributionHandled = true
  } else if (residuaryEstate.distributionType === 'children' && children.length > 0) {
    lines.push(
      `(a) To my children, in equal shares${residuaryEstate.perStirpes ? ' (per stirpes)' : ''}, ` +
        `if they survive me by ${toWords(survivorshipPeriod)} days.`
    )
    distributionHandled = true
  } else if (
    residuaryEstate.distributionType === 'split' &&
    testator.maritalStatus === 'married' &&
    children.length > 0
  ) {
    lines.push(
      `(a) ${toWords(residuaryEstate.spouseShare)} percent to my spouse, ${testator.spouseName || '[SPOUSE]'}, ` +
        `and ${toWords(residuaryEstate.childrenShare)} percent to my children, in equal shares` +
        `${residuaryEstate.perStirpes ? ' (per stirpes)' : ''}, ` +
        `if they survive me by ${toWords(survivorshipPeriod)} days.`
    )
    distributionHandled = true
  } else if (
    residuaryEstate.distributionType === 'custom' &&
    residuaryEstate.customBeneficiaries?.length > 0
  ) {
    lines.push(
      `(a) To the following beneficiaries, if they survive me by ${toWords(survivorshipPeriod)} days:`
    )
    residuaryEstate.customBeneficiaries.forEach(beneficiary => {
      lines.push(
        `    - ${toWords(beneficiary.share || 0)} percent to ${beneficiary.name || '[BENEFICIARY]'}` +
          `${beneficiary.relationship ? ` (${beneficiary.relationship})` : ''}`
      )
    })
    distributionHandled = true
  }

  // Add anti-lapse provision
  if (distributionHandled) {
    lines.push('')
    lines.push(
      `(b) If any of the beneficiaries named above shall not survive me, decline the gift, ` +
        `or are no longer in existence (together referred to as "predeceased"), then their share ` +
        `shall pass to the surviving children of the predeceased beneficiary, if any, in equal shares` +
        `${residuaryEstate.perStirpes ? ' (per stirpes)' : ''}. If the predeceased beneficiary has no ` +
        `surviving children, then their share shall pass equally to the other beneficiaries named above ` +
        `who survive me.`
    )
    lines.push('')
    lines.push(
      `(c) If none of the beneficiaries described in clauses (a) and (b) above shall survive me, ` +
        `decline the gift, or are no longer in existence, then I give my residuary estate to those ` +
        `who would take from me as if I were then to die without a will, unmarried, and the absolute ` +
        `owner of my residuary estate, and a resident of the ${stateFullName}.`
    )
  } else {
    // Fallback if no distribution was specified
    lines.push(`To be distributed according to the intestacy laws of the ${stateFullName}.`)
    lines.push('')
    lines.push(
      `[NOTE: The distribution settings in this will may be incomplete. Please review ` +
        `the Estate Distribution section to ensure your wishes are properly specified.]`
    )
  }
  lines.push('')

  // Article - Survivorship Requirement
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - SURVIVORSHIP REQUIREMENT`)
  lines.push('')
  lines.push(
    `No beneficiary shall be entitled to receive any benefit under this Will unless ` +
      `such beneficiary survives me by ${toWords(survivorshipPeriod)} days. If a beneficiary fails to survive ` +
      `me by such period, such beneficiary shall be deemed to have predeceased me for all ` +
      `purposes of this Will.`
  )
  lines.push('')

  // Article - Distributions to Minors or Incapacitated Beneficiaries
  lines.push(
    `ARTICLE ${toRoman(articleNumber++)} - DISTRIBUTIONS TO MINORS OR INCAPACITATED BENEFICIARIES`
  )
  lines.push('')
  lines.push(
    `Whenever any beneficiary of my estate is under a legal disability or, in the judgment ` +
      `of my Personal Representative, is for any reason unable to manage their own affairs or ` +
      `apply any distribution to the beneficiary's own best advantage, my Personal Representative ` +
      `may, in their sole discretion, make distribution in any one or more of the following ways:`
  )
  lines.push('')
  lines.push(`  (a) Directly to the beneficiary;`)
  lines.push(`  (b) To the legal guardian or conservator of the beneficiary's property;`)
  lines.push(`  (c) To a parent or person with whom the beneficiary resides;`)
  const utmaAge = stateConfig?.utmaAge || 21
  lines.push(
    `  (d) If the beneficiary is under ${toWords(utmaAge)} years of age, to a custodian for the ` +
      `beneficiary under the Uniform Transfers to Minors Act of any state;`
  )
  lines.push(`  (e) By expending such property directly for the benefit of the beneficiary.`)
  lines.push('')
  lines.push(
    `The receipt by the beneficiary, guardian, conservator, custodian, or other person of ` +
      `any distribution so made shall be a complete discharge to my Personal Representative ` +
      `regarding such distribution.`
  )
  lines.push('')

  // Article - Digital Assets
  if (digitalAssets.include) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DIGITAL ASSETS`)
    lines.push('')
    lines.push(
      `Pursuant to the ${stateConfig?.digitalAssetsAct || 'Revised Uniform Fiduciary Access to Digital Assets Act'}, I authorize my Personal Representative to access, manage, and dispose of ` +
        `my digital assets.`
    )

    if (digitalAssets.fiduciary) {
      lines.push('')
      lines.push(
        `I specifically authorize ${digitalAssets.fiduciary} to serve as my digital ` +
          `fiduciary with full power to access my digital accounts and assets.`
      )
    }

    lines.push('')
    lines.push(`Instructions for digital assets:`)
    if (digitalAssets.socialMedia) {
      lines.push(
        `  - Social media accounts: ${digitalAssets.socialMedia === 'delete' ? 'Delete' : digitalAssets.socialMedia === 'memorialize' ? 'Memorialize (if available)' : 'Transfer to fiduciary'}`
      )
    }
    if (digitalAssets.email) {
      lines.push(
        `  - Email accounts: ${digitalAssets.email === 'delete' ? 'Delete' : digitalAssets.email === 'archive' ? 'Archive contents then delete' : 'Transfer access to fiduciary'}`
      )
    }
    if (digitalAssets.cloudStorage) {
      lines.push(
        `  - Cloud storage: ${digitalAssets.cloudStorage === 'delete' ? 'Delete' : digitalAssets.cloudStorage === 'download' ? 'Download contents and distribute' : 'Transfer to fiduciary'}`
      )
    }

    if (digitalAssets.cryptocurrency) {
      lines.push('')
      lines.push(`Cryptocurrency/Digital Wallets: ${digitalAssets.cryptocurrency}`)
    }

    if (digitalAssets.passwordManager) {
      lines.push('')
      lines.push(`Access Information: ${digitalAssets.passwordManager}`)
    }

    if (digitalAssets.instructions) {
      lines.push('')
      lines.push(`Additional Instructions: ${digitalAssets.instructions}`)
    }
    lines.push('')
  }

  // Article - Pet Care
  if (pets.include && pets.items?.length > 0) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - PET CARE PROVISIONS`)
    lines.push('')

    pets.items.forEach((pet, index) => {
      lines.push(`${index + 1}. My ${pet.type || 'pet'}${pet.name ? ` named ${pet.name}` : ''}:`)
      lines.push(`   I designate ${pet.caretaker} as the caretaker.`)
      if (pet.alternateCaretaker) {
        lines.push(
          `   If ${pet.caretaker} is unable to serve, I designate ${pet.alternateCaretaker} as alternate.`
        )
      }
      if (pet.funds) {
        lines.push(`   I set aside ${pet.funds} for the care of this pet.`)
      }
      if (pet.instructions) {
        lines.push(`   Care instructions: ${pet.instructions}`)
      }
      lines.push('')
    })
  }

  // Article - Funeral Wishes
  if (funeral.include) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - FUNERAL AND BURIAL WISHES`)
    lines.push('')
    lines.push(`I express the following wishes regarding my funeral and final disposition:`)

    if (funeral.preference) {
      const prefText = {
        burial: 'traditional burial',
        cremation: 'cremation',
        green: 'green/natural burial',
        donation: 'donation of my body to science',
      }
      lines.push(`  - Disposition: I prefer ${prefText[funeral.preference] || funeral.preference}`)
    }

    if (funeral.serviceType) {
      const serviceText = {
        traditional: 'a traditional funeral service',
        memorial: 'a memorial service',
        celebration: 'a celebration of life',
        private: 'a private family-only service',
        none: 'no formal service',
      }
      lines.push(
        `  - Service: I request ${serviceText[funeral.serviceType] || funeral.serviceType}`
      )
    }

    if (funeral.location) {
      lines.push(`  - Location: ${funeral.location}`)
    }

    if (funeral.memorialDonations) {
      lines.push(`  - Memorial donations: ${funeral.memorialDonations}`)
    }

    if (funeral.prePaidArrangements && funeral.prePaidDetails) {
      lines.push(`  - Pre-paid arrangements: ${funeral.prePaidDetails}`)
    }

    if (funeral.additionalWishes) {
      lines.push('')
      lines.push(`Additional wishes: ${funeral.additionalWishes}`)
    }

    lines.push('')
    lines.push(
      `These wishes are expressions of my desires and are not legally binding. I request ` +
        `that my Personal Representative and family honor these wishes to the extent practicable.`
    )
    lines.push('')
  }

  // Article - Debts and Taxes
  if (debtsAndTaxes.include) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DEBTS AND TAXES`)
    lines.push('')

    if (debtsAndTaxes.paymentOrder === 'residuary') {
      lines.push(
        `All of my legally enforceable debts, funeral expenses, costs of administration, ` +
          `and any applicable taxes shall be paid from my residuary estate before distribution.`
      )
    } else if (debtsAndTaxes.paymentOrder === 'proportional') {
      lines.push(
        `All of my legally enforceable debts, funeral expenses, costs of administration, ` +
          `and any applicable taxes shall be paid proportionally from all assets of my estate.`
      )
    } else if (debtsAndTaxes.paymentOrder === 'specific') {
      lines.push(`My debts, expenses, and taxes shall be paid as follows:`)
      if (debtsAndTaxes.specificInstructions) {
        lines.push(debtsAndTaxes.specificInstructions)
      }
    }
    lines.push('')
  } else {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DEBTS AND EXPENSES`)
    lines.push('')
    lines.push(
      `I direct my Personal Representative to pay all of my legally enforceable debts, ` +
        `funeral expenses, and costs of administration from my residuary estate.`
    )
    lines.push('')
  }

  // Article - Disinheritance
  if (disinheritance.include && disinheritance.persons?.length > 0) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DISINHERITANCE`)
    lines.push('')
    lines.push(
      `I have intentionally and with full knowledge of the consequences omitted to provide ` +
        `for the following persons who might otherwise claim to be entitled to a share of my estate:`
    )
    lines.push('')

    disinheritance.persons.forEach((person, index) => {
      lines.push(
        `${index + 1}. ${person.name || '[NAME]'}${person.relationship ? ` (${person.relationship})` : ''} ` +
          `shall receive no benefit from my estate.`
      )
      if (person.reason) {
        lines.push(`   Reason: ${person.reason}`)
      }
    })

    lines.push('')
    lines.push(`This omission is intentional and not made by accident or mistake.`)
    lines.push('')
  }

  // Article - No Contest Clause
  if (noContestClause) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - NO CONTEST CLAUSE`)
    lines.push('')
    lines.push(
      `If any beneficiary under this Will, directly or indirectly, contests or attacks ` +
        `this Will or any of its provisions, any share or interest in my estate given to that ` +
        `contesting beneficiary under this Will is revoked and shall be disposed of as if that ` +
        `contesting beneficiary had predeceased me without issue.`
    )
    lines.push('')
  }

  // Article - Simultaneous Death
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - SIMULTANEOUS DEATH`)
  lines.push('')
  lines.push(
    `If any beneficiary and I should die simultaneously, or under circumstances where ` +
      `it is difficult or impossible to determine who died first, it shall be conclusively ` +
      `presumed for purposes of this Will that such beneficiary predeceased me. This provision ` +
      `shall apply to all beneficiaries named herein, including my spouse, and shall be in ` +
      `accordance with the ${stateConfig?.simultaneousDeathAct || 'Uniform Simultaneous Death Act'}.`
  )
  lines.push('')

  // Article - Tax Apportionment
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - TAX APPORTIONMENT`)
  lines.push('')
  lines.push(
    `All estate, inheritance, succession, and other death taxes (including any interest ` +
      `and penalties thereon) payable by reason of my death shall be paid out of my residuary ` +
      `estate as an expense of administration, without apportionment and without reimbursement ` +
      `from any recipient of any property included in my taxable estate. This includes taxes ` +
      `on non-probate assets passing outside this Will.`
  )
  lines.push('')

  // Article - Specific Gift Failure
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - LAPSED GIFTS`)
  lines.push('')
  lines.push(
    `If any specific gift made under this Will fails for any reason, including but not ` +
      `limited to the predeceasing of the beneficiary, disclaimer, or the non-existence of the ` +
      `property at my death, such gift shall lapse and become part of my residuary estate, ` +
      `unless an alternate beneficiary is specifically designated or unless the beneficiary is ` +
      `a descendant of mine, in which case ${stateName}'s anti-lapse statute (${stateConfig?.antiLapseStatute || 'the applicable state anti-lapse statute'}) shall apply.`
  )
  lines.push('')

  // Article - Custom Provisions
  if (customProvisions?.include && customProvisions.items?.length > 0) {
    customProvisions.items.forEach(provision => {
      lines.push(`ARTICLE ${toRoman(articleNumber++)} - ${(provision.title || '').toUpperCase()}`)
      lines.push('')
      lines.push(provision.content)
      lines.push('')
    })
  }

  // Article - General Provisions
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - GENERAL PROVISIONS`)
  lines.push('')
  lines.push(
    `A. Governing Law: This Will shall be governed by and construed in accordance with ` +
      `the laws of the ${stateFullName}.`
  )
  lines.push('')
  lines.push(
    `B. Severability: If any provision of this Will is held invalid or unenforceable, ` +
      `the remaining provisions shall continue in full force and effect.`
  )
  lines.push('')
  lines.push(
    `C. Headings: The article headings used herein are for convenience only and shall ` +
      `not affect the interpretation of this Will.`
  )
  lines.push('')
  lines.push(
    `D. Gender and Number: Wherever used in this Will, the masculine, feminine, or ` +
      `neuter gender, and the singular or plural number, shall be deemed to include the others ` +
      `whenever the context so indicates.`
  )
  lines.push('')
  lines.push(
    `E. Definitions: As used in this Will, "descendants" means children, grandchildren, ` +
      `and more remote descendants, and "per stirpes" means that if any beneficiary predeceases ` +
      `me, that beneficiary's share passes to their descendants by right of representation.`
  )
  lines.push('')

  // State-specific property notice
  if (stateConfig?.homesteadProvisions) {
    lines.push(
      `F. ${stateName} Homestead: I am aware that ${stateName} law provides special protections ` +
        `for homestead property. If I own homestead property at my death, such property shall ` +
        `pass in accordance with ${stateName} law, which may supersede the provisions of this Will ` +
        `regarding such property.`
    )
    lines.push('')
  }

  // Community property notice
  if (stateConfig?.communityProperty) {
    lines.push(
      `${stateConfig?.homesteadProvisions ? 'G' : 'F'}. Community Property: I am aware that ${stateName} is a community property state. ` +
        `Property acquired during marriage may be subject to community property laws, which may ` +
        `affect the disposition of certain assets under this Will.`
    )
    lines.push('')
  }

  // Signature Block
  lines.push('='.repeat(60))
  lines.push('')
  lines.push(
    `IN WITNESS WHEREOF, I have signed this Last Will and Testament on this _____ day ` +
      `of _________________, 20_____, at ${testator.county} ${countyOrParish}, ${stateName}.`
  )
  lines.push('')
  lines.push('')
  lines.push('_________________________________________')
  lines.push(`${testator.fullName}, Testator`)
  lines.push('')
  lines.push('')

  // Attestation Clause
  lines.push('ATTESTATION OF WITNESSES')
  lines.push('')
  lines.push(
    `We, the undersigned witnesses, at the Testator's request, sign our names to this ` +
      `instrument, being first duly sworn, and do hereby declare to any authority that may be ` +
      `concerned that the Testator signed and executed this instrument as the Testator's Last ` +
      `Will and Testament, and that the Testator signed it willingly, and that each of us, in ` +
      `the presence and hearing of the Testator, hereby signs this Will as witness to the ` +
      `Testator's signing.`
  )
  lines.push('')
  lines.push(
    `We further declare that to the best of our knowledge the Testator is eighteen years ` +
      `of age or older, of sound mind, and under no constraint or undue influence.`
  )
  lines.push('')
  lines.push('')

  // Generate witness signature blocks based on state requirement
  const numWitnesses = stateConfig?.witnesses || 2
  for (let i = 1; i <= numWitnesses; i++) {
    lines.push('_________________________________________')
    lines.push(`Witness ${i} Signature`)
    lines.push('')
    lines.push('_________________________________________')
    lines.push(`Witness ${i} Printed Name`)
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
    lines.push('')
  }

  // Self-Proving Affidavit
  lines.push('='.repeat(60))
  lines.push('SELF-PROVING AFFIDAVIT')
  lines.push(`(Pursuant to ${stateConfig?.affidavitStatute || '[STATE AFFIDAVIT STATUTE]'})`)
  lines.push('='.repeat(60))
  lines.push('')
  lines.push(`STATE OF ${stateName.toUpperCase()}`)
  lines.push(`${countyOrParish.toUpperCase()} OF ${(testator.county || '[COUNTY]').toUpperCase()}`)
  lines.push('')

  // Generate witness names in affidavit based on state requirement
  const witnessPlaceholders = Array(numWitnesses).fill('_________________________').join(', and ')
  lines.push(
    `We, ${testator.fullName || '[NAME]'}, ${witnessPlaceholders}, ` +
      `the Testator and the witnesses, respectively, whose names are signed to the foregoing ` +
      `instrument, being first duly sworn, do hereby declare to the undersigned authority that ` +
      `the Testator signed and executed the instrument as the Testator's Last Will and that the ` +
      `Testator signed it willingly, or directed another to sign for the Testator, and that each ` +
      `of the witnesses, in the presence and at the request of the Testator, signed the Will as ` +
      `witness in the Testator's presence and in the presence of each other, and that the ` +
      `Testator was at that time eighteen years of age or older, of sound mind, and under no ` +
      `constraint or undue influence.`
  )
  lines.push('')
  lines.push('')
  lines.push('_________________________________________')
  lines.push(`${testator.fullName || '[NAME]'}, Testator`)
  lines.push('')
  lines.push('')

  // Generate witness signature blocks for affidavit
  for (let i = 1; i <= numWitnesses; i++) {
    lines.push('_________________________________________')
    lines.push(`Witness ${i}`)
    lines.push('')
    lines.push('')
  }

  lines.push(
    `Subscribed, sworn to and acknowledged before me by ${testator.fullName}, the ` +
      `Testator, and subscribed and sworn to before me by ${witnessPlaceholders}, the witnesses, this _____ day of _________________, 20_____.`
  )
  lines.push('')
  lines.push('')
  lines.push('_________________________________________')
  lines.push(`Notary Public, ${stateFullName}`)
  lines.push('')
  lines.push('My Commission Expires: ___________________')
  lines.push('')
  lines.push('[NOTARY SEAL]')

  return lines.join('\n')
}
