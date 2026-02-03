/**
 * Location constants for form fields
 * Centralized to avoid duplication across components
 */

export const FLORIDA_COUNTIES = [
  'Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard', 'Broward', 'Calhoun', 'Charlotte',
  'Citrus', 'Clay', 'Collier', 'Columbia', 'DeSoto', 'Dixie', 'Duval', 'Escambia',
  'Flagler', 'Franklin', 'Gadsden', 'Gilchrist', 'Glades', 'Gulf', 'Hamilton', 'Hardee',
  'Hendry', 'Hernando', 'Highlands', 'Hillsborough', 'Holmes', 'Indian River', 'Jackson',
  'Jefferson', 'Lafayette', 'Lake', 'Lee', 'Leon', 'Levy', 'Liberty', 'Madison', 'Manatee',
  'Marion', 'Martin', 'Miami-Dade', 'Monroe', 'Nassau', 'Okaloosa', 'Okeechobee', 'Orange',
  'Osceola', 'Palm Beach', 'Pasco', 'Pinellas', 'Polk', 'Putnam', 'Santa Rosa', 'Sarasota',
  'Seminole', 'St. Johns', 'St. Lucie', 'Sumter', 'Suwannee', 'Taylor', 'Union', 'Volusia',
  'Wakulla', 'Walton', 'Washington'
]

export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' }
]

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single (never married)' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Legally Separated' }
]

export const CHILD_RELATIONSHIP_OPTIONS = [
  { value: 'biological', label: 'Biological Child' },
  { value: 'adopted', label: 'Legally Adopted Child' },
  { value: 'stepchild', label: 'Stepchild' }
]

export const GIFT_TYPE_OPTIONS = [
  { value: 'cash', label: 'Cash/Money' },
  { value: 'real_property', label: 'Real Property (House, Land)' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'furniture', label: 'Furniture/Household Items' },
  { value: 'securities', label: 'Stocks/Bonds/Securities' },
  { value: 'personal_property', label: 'Other Personal Property' }
]

export const DISTRIBUTION_TYPE_OPTIONS = [
  { value: 'spouse', label: 'All to Spouse' },
  { value: 'children', label: 'Equally to Children' },
  { value: 'split', label: 'Split Between Spouse and Children' },
  { value: 'custom', label: 'Custom Distribution' }
]

export const DIGITAL_ASSET_OPTIONS = {
  socialMedia: [
    { value: 'delete', label: 'Delete accounts' },
    { value: 'memorialize', label: 'Memorialize (if available)' },
    { value: 'transfer', label: 'Transfer to fiduciary' }
  ],
  email: [
    { value: 'delete', label: 'Delete accounts' },
    { value: 'archive', label: 'Archive then delete' },
    { value: 'transfer', label: 'Transfer access to fiduciary' }
  ],
  cloudStorage: [
    { value: 'delete', label: 'Delete all data' },
    { value: 'download', label: 'Download contents and distribute' },
    { value: 'transfer', label: 'Transfer to fiduciary' }
  ]
}

export const FUNERAL_PREFERENCE_OPTIONS = [
  { value: 'burial', label: 'Traditional Burial' },
  { value: 'cremation', label: 'Cremation' },
  { value: 'green', label: 'Green/Natural Burial' },
  { value: 'donation', label: 'Donate Body to Science' }
]

export const FUNERAL_SERVICE_OPTIONS = [
  { value: 'traditional', label: 'Traditional Funeral Service' },
  { value: 'memorial', label: 'Memorial Service' },
  { value: 'celebration', label: 'Celebration of Life' },
  { value: 'private', label: 'Private Family-Only Service' },
  { value: 'none', label: 'No Formal Service' }
]

export const DEBT_PAYMENT_OPTIONS = [
  { value: 'residuary', label: 'Pay from Residuary Estate' },
  { value: 'proportional', label: 'Pay Proportionally from All Assets' },
  { value: 'specific', label: 'Specific Instructions' }
]
