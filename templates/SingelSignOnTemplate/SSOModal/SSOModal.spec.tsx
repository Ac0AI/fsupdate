import { act } from 'react'
import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/navigation'
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import SSOModal, { SSOModalProps } from './SSOModal'

describe.skip('SSOModal', () => {
  const server = setupServer(
    ...[
      http.post('auth/users/login/sso/accept', () => new HttpResponse(null, { status: 200 })),
      http.post('auth/users/login/sso', () =>
        HttpResponse.json({
          accessToken: 'test_1231123',
        }),
      ),
    ],
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const desktopWidth = 1500
  const propsWithData = {
    token: 'token_123',
    setOpenModal: jest.fn(),
    openModal: true,
  }
  const renderComponent = (simulatedWidth = desktopWidth, props: SSOModalProps = propsWithData) => {
    const width = { width: simulatedWidth }
    const utils = render(
      <ResponsiveContext.Provider value={width}>
        <SSOModal {...props} />
      </ResponsiveContext.Provider>,
    )
    return { ...utils }
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders.', () => {
    expect.assertions(1)
    const { container } = renderComponent()
    expect(container.firstChild).not.toBeNull()
  })
  it('renders modal image with Flyttsmart and Fastighetsbyran logo', () => {
    expect.assertions(1)
    const { getByAltText } = renderComponent()
    expect(getByAltText('Flyttsmart och Fastighetsbyrån logotyp')).not.toBeNull()
  })
  it('renders correct translations in modal', () => {
    expect.assertions(5)
    const { getByText } = renderComponent()
    expect(getByText('welcomeTo')).not.toBeNull()
    expect(getByText('flyttsmart')).not.toBeNull()
    expect(getByText('getItDone')).not.toBeNull()
    expect(getByText('terms')).not.toBeNull()
    expect(getByText('termsLinkText')).not.toBeNull()
  })
  it('renders modal image with Flyttsmart and Fastighetsbyran logo', () => {
    expect.assertions(1)
    const { getByAltText } = renderComponent()
    expect(getByAltText('Flyttsmart och Fastighetsbyrån logotyp')).not.toBeNull()
  })
  it('calls login user with token using sso when button is clicked and direct user to movepage afterwards', async () => {
    expect.assertions(1)
    const router = useRouter()
    const { getByRole } = renderComponent()
    const button = getByRole('button', {
      name: /getItDone/i,
    })
    await act(async () => {
      await waitFor(() => fireEvent.click(button))
    })
    expect(router.push).toHaveBeenCalledWith('/app/movepage')
  })
  it('if token is not provided, user is not logged in and not direct to movepage ', async () => {
    expect.assertions(1)
    const router = useRouter()
    const { getByRole } = renderComponent(desktopWidth, { token: '', setOpenModal: jest.fn(), openModal: true })
    const button = getByRole('button', {
      name: /getItDone/i,
    })
    await act(async () => {
      await waitFor(() => fireEvent.click(button))
    })
    expect(router.push).not.toHaveBeenCalledWith('/app/movepage')
  })
})
