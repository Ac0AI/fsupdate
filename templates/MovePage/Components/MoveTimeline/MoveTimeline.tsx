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
            <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-primary-main)]" style={{ width: `${timePercent}%` }} />
            <span
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-[3px] border-[var(--color-secondary-main)]"
              style={{ left: `${timePercent}%` }}
            />
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
