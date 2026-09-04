import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Switch from './Switch'

describe('Switch', () => {
  it('moves the thumb when on', () => {
    expect.assertions(2)
    const { getByTestId, rerender } = render(<Switch on={false} />)
    expect(getByTestId('switch').firstChild).not.toHaveClass('translate-x-[18px]')
    rerender(<Switch on />)
    expect(getByTestId('switch').firstChild).toHaveClass('translate-x-[18px]')
  })
})
