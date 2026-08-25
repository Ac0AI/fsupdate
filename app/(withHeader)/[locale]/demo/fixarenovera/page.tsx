import ClientPage from '../../app/fixarenovera/ClientPage'

/**
 * Fixa & renovera som ren frontendvisning. Providern hämtar sin data som vanligt,
 * men anropen fångas av demoFetch i common/utils/api.ts eftersom sökvägen
 * innehåller /demo.
 */
export default function DemoFixaRenoveraPage() {
  return (
    <main>
      <ClientPage />
    </main>
  )
}
