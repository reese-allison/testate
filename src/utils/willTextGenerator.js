import { getStateConfig } from '../constants/stateConfigs'

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
    noContestClause = true
  } = formData

  // Get state configuration (defaults to FL for backward compatibility)
  const stateCode = testator.residenceState || 'FL'
  const stateConfig = getStateConfig(stateCode)
  const countyOrParish = stateCode === 'LA' ? 'Parish' : 'County'

  const lines = []
  let articleNumber = 1

  // Title
  lines.push('LAST WILL AND TESTAMENT')
  lines.push(`OF ${testator.fullName.toUpperCase()}`)
  lines.push('')

  // Preamble
  lines.push(`I, ${testator.fullName}, a resident of ${testator.county} ${countyOrParish}, ${stateConfig.name}, ` +
    `residing at ${testator.address}, ${testator.city}, ${stateConfig.name} ${testator.zip}, ` +
    `being of sound mind and disposing memory, do hereby declare this to be my Last Will and Testament, ` +
    `and I hereby revoke all wills and codicils previously made by me.`)
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
      const relationship = child.relationship === 'biological' ? '' :
        child.relationship === 'adopted' ? ' (legally adopted)' : ' (stepchild)'
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
  lines.push(`I appoint ${executor.name}${executor.relationship ? `, my ${executor.relationship},` : ''} ` +
    `as the Personal Representative of my estate.`)

  if (executor.alternateName) {
    lines.push('')
    lines.push(`If ${executor.name} is unable or unwilling to serve, I appoint ` +
      `${executor.alternateName}${executor.alternateRelationship ? `, my ${executor.alternateRelationship},` : ''} ` +
      `as alternate Personal Representative.`)
  }

  lines.push('')
  if (executor.bondRequired) {
    lines.push(`My Personal Representative shall be required to post a bond.`)
  } else {
    lines.push(`My Personal Representative shall serve without bond.`)
  }

  lines.push('')
  lines.push(`I grant my Personal Representative full power and authority to:`)
  lines.push(`  (a) Take possession of and manage all my property;`)
  lines.push(`  (b) Sell, lease, or mortgage any real or personal property;`)
  lines.push(`  (c) Pay all debts, taxes, and expenses of administration;`)
  lines.push(`  (d) Distribute my estate according to this Will;`)
  lines.push(`  (e) Perform all acts necessary for proper estate administration.`)
  lines.push('')

  // Article - Guardian (if minor children)
  const minorChildren = children.filter(c => c.isMinor)
  if (minorChildren.length > 0 && guardian.name) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - GUARDIAN OF MINOR CHILDREN`)
    lines.push('')
    lines.push(`If at my death I have any minor children and their other parent is unable or ` +
      `unwilling to care for them, I appoint ${guardian.name}${guardian.relationship ? `, ${guardian.relationship},` : ''} ` +
      `as guardian of the person of my minor children.`)

    if (guardian.alternateName) {
      lines.push('')
      lines.push(`If ${guardian.name} is unable or unwilling to serve, I appoint ` +
        `${guardian.alternateName}${guardian.alternateRelationship ? `, ${guardian.alternateRelationship},` : ''} ` +
        `as alternate guardian.`)
    }
    lines.push('')
  }

  // Article - Specific Gifts
  if (specificGifts.length > 0) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - SPECIFIC GIFTS`)
    lines.push('')
    lines.push(`I make the following specific gifts:`)
    lines.push('')

    specificGifts.forEach((gift, index) => {
      lines.push(`${index + 1}. I give ${gift.description} to ${gift.beneficiary}` +
        `${gift.beneficiaryRelationship ? ` (${gift.beneficiaryRelationship})` : ''}.`)

      if (gift.alternativeBeneficiary) {
        lines.push(`   If ${gift.beneficiary} does not survive me, this gift shall pass to ` +
          `${gift.alternativeBeneficiary}.`)
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
      lines.push(`${index + 1}. The property located at ${property.address}` +
        `${property.description ? ` (${property.description})` : ''} ` +
        `shall pass to ${property.beneficiary}.`)
      if (property.instructions) {
        lines.push(`   Special instructions: ${property.instructions}`)
      }
      lines.push('')
    })
  }

  // Article - Residuary Estate
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - RESIDUARY ESTATE`)
  lines.push('')
  lines.push(`I give all the rest, residue, and remainder of my estate, whether real, personal, ` +
    `or mixed, and wherever situated, including any property over which I may have power of ` +
    `appointment (hereinafter referred to as my "residuary estate"), as follows:`)
  lines.push('')

  if (residuaryEstate.distributionType === 'spouse' && testator.maritalStatus === 'married') {
    lines.push(`To my spouse, ${testator.spouseName}, if my spouse survives me by ${survivorshipPeriod} days.`)
  } else if (residuaryEstate.distributionType === 'children' && children.length > 0) {
    lines.push(`To my children, in equal shares${residuaryEstate.perStirpes ? ', per stirpes' : ''}.`)
  } else if (residuaryEstate.distributionType === 'split' && testator.maritalStatus === 'married') {
    lines.push(`${residuaryEstate.spouseShare}% to my spouse, ${testator.spouseName}, ` +
      `and ${residuaryEstate.childrenShare}% to my children, in equal shares${residuaryEstate.perStirpes ? ', per stirpes' : ''}.`)
  } else if (residuaryEstate.distributionType === 'custom' && residuaryEstate.customBeneficiaries?.length > 0) {
    residuaryEstate.customBeneficiaries.forEach(beneficiary => {
      lines.push(`  - ${beneficiary.share}% to ${beneficiary.name}` +
        `${beneficiary.relationship ? ` (${beneficiary.relationship})` : ''}`)
    })
  }

  if (residuaryEstate.perStirpes && children.length > 0) {
    lines.push('')
    lines.push(`If any beneficiary named above does not survive me, their share shall pass to ` +
      `their descendants, per stirpes.`)
  }
  lines.push('')

  // Article - Survivorship Requirement
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - SURVIVORSHIP REQUIREMENT`)
  lines.push('')
  lines.push(`No beneficiary shall be entitled to receive any benefit under this Will unless ` +
    `such beneficiary survives me by ${survivorshipPeriod} days. If a beneficiary fails to survive ` +
    `me by such period, such beneficiary shall be deemed to have predeceased me for all ` +
    `purposes of this Will.`)
  lines.push('')

  // Article - Digital Assets
  if (digitalAssets.include) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DIGITAL ASSETS`)
    lines.push('')
    lines.push(`Pursuant to the ${stateConfig.digitalAssetsAct}, I authorize my Personal Representative to access, manage, and dispose of ` +
      `my digital assets.`)

    if (digitalAssets.fiduciary) {
      lines.push('')
      lines.push(`I specifically authorize ${digitalAssets.fiduciary} to serve as my digital ` +
        `fiduciary with full power to access my digital accounts and assets.`)
    }

    lines.push('')
    lines.push(`Instructions for digital assets:`)
    if (digitalAssets.socialMedia !== 'transfer') {
      lines.push(`  - Social media accounts: ${digitalAssets.socialMedia === 'delete' ? 'Delete' : 'Memorialize (if available)'}`)
    }
    if (digitalAssets.email) {
      lines.push(`  - Email accounts: ${digitalAssets.email === 'delete' ? 'Delete' : digitalAssets.email === 'archive' ? 'Archive contents then delete' : 'Transfer access to fiduciary'}`)
    }
    if (digitalAssets.cloudStorage) {
      lines.push(`  - Cloud storage: ${digitalAssets.cloudStorage === 'delete' ? 'Delete' : digitalAssets.cloudStorage === 'download' ? 'Download contents and distribute' : 'Transfer to fiduciary'}`)
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
        lines.push(`   If ${pet.caretaker} is unable to serve, I designate ${pet.alternateCaretaker} as alternate.`)
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
        donation: 'donation of my body to science'
      }
      lines.push(`  - Disposition: I prefer ${prefText[funeral.preference] || funeral.preference}`)
    }

    if (funeral.serviceType) {
      const serviceText = {
        traditional: 'a traditional funeral service',
        memorial: 'a memorial service',
        celebration: 'a celebration of life',
        private: 'a private family-only service',
        none: 'no formal service'
      }
      lines.push(`  - Service: I request ${serviceText[funeral.serviceType] || funeral.serviceType}`)
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
    lines.push(`These wishes are expressions of my desires and are not legally binding. I request ` +
      `that my Personal Representative and family honor these wishes to the extent practicable.`)
    lines.push('')
  }

  // Article - Debts and Taxes
  if (debtsAndTaxes.include) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DEBTS AND TAXES`)
    lines.push('')

    if (debtsAndTaxes.paymentOrder === 'residuary') {
      lines.push(`All of my legally enforceable debts, funeral expenses, costs of administration, ` +
        `and any applicable taxes shall be paid from my residuary estate before distribution.`)
    } else if (debtsAndTaxes.paymentOrder === 'proportional') {
      lines.push(`All of my legally enforceable debts, funeral expenses, costs of administration, ` +
        `and any applicable taxes shall be paid proportionally from all assets of my estate.`)
    } else if (debtsAndTaxes.paymentOrder === 'specific') {
      lines.push(`My debts, expenses, and taxes shall be paid as follows:`)
      lines.push(debtsAndTaxes.specificInstructions)
    }
    lines.push('')
  } else {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DEBTS AND EXPENSES`)
    lines.push('')
    lines.push(`I direct my Personal Representative to pay all of my legally enforceable debts, ` +
      `funeral expenses, and costs of administration from my residuary estate.`)
    lines.push('')
  }

  // Article - Disinheritance
  if (disinheritance.include && disinheritance.persons?.length > 0) {
    lines.push(`ARTICLE ${toRoman(articleNumber++)} - DISINHERITANCE`)
    lines.push('')
    lines.push(`I have intentionally and with full knowledge of the consequences omitted to provide ` +
      `for the following persons who might otherwise claim to be entitled to a share of my estate:`)
    lines.push('')

    disinheritance.persons.forEach((person, index) => {
      lines.push(`${index + 1}. ${person.name}${person.relationship ? ` (${person.relationship})` : ''} ` +
        `shall receive no benefit from my estate.`)
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
    lines.push(`If any beneficiary under this Will, directly or indirectly, contests or attacks ` +
      `this Will or any of its provisions, any share or interest in my estate given to that ` +
      `contesting beneficiary under this Will is revoked and shall be disposed of as if that ` +
      `contesting beneficiary had predeceased me without issue.`)
    lines.push('')
  }

  // Article - Simultaneous Death
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - SIMULTANEOUS DEATH`)
  lines.push('')
  lines.push(`If any beneficiary and I should die simultaneously, or under circumstances where ` +
    `it is difficult or impossible to determine who died first, it shall be conclusively ` +
    `presumed for purposes of this Will that such beneficiary predeceased me. This provision ` +
    `shall apply to all beneficiaries named herein, including my spouse, and shall be in ` +
    `accordance with the ${stateConfig.simultaneousDeathAct}.`)
  lines.push('')

  // Article - Tax Apportionment
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - TAX APPORTIONMENT`)
  lines.push('')
  lines.push(`All estate, inheritance, succession, and other death taxes (including any interest ` +
    `and penalties thereon) payable by reason of my death shall be paid out of my residuary ` +
    `estate as an expense of administration, without apportionment and without reimbursement ` +
    `from any recipient of any property included in my taxable estate. This includes taxes ` +
    `on non-probate assets passing outside this Will.`)
  lines.push('')

  // Article - Specific Gift Failure
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - LAPSED GIFTS`)
  lines.push('')
  lines.push(`If any specific gift made under this Will fails for any reason, including but not ` +
    `limited to the predeceasing of the beneficiary, disclaimer, or the non-existence of the ` +
    `property at my death, such gift shall lapse and become part of my residuary estate, ` +
    `unless an alternate beneficiary is specifically designated or unless the beneficiary is ` +
    `a descendant of mine, in which case ${stateConfig.name}'s anti-lapse statute (${stateConfig.antiLapseStatute}) shall apply.`)
  lines.push('')

  // Article - Custom Provisions
  if (customProvisions?.include && customProvisions.items?.length > 0) {
    customProvisions.items.forEach((provision) => {
      lines.push(`ARTICLE ${toRoman(articleNumber++)} - ${provision.title.toUpperCase()}`)
      lines.push('')
      lines.push(provision.content)
      lines.push('')
    })
  }

  // Article - General Provisions
  lines.push(`ARTICLE ${toRoman(articleNumber++)} - GENERAL PROVISIONS`)
  lines.push('')
  lines.push(`A. Governing Law: This Will shall be governed by and construed in accordance with ` +
    `the laws of the ${stateConfig.fullName}.`)
  lines.push('')
  lines.push(`B. Severability: If any provision of this Will is held invalid or unenforceable, ` +
    `the remaining provisions shall continue in full force and effect.`)
  lines.push('')
  lines.push(`C. Headings: The article headings used herein are for convenience only and shall ` +
    `not affect the interpretation of this Will.`)
  lines.push('')
  lines.push(`D. Gender and Number: Wherever used in this Will, the masculine, feminine, or ` +
    `neuter gender, and the singular or plural number, shall be deemed to include the others ` +
    `whenever the context so indicates.`)
  lines.push('')
  lines.push(`E. Definitions: As used in this Will, "descendants" means children, grandchildren, ` +
    `and more remote descendants, and "per stirpes" means that if any beneficiary predeceases ` +
    `me, that beneficiary's share passes to their descendants by right of representation.`)
  lines.push('')

  // State-specific property notice
  if (stateConfig.homesteadProvisions) {
    lines.push(`F. ${stateConfig.name} Homestead: I am aware that ${stateConfig.name} law provides special protections ` +
      `for homestead property. If I own homestead property at my death, such property shall ` +
      `pass in accordance with ${stateConfig.name} law, which may supersede the provisions of this Will ` +
      `regarding such property.`)
    lines.push('')
  }

  // Community property notice
  if (stateConfig.communityProperty) {
    lines.push(`${stateConfig.homesteadProvisions ? 'G' : 'F'}. Community Property: I am aware that ${stateConfig.name} is a community property state. ` +
      `Property acquired during marriage may be subject to community property laws, which may ` +
      `affect the disposition of certain assets under this Will.`)
    lines.push('')
  }

  // Signature Block
  lines.push('=' .repeat(60))
  lines.push('')
  lines.push(`IN WITNESS WHEREOF, I have signed this Last Will and Testament on this _____ day ` +
    `of _________________, 20_____, at ${testator.county} ${countyOrParish}, ${stateConfig.name}.`)
  lines.push('')
  lines.push('')
  lines.push('_________________________________________')
  lines.push(`${testator.fullName}, Testator`)
  lines.push('')
  lines.push('')

  // Attestation Clause
  lines.push('ATTESTATION CLAUSE')
  lines.push('')
  lines.push(`We, the undersigned witnesses, declare that the person who signed this Will, ` +
    `or asked another to sign for them, did so in our presence, and that we believe this person ` +
    `to be of sound mind. We have signed this Will as witnesses in the presence of the Testator ` +
    `and in the presence of each other.`)
  lines.push('')
  lines.push('')

  // Generate witness signature blocks based on state requirement
  for (let i = 1; i <= stateConfig.witnesses; i++) {
    lines.push('_________________________________________    ________________________________')
    lines.push(`Witness ${i} Signature                          Printed Name`)
    lines.push('')
    lines.push('_________________________________________')
    lines.push('Address')
    lines.push('')
    lines.push('')
  }

  // Self-Proving Affidavit
  lines.push('=' .repeat(60))
  lines.push('SELF-PROVING AFFIDAVIT')
  lines.push(`(Pursuant to ${stateConfig.affidavitStatute})`)
  lines.push('=' .repeat(60))
  lines.push('')
  lines.push(`STATE OF ${stateConfig.name.toUpperCase()}`)
  lines.push(`${countyOrParish.toUpperCase()} OF ${testator.county.toUpperCase()}`)
  lines.push('')

  // Generate witness names in affidavit based on state requirement
  const witnessPlaceholders = Array(stateConfig.witnesses).fill('_________________________').join(', and ')
  lines.push(`We, ${testator.fullName}, ${witnessPlaceholders}, ` +
    `the Testator and the witnesses, respectively, whose names are signed to the foregoing ` +
    `instrument, being first duly sworn, do hereby declare to the undersigned authority that ` +
    `the Testator signed and executed the instrument as the Testator's Last Will and that the ` +
    `Testator signed it willingly, or directed another to sign for the Testator, and that each ` +
    `of the witnesses, in the presence and at the request of the Testator, signed the Will as ` +
    `witness in the Testator's presence and in the presence of each other, and that the ` +
    `Testator was at that time eighteen years of age or older, of sound mind, and under no ` +
    `constraint or undue influence.`)
  lines.push('')
  lines.push('')
  lines.push('_________________________________________')
  lines.push(`${testator.fullName}, Testator`)
  lines.push('')
  lines.push('')

  // Generate witness signature blocks for affidavit
  for (let i = 1; i <= stateConfig.witnesses; i++) {
    lines.push('_________________________________________')
    lines.push(`Witness ${i}`)
    lines.push('')
    lines.push('')
  }

  lines.push(`Subscribed, sworn to and acknowledged before me by ${testator.fullName}, the ` +
    `Testator, and subscribed and sworn to before me by ${witnessPlaceholders}, the witnesses, this _____ day of _________________, 20_____.`)
  lines.push('')
  lines.push('')
  lines.push('_________________________________________')
  lines.push(`Notary Public, ${stateConfig.fullName}`)
  lines.push('')
  lines.push('My Commission Expires: ___________________')
  lines.push('')
  lines.push('[NOTARY SEAL]')

  return lines.join('\n')
}

function toRoman(num) {
  const romanNumerals = [
    ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
  ]
  let result = ''
  for (const [roman, value] of romanNumerals) {
    while (num >= value) {
      result += roman
      num -= value
    }
  }
  return result
}

export default generateWillText
