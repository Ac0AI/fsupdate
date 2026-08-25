import ClientPage from '../../app/insurance/ClientPage'

/**
 * Hemförsäkring som ren frontendvisning. Providern hämtar sin data som vanligt,
 * men anropen fångas av demoFetch i common/utils/api.ts eftersom sökvägen
 * innehåller /demo.
 */
export default function DemoInsurancePage() {
  return (
    <main>
      <ClientPage />
    </main>
  )
}
