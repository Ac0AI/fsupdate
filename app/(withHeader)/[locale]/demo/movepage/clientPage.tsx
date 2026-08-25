'use client'

import { ChecklistContextProvider, CreateChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { CreateUserContext, UserProvider } from '@/common/context/user/UserProvider'
import { demoUser } from '@/common/data/demoMovepage'
import MovePage from '@/templates/MovePage'

const checklistContext = CreateChecklistContext()
const userContext = CreateUserContext()

/**
 * Checklistesidan som ren frontendvisning. Användaren kommer från fixturer i
 * stället för /users/me, och API-anropen under vägen fångas i common/utils/api.ts.
 */
const DemoMovepageClient = () => (
  <div style={{ background: 'rgb(232, 237, 240)', flexGrow: '1' }}>
    <UserProvider context={userContext} defaultValueUser={demoUser as unknown as User}>
      <ChecklistContextProvider context={checklistContext}>
        <MovePage completedBookings={[]} />
      </ChecklistContextProvider>
    </UserProvider>
  </div>
)

export default DemoMovepageClient
