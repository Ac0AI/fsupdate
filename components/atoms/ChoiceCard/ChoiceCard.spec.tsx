import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChoiceCard from './ChoiceCard'

describe('ChoiceCard', () => {
  it('renders title and hint as a radio', () => {
    expect.assertions(3)
    const { getByRole, getByText } = render(<ChoiceCard active title="Samma dag som flytten" hint="25 september" onClick={jest.fn()} />)
    const radio = getByRole('radio')
    expect(radio).toHaveAttribute('aria-checked', 'true')
    expect(getByText('Samma dag som flytten')).toBeInTheDocument()
    expect(getByText('25 september')).toBeInTheDocument()
  })
  it('calls onClick when pressed', async () => {
    expect.assertions(1)
    const onClick = jest.fn()
    const { getByRole } = render(<ChoiceCard active={false} title="Ett annat datum" onClick={onClick} />)
    await userEvent.click(getByRole('radio'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
