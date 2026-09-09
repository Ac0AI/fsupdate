import { act } from 'react'
import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { useRouter } from 'next/navigation'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SingelSignOnTemplate from './SingelSignOnTemplate'

const mockRouterPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

describe.skip('SingelSignOnTemplate', () => {
  const server = setupServer(
    ...[
      http.post('auth/users/login/sso/accept', () => new HttpResponse(null, { status: 200 })),
      http.post('auth/users/login/sso/validate', () => new HttpResponse(null, { status: 200 })),

      http.post('auth/users/login/sso', () =>
        HttpResponse.json({
          accessToken: 'test_1231123',
        }),
      ),
    ],
  )
  const serverError = setupServer(
    ...[
      http.post('auth/users/login/sso/accept', () => new HttpResponse(null, { status: 200 })),
      http.post('auth/users/login/sso/validate', () =>
        HttpResponse.json(
          {
            statusCode: 401,
            messageKey: 'failed',
          },
          { status: 401 },
        ),
      ),

      http.post('auth/users/login/sso', () =>
        HttpResponse.json(
          {
            statusCode: 401,
            messageKey: 'failed',
          },
          { status: 401 },
        ),
      ),
    ],
  )

  const serverAllvalid = setupServer(
    ...[
      http.post('auth/users/login/sso/validate', () => HttpResponse.json(true)),
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
  const renderComponent = (simulatedWidth = desktopWidth) => {
    const width = { width: simulatedWidth }
    const utils = render(
      <ResponsiveContext.Provider value={width}>
        <SingelSignOnTemplate />
      </ResponsiveContext.Provider>,
    )
    return { ...utils }
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders.', async () => {
    expect.assertions(1)
    const { container } = renderComponent()
    await act(() => {
      expect(container.firstChild).not.toBeNull()
    })
  })
  it('should render spinner and prepair movepage text as default', async () => {
    expect.assertions(2)
    const { getByTestId, getByText } = renderComponent()
    await act(() => {
      expect(getByTestId('spinner')).not.toBeNull()
      expect(getByText('prepareMovepage')).not.toBeNull()
    })
  })
  it('should get the token from query and validate it and render modal if token is valid and it is a new user', async () => {
    const { getByText } = renderComponent()
    await waitFor(() => expect(getByText('welcomeTo')).toBeInTheDocument())
  })
  it('should redirect user to startpage (startpage is on url / ) if modal for accepting terms is closed without accepting terms', async () => {
    const { getByText, getByRole } = renderComponent()
    const router = useRouter()
    await waitFor(() => {
      expect(getByText('welcomeTo')).toBeInTheDocument()
      const button = getByRole('button', {
        name: /close/i,
      })
      fireEvent.click(button)
      expect(router.push).toHaveBeenCalledWith('/')
    })
  })
  it('if token isnt valid, render error section with texts and button', async () => {
    server.close()
    serverError.listen()
    await act(async () => {
      renderComponent()
    })

    await waitFor(() => {
      expect(screen.getByText('loginFailed')).toBeInTheDocument()
      expect(screen.getByText('loginFailedText')).toBeInTheDocument()
      const button = screen.getByRole('button', {
        name: /login/i,
      })
      expect(button).toBeInTheDocument()
    })
    serverError.resetHandlers()
    serverError.close()
  })
  it('if token is valid and user already exist, redirect user directly to movepage', async () => {
    server.resetHandlers()
    server.close()
    serverError.resetHandlers()
    serverError.close()
    serverAllvalid.listen()
    const router = useRouter()
    act(() => {
      renderComponent()
    })
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/app/movepage')
    })
    serverAllvalid.resetHandlers()
    serverAllvalid.close()
  })
})
