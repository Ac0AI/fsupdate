'use client'

import { ChecklistContextProvider, CreateChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { CreateUserContext, UserProvider } from '@/common/context/user/UserProvider'
import { demoUser } from '@/common/data/demoMovepage'

const checklistContext = CreateChecklistContext()
const userContext = CreateUserContext()

/**
 * Ger tjänstesidorna under /demo samma användare och checklista som
 * demoflyttsidan. Utan den saknar providern ett move-id, checklistan hämtas
 * aldrig, och mallar som väntar på activitiesList fastnar i sitt laddningsläge
 * i stället för att rendera. Skarpa appen rör vi inte: den här komponenten
 * används bara av sidorna under /demo.
 */
const DemoUserBoundary = ({ children }: { children: React.ReactNode }) => (
  <UserProvider context={userContext} defaultValueUser={demoUser as unknown as User}>
    <ChecklistContextProvider context={checklistContext}>
      <div className="motion-safe:animate-[rise_.4s_var(--ease-out-expo)_both]">{children}</div>
    </ChecklistContextProvider>
  </UserProvider>
)

export default DemoUserBoundary
