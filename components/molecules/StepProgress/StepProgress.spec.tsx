import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import StepProgress from './StepProgress'

describe('StepProgress', () => {
  it('names the current step and marks it aria-current', () => {
    expect.assertions(2)
    const { getByText, getAllByRole } = render(<StepProgress step={1} titles={['Bostäderna', 'Tjänster', 'Offert']} />)
    expect(getByText(/Steg 2 av 3/)).toBeInTheDocument()
    expect(getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step')
  })
})
