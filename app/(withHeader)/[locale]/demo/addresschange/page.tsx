import ClientPage from '../../app/addresschange/ClientPage'

/**
 * Flyttanmälan som ren frontendvisning. Providern hämtar sin data som vanligt,
 * men anropen fångas av demoFetch i common/utils/api.ts eftersom sökvägen
 * innehåller /demo.
 */
export default function DemoAddresschangePage() {
  return (
    <main>
      <ClientPage />
    </main>
  )
}
