'use client'

import { useEffect, useRef, useState, KeyboardEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import useResponsive from '@/common/hooks/useResponsive'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Spinner from '@/components/atoms/Spinner'
import Text from '@/components/atoms/Text'
import LinkButton from '@/components/linkButton'
import LoginAndSignupBase from '@/components/molecules/LoginAndSignupBase'
import BankId from '@/public/images/BankId.svg'
import Info from '@/public/images/Info.svg'
import i18nConfig from 'i18nConfig'
import { collectWrapperVariants, innerWrapperVariants as collectInnerWrapperVariants } from '@/templates/LoginTemplate/Collect/Collect.variants'
import {
  buttonWrapperVariants,
  headerSubtitleVariants,
  headerVariants,
  iconWrapperVariants,
  infoWrapperVariants,
  initWrapperVariants,
  innerWrapperVariants,
  inputAndButtonsWrapperVariants,
  largeButtonWrapperVariants,
  textWrapperVariants,
  thisDeviceButtonWrapperVariants,
} from '@/templates/LoginTemplate/Init/Init.variants'

// Samma rytm som en riktig BankID-inloggning på en bra dag: appen öppnas,
// legitimeringen tar en stund, sedan bekräftelse. Tre skärmar i stället för
// en spinner, så att väntan berättar vad som händer.
type Stage = 'open' | 'identify' | 'done'
const STAGES: { stage: Stage; at: number }[] = [
  { stage: 'open', at: 0 },
  { stage: 'identify', at: 700 },
  { stage: 'done', at: 1900 },
]
const FAKE_IDENTIFY_MS = 2600

const STAGE_COPY: Record<Stage, string> = {
  open: 'Öppnar BankID',
  identify: 'Legitimerar dig',
  done: 'Välkommen tillbaka, Anna',
}

export default function DemoLoginPreview() {
  const { t } = useTranslation(['login'])
  const { isTabletPortraitOrGreater } = useResponsive()
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const [isBankIdOnThisDeviceLogin, setIsBankIdOnThisDeviceLogin] = useState(true)
  const [personalNumber, setPersonalNumber] = useState('')
  const [isIdentifying, setIsIdentifying] = useState(false)
  const [stage, setStage] = useState<Stage>('open')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Personnumret lämnar aldrig komponenten. Inget anrop går ut, ingen cookie
  // sätts. Knappen leder till demoflyttsidan, som kör på påhittad data.
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const startDemoLogin = () => {
    setIsIdentifying(true)
    setStage('open')
    timers.current = [
      ...STAGES.filter((s) => s.at > 0).map((s) => setTimeout(() => setStage(s.stage), s.at)),
      setTimeout(() => router.push(locale === i18nConfig.defaultLocale ? '/demo/movepage' : `/${locale}/demo/movepage`), FAKE_IDENTIFY_MS),
    ]
  }

  const cancelDemoLogin = () => {
    clearTimers()
    setIsIdentifying(false)
  }

  useEffect(() => clearTimers, [])

  useEffect(() => {
    if (isTabletPortraitOrGreater) {
      setIsBankIdOnThisDeviceLogin(false)
    }
  }, [isTabletPortraitOrGreater])

  const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault()
    }
  }

  if (isIdentifying) {
    return (
      <LoginAndSignupBase>
        <div className={collectWrapperVariants()}>
          <h1 className={headerVariants()}>{t('identifyWithBankid')}</h1>
          <div className={collectInnerWrapperVariants()}>
            <div key={stage} className="flex flex-col items-center motion-safe:animate-[rise_.35s_var(--ease-out-expo)_both]" aria-live="polite">
              <div className="flex h-20 items-center justify-center">
                {stage === 'open' && (
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_6px_20px_rgba(1,22,39,0.12)] motion-safe:animate-[pulse_1.4s_ease-in-out_infinite] [&_svg]:h-8 [&_svg]:w-9">
                    <BankId />
                  </span>
                )}
                {stage === 'identify' && <Spinner scale={1.5} color="green" />}
                {stage === 'done' && (
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-main)] motion-safe:animate-[pop_.5s_var(--ease-spring)_both]">
                    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden>
                      <path d="M5 13l4 4L19 7" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </div>
              <Text className="mt-4 text-center font-bold" spacing="none">
                {STAGE_COPY[stage]}
              </Text>
            </div>
            <Text className="mt-2 text-center text-xs" variant="details" spacing="none">
              Simulerad identifiering. Ingen kontakt tas med BankID.
            </Text>
            {stage !== 'done' && (
              <div className="mt-8">
                <LinkButton sx={{ fontSize: 12, fontWeight: '200', borderBottom: '1px solid' }} noUnderline={false} onClick={cancelDemoLogin}>
                  {t('cancel')}
                </LinkButton>
              </div>
            )}
          </div>
        </div>
      </LoginAndSignupBase>
    )
  }

  return (
    <LoginAndSignupBase>
      <div className={`${initWrapperVariants()} motion-safe:animate-[rise_.4s_var(--ease-out-expo)_both]`}>
        <h1 className={headerVariants()}>{t('header')}</h1>
        <Text className={headerSubtitleVariants()} spacing="bottom">
          {t('headerSubtitle')}
        </Text>
        <Text className="mb-6 rounded-full bg-[var(--color-primary-main)]/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary-main)]" variant="details">
          Visual demo
        </Text>
        <div className={innerWrapperVariants()}>
          {isBankIdOnThisDeviceLogin ? (
            <>
              <div className={thisDeviceButtonWrapperVariants()}>
                <div className={largeButtonWrapperVariants()}>
                  <Button variant="primaryAlt" iconRight={<BankId />} text={t('login')} className="!text-md" withFullWidth padding="10px 10px" onClick={startDemoLogin} />
                </div>
              </div>
              <LinkButton
                sx={{ fontSize: 12, fontWeight: '200', borderBottom: '1px solid', marginTop: 15 }}
                noUnderline={false}
                onClick={() => setIsBankIdOnThisDeviceLogin(false)}
              >
                {t('bankIdOtherDevice')}
              </LinkButton>
            </>
          ) : (
            <div className={inputAndButtonsWrapperVariants()}>
              <Input handleKeypress={handleKeypress} label={t('pno')} type="text" value={personalNumber} onChange={(e) => setPersonalNumber(e.currentTarget.value)} />
              <div className={buttonWrapperVariants()}>
                <div className={largeButtonWrapperVariants()}>
                  <Button
                    padding={isTabletPortraitOrGreater ? '10px 46px' : '10px 10px'}
                    className="w-full !text-[14px]"
                    withFullWidth
                    variant="primaryAlt"
                    iconRight={<BankId />}
                    iconColor="#000"
                    text={t('login')}
                    onClick={startDemoLogin}
                  />
                </div>
              </div>
              <LinkButton
                sx={{ fontSize: 12, fontWeight: '200', borderBottom: '1px solid', marginTop: 8 }}
                noUnderline={false}
                onClick={() => setIsBankIdOnThisDeviceLogin(true)}
              >
                {t('bankIdThisDevice')}
              </LinkButton>
            </div>
          )}
        </div>
        <Text className="mt-8 text-center text-xs" variant="details">
          {t('termsText')}
          <Link target="_blank" href="/terms" legacyBehavior>
            <a className="!text-[var(--color-primary-main)] !font-bold">{t('termsLink')}</a>
          </Link>
        </Text>
        {typeof navigator !== 'undefined' && navigator.userAgent.includes('SamsungBrowser') && (
          <div className={infoWrapperVariants()}>
            <div className={iconWrapperVariants()}>
              <Info />
            </div>
            <div className={textWrapperVariants()}>
              <Trans t={t} i18nKey="samsungHelpText" components={[<a key="samsungHelpText" />]} />
            </div>
          </div>
        )}
      </div>
    </LoginAndSignupBase>
  )
}
