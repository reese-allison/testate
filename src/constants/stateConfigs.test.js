import { describe, it, expect } from 'vitest'
import {
  STATE_CONFIGS,
  getStateConfig,
  COMMUNITY_PROPERTY_STATES,
  THREE_WITNESS_STATES,
} from './stateConfigs'

describe('STATE_CONFIGS', () => {
  it('contains all 50 states plus DC', () => {
    const stateCount = Object.keys(STATE_CONFIGS).length
    expect(stateCount).toBe(51) // 50 states + DC
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
    ]

    Object.entries(STATE_CONFIGS).forEach(([stateCode, config]) => {
      requiredProps.forEach(prop => {
        expect(config[prop], `${stateCode} missing ${prop}`).toBeDefined()
      })
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

  it('returns Florida config for invalid state code (backward compatibility)', () => {
    const config = getStateConfig('XX')
    expect(config.name).toBe('Florida')
  })

  it('returns Florida config for undefined (backward compatibility)', () => {
    const config = getStateConfig(undefined)
    expect(config.name).toBe('Florida')
  })

  it('returns Florida config for null (backward compatibility)', () => {
    const config = getStateConfig(null)
    expect(config.name).toBe('Florida')
  })
})

describe('COMMUNITY_PROPERTY_STATES', () => {
  it('contains the 9 community property states', () => {
    // AZ, CA, ID, LA, NV, NM, TX, WA, WI
    expect(COMMUNITY_PROPERTY_STATES).toContain('AZ')
    expect(COMMUNITY_PROPERTY_STATES).toContain('CA')
    expect(COMMUNITY_PROPERTY_STATES).toContain('ID')
    expect(COMMUNITY_PROPERTY_STATES).toContain('LA')
    expect(COMMUNITY_PROPERTY_STATES).toContain('NV')
    expect(COMMUNITY_PROPERTY_STATES).toContain('NM')
    expect(COMMUNITY_PROPERTY_STATES).toContain('TX')
    expect(COMMUNITY_PROPERTY_STATES).toContain('WA')
    expect(COMMUNITY_PROPERTY_STATES).toContain('WI')
    expect(COMMUNITY_PROPERTY_STATES.length).toBe(9)
  })

  it('does not contain common law states', () => {
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('FL')
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('NY')
    expect(COMMUNITY_PROPERTY_STATES).not.toContain('OH')
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
