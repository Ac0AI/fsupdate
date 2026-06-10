'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

interface BrokerTrustBadgeProps {
  brokerAgencyLogo?: string
  brokerOfficeName?: string
  variant?: 'default' | 'compact' | 'prominent'
  className?: string
}

export const BrokerTrustBadge = ({
  brokerAgencyLogo,
  brokerOfficeName,
  variant = 'default',
  className,
}: BrokerTrustBadgeProps) => {
  const { t } = useTranslation(['signup'])

  if (!brokerAgencyLogo) return null

  if (variant === 'compact') {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <div className="relative w-[80px] h-[28px] bg-white rounded-md p-1">
          <Image
            src={brokerAgencyLogo}
            alt={brokerOfficeName || 'Broker'}
            fill
            style={{ objectFit: 'contain', padding: '2px' }}
          />
        </div>
      </div>
    )
  }

  if (variant === 'prominent') {
    return (
      <div
        className={clsx(
          'flex flex-col items-center gap-3 p-5 rounded-2xl',
          'bg-gradient-to-b from-white to-background-default',
          'border border-primary-main/20',
          'shadow-md',
          className
        )}
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-main">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          {t('verifiedPartner', 'Verifierad partner')}
        </div>

        <div className="relative w-[160px] h-[48px]">
          <Image
            src={brokerAgencyLogo}
            alt={brokerOfficeName || 'Broker'}
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {brokerOfficeName && (
          <p className="text-xs text-inactive-dark text-center">
            {t('recommendedForYourMove', 'Rekommenderar Flyttsmart för din flytt')}
          </p>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-2.5',
        'bg-white rounded-xl',
        'shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
        'border border-inactive-main',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-inactive-dark">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--color-primary-main)">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        {t('invitedBy', 'Inbjuden av')}
      </div>
      <div className="w-px h-5 bg-inactive-main" />
      <div className="relative w-[100px] h-[32px]">
        <Image
          src={brokerAgencyLogo}
          alt={brokerOfficeName || 'Broker'}
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    </div>
  )
}

export default BrokerTrustBadge
