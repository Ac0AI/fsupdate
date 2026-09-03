'use client'

import Image from 'next/image'
import { useIntercom } from 'react-use-intercom'
import { coordinators } from '@/common/data/coordinators'

/**
 * Människorna bakom tjänsten, med namn och foto (designprincip 2). Texten under
 * rubriken är brandguidens Block 1 ordagrant, regel 05: den skrivs inte om.
 */
const FIRST = coordinators.map((c) => c.name.split(' ')[0])
const FIRST_NAMES = `${FIRST.slice(0, -1).join(', ')} och ${FIRST[FIRST.length - 1]}`

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

          {/* Hela teamet som en grupp: överlappande porträtt på ljusblå plattor (fotonas vita
              bakgrund multipliceras bort), en ring i sidans ground skiljer kanterna åt. */}
          <div className="flex flex-col gap-5">
            <ul className="flex items-center pl-1">
              {coordinators.map((c, i) => (
                <li key={c.id} className={i > 0 ? 'relative -ml-3 sm:-ml-4' : 'relative'} style={{ zIndex: coordinators.length - i }}>
                  <span className="block w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-[#EAF2F8] overflow-hidden border-[3px] border-[#F8FAF9]">
                    <Image
                      src={`${c.imageKitPath.split('?')[0]}?tr=w-192,h-192,fo-face,z-0.6`}
                      alt={c.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-[var(--color-secondary-main)] leading-snug">{FIRST_NAMES}</p>
            <p className="-mt-3 text-sm text-[var(--color-secondary-main)]/70">Flyttkoordinatorer. Du får en av dem genom hela flytten.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Coordinators
