import ClientPage from '../../app/broadband/ClientPage'

/**
 * Bredband som ren frontendvisning. Providern hämtar sin data som vanligt,
 * men anropen fångas av demoFetch i common/utils/api.ts eftersom sökvägen
 * innehåller /demo.
 */
export default function DemoBroadbandPage() {
  return (
    <main className="motion-safe:animate-[rise_.4s_var(--ease-out-expo)_both]">
      <ClientPage />
    </main>
  )
}
