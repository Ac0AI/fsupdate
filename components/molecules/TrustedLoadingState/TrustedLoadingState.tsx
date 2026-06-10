'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import { clsx } from 'clsx'

interface TrustedLoadingStateProps {
  brokerOfficeName?: string
  brokerAgencyLogo?: string
  mode?: 'fetching' | 'creating'
}

const coordinators = [
  { name: 'Andreas', image: '/images/team-andreas.webp' },
  { name: 'Joel', image: '/images/team-joel.webp' },
  { name: 'Nina', image: '/images/team-nina.webp' },
]

export const TrustedLoadingState = ({ brokerOfficeName, brokerAgencyLogo, mode = 'fetching' }: TrustedLoadingStateProps) => {
  const { t } = useTranslation(['signup'])
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const title =
    mode === 'creating'
      ? t('creatingMovepage', 'Sätter ihop din personliga flyttsida')
      : brokerOfficeName
        ? `${t('fetchingProvider', 'Hämtar din flytt från')} ${brokerOfficeName}`
        : t('fetchingYourDetails', 'Hämtar dina uppgifter')

  return (
    <div
      className={clsx(
        'fixed inset-0 flex flex-col items-center justify-center',
        'bg-background-default',
        'transition-opacity duration-500',
        fadeIn ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Broker connection badge */}
        {brokerAgencyLogo && (
          <div
            className={clsx(
              'mb-8 transition-all duration-700 delay-200',
              fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-sm border border-primary-main/20">
              <span className="text-xs text-inactive-dark font-medium uppercase tracking-wider">
                {t('invitedBy', 'Inbjuden av')}
              </span>
              <div className="w-px h-4 bg-inactive-main" />
              <div className="relative h-6 w-24">
                <Image
                  src={brokerAgencyLogo}
                  alt={brokerOfficeName || 'Broker'}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Coordinators */}
        <div
          className={clsx(
            'flex flex-col items-center mb-6 transition-all duration-700 delay-300',
            fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          )}
        >
          <div className="flex">
            {coordinators.map((coordinator, index) => (
              <div
                key={coordinator.name}
                className={clsx(
                  'relative w-16 h-16 rounded-full overflow-hidden border-[3px] border-white shadow-md',
                  index > 0 && '-ml-4'
                )}
                style={{ zIndex: coordinators.length - index }}
              >
                <Image src={coordinator.image} alt={coordinator.name} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-inactive-dark">
            {t('coordinatorsIntro', 'Andreas, Joel och Nina hjälper dig genom flytten')}
          </p>
        </div>

        {/* Loading text */}
        <div
          className={clsx(
            'transition-all duration-700 delay-500',
            fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <h2 className="text-xl font-bold text-secondary-main mb-2">{title}</h2>
        </div>

        {/* Activity indicator */}
        <div
          className={clsx(
            'mt-6 flex gap-1.5 transition-opacity duration-700 delay-500',
            fadeIn ? 'opacity-100' : 'opacity-0'
          )}
          role="status"
          aria-label={title}
        >
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 rounded-full bg-primary-main animate-pulse"
              style={{ animationDelay: `${dot * 0.2}s` }}
            />
          ))}
        </div>

        {/* Trust footer */}
        <div
          className={clsx(
            'mt-12 flex items-center gap-6 text-xs text-inactive-dark transition-all duration-700 delay-700',
            fadeIn ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="var(--color-primary-main)" />
            </svg>
            <span>{t('secureService', 'Säker tjänst')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="var(--color-accent-icon)" />
            </svg>
            <span>{t('trustedByThousands', '200 000+ flyttar sedan 2020')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustedLoadingState
