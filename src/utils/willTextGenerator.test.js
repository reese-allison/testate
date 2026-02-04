import { describe, it, expect } from 'vitest'
import { generateWillText } from './willTextGenerator'

const createMinimalFormData = (residenceState = 'FL') => ({
  testator: {
    fullName: 'John Michael Smith',
    address: '123 Palm Beach Road',
    city: 'Miami',
    state: 'Florida',
    zip: '33101',
    county: 'Miami-Dade',
    maritalStatus: 'single',
    spouseName: '',
    residenceState: residenceState
  },
  executor: {
    name: 'Jane Doe',
    relationship: 'Sister',
    address: '456 Oak St',
    city: 'Orlando',
    state: 'Florida',
    zip: '32801',
    alternateName: '',
    bondRequired: false
  },
  children: [],
  guardian: { name: '', relationship: '' },
  specificGifts: [],
  residuaryEstate: {
    distributionType: 'spouse',
    spouseShare: 100,
    childrenShare: 0,
    customBeneficiaries: [],
    perStirpes: true
  },
  digitalAssets: { include: false },
  pets: { include: false, items: [] },
  funeral: { include: false },
  realProperty: { include: false, items: [] },
  debtsAndTaxes: { include: false },
  disinheritance: { include: false, persons: [] },
  customProvisions: { include: false, items: [] },
  survivorshipPeriod: 30,
  noContestClause: true
})

