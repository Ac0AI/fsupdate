'use client'

import { ChecklistContextProvider, CreateChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { CreateUserContext, UserProvider } from '@/common/context/user/UserProvider'
import { useDemoUser } from '@/common/data/useDemoUser'
import MovePage from '@/templates/MovePage'

const checklistContext = CreateChecklistContext()
const userContext = CreateUserContext()

/**
 * Checklistesidan som ren frontendvisning. Användaren kommer från fixturer i
 * stället för /users/me, och API-anropen under vägen fångas i common/utils/api.ts.
 */
const DemoMovepageClient = () => {
  const user = useDemoUser()
  return (
  <div style={{ background: 'rgb(232, 237, 240)', flexGrow: '1' }}>
    <UserProvider context={userContext} defaultValueUser={user as unknown as User}>
      <ChecklistContextProvider context={checklistContext}>
        <MovePage completedBookings={[]} />
      </ChecklistContextProvider>
    </UserProvider>
  </div>
  )
}

export default DemoMovepageClient
