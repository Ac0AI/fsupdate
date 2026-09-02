'use client'

import { clsx } from 'clsx'

/**
 * Det här ingår. Sex saker varje flytt kräver, en rad per tjänst med vad kunden
 * slipper och vad hon får (brandguidens snabbtest). Inga siffror utan täckning,
 * "jämföra" bara i nekad form, och ett förslag per tjänst i stället för en meny.
 */
const SERVICES = [
  { name: 'Elavtal', skip: 'Ringa elbolag och läsa villkor.', get: 'Ett färdigförhandlat avtal. Tänd lampa när du kommer.' },
  { name: 'Bredband', skip: 'Jaga operatörer och teknikertider.', get: 'Det som finns på din adress, klart till inflytt.' },
  { name: 'Flytthjälp', skip: 'Begära offerter och bära själv.', get: 'En offert, försäkrat och med trafiktillstånd. Vi tar ansvar hela vägen.' },
  { name: 'Flyttstädning', skip: 'Skura sista kvällen.', get: 'Städat med garanti innan nycklarna lämnas.' },
  { name: 'Hemförsäkring', skip: 'Stå oförsäkrad första natten.', get: 'Rätt skydd från dagen du får nycklarna.' },
  { name: 'Adressändring', skip: 'Meddela varje avsändare själv.', get: 'Ny adress hos Skatteverket. Posten kommer rätt.' },
] as const

const label = 'block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-secondary-main)]/50 mb-1'

const ServiceOverview = () => (
  <section id="det-har-ingar" aria-labelledby="service-overview-heading" className="w-screen bg-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-[720px] mb-10 md:mb-14">
        <p className="text-[var(--color-primary-main)] text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-4">Det här ingår</p>
        <h2 id="service-overview-heading" className="text-[var(--color-secondary-main)] font-bold leading-[1.08] text-[32px] md:text-[44px] lg:text-[48px] mb-4">
          Sex saker varje flytt kräver. Vi har redan ordnat dem.
        </h2>
        <p className="text-lg text-[var(--color-secondary-main)]/65 leading-relaxed max-w-[560px]">
          Färdigförhandlat och kvalitetskontrollerat i förväg. Ett förslag per tjänst, du säger ja.
        </p>
      </div>

      <ul className="border-t border-[var(--color-secondary-main)]/10">
        {SERVICES.map((s) => (
          <li
            key={s.name}
            className={clsx(
              'py-5 md:py-6 border-b border-[var(--color-secondary-main)]/10',
              'grid grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)] md:gap-8 md:items-start',
            )}
          >
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary-main)]">{s.name}</h3>
            <p className="text-[15px] leading-relaxed text-[var(--color-secondary-main)]/70">
              <span className={label}>Du slipper</span>
              {s.skip}
            </p>
            <p className="text-[15px] leading-relaxed text-[var(--color-secondary-main)]">
              <span className={label}>Du får</span>
              {s.get}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default ServiceOverview
