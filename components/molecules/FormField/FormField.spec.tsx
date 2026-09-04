import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import FormField from './FormField'

describe('FormField', () => {
  it('renders label, child and error, and marks itself invalid', () => {
    expect.assertions(3)
    const { getByText, getByRole, container } = render(
      <FormField label="Våning" error="Välj våning.">
        <input aria-label="Våning" />
      </FormField>,
    )
    expect(getByText('Våning')).toBeInTheDocument()
    expect(getByRole('alert')).toHaveTextContent('Välj våning.')
    expect(container.firstChild).toHaveAttribute('data-invalid', 'true')
  })
})
