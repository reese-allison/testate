import { describe, it, expect } from 'vitest'
import {
  STATE_CONFIGS,
  getStateConfig,
  COMMUNITY_PROPERTY_STATES,
  MARITAL_PROPERTY_STATES,
  THREE_WITNESS_STATES,
} from './stateConfigs'

describe('STATE_CONFIGS', () => {
  it('contains 50 states plus DC minus Louisiana', () => {
    const stateCount = Object.keys(STATE_CONFIGS).length
    expect(stateCount).toBe(50) // 50 states + DC - Louisiana = 50
  })

  it('does not contain Louisiana', () => {
    expect(STATE_CONFIGS.LA).toBeUndefined()
  })

  it('each state has required properties', () => {
    const requiredProps = [
      'name',
      'fullName',
      'witnesses',
      'selfProvingAffidavit',
      'affidavitStatute',
      'antiLapseStatute',
      'communityProperty',
      'homesteadProvisions',
      'digitalAssetsAct',
      'simultaneousDeathAct',
      'utmaAge',
    ]

    Object.entries(STATE_CONFIGS).forEach(([stateCode, config]) => {
      requiredProps.forEach(prop => {
        expect(config[prop], `${stateCode} missing ${prop}`).toBeDefined()
      })
    })
  })

  it('all states have valid utmaAge (18-25)', () => {
    Object.entries(STATE_CONFIGS).forEach(([stateCode, config]) => {
      expect(config.utmaAge, `${stateCode} utmaAge out of range`).toBeGreaterThanOrEqual(18)
      expect(config.utmaAge, `${stateCode} utmaAge out of range`).toBeLessThanOrEqual(25)
    })
  })

  it('Florida config is correct', () => {
    const fl = STATE_CONFIGS.FL
    expect(fl.name).toBe('Florida')
    expect(fl.fullName).toBe('State of Florida')
    expect(fl.witnesses).toBe(2)
    expect(fl.selfProvingAffidavit).toBe(true)
    expect(fl.affidavitStatute).toContain('732.503')
    expect(fl.antiLapseStatute).toContain('732.603')
    expect(fl.communityProperty).toBe(false)
    expect(fl.utmaAge).toBe(21)
  })

  it('California is a community property state', () => {
    expect(STATE_CONFIGS.CA.communityProperty).toBe(true)
  })

  it('Texas is a community property state', () => {
    expect(STATE_CONFIGS.TX.communityProperty).toBe(true)
  })

  it('New York is not a community property state', () => {
    expect(STATE_CONFIGS.NY.communityProperty).toBe(false)
  })

  it('Wisconsin has maritalProperty true and communityProperty false', () => {
    expect(STATE_CONFIGS.WI.maritalProperty).toBe(true)
    expect(STATE_CONFIGS.WI.communityProperty).toBe(false)
  })

  it('South Carolina requires 3 witnesses', () => {
    expect(STATE_CONFIGS.SC.witnesses).toBe(3)
  })

  it('Vermont requires 3 witnesses', () => {
    expect(STATE_CONFIGS.VT.witnesses).toBe(3)
  })

  it('most states require 2 witnesses', () => {
    const twoWitnessStates = Object.entries(STATE_CONFIGS).filter(
      ([_, config]) => config.witnesses === 2
    )
    expect(twoWitnessStates.length).toBeGreaterThan(45)
  })

  it('states with extended UTMA ages are correct', () => {
    expect(STATE_CONFIGS.AK.utmaAge).toBe(25) // Alaska
    expect(STATE_CONFIGS.NV.utmaAge).toBe(25) // Nevada
    expect(STATE_CONFIGS.OR.utmaAge).toBe(25) // Oregon
    expect(STATE_CONFIGS.KY.utmaAge).toBe(18) // Kentucky
    expect(STATE_CONFIGS.SD.utmaAge).toBe(18) // South Dakota
  })
})

describe('getStateConfig', () => {
  it('returns Florida config for FL', () => {
    const config = getStateConfig('FL')
    expect(config.name).toBe('Florida')
  })

  it('returns California config for CA', () => {
    const config = getStateConfig('CA')
    expect(config.name).toBe('California')
  })

  it('returns null for Louisiana (LA)', () => {
    const config = getStateConfig('LA')
    expect(config).toBeNull()
  })

  it('returns null for invalid state code', () => {
    const config = getStateConfig('XX')
    expect(config).toBeNull()
  })

  it('returns null for undefined', () => {
    const config = getStateConfig(undefined)
    expect(config).toBeNull()
  })

  it('returns null for null', () => {
    const config = getStateConfig(null)
    expect(config).toBeNull()
  })

  it('returns null for empty string', () => {
    const config = getStateConfig('')
    expect(config).toBeNull()
  })
})

describe('COMMUNITY_PROPERTY_STATES', () => {
  it('contains the 7 community property states (excluding LA and WI)', () => {
    // AZ, CA, ID, NV, NM, TX, WA (LA removed, WI is marital property)
    expect(COMMUNITY_PROPERTY_STATES).toContain('AZ')
    expect(COMMUNITY_PROPERTY_STATES).toContain('CA')
    expect(COMMUNITY_PROPERTY_STATES).toContain('ID')
    expect(COMMUNITY_PROPERTY_STATES).toContain('NV')
    expect(COMMUNITY_PROPERTY_STATES).toContain('NM')
    expect(COMMUNITY_PROPERTY_STATES).toContain('TX')
    expect(COMMUNITY_PROPERTY_STATES).toContain('WA')
    expect(COMMUNITY_PROPERTY_STATES.length).toBe(7)
  })

  it('does not contain Louisiana', () => {
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('LA')
  })

  it('does not contain Wisconsin (marital property state)', () => {
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('WI')
  })

  it('does not contain common law states', () => {
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('FL')
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('NY')
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('OH')
  })
})

describe('MARITAL_PROPERTY_STATES', () => {
  it('contains only Wisconsin', () => {
    expect(MARITAL_PROPERTY_STATES).toContain('WI')
    expect(MARITAL_PROPERTY_STATES.length).toBe(1)
  })
})

describe('THREE_WITNESS_STATES', () => {
  it('contains SC and VT', () => {
    expect(THREE_WITNESS_STATES).toContain('SC')
    expect(THREE_WITNESS_STATES).toContain('VT')
    expect(THREE_WITNESS_STATES.length).toBe(2)
  })

  it('does not contain two-witness states', () => {
    expect(THREE_WITNESS_STATES).not.toContain('FL')
    expect(THREE_WITNESS_STATES).not.toContain('CA')
    expect(THREE_WITNESS_STATES).not.toContain('NY')
  })
})
