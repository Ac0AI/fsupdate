import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Chip from './Chip'

describe('Chip', () => {
  it('renders its label and reports pressed state', () => {
    expect.assertions(2)
    const { getByRole } = render(
      <Chip active onClick={jest.fn()}>
        Lägenhet
      </Chip>,
    )
    const chip = getByRole('button', { name: 'Lägenhet' })
    expect(chip).toBeInTheDocument()
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })
  it('calls onClick when pressed', async () => {
    expect.assertions(1)
    const onClick = jest.fn()
    const { getByRole } = render(
      <Chip active={false} onClick={onClick}>
        Villa
      </Chip>,
    )
    await userEvent.click(getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
  it('renders the hint on a second row', () => {
    expect.assertions(1)
    const { getByText } = render(
      <Chip active={false} onClick={jest.fn()} hint="start 08–09">
        Morgon
      </Chip>,
    )
    expect(getByText('start 08–09')).toBeInTheDocument()
  })
})
