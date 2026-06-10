'use client'

import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT } from '@/constants/trustStats'

interface TrustIndicatorsStripProps {
  googleRating?: number
  reviewCount?: number
  variant?: 'light' | 'dark'
  className?: string
}

export const TrustIndicatorsStrip = ({
  googleRating = GOOGLE_RATING,
  reviewCount = GOOGLE_REVIEW_COUNT,
  variant = 'light',
  className,
}: TrustIndicatorsStripProps) => {
  const { t } = useTranslation(['common'])

  const isDark = variant === 'dark'

  return (
    <div
      className={clsx(
        'flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-2.5 px-4 rounded-lg',
        isDark ? 'bg-secondary-main/5' : 'bg-background-default',
        className
      )}
    >
      {/* Row 1 on mobile: Rating + Moves */}
      <div className="flex items-center justify-center gap-3 md:gap-4">
        {/* Google Rating */}
        <div className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBC04">
            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
          </svg>
          <span className="text-xs font-semibold text-secondary-main">
            {String(googleRating).replace('.', ',')}
          </span>
          <span className="text-[10px] text-inactive-dark">
            ({reviewCount}+)
          </span>
        </div>

        <div className={clsx('w-px h-3', isDark ? 'bg-secondary-main/20' : 'bg-inactive-main')} />

        {/* Moves count */}
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-primary-main)">
            <path d="M12 2L3 9V20C3 20.55 3.45 21 4 21H9V14H15V21H20C20.55 21 21 20.55 21 20V9L12 2Z" />
          </svg>
          <span className="text-xs text-inactive-dark">
            200 000+ {t('moves', 'flyttar')}
          </span>
        </div>
      </div>

      {/* Divider between rows (hidden on mobile) */}
      <div className={clsx('hidden md:block w-px h-3', isDark ? 'bg-secondary-main/20' : 'bg-inactive-main')} />

      {/* Row 2 on mobile: Secure + Free */}
      <div className="flex items-center justify-center gap-3 md:gap-4">
        {/* Security badge */}
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-primary-main)">
            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" />
          </svg>
          <span className="text-xs text-inactive-dark">
            {t('secure', 'Säkert')}
          </span>
        </div>

        <div className={clsx('w-px h-3', isDark ? 'bg-secondary-main/20' : 'bg-inactive-main')} />

        {/* Free service badge */}
        <div className="flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-primary-main)">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span className="text-xs text-inactive-dark">
            {t('freeService', 'Kostnadsfri')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TrustIndicatorsStrip
