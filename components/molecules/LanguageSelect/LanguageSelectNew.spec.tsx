import { act } from 'react'
import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSelect from './LanguageSelectNew'

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
}))

const server = setupServer(http.patch('/web/user/change-language', () => new HttpResponse(null, { status: 200 })))

describe.skip('LanguageSelectNew', () => {
  const desktopWidth = 1500
  beforeAll(() => server.listen())
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => server.close())

  const renderComponent = (simulatedWidth = desktopWidth) => {
    const width = { width: simulatedWidth }
    const utils = render(
      <ResponsiveContext.Provider value={width}>
        <LanguageSelect />
      </ResponsiveContext.Provider>,
    )
    return { ...utils }
  }
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders swedish and english texts', async () => {
    expect.assertions(2)
    await act(() => {
      renderComponent()
    })
    await waitFor(() => {
      expect(screen.getByText('Svenska')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
    })
  })
  it('renders swedish as active language by default', async () => {
    expect.assertions(2)
    await act(() => {
      renderComponent()
    })
    await waitFor(() => {
      expect(screen.getByTestId('active-swedish')).toBeInTheDocument()
      expect(screen.queryByTestId('active-english')).toBeNull()
    })
  })
  it('renders english as active language when clicked', async () => {
    await act(() => {
      renderComponent()
    })
    await waitFor(() => {
      const englishButton = screen.getByTestId('english')
      userEvent.click(englishButton)
    })
    await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith({ pathname: 'en/app/movepage', query: {} }, 'some-other-path', { locale: 'en' }))
  })
})
