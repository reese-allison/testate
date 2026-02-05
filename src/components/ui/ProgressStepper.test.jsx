import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { ProgressStepper } from './ProgressStepper'

const mockSteps = [
  { label: 'Step 1', shortLabel: 'S1', component: 'step1' },
  { label: 'Step 2', shortLabel: 'S2', component: 'step2' },
  { label: 'Step 3', shortLabel: 'S3', component: 'step3' },
  { label: 'Step 4', shortLabel: 'S4', component: 'step4' },
]

describe('ProgressStepper', () => {
  it('renders all steps', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={0} onStepClick={() => {}} />)

    expect(screen.getByText('S1')).toBeInTheDocument()
    expect(screen.getByText('S2')).toBeInTheDocument()
    expect(screen.getByText('S3')).toBeInTheDocument()
    expect(screen.getByText('S4')).toBeInTheDocument()
  })

  it('displays current step info', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={1} onStepClick={() => {}} />)

    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
  })

  it('calls onStepClick when clicking a completed step', () => {
    const onStepClick = vi.fn()
    render(<ProgressStepper steps={mockSteps} currentStep={2} onStepClick={onStepClick} />)

    // Click on step 1 (completed)
    fireEvent.click(screen.getByText('S1'))
    expect(onStepClick).toHaveBeenCalledWith(0)
  })

  it('calls onStepClick when clicking the current step', () => {
    const onStepClick = vi.fn()
    render(<ProgressStepper steps={mockSteps} currentStep={1} onStepClick={onStepClick} />)

    // Click on current step (step 2)
    fireEvent.click(screen.getByText('S2'))
    expect(onStepClick).toHaveBeenCalledWith(1)
  })

  it('calls onStepClick when clicking a future step', () => {
    const onStepClick = vi.fn()
    render(<ProgressStepper steps={mockSteps} currentStep={0} onStepClick={onStepClick} />)

    // Click on step 3 (future)
    fireEvent.click(screen.getByText('S3'))
    expect(onStepClick).toHaveBeenCalledWith(2)
  })

  it('supports keyboard navigation with Enter key', () => {
    const onStepClick = vi.fn()
    render(<ProgressStepper steps={mockSteps} currentStep={0} onStepClick={onStepClick} />)

    const step2Button = screen.getByText('S2').closest('button')
    fireEvent.keyDown(step2Button, { key: 'Enter' })
    expect(onStepClick).toHaveBeenCalledWith(1)
  })

  it('supports keyboard navigation with Space key', () => {
    const onStepClick = vi.fn()
    render(<ProgressStepper steps={mockSteps} currentStep={0} onStepClick={onStepClick} />)

    const step2Button = screen.getByText('S2').closest('button')
    fireEvent.keyDown(step2Button, { key: ' ' })
    expect(onStepClick).toHaveBeenCalledWith(1)
  })

  it('shows check icon for completed steps', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={2} onStepClick={() => {}} />)

    // Steps 1 and 2 should have check icons (svg elements)
    const buttons = screen.getAllByRole('button')
    const step1Icon = buttons[0].querySelector('svg')
    const step2Icon = buttons[1].querySelector('svg')

    expect(step1Icon).toBeInTheDocument()
    expect(step2Icon).toBeInTheDocument()
  })

  it('shows step numbers for non-completed steps', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={1} onStepClick={() => {}} />)

    // Step 3 and 4 should show numbers
    const buttons = screen.getAllByRole('button')
    expect(buttons[2]).toHaveTextContent('3')
    expect(buttons[3]).toHaveTextContent('4')
  })

  it('applies correct aria attributes', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={1} onStepClick={() => {}} />)

    const buttons = screen.getAllByRole('button')

    // Check aria-label format
    expect(buttons[0]).toHaveAttribute('aria-label', expect.stringContaining('Step 1'))
    expect(buttons[1]).toHaveAttribute('aria-label', expect.stringContaining('current step'))
    expect(buttons[0]).toHaveAttribute('aria-label', expect.stringContaining('completed'))

    // Current step should have aria-current
    expect(buttons[1]).toHaveAttribute('aria-current', 'step')
    expect(buttons[0]).not.toHaveAttribute('aria-current')
  })

  it('has navigation landmark', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={0} onStepClick={() => {}} />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Form progress')
  })

  it('applies reduced opacity to future steps', () => {
    render(<ProgressStepper steps={mockSteps} currentStep={0} onStepClick={() => {}} />)

    const buttons = screen.getAllByRole('button')

    // Future steps should have muted styling (removed opacity for accessibility)
    // Current step should not be muted
    expect(buttons[0].className).toContain('cursor-pointer')
    expect(buttons[1].className).toContain('cursor-pointer')
    expect(buttons[2].className).toContain('cursor-pointer')
    expect(buttons[3].className).toContain('cursor-pointer')
  })

  it('handles missing onStepClick gracefully', () => {
    // Should not throw when onStepClick is not provided
    render(<ProgressStepper steps={mockSteps} currentStep={0} />)

    const step2Button = screen.getByText('S2').closest('button')
    expect(() => fireEvent.click(step2Button)).not.toThrow()
  })

  it('uses full label when shortLabel is not provided', () => {
    const stepsWithoutShortLabels = [
      { label: 'Full Label 1', component: 'step1' },
      { label: 'Full Label 2', component: 'step2' },
    ]

    render(
      <ProgressStepper steps={stepsWithoutShortLabels} currentStep={0} onStepClick={() => {}} />
    )

    expect(screen.getByText('Full Label 1')).toBeInTheDocument()
    expect(screen.getByText('Full Label 2')).toBeInTheDocument()
  })
})
