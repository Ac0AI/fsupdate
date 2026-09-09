import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { LoginProvider } from '@/common/context/login/Login.provider'
import { CreateUserContext, UserProvider } from '@/common/context/user/UserProvider'
import { ERRORCODES } from '@/constants/errorCodes'
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Collect } from './Collect'

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

describe.skip('Collect login', () => {
  const server = setupServer(
    ...[
      http.post('users/login/collect', () => HttpResponse.json({ status: 'complete', token: 6912312312312, userCreated: false })),
      http.get('/users/me', () => new HttpResponse(null, { status: 200 })),
      http.get('/moves/current', () => new HttpResponse(null, { status: 200 })),
      http.get('/users/contact', () => new HttpResponse(null, { status: 200 })),
    ],
  )
  const serverError = setupServer(
    ...[
      http.post('users/login/collect', () =>
        HttpResponse.json(
          {
            statusCode: 500,
            messageKey: ERRORCODES.USERUNDER18,
          },
          { status: 500 },
        ),
      ),
      http.get('/users/me', () => new HttpResponse(null, { status: 200 })),
      http.get('/moves/current', () => new HttpResponse(null, { status: 200 })),
      http.get('/users/contact', () => new HttpResponse(null, { status: 200 })),
    ],
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const desktopWidth = 1500
  const context = CreateUserContext()
  const renderComponent = (simulatedWidth = desktopWidth, orderRef?: string, refUrl?: string) => {
    const width = { width: simulatedWidth }
    const utils = render(
      <UserProvider context={context}>
        <LoginProvider orderRefProp={orderRef} refUrlProp={refUrl}>
          <ResponsiveContext.Provider value={width}>
            <Collect />
          </ResponsiveContext.Provider>
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
  it('renders start bankid, cancel & identifiy with bankid text placeholders', async () => {
    expect.assertions(3)
    const { getByText } = renderComponent()
    expect(getByText('startBankid')).not.toBeNull()
    expect(getByText('cancel')).not.toBeNull()
    expect(getByText('identifyWithBankid')).not.toBeNull()
  })
  it('renders a spinner when waiting for api call to complete', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId('spinner')).toBeInTheDocument()
  })
  it('should call collect login endpoint when orderRef is present which if success will redirect user to movepage', async () => {
    renderComponent(1500, 'cabaf55f-e6bf-47ff-996b-752d1944cc50')
    jest.runAllTimers()
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/app/movepage'))
  })
  it('should cancel collect api call if cancel button is pressed', () => {
    const { getByText } = renderComponent(1500, 'cabaf55f-e6bf-47ff-996b-752d1944cc50')
    const linkButton = getByText('cancel')
    fireEvent.click(linkButton)
    expect(mockRouterPush).toHaveBeenCalledWith('/login', undefined, { shallow: true })
  })
  it('should redirect to refUrl when collect api call is complete', async () => {
    renderComponent(1500, 'cabaf55f-e6bf-47ff-996b-752d1944cc50', '/fixarenovera')
    jest.runAllTimers()
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/fixarenovera'))
  })
  it('should redirect to error page if collect api call fails', async () => {
    server.close()
    serverError.listen()
    renderComponent(1500, 'cabaf55f-e6bf-47ff-996b-752d1944cc50')
    jest.runAllTimers()
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/login?failed=true', '/login/failed', { shallow: true }))
    serverError.close()
  })
})
