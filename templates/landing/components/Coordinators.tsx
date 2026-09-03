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
  const { boot, show } = useIntercom()
  return (
    <section id="koordinatorerna" aria-labelledby="coordinators-heading" className="w-screen bg-[var(--color-background-default)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
          <div>
            <h2 id="coordinators-heading" className="text-[var(--color-secondary-main)] font-bold leading-[1.08] text-[32px] md:text-[44px] lg:text-[48px] mb-4">
              Koordinatorerna som kan din flytt
            </h2>
            <p className="text-lg text-[var(--color-secondary-main)] leading-relaxed max-w-[520px] mb-8">
              Går något fel hör du av dig till oss. Undrar du något hör du av dig i chatten.
            </p>
            <button
              type="button"
              onClick={() => {
                boot()
                show()
              }}
              className="inline-flex items-center gap-2 min-h-11 px-6 rounded-full border border-[var(--color-secondary-main)] text-[var(--color-secondary-main)] font-semibold hover:bg-[var(--color-secondary-main)] hover:text-white transition-colors"
            >
              Öppna chatten
            </button>
            <p className="mt-4 text-sm text-[var(--color-secondary-main)]/70">
              Hellre ringa?{' '}
              <a href="tel:+46812008822" className="font-semibold text-[var(--color-secondary-main)] underline underline-offset-2">
                08-12 00 88 22
              </a>
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {TEAM.map((c) => (
              <li key={c.id} className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-4">
                {/* Ljusblå platta bakom porträttet; fotots vita studiobakgrund multipliceras bort
                    så alla tre sitter i samma färg i stället för att flyta ut i sidans ground. */}
                <span className="w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full bg-[var(--color-pale,#EAF2F8)] overflow-hidden shrink-0">
                  <Image
                    src={`${c.imageKitPath.split('?')[0]}?tr=w-288,h-288,fo-face`}
                    alt={c.name}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-lg font-bold text-[var(--color-secondary-main)]">{c.name}</span>
                  <span className="text-sm text-[var(--color-secondary-main)]/60">{c.title}</span>
                  <a href={`mailto:${c.email}`} className="text-sm text-[var(--color-secondary-main)] underline underline-offset-2">{c.email}</a>
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
