import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToastContext } from './toast.provider'

const Consumer = ({ message }: { message: string }) => {
  const { showToast } = useToastContext()
  return (
    <button type="button" onClick={() => showToast(message)}>
      Visa
    </button>
  )
}

const renderWithProvider = (message: string) =>
  render(
    <ToastProvider>
      <Consumer message={message} />
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

  it('renderar barnen även utan toast', () => {
    renderWithProvider('Elavtalet är tecknat')

    expect(screen.getByRole('button', { name: 'Visa' })).toBeInTheDocument()
  })
})
