import ClientPage from '../../app/moveclean/ClientPage'

/**
 * Flyttstädning som ren frontendvisning. Providern hämtar sin data som vanligt,
 * men anropen fångas av demoFetch i common/utils/api.ts eftersom sökvägen
 * innehåller /demo.
 */
export default function DemoMovecleanPage() {
  return (
    <main>
      <ClientPage />
    </main>
  )
}
