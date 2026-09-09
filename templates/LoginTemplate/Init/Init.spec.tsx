import React from 'react'
import { act } from 'react'
import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { LoginProvider } from '@/common/context/login/Login.provider'
import { ColourModeProvider, CreateThemeContext } from '@/common/context/theme/themeContext.provider'
import { UserProvider, CreateUserContext } from '@/common/context/user/UserProvider'
import { ERRORCODES } from '@/constants/errorCodes'
import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import { Init } from './Init'

const mockRouterPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    push: mockRouterPush,
    refresh: jest.fn(),
    prefetch: () => null,
    replace: mockReplace,
  }),
  usePathname: jest.fn(() => '/login'),
}))

const setLoginStateMock = jest.fn()

jest.mock('@/common/context/login/Login.provider', () => {
  const originalModule = jest.requireActual('@/common/context/login/Login.provider')
  return {
    ...originalModule,
    useLogin: jest.fn(() => ({ ...originalModule.useLogin(), setLoginState: setLoginStateMock })),
  }
})

describe.skip('Login init', () => {
  const server = setupServer(
    ...[
      http.post('users/login/init', () =>
        HttpResponse.json({
          orderRef: 's12312-12342141-24112412',
          autoStartToken: null,
          qrStartSecret: null,
          qrStartToken: null,
        }),
      ),
    ],
  )
  const serverError = setupServer(
    ...[
      http.post('users/login/init', () =>
        HttpResponse.json(
          {
            statusCode: 500,
            messageKey: ERRORCODES.NOTFOUND,
          },
          { status: 500 },
        ),
      ),
    ],
  )
  const serverErrorUnder18 = setupServer(
    ...[
      http.post('users/login/init', () =>
        HttpResponse.json(
          {
            statusCode: 500,
            messageKey: ERRORCODES.USERUNDER18,
          },
          { status: 500 },
        ),
      ),
    ],
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const desktopWidth = 1500
  const context = CreateUserContext()
  const themeObject = CreateThemeContext()
  const renderComponent = (simulatedWidth = desktopWidth) => {
    const width = { width: simulatedWidth }
    const utils = render(
      <UserProvider context={context}>
        <LoginProvider>
          <ColourModeProvider context={themeObject}>
            <ResponsiveContext.Provider value={width}>
              <Init />
            </ResponsiveContext.Provider>
          </ColourModeProvider>
        </LoginProvider>
      </UserProvider>,
    )
    return { ...utils }
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders.', async () => {
    expect.assertions(1)
    const { container } = renderComponent()
    expect(container.firstChild).not.toBeNull()
  })
  it('renders header, pno, bankID on this device and terms text and terms link text placeholders', async () => {
    expect.assertions(5)
    const { getByText } = renderComponent()
    expect(getByText('pno')).not.toBeNull()
    expect(getByText('bankIdThisDevice')).not.toBeNull()
    expect(getByText('termsText')).not.toBeNull()
    expect(getByText('termsLink')).not.toBeNull()
    expect(getByText('header')).not.toBeNull()
  })
  it('renders button & button as disabled by default', async () => {
    expect.assertions(2)
    const { getByRole } = renderComponent()
    expect(
      getByRole('button', {
        name: /login/i,
      }),
    ).not.toBeNull()
    expect(
      getByRole('button', {
        name: /login/i,
      }),
    ).toBeDisabled()
  })
  it('renders button as disabled when not 12 numbers are written in the input field & renders error message', async () => {
    const { getByRole } = renderComponent()
    const button = getByRole('button', {
      name: /login/i,
    })
    expect.assertions(1)

    await act(async () => {
      fireEvent.input(getByRole('textbox'), { target: { value: '19910324556' } })
      fireEvent.click(button)
    })
    expect(
      getByRole('button', {
        name: /login/i,
      }),
    ).toBeDisabled()
  })
  it('renders button as disabled when not 12 numbers are written in the input field', async () => {
    const { getByRole } = renderComponent()
    const button = getByRole('button', {
      name: /login/i,
    })
    expect.assertions(1)

    await act(async () => {
      fireEvent.input(getByRole('textbox'), { target: { value: '1991032455612' } })
      fireEvent.click(button)
    })
    expect(
      getByRole('button', {
        name: /login/i,
      }),
    ).toBeDisabled()
  })
  it('renders button as enabled when correct pno is provided', async () => {
    const { getByRole } = renderComponent()
    expect.assertions(1)

    await act(async () => {
      fireEvent.input(getByRole('textbox'), { target: { value: '200312212186' } })
    })
    expect(
      getByRole('button', {
        name: /login/i,
      }),
    ).not.toBeDisabled()
  })
  it('it calls login endpoint when input is correctly filled and button is pressed', async () => {
    const { getByRole } = renderComponent()
    const button = getByRole('button', {
      name: /login/i,
    })
    expect.assertions(1)

    await act(async () => {
      fireEvent.input(getByRole('textbox'), { target: { value: '200312212186' } })
      fireEvent.click(button)
    })
    expect(setLoginStateMock).toHaveBeenCalledWith({ orderRef: 's12312-12342141-24112412', step: 'collect' })
  })
  it('redirects to failed not found page when login endpoint responds with error', async () => {
    server.close()
    serverError.listen()
    const { getByRole } = renderComponent()
    const button = getByRole('button', {
      name: /login/i,
    })
    expect.assertions(1)

    await act(async () => {
      fireEvent.input(getByRole('textbox'), { target: { value: '200312212186' } })
      fireEvent.click(button)
    })
    expect(setLoginStateMock).toHaveBeenCalledWith({ statusCode: 'user_not_found', step: 'failed' })
    serverError.resetHandlers()
    serverError.close()
  })
  it('redirects to failed page when login endpoint responds with error', async () => {
    server.close()
    serverErrorUnder18.listen()
    const { getByRole } = renderComponent()
    const button = getByRole('button', {
      name: /login/i,
    })
    expect.assertions(1)

    await act(async () => {
      fireEvent.input(getByRole('textbox'), { target: { value: '200312212186' } })
      fireEvent.click(button)
    })
    expect(setLoginStateMock).toHaveBeenCalledWith({ statusCode: 'failed', step: 'failed' })
    serverErrorUnder18.resetHandlers()
    serverErrorUnder18.close()
  })
  it('should render login on same device button if on mobile screen width and not input field', () => {
    const { getByRole, queryByRole, getByText } = renderComponent(500)
    expect.assertions(3)
    expect(queryByRole('textbox')).toBeNull()
    expect(
      getByRole('button', {
        name: /login/i,
      }),
    ).toBeInTheDocument()
    expect(getByText('bankIdOtherDevice')).toBeInTheDocument()
  })
  it('should render the input field if user clicks link button for entering pno on mobile width', () => {
    const { getByRole, queryByRole, getAllByText } = renderComponent(500)
    const linkButton = getAllByText('bankIdOtherDevice')[0]
    expect(queryByRole('textbox')).toBeNull()
    fireEvent.click(linkButton)
    expect(getByRole('textbox')).toBeInTheDocument()
  })
})
