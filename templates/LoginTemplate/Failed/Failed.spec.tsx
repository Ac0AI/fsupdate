import { act } from 'react'
import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { LoginProvider } from '@/common/context/login/Login.provider'
import { CreateUserContext, UserProvider } from '@/common/context/user/UserProvider'
import { ERRORCODES } from '@/constants/errorCodes'
import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import { Failed } from './Failed'

const mockRouterPush = jest.fn()
const mockReplace = jest.fn()
jest.useFakeTimers()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    push: mockRouterPush,
    refresh: jest.fn(),
    prefetch: () => null,
    replace: mockReplace,
  }),
}))

describe.skip('Failed login', () => {
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
  // eslint-disable-next-line max-params
  const renderComponent = (simulatedWidth = desktopWidth, loginStatus?: string, orderRef?: string, refUrl?: string) => {
    const width = { width: simulatedWidth }
    const utils = render(
      <UserProvider context={context}>
        <LoginProvider loginStatusProp={loginStatus} orderRefProp={orderRef} refUrlProp={refUrl}>
          <ResponsiveContext.Provider value={width}>
            <Failed />
          </ResponsiveContext.Provider>
        </LoginProvider>
      </UserProvider>,
    )
    return { ...utils }
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders.', () => {
    expect.assertions(1)
    const { container } = renderComponent(1500, ERRORCODES.FAILED)
    expect(container.firstChild).not.toBeNull()
  })
  it('renders texts for correct failed error message', () => {
    expect.assertions(4)
    const { getByText, getAllByText } = renderComponent(1500, ERRORCODES.FAILED)
    expect(getAllByText('tryAgain')).not.toBeNull()
    expect(getByText('bankIdError')).not.toBeNull()
    expect(getByText('contactUs')).not.toBeNull()
    expect(getByText('back')).not.toBeNull()
  })
  it('renders texts for correct failed error message', () => {
    expect.assertions(3)
    const { getByText, getAllByText } = renderComponent(1500, ERRORCODES.NOTFOUND)
    expect(getAllByText('noAccount')).not.toBeNull()
    expect(getByText('registerAccount')).not.toBeNull()
    expect(getByText('returnToStartpage')).not.toBeNull()
  })
  it('should redrirect to startpage when button is clicked on notfound error page', () => {
    expect.assertions(1)
    const { getByRole } = renderComponent(1500, ERRORCODES.NOTFOUND)
    const button = getByRole('button', {
      name: /returnToStartpage/i,
    })
    fireEvent.click(button)
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
  it('should redirect user to collect page when user clicks try again button', async () => {
    expect.assertions(1)
    const { getByRole } = renderComponent(1500, ERRORCODES.FAILED)
    const button = getByRole('button', {
      name: /tryAgain/i,
    })
    await act(async () => {
      fireEvent.click(button)
    })
    expect(mockRouterPush).toHaveBeenCalledWith(`/login?collect=true`, '/login/collect', { shallow: true })
  })
  it('should redirect to same error page again if init api call fails again', async () => {
    server.close()
    serverError.listen()
    const { getByRole } = renderComponent(1500, ERRORCODES.FAILED)
    const button = getByRole('button', {
      name: /tryAgain/i,
    })
    await act(async () => {
      fireEvent.click(button)
    })
    expect(mockRouterPush).toHaveBeenCalledWith(`/login?failed=true`, '/login/failed', { shallow: true })
    serverError.close()
  })
})
