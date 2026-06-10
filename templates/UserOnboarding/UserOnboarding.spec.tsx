import { Context as ResponsiveContext } from 'react-responsive'
import { http, HttpResponse, delay } from 'msw'
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LeadProvider } from '@/common/context/lead/LeadProvider'
import NoBankIdUserTemplate from './UserOnboarding'

const mockRouterPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: jest.fn(),
    forward: jest.fn(),
    push: mockRouterPush,
    refresh: jest.fn(),
    prefetch: () => null,
    replace: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

const leadResponse = {
  leadDetails: {
    brokerOfficeId: 'office-1',
    brokerOfficeName: 'Testmäklarna',
    brokerOfficePersonName: 'Test Person',
    brokerAgencyLogo: '',
    pno: '',
    sourceSystem: 'test',
    type: null,
    id: 'lead-1',
    movingDate: '2026-08-01',
    inviteCode: '1234',
    address: null,
  },
  partnerDetails: {
    partnerId: 'partner-1',
    partnerName: 'Test Partner',
    agentName: 'Test Agent',
  },
}

describe('NoBankIdUserTemplate (onboarding)', () => {
  const renderComponent = (simulatedWidth = 1500) => {
    return render(
      <ResponsiveContext.Provider value={{ width: simulatedWidth }}>
        <LeadProvider context={null as never}>
          <NoBankIdUserTemplate code={'1234'} />
        </LeadProvider>
      </ResponsiveContext.Provider>,
    )
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('while the invitation is being fetched', () => {
    const server = setupServer(
      http.get('*/users/code/*', async () => {
        await delay('infinite')
        return HttpResponse.json(leadResponse)
      }),
    )
    beforeAll(() => server.listen())
    afterAll(() => server.close())

    it('shows the coordinators and an honest fetching message, tied to the real request', async () => {
      renderComponent()
      expect(await screen.findByText('coordinatorsIntro')).toBeInTheDocument()
      expect(screen.getByText('fetchingYourDetails')).toBeInTheDocument()
    })
  })

  describe('when the invitation is found', () => {
    const server = setupServer(
      http.get('*/users/code/*', () => {
        return HttpResponse.json(leadResponse)
      }),
    )
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('shows the onboarding form without artificial delay', async () => {
      renderComponent()
      // The modal renders twice (desktop + mobile variant, toggled via CSS)
      expect((await screen.findAllByText('whereToMove')).length).toBeGreaterThan(0)
      expect(screen.getAllByText('introTitle').length).toBeGreaterThan(0)
    })
  })

  describe('when fetching the invitation fails', () => {
    const server = setupServer(
      http.get('*/users/code/*', () => {
        return HttpResponse.json({ statusCode: 500, messageKey: 'failed' }, { status: 500 })
      }),
    )
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())

    it('shows an honest error state instead of pretending the fetch succeeded', async () => {
      renderComponent()
      expect(await screen.findByText('invitationNotFoundTitle')).toBeInTheDocument()
      expect(screen.getByText('invitationNotFoundText')).toBeInTheDocument()
      expect(screen.getByText('tryAgain')).toBeInTheDocument()
      expect(screen.getByText('continueWithout')).toBeInTheDocument()
    })

    it('lets the user continue to the onboarding form without an invitation', async () => {
      renderComponent()
      fireEvent.click(await screen.findByText('continueWithout'))
      await waitFor(() => {
        expect(screen.getAllByText('whereToMove').length).toBeGreaterThan(0)
      })
    })
  })
})
