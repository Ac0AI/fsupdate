import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { useLeadContext } from '@/common/context/lead/LeadProvider'
import Button from '@/components/atoms/Button'
import TrustedLoadingState from '@/components/molecules/TrustedLoadingState'
import OnboardingDataSection from './OnboardingDataSection'

export interface NoBankIdProps {
  code: string
}

export const NoBankIdUserTemplate = ({ code }: NoBankIdProps) => {
  const { t } = useTranslation(['signup'])
  const {
    lead: { leadDetails, partnerDetails, hasFetchedData },
    setInvitationCode,
    setChannel,
    isLoadingCreateUser,
    leadFetchFailed,
    retryLeadFetch,
    createUserFailed,
    retryCreateUser,
  } = useLeadContext()

  useEffect(() => {
    if (!!code) setInvitationCode(code)
  }, [code, setInvitationCode])

  const [continueWithoutInvite, setContinueWithoutInvite] = useState<boolean>(false)
  const [inviterLogoUrl, setInviterLogoUrl] = useState<string>('')
  const channelQuery = useSearchParams().get('channel')

  useEffect(() => {
    if (!!channelQuery) {
      setChannel(channelQuery as string)
    }
  }, [channelQuery, setChannel])

  useEffect(() => {
    if (!inviterLogoUrl?.length && code) {
      setInviterLogoUrl(leadDetails.brokerAgencyLogo || '')
    }
  }, [inviterLogoUrl, leadDetails, partnerDetails, code])

  if (isLoadingCreateUser) {
    return <TrustedLoadingState mode="creating" />
  }

  if (!hasFetchedData) {
    return (
      <TrustedLoadingState
        mode="fetching"
        brokerOfficeName={leadDetails?.brokerOfficeName}
        brokerAgencyLogo={inviterLogoUrl || leadDetails?.brokerAgencyLogo}
      />
    )
  }

  if (createUserFailed) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background-default px-6">
        <div className="flex flex-col items-center max-w-md text-center">
          <h2 className="text-xl font-bold text-secondary-main mb-2">{t('tryAgainText', 'Vi kunde inte hämta din flyttsida')}</h2>
          <p className="text-sm text-inactive-dark mb-8">{t('contactUsText', 'Kontakta oss, om det fortsätter att krångla.')}</p>
          <div className="w-full max-w-xs">
            <Button text={t('tryAgain', 'Försök igen')} withFullWidth onClick={retryCreateUser} />
          </div>
        </div>
      </div>
    )
  }

  if (leadFetchFailed && !continueWithoutInvite) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background-default px-6">
        <div className="flex flex-col items-center max-w-md text-center">
          <h2 className="text-xl font-bold text-secondary-main mb-2">
            {t('invitationNotFoundTitle', 'Vi kunde inte hitta din inbjudan')}
          </h2>
          <p className="text-sm text-inactive-dark mb-8">
            {t('invitationNotFoundText', 'Kontakta din mäklare om du väntar på en inbjudan. Du kan också fortsätta utan – det går lika bra.')}
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button text={t('tryAgain', 'Försök igen')} withFullWidth onClick={retryLeadFetch} />
            <Button
              text={t('continueWithout', 'Fortsätt utan inbjudan')}
              variant="ghost"
              withFullWidth
              onClick={() => setContinueWithoutInvite(true)}
            />
          </div>
        </div>
      </div>
    )
  }

  return <OnboardingDataSection code={code} />
}

export default NoBankIdUserTemplate
