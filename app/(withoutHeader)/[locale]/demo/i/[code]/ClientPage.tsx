'use client'

import { useEffect, useState } from 'react'
import { LeadProvider, CreateLeadContext } from '@/common/context/lead/LeadProvider'
import { isDemoPersona, startDemoSession } from '@/common/data/demoPersona'
import { resetDemoChecklist } from '@/common/utils/demoApi'
import UserOnboarding from '@/templates/UserOnboarding/UserOnboarding'

const context = CreateLeadContext()

export default function ClientPage({ code }: { code: string }) {
  const [ready, setReady] = useState(false)

  // Länken är starten på en ny kunds resa: nollställ allt innan inbjudan hämtas.
  useEffect(() => {
    startDemoSession(isDemoPersona(code) ? code : 'kopare')
    resetDemoChecklist()
    setReady(true)
  }, [code])

  if (!ready) return null

  return (
    <LeadProvider context={context}>
      <UserOnboarding code={code} />
    </LeadProvider>
  )
}
