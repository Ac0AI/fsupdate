import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, ToastTone, useToastContext } from './toast.provider'

const Consumer = ({ message, tone }: { message: string; tone?: ToastTone }) => {
  const { showToast } = useToastContext()
  return (
    <button type="button" onClick={() => showToast(message, tone)}>
      Visa
    </button>
  )
}

const renderWithProvider = (message: string, tone?: ToastTone) =>
  render(
    <ToastProvider>
      <Consumer message={message} tone={tone} />
    </ToastProvider>,
  )

describe('ToastProvider', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('visar ingen toast innan något anropar showToast', () => {
    renderWithProvider('Elavtalet är tecknat')

    expect(screen.queryByText('Elavtalet är tecknat')).not.toBeInTheDocument()
  })

  it('visar meddelandet när showToast anropas', async () => {
    const user = userEvent.setup()
    renderWithProvider('Elavtalet är tecknat')

    await user.click(screen.getByRole('button', { name: 'Visa' }))

    await waitFor(() => {
      expect(screen.getByText('Elavtalet är tecknat')).toBeInTheDocument()
    })
  })

  it('bekräftar i grått som standard', async () => {
    const user = userEvent.setup()
    renderWithProvider('Elavtalet är tecknat')

    await user.click(screen.getByRole('button', { name: 'Visa' }))

    await waitFor(() => {
      expect(screen.getByText('Elavtalet är tecknat').closest('li')?.className).toContain('bg-[#869AA9]')
    })
  })

  it('använder feltonen när showToast får error', async () => {
    const user = userEvent.setup()
    renderWithProvider('Något gick fel, försök igen.', 'error')

    await user.click(screen.getByRole('button', { name: 'Visa' }))

    await waitFor(() => {
      expect(screen.getByText('Något gick fel, försök igen.').closest('li')?.className).toContain('bg-[var(--color-error-red)]')
    })
  })

  it('renderar barnen även utan toast', () => {
    renderWithProvider('Elavtalet är tecknat')

    expect(screen.getByRole('button', { name: 'Visa' })).toBeInTheDocument()
  })
})
