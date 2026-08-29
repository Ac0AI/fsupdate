'use client'

import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

interface Props {
  /** Inflyttningsdatum. Saknas det visas bara antalet avklarade steg. */
  movingDate?: string | Date | null
  /** När flytten lades upp. Används som startpunkt på linjen. */
  startedAt?: string | Date | null
  completed: number
  total: number
}

const MS_PER_DAY = 1000 * 60 * 60 * 24
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/**
 * Flyttbilen och hemmet ritas här i stället för att hämtas som filer: de finns
 * bara i tidslinjen, och i den här storleken behöver formerna vara ritade för
 * just den för att inte bli grötiga. Manéret är samma som tjänsteikonerna:
 * navy linjer, persika och mint som fyllning.
 */
const MovingVan = () => (
  <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    {/* Vit halo så bilen håller sig läsbar både på den mintfyllda och den grå delen av linjen. */}
    <g stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <rect x="2" y="3.5" width="17" height="12" rx="2" />
      <path d="M19 8h4.6l4.9 4.4V15.5H19z" />
    </g>
    {/* Skåpet och hytten i persika med navy kontur, som flytthjälpsikonen. */}
    <rect x="2" y="3.5" width="17" height="12" rx="2" fill="#FFD4B3" stroke="#214766" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M19 8h4.6l4.9 4.4V15.5H19z" fill="#FFD4B3" stroke="#214766" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M20.6 9.6h2.6l2.7 2.5h-5.3z" fill="#FFFFFF" stroke="#214766" strokeWidth="1.2" strokeLinejoin="round" />
    {/* Mint rand: samma accent som bocken och tidslinjens fyllning. */}
    <path d="M5.5 9.5h7" stroke="#51C8B4" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="8.5" cy="17.5" r="3.1" fill="#FFFFFF" stroke="#214766" strokeWidth="1.8" />
    <circle cx="8.5" cy="17.5" r="1.1" fill="#214766" />
    <circle cx="24.5" cy="17.5" r="3.1" fill="#FFFFFF" stroke="#214766" strokeWidth="1.8" />
    <circle cx="24.5" cy="17.5" r="1.1" fill="#214766" />
  </svg>
)

const DestinationHome = () => (
  <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <g stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round">
      <path d="M12 2.5 3 10.5h2.2v8.2a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1v-8.2H21z" />
    </g>
    {/* Väggar vita, tak i persika, dörr i mint, allt med navy kontur. */}
    <path d="M5.2 10.5h13.6v8.2a1 1 0 0 1-1 1H6.2a1 1 0 0 1-1-1z" fill="#FFFFFF" stroke="#214766" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 2.5 3 10.5h18z" fill="#FFD4B3" stroke="#214766" strokeWidth="1.8" strokeLinejoin="round" />
    <rect x="15" y="4.2" width="2.4" height="3.2" rx="0.4" fill="#214766" />
    <rect x="9.9" y="13" width="4.2" height="6.7" rx="1" fill="#51C8B4" />
  </svg>
)

/**
 * Lätt tidslinje: här är du idag, hit ska vi. Fyllningen är tid, inte uppgifter -
 * att blanda två betydelser i samma stapel gör den obegriplig.
 */
const MoveTimeline = ({ movingDate, startedAt, completed, total }: Props) => {
  const { t, i18n } = useTranslation(['movePage'])

  const moveIn = movingDate ? startOfDay(new Date(movingDate)) : null
  const today = startOfDay(new Date())
  const start = startedAt ? startOfDay(new Date(startedAt)) : null

  const daysLeft = moveIn ? Math.max(0, Math.round((moveIn.getTime() - today.getTime()) / MS_PER_DAY)) : null

  // Andel av tiden som gått. Utan startdatum antar vi ett fönster på 60 dagar.
  const span = moveIn ? (start ? moveIn.getTime() - start.getTime() : 60 * MS_PER_DAY) : 0
  const elapsed = moveIn ? span - (moveIn.getTime() - today.getTime()) : 0
  const timePercent = span > 0 ? Math.min(100, Math.max(4, Math.round((elapsed / span) * 100))) : 0

  const moveInLabel = moveIn
    ? new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-GB' : 'sv-SE', { day: 'numeric', month: 'short' }).format(moveIn)
    : ''

  return (
    <section
      aria-label={t('CHECKLIST_SECTION.progressTitle')}
      className="bg-white rounded-lg shadow-[0px_2px_6px_rgba(1,22,39,0.06)] w-full max-w-[818px] px-4 py-4 mt-6 md:px-6 md:py-5"
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <p className="font-bold text-[15px] md:text-[17px] text-[var(--color-text-main)]">
          {daysLeft !== null ? t('CHECKLIST_SECTION.daysUntilMoveIn', { count: daysLeft }) : t('CHECKLIST_SECTION.progressTitle')}
        </p>
        <p className="text-[13px] text-[var(--color-inactive-dark)] whitespace-nowrap">
          {t('CHECKLIST_SECTION.progressCount', { completed, total })}
        </p>
      </div>

      {moveIn && (
        <>
          <div className="relative h-1.5 rounded-full bg-[var(--color-inactive-main)]" aria-hidden>
            {/* Fyllningen växer från noll när sidan laddas, och bilen sitter i dess ände så den kör fram till dagens datum. */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-primary-main)] w-[var(--fill)] starting:w-0 transition-[width] duration-[1100ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
              style={{ '--fill': `${timePercent}%` } as React.CSSProperties}
            >
              <span className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
                <MovingVan />
              </span>
            </div>

            <span className="absolute top-1/2 left-full -translate-y-1/2 -translate-x-1/2">
              <DestinationHome />
            </span>
          </div>

          <div className="flex items-center justify-between mt-2.5">
            <span className={clsx('text-[12px] font-semibold text-[var(--color-secondary-main)]')}>{t('CHECKLIST_SECTION.timelineToday')}</span>
            <span className="text-[12px] text-[var(--color-inactive-dark)]">{moveInLabel}</span>
          </div>
        </>
      )}
    </section>
  )
}

export default MoveTimeline
