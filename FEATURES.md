# Testate Feature Plan

## Feature 1: Clickable Progress Bar

**Goal:** Allow users to navigate between steps by clicking on the progress stepper.

**Implementation:**
- Modify `src/components/ui/ProgressStepper.jsx` to accept click handlers
- Add `onStepClick` prop that receives step index
- Visual states: completed (clickable), current (highlighted), future (dimmed but clickable with warning)
- When clicking a future step, validate current step first and show warning if incomplete
- Add hover states and cursor pointer for clickable steps

**Files to modify:**
- `src/components/ui/ProgressStepper.jsx` - Add click handling and hover states
- `src/components/WillGenerator.jsx` - Handle step navigation logic

**Estimated complexity:** Low

---

## Feature 2: Multi-State Support

**Goal:** Extend support beyond Florida to cover most US states.

**Research - Key State Variations:**

| Aspect | Variation |
|--------|-----------|
| Witnesses | Most: 2, some states vary |
| Self-proving affidavit | Different statute references |
| Notarization | Required in some states |
| Holographic wills | Recognized in ~26 states |
| Community property | 9 states (AZ, CA, ID, LA, NV, NM, TX, WA, WI) |
| Homestead protection | Varies significantly |

**Implementation:**
1. Create `src/constants/stateConfigs.js` with per-state configuration:
   ```javascript
   export const STATE_CONFIGS = {
     FL: {
       name: 'Florida',
       witnesses: 2,
       selfProvingAffidavit: true,
       affidavitStatute: 'Florida Statutes Section 732.503',
       digitalAssetsAct: 'Florida Fiduciary Access to Digital Assets Act',
       antiLapseStatute: 'F.S. 732.603',
       communityProperty: false,
       homesteadProvisions: true,
       // ... more config
     },
     TX: {
       name: 'Texas',
       witnesses: 2,
       selfProvingAffidavit: true,
       affidavitStatute: 'Texas Estates Code Section 251.104',
       // ...
     },
     // ... other states
   }
   ```

2. Add state selector to Step 1 (TestatorInfo)
3. Update `willTextGenerator.js` to use state config
4. Update `WillDocument.jsx` (PDF) to use state config
5. Update legal disclaimer to reference selected state

**Files to create:**
- `src/constants/stateConfigs.js` - State-specific configurations

**Files to modify:**
- `src/components/steps/TestatorInfo.jsx` - Add state selector
- `src/utils/willTextGenerator.js` - Parameterize state references
- `src/components/pdf/WillDocument.jsx` - Parameterize state references
- `src/hooks/useWillState.js` - Add state to form data

**Estimated complexity:** Medium-High (research + implementation)

---

## Feature 3: Custom Provisions Section

**Goal:** Allow users to add custom clauses for edge cases not covered by standard sections.

**Implementation:**
1. Add new form section for custom provisions
2. Support multiple custom clauses with titles
3. Include in PDF output as a dedicated article
4. Add to text generator

**Data structure:**
```javascript
customProvisions: {
  include: false,
  items: [
    {
      title: 'Special Instructions for Business Assets',
      content: 'I direct that my 50% ownership in XYZ LLC...'
    }
  ]
}
```

**Files to create:**
- `src/components/steps/CustomProvisions.jsx` - New step component

**Files to modify:**
- `src/components/steps/index.js` - Export new component
- `src/components/WillGenerator.jsx` - Add step (could be sub-section of Additional Provisions)
- `src/hooks/useWillState.js` - Add customProvisions to initial state
- `src/utils/willTextGenerator.js` - Generate custom provisions text
- `src/components/pdf/WillDocument.jsx` - Render custom provisions
- `src/utils/validators.js` - Add validation (title required if content present)

**Estimated complexity:** Low-Medium

---

## Feature 4: Donation Button

**Goal:** Add unobtrusive donation option (PayPal/Buy Me a Coffee).

**Implementation Options:**

### Option A: Footer Link
- Add donation link in existing footer
- Simple and unobtrusive

### Option B: Floating Button
- Small floating button in corner
- More visible but could be distracting

### Option C: Thank You Modal
- Show after PDF download with optional donation prompt
- High visibility at moment of value delivery

**Recommended:** Combine Option A (always visible) + Option C (post-download prompt)

**Files to modify:**
- `src/App.jsx` - Add footer donation link
- `src/components/steps/ReviewGenerate.jsx` - Add thank you message after download

**Configuration needed:**
- PayPal.me link or Buy Me a Coffee username
- Could use environment variable or config file

**Estimated complexity:** Low

---

## Implementation Priority

| Priority | Feature | Complexity | Value |
|----------|---------|------------|-------|
| 1 | Clickable Progress Bar | Low | High (UX) |
| 2 | Donation Button | Low | Medium (Revenue) |
| 3 | Custom Provisions | Low-Medium | High (Flexibility) |
| 4 | Multi-State Support | Medium-High | Very High (Reach) |

---

## Subagent Task Breakdown

### Agent 1: Progress Bar Enhancement
- Make ProgressStepper clickable
- Add navigation logic to WillGenerator
- Add tests

### Agent 2: Donation Integration
- Add footer donation link
- Add post-download thank you prompt
- Needs: PayPal/donation link from user

### Agent 3: Custom Provisions
- Create CustomProvisions component
- Integrate into form state
- Add to PDF and text generators
- Add tests

### Agent 4: Multi-State Research & Config
- Research state-by-state requirements
- Create stateConfigs.js with top 10-15 states
- Document variations

### Agent 5: Multi-State Implementation
- Add state selector UI
- Update generators to use state config
- Update PDF template
- Add tests
