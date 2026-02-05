import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS } from '../constants'

const initialState = {
  // Step 1: Testator Info
  testator: {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    maritalStatus: '',
    spouseName: '',
    residenceState: '', // State code for will jurisdiction - user must select
  },

  // Step 2: Executor/Personal Representative
  executor: {
    name: '',
    relationship: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    alternateName: '',
    alternateRelationship: '',
    alternateAddress: '',
    alternateCity: '',
    alternateState: '',
    alternateZip: '',
    bondRequired: false,
  },

  // Step 3: Children & Guardian
  children: [],
  guardian: {
    name: '',
    relationship: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    alternateName: '',
    alternateRelationship: '',
    alternateAddress: '',
    alternateCity: '',
    alternateState: '',
    alternateZip: '',
  },

  // Step 4: Specific Gifts
  specificGifts: [],

  // Step 5: Estate Distribution
  residuaryEstate: {
    distributionType: '', // spouse, children, split, custom - user must select
    spouseShare: 100,
    childrenShare: 0,
    customBeneficiaries: [],
    perStirpes: true,
  },

  // Step 6: Additional Provisions
  digitalAssets: {
    include: false,
    fiduciary: '',
    socialMedia: 'delete', // delete, memorialize, transfer
    email: 'delete',
    cloudStorage: 'transfer',
    cryptocurrency: '',
    passwordManager: '',
    instructions: '',
  },
  pets: {
    include: false,
    items: [],
  },
  funeral: {
    include: false,
    preference: '', // burial, cremation, other
    serviceType: '', // traditional, memorial, celebration, none
    location: '',
    memorialDonations: '',
    prePaidArrangements: false,
    prePaidDetails: '',
    additionalWishes: '',
  },
  realProperty: {
    include: false,
    items: [],
  },
  debtsAndTaxes: {
    include: false,
    paymentOrder: 'residuary', // residuary, proportional, specific
    specificInstructions: '',
  },
  customProvisions: {
    include: false,
    items: [], // { title: '', content: '' }
  },

  // Step 7: Disinheritance (Optional)
  disinheritance: {
    include: false,
    persons: [],
  },

  // Meta
  survivorshipPeriod: 30, // days
  noContestClause: true,
}

export function useWillState() {
  const [formData, setFormData, clearFormData] = useLocalStorage(
    STORAGE_KEYS.FORM_DATA,
    initialState
  )

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateSection = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }))
  }

  const updateArray = (section, newArray) => {
    setFormData(prev => ({
      ...prev,
      [section]: newArray,
    }))
  }

  const resetForm = () => {
    clearFormData()
  }

  return {
    formData,
    setFormData,
    updateField,
    updateSection,
    updateArray,
    resetForm,
  }
}