describe('generateWillText', () => {
  describe('Title and Preamble', () => {
    it('includes title with testator name in uppercase', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('LAST WILL AND TESTAMENT')
      expect(text).toContain('OF JOHN MICHAEL SMITH')
    })

    it('includes preamble with full address', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('I, John Michael Smith, a resident of Miami-Dade County, Florida')
      expect(text).toContain('123 Palm Beach Road, Miami, Florida 33101')
      expect(text).toContain('being of sound mind and disposing memory')
    })
  })

  describe('Family Declaration', () => {
    it('declares single status', () => {
      const formData = createMinimalFormData()
      formData.testator.maritalStatus = 'single'
      const text = generateWillText(formData)

      expect(text).toContain('I am not currently married')
    })

    it('declares married status with spouse name', () => {
      const formData = createMinimalFormData()
      formData.testator.maritalStatus = 'married'
      formData.testator.spouseName = 'Jane Elizabeth Smith'
      const text = generateWillText(formData)

      expect(text).toContain('I am married to Jane Elizabeth Smith')
    })

    it('declares divorced status', () => {
      const formData = createMinimalFormData()
      formData.testator.maritalStatus = 'divorced'
      const text = generateWillText(formData)

      expect(text).toContain('I am divorced and currently unmarried')
    })

    it('declares widowed status', () => {
      const formData = createMinimalFormData()
      formData.testator.maritalStatus = 'widowed'
      const text = generateWillText(formData)

      expect(text).toContain('I am a widow/widower and currently unmarried')
    })

    it('declares no children when empty', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('I have no children')
    })

    it('lists children when present', () => {
      const formData = createMinimalFormData()
      formData.children = [
        { name: 'Emily Rose Smith', relationship: 'biological', isMinor: true },
        { name: 'Michael John Smith', relationship: 'adopted', isMinor: false }
      ]
      const text = generateWillText(formData)

      expect(text).toContain('I have the following children')
      expect(text).toContain('Emily Rose Smith')
      expect(text).toContain('Michael John Smith (legally adopted)')
    })
  })

  describe('Personal Representative', () => {
    it('appoints executor with relationship', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('I appoint Jane Doe, my Sister, as the Personal Representative')
    })

    it('includes alternate executor when provided', () => {
      const formData = createMinimalFormData()
      formData.executor.alternateName = 'Robert Wilson'
      formData.executor.alternateRelationship = 'Brother'
      const text = generateWillText(formData)

      expect(text).toContain('If Jane Doe is unable or unwilling to serve')
      expect(text).toContain('Robert Wilson, my Brother, as alternate Personal Representative')
    })

    it('specifies no bond when bondRequired is false', () => {
      const formData = createMinimalFormData()
      formData.executor.bondRequired = false
      const text = generateWillText(formData)

      expect(text).toContain('shall serve without bond')
    })

    it('specifies bond required when bondRequired is true', () => {
      const formData = createMinimalFormData()
      formData.executor.bondRequired = true
      const text = generateWillText(formData)

      expect(text).toContain('shall be required to post a bond')
    })

    it('includes executor powers', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('Take possession of and manage all my property')
      expect(text).toContain('Sell, lease, or mortgage any real or personal property')
      expect(text).toContain('Pay all debts, taxes, and expenses')
    })
  })

  describe('Guardian', () => {
    it('includes guardian section when minor children exist', () => {
      const formData = createMinimalFormData()
      formData.children = [{ name: 'Child', isMinor: true }]
      formData.guardian = { name: 'Mary Johnson', relationship: 'Aunt' }
      const text = generateWillText(formData)

      expect(text).toContain('GUARDIAN OF MINOR CHILDREN')
      expect(text).toContain('I appoint Mary Johnson, Aunt, as guardian')
    })

    it('does not include guardian section when no minor children', () => {
      const formData = createMinimalFormData()
      formData.children = [{ name: 'Adult Child', isMinor: false }]
      formData.guardian = { name: 'Mary Johnson' }
      const text = generateWillText(formData)

      expect(text).not.toContain('GUARDIAN OF MINOR CHILDREN')
    })
  })

  describe('Specific Gifts', () => {
    it('does not include gifts section when empty', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).not.toContain('SPECIFIC GIFTS')
    })

    it('lists specific gifts when present', () => {
      const formData = createMinimalFormData()
      formData.specificGifts = [
        { description: '2020 Toyota Camry', beneficiary: 'Emily Smith', conditions: 'Upon reaching age 21' },
        { description: 'Diamond ring', beneficiary: 'Jane Smith', alternativeBeneficiary: 'Emily Smith' }
      ]
      const text = generateWillText(formData)

      expect(text).toContain('SPECIFIC GIFTS')
      expect(text).toContain('2020 Toyota Camry to Emily Smith')
      expect(text).toContain('Conditions: Upon reaching age 21')
      expect(text).toContain('Diamond ring to Jane Smith')
      expect(text).toContain('If Jane Smith does not survive me, this gift shall pass to Emily Smith')
    })
  })

  describe('Residuary Estate', () => {
    it('distributes to spouse when married and distribution type is spouse', () => {
      const formData = createMinimalFormData()
      formData.testator.maritalStatus = 'married'
      formData.testator.spouseName = 'Jane Smith'
      formData.residuaryEstate.distributionType = 'spouse'
      const text = generateWillText(formData)

      expect(text).toContain('To my spouse, Jane Smith, if my spouse survives me by 30 days')
    })

    it('distributes to children equally', () => {
      const formData = createMinimalFormData()
      formData.children = [{ name: 'Child 1' }, { name: 'Child 2' }]
      formData.residuaryEstate.distributionType = 'children'
      formData.residuaryEstate.perStirpes = true
      const text = generateWillText(formData)

      expect(text).toContain('To my children, in equal shares, per stirpes')
    })

    it('handles custom beneficiaries', () => {
      const formData = createMinimalFormData()
      formData.residuaryEstate.distributionType = 'custom'
      formData.residuaryEstate.customBeneficiaries = [
        { name: 'Person A', share: 50, relationship: 'Friend' },
        { name: 'Person B', share: 50 }
      ]
      const text = generateWillText(formData)

      expect(text).toContain('50% to Person A (Friend)')
      expect(text).toContain('50% to Person B')
    })
  })

  describe('Survivorship Requirement', () => {
    it('includes survivorship period', () => {
      const formData = createMinimalFormData()
      formData.survivorshipPeriod = 30
      const text = generateWillText(formData)

      expect(text).toContain('survives me by 30 days')
    })

    it('uses custom survivorship period', () => {
      const formData = createMinimalFormData()
      formData.survivorshipPeriod = 60
      const text = generateWillText(formData)

      expect(text).toContain('survives me by 60 days')
    })
  })

  describe('Digital Assets', () => {
    it('does not include digital assets when disabled', () => {
      const formData = createMinimalFormData()
      formData.digitalAssets = { include: false }
      const text = generateWillText(formData)

      expect(text).not.toContain('DIGITAL ASSETS')
    })

    it('includes digital assets section when enabled', () => {
      const formData = createMinimalFormData()
      formData.digitalAssets = {
        include: true,
        fiduciary: 'Robert Wilson',
        socialMedia: 'delete',
        email: 'archive',
        cloudStorage: 'transfer'
      }
      const text = generateWillText(formData)

      expect(text).toContain('DIGITAL ASSETS')
      expect(text).toContain('Florida Fiduciary Access to Digital Assets Act')
      expect(text).toContain('Robert Wilson to serve as my digital fiduciary')
      expect(text).toContain('Social media accounts: Delete')
      expect(text).toContain('Email accounts: Archive contents then delete')
      expect(text).toContain('Cloud storage: Transfer to fiduciary')
    })
  })

  describe('Pet Care', () => {
    it('does not include pets section when disabled', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).not.toContain('PET CARE PROVISIONS')
    })

    it('includes pet care when enabled with pets', () => {
      const formData = createMinimalFormData()
      formData.pets = {
        include: true,
        items: [{
          type: 'Dog',
          name: 'Max',
          caretaker: 'Mary Johnson',
          alternateCaretaker: 'Bob Smith',
          funds: '$5,000',
          instructions: 'Likes long walks'
        }]
      }
      const text = generateWillText(formData)

      expect(text).toContain('PET CARE PROVISIONS')
      expect(text).toContain('My Dog named Max')
      expect(text).toContain('Mary Johnson as the caretaker')
      expect(text).toContain('Bob Smith as alternate')
      expect(text).toContain('$5,000 for the care of this pet')
      expect(text).toContain('Likes long walks')
    })
  })

  describe('Funeral Wishes', () => {
    it('does not include funeral section when disabled', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).not.toContain('FUNERAL AND BURIAL WISHES')
    })

    it('includes funeral wishes when enabled', () => {
      const formData = createMinimalFormData()
      formData.funeral = {
        include: true,
        preference: 'cremation',
        serviceType: 'memorial',
        location: 'Miami Beach Chapel',
        memorialDonations: 'American Heart Association'
      }
      const text = generateWillText(formData)

      expect(text).toContain('FUNERAL AND BURIAL WISHES')
      expect(text).toContain('I prefer cremation')
      expect(text).toContain('a memorial service')
      expect(text).toContain('Miami Beach Chapel')
      expect(text).toContain('American Heart Association')
    })
  })

  describe('Disinheritance', () => {
    it('does not include disinheritance when disabled', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).not.toContain('DISINHERITANCE')
    })

    it('includes disinheritance when enabled with persons', () => {
      const formData = createMinimalFormData()
      formData.disinheritance = {
        include: true,
        persons: [{
          name: 'John Doe Jr',
          relationship: 'Son',
          reason: 'Personal reasons'
        }]
      }
      const text = generateWillText(formData)

      expect(text).toContain('DISINHERITANCE')
      expect(text).toContain('John Doe Jr (Son) shall receive no benefit')
      expect(text).toContain('Reason: Personal reasons')
      expect(text).toContain('This omission is intentional')
    })
  })

  describe('Custom Provisions', () => {
    it('does not include custom provisions when disabled', () => {
      const formData = createMinimalFormData()
      formData.customProvisions = { include: false, items: [] }
      const text = generateWillText(formData)

      expect(text).not.toContain('BUSINESS INSTRUCTIONS')
    })

    it('does not include custom provisions when enabled but no items', () => {
      const formData = createMinimalFormData()
      formData.customProvisions = { include: true, items: [] }
      const text = generateWillText(formData)

      // Should still have General Provisions as the last numbered article
      expect(text).toContain('GENERAL PROVISIONS')
    })

    it('includes custom provisions when enabled with items', () => {
      const formData = createMinimalFormData()
      formData.customProvisions = {
        include: true,
        items: [{
          title: 'Business Instructions',
          content: 'My family business shall be managed by my spouse until my children reach age 25.'
        }]
      }
      const text = generateWillText(formData)

      expect(text).toContain('BUSINESS INSTRUCTIONS')
      expect(text).toContain('My family business shall be managed by my spouse until my children reach age 25.')
    })

    it('includes multiple custom provisions as separate articles', () => {
      const formData = createMinimalFormData()
      formData.customProvisions = {
        include: true,
        items: [
          {
            title: 'Family Heirlooms',
            content: 'The antique clock shall remain in the family.'
          },
          {
            title: 'Charitable Wishes',
            content: 'I request my family consider annual donations to local charities.'
          }
        ]
      }
      const text = generateWillText(formData)

      expect(text).toContain('FAMILY HEIRLOOMS')
      expect(text).toContain('The antique clock shall remain in the family.')
      expect(text).toContain('CHARITABLE WISHES')
      expect(text).toContain('I request my family consider annual donations to local charities.')
    })

    it('custom provisions appear before General Provisions', () => {
      const formData = createMinimalFormData()
      formData.customProvisions = {
        include: true,
        items: [{
          title: 'Special Instructions',
          content: 'These are my special instructions.'
        }]
      }
      const text = generateWillText(formData)

      const customIndex = text.indexOf('SPECIAL INSTRUCTIONS')
      const generalIndex = text.indexOf('GENERAL PROVISIONS')
      expect(customIndex).toBeLessThan(generalIndex)
    })
  })

  describe('No Contest Clause', () => {
    it('includes no contest clause when enabled', () => {
      const formData = createMinimalFormData()
      formData.noContestClause = true
      const text = generateWillText(formData)

      expect(text).toContain('NO CONTEST CLAUSE')
      expect(text).toContain('If any beneficiary under this Will, directly or indirectly, contests')
    })

    it('does not include no contest clause when disabled', () => {
      const formData = createMinimalFormData()
      formData.noContestClause = false
      const text = generateWillText(formData)

      expect(text).not.toContain('NO CONTEST CLAUSE')
    })
  })

  describe('Self-Proving Affidavit', () => {
    it('includes self-proving affidavit', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('SELF-PROVING AFFIDAVIT')
      expect(text).toContain('Florida Statutes Section 732.503')
      expect(text).toContain('STATE OF FLORIDA')
      expect(text).toContain('COUNTY OF MIAMI-DADE')
      expect(text).toContain('Notary Public, State of Florida')
    })
  })

  describe('Simultaneous Death Provision', () => {
    it('includes simultaneous death provision', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('SIMULTANEOUS DEATH')
      expect(text).toContain('Uniform Simultaneous Death Act')
      expect(text).toContain('conclusively presumed')
    })
  })

  describe('Tax Apportionment', () => {
    it('includes tax apportionment provision', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('TAX APPORTIONMENT')
      expect(text).toContain('death taxes')
      expect(text).toContain('without apportionment')
    })
  })

  describe('Lapsed Gifts Provision', () => {
    it('includes lapsed gifts provision', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('LAPSED GIFTS')
      expect(text).toContain('anti-lapse statute')
      expect(text).toContain('Florida Statutes Section 732.603')
    })
  })

  describe('General Provisions', () => {
    it('includes general provisions', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('GENERAL PROVISIONS')
      expect(text).toContain('Governing Law')
      expect(text).toContain('laws of the State of Florida')
      expect(text).toContain('Severability')
    })

    it('includes gender and number clause', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('Gender and Number')
      expect(text).toContain('masculine, feminine, or neuter')
    })

    it('includes definitions clause', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('Definitions')
      expect(text).toContain('descendants')
      expect(text).toContain('per stirpes')
    })

    it('includes Florida homestead notice', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('Florida Homestead')
      expect(text).toContain('special protections')
    })
  })

  describe('Signature Blocks', () => {
    it('includes signature line for testator', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('John Michael Smith, Testator')
    })

    it('includes witness signature section', () => {
      const formData = createMinimalFormData()
      const text = generateWillText(formData)

      expect(text).toContain('ATTESTATION CLAUSE')
      expect(text).toContain('Witness 1 Signature')
      expect(text).toContain('Witness 2 Signature')
    })
  })

  describe('Multi-State Support', () => {
    it('defaults to Florida when residenceState is not set', () => {
      const formData = createMinimalFormData()
      delete formData.testator.residenceState
      const text = generateWillText(formData)

      expect(text).toContain('State of Florida')
      expect(text).toContain('Florida Statutes Section 732.503')
    })

    it('uses California law when residenceState is CA', () => {
      const formData = createMinimalFormData('CA')
      formData.testator.state = 'California'
      const text = generateWillText(formData)

      expect(text).toContain('a resident of Miami-Dade County, California')
      expect(text).toContain('California Probate Code Section 8220')
      expect(text).toContain('laws of the State of California')
      expect(text).toContain("California's anti-lapse statute")
      expect(text).toContain('Notary Public, State of California')
    })

    it('uses Texas law when residenceState is TX', () => {
      const formData = createMinimalFormData('TX')
      formData.testator.state = 'Texas'
      const text = generateWillText(formData)

      expect(text).toContain('State of Texas')
      expect(text).toContain('Texas Estates Code Section 251.104')
      expect(text).toContain("Texas's anti-lapse statute")
    })

    it('uses Parish instead of County for Louisiana', () => {
      const formData = createMinimalFormData('LA')
      formData.testator.state = 'Louisiana'
      formData.testator.county = 'Orleans'
      const text = generateWillText(formData)

      expect(text).toContain('a resident of Orleans Parish, Louisiana')
      expect(text).toContain('PARISH OF ORLEANS')
    })

    it('includes community property notice for community property states', () => {
      const formData = createMinimalFormData('CA')
      formData.testator.state = 'California'
      const text = generateWillText(formData)

      expect(text).toContain('Community Property')
      expect(text).toContain('community property state')
    })

    it('does not include community property notice for common law states', () => {
      const formData = createMinimalFormData('FL')
      const text = generateWillText(formData)

      expect(text).not.toContain('community property state')
    })

    it('includes correct digital assets act for different states', () => {
      const formData = createMinimalFormData('NY')
      formData.testator.state = 'New York'
      formData.digitalAssets = {
        include: true,
        fiduciary: 'John Doe',
        socialMedia: 'delete',
        email: 'archive',
        cloudStorage: 'transfer'
      }
      const text = generateWillText(formData)

      expect(text).toContain('New York Fiduciary Access to Digital Assets Law')
    })

    it('generates 3 witness blocks for South Carolina', () => {
      const formData = createMinimalFormData('SC')
      formData.testator.state = 'South Carolina'
      const text = generateWillText(formData)

      expect(text).toContain('Witness 1 Signature')
      expect(text).toContain('Witness 2 Signature')
      expect(text).toContain('Witness 3 Signature')
    })

    it('generates 3 witness blocks for Vermont', () => {
      const formData = createMinimalFormData('VT')
      formData.testator.state = 'Vermont'
      const text = generateWillText(formData)

      expect(text).toContain('Witness 1')
      expect(text).toContain('Witness 2')
      expect(text).toContain('Witness 3')
    })

    it('uses correct Commonwealth designation for Pennsylvania', () => {
      const formData = createMinimalFormData('PA')
      formData.testator.state = 'Pennsylvania'
      const text = generateWillText(formData)

      expect(text).toContain('Commonwealth of Pennsylvania')
    })

    it('uses correct Commonwealth designation for Kentucky', () => {
      const formData = createMinimalFormData('KY')
      formData.testator.state = 'Kentucky'
      const text = generateWillText(formData)

      expect(text).toContain('Commonwealth of Kentucky')
    })

    it('handles District of Columbia', () => {
      const formData = createMinimalFormData('DC')
      formData.testator.state = 'District of Columbia'
      const text = generateWillText(formData)

      expect(text).toContain('District of Columbia')
      expect(text).toContain('D.C. Code Section 18-103')
    })
  })
})
