import { Suspense } from 'react'
import Loading from '../../../loading'
import ClientPage from './ClientPage'

/**
 * Inbjudningslänken i demon. Koden är rollen: kopare eller saljare. Samma
 * onboarding som skarpa /i/[kod], men inbjudan, signup och sparad adress
 * svaras av demo-API:t och demon börjar om varje gång länken öppnas.
 */
export default async function Page(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <ClientPage code={code} />
      </Suspense>
    </main>
  )
}
