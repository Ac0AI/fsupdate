'use client'

import Image from 'next/image'
import { useIntercom } from 'react-use-intercom'
import { coordinators } from '@/common/data/coordinators'

/**
 * Människorna bakom tjänsten, med namn och foto (designprincip 2). Texten under
 * rubriken är brandguidens Block 1 ordagrant, regel 05: den skrivs inte om.
 */
const TEAM = coordinators.slice(0, 3)

const Coordinators = () => {
  const { show } = useIntercom()
  return (
    <section id="koordinatorerna" aria-labelledby="coordinators-heading" className="w-screen bg-[var(--color-background-default)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
          <div>
            <p className="text-[var(--color-primary-main)] text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-4">Dina flyttkoordinatorer</p>
            <h2 id="coordinators-heading" className="text-[var(--color-secondary-main)] font-bold leading-[1.08] text-[32px] md:text-[44px] lg:text-[48px] mb-4">
              Riktiga människor som kan din flytt
            </h2>
            <p className="text-lg text-[var(--color-secondary-main)] leading-relaxed max-w-[520px] mb-2">
              Går något fel hör du av dig till oss. Undrar du något hör du av dig i chatten.
            </p>
            <p className="text-lg text-[var(--color-secondary-main)]/65 leading-relaxed max-w-[520px] mb-8">
              Din koordinator svarar i chatten, på mejl och i telefon, och följer din flytt från första dagen till sista nyckeln.
            </p>
            <button
              type="button"
              onClick={() => show()}
              className="inline-flex items-center gap-2 min-h-11 px-6 rounded-full border border-[var(--color-secondary-main)] text-[var(--color-secondary-main)] font-semibold hover:bg-[var(--color-secondary-main)] hover:text-white transition-colors"
            >
              Öppna chatten
            </button>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {TEAM.map((c) => (
              <li key={c.id} className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-4">
                <Image
                  src={`${c.imageKitPath.split('?')[0]}?tr=w-256,h-256,fo-face`}
                  alt={c.name}
                  width={128}
                  height={128}
                  className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full object-cover shrink-0"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-[var(--color-secondary-main)]">{c.name}</span>
                  <span className="text-sm text-[var(--color-secondary-main)]/60">{c.title}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Coordinators
