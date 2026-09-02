'use client'

import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import {
  INITIAL_AGES_SECONDS,
  MOVE_EVENTS,
  SERVICE_ICONS,
  type MoveEvent,
} from './recentMovesData'

const VISIBLE_ROWS = 5
const TICK_SECONDS = 5

type Row = { event: MoveEvent; ageSeconds: number; key: number }

const formatAge = (seconds: number) => {
  if (seconds < 60) return 'Nu'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min sedan`
  const hours = Math.floor(minutes / 60)
  return `${hours} h sedan`
}

const initialRows: Row[] = INITIAL_AGES_SECONDS.map((ageSeconds, i) => ({
  event: MOVE_EVENTS[i],
  ageSeconds,
  key: i,
}))

const RecentMoves = () => {
  const [rows, setRows] = useState<Row[]>(initialRows)
  const nextIndex = useRef(INITIAL_AGES_SECONDS.length)
  const nextKey = useRef(INITIAL_AGES_SECONDS.length)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const id = window.setInterval(() => {
      setRows((current) => {
        const event = MOVE_EVENTS[nextIndex.current % MOVE_EVENTS.length]
        nextIndex.current += 1
        nextKey.current += 1
        const aged = current.map((row) => ({ ...row, ageSeconds: row.ageSeconds + TICK_SECONDS }))
        return [{ event, ageSeconds: 0, key: nextKey.current }, ...aged].slice(0, VISIBLE_ROWS)
      })
    }, TICK_SECONDS * 1000)

    return () => window.clearInterval(id)
  }, [])

  return (
    <section
      aria-labelledby="recent-moves-heading"
      className="w-screen bg-[var(--color-background-default)] py-16 md:py-24 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-block text-[var(--color-primary-main)] text-sm font-semibold uppercase tracking-wider mb-4">
              Just nu
            </span>
            <h2
              id="recent-moves-heading"
              className="text-3xl md:text-4xl font-bold text-[var(--color-secondary-main)] mb-5"
            >
              Någon annans flytt blir klar medan du läser det här
            </h2>
            <p className="text-lg text-[var(--color-secondary-main)]/60 leading-relaxed max-w-[520px]">
              Varje rad är en tjänst vi har tecknat, bokat eller bockat av åt en kund. Ingen av dem
              har ringt runt eller begärt offerter. De sa ja till ett förslag.
            </p>
          </div>

          {/* Flöde */}
          <div className="relative">
            <ul className="flex flex-col gap-3">
              {rows.map((row) => (
                <li
                  key={row.key}
                  className={clsx(
                    'flex items-center gap-4 bg-white rounded-xl px-4 py-3.5',
                    'border border-gray-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
                    'animate-recent-move-in'
                  )}
                >
                  <span className="w-9 h-9 rounded-lg bg-[var(--color-primary-main)]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-[18px] h-[18px] text-[var(--color-primary-main)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={SERVICE_ICONS[row.event.service]}
                      />
                    </svg>
                  </span>

                  <p className="flex-1 min-w-0 text-sm text-[var(--color-secondary-main)] leading-snug">
                    <span className="font-semibold">{row.event.person}</span>
                    <span className="text-[var(--color-secondary-main)]/50"> i {row.event.city} </span>
                    {row.event.action}
                  </p>

                  <span className="text-xs text-[var(--color-secondary-main)]/40 whitespace-nowrap flex-shrink-0">
                    {formatAge(row.ageSeconds)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Toning nedåt så listan känns som ett flöde utan slut */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecentMoves
