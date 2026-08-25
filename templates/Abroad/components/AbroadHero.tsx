import NextLink from 'next/link'
import QuoteForm from './QuoteForm'

/**
 * Heron på hubben och landssidorna. Samma uppställning i båda: löftet till
 * vänster, formuläret till höger, två hårda tal på raden under.
 *
 * På mobil byter formuläret plats med punktlistan. Punkterna är fyra rader
 * långa och trycker annars ner formuläret långt under vecket, och det är
 * formuläret sidan finns för. Samma ordning som mobil-artboarden i Paper.
 *
 * Paper-designen har ett foto som bleeder ut till höger under formuläret. Vi
 * har inga bilder inlagda än, så bakgrunden är en gradient i samma toner.
 * Skicka in fotona så byter vi ut den.
 */

type Stat = {
  value: string
  label: string
}

interface Props {
  eyebrow: string
  breadcrumb?: { label: string; href: string }
  headline: string | readonly string[]
  body: string
  bullets: readonly string[]
  stats: readonly Stat[]
  country?: string
}

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden className="mt-[3px] shrink-0">
    <circle cx="9" cy="9" r="9" fill="var(--color-primary-main)" />
    <path d="M5 9.2L7.7 11.8L13 6.6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AbroadHero = ({ eyebrow, breadcrumb, headline, body, bullets, stats, country }: Props) => {
  const lines = typeof headline === 'string' ? [headline] : headline

  return (
    <section className="relative overflow-hidden bg-[var(--color-secondary-extra-extra-light)]">
      {/* Djup i bakgrunden. Ersätts av hero-fotot när vi har det. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-15%] h-[620px] w-[620px] rounded-full bg-[var(--color-primary-main)]/12 blur-[120px]" />
        <div className="absolute bottom-[-25%] right-[10%] h-[520px] w-[520px] rounded-full bg-[var(--color-accent-main)]/10 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary-extra-extra-light)] via-[var(--color-secondary-extra-extra-light)]/80 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px] lg:items-center lg:gap-16">
          {/* display:contents på mobil gör löftets två block till egna grid-items,
              så de kan sorteras runt formuläret. På lg blir wrappern en vanlig
              kolumn igen och ordningen spelar ingen roll. */}
          <div className="contents lg:block">
            <div className="order-1 lg:order-none">
              <p className="text-xs md:text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">
                {breadcrumb ? (
                  <>
                    <NextLink href={breadcrumb.href} className="hover:text-[var(--color-secondary-main)] transition-colors">
                      {breadcrumb.label}
                    </NextLink>
                    <span className="mx-2 text-[var(--color-inactive-grey-light)]">/</span>
                    <span className="text-[var(--color-inactive-dark)]">{eyebrow}</span>
                  </>
                ) : (
                  eyebrow
                )}
              </p>

              <h1 className="mt-5 text-[var(--color-secondary-dark)] font-bold leading-[1.08] text-[38px] md:text-[52px] lg:text-[56px] tracking-[-0.02em]">
                {lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>

              <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-[var(--color-secondary-main)]/80">{body}</p>
            </div>

            <div className="order-3 lg:order-none lg:mt-9">
              <ul className="space-y-3">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-[15px] leading-relaxed text-[var(--color-secondary-main)]">
                    <Check />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-6 border-t border-[var(--color-secondary-main)]/15 pt-7">
                {stats.map((stat, index) => (
                  <div key={stat.value} className={index === 0 ? '' : 'border-l border-[var(--color-secondary-main)]/15 pl-8'}>
                    <p className="text-[28px] md:text-[32px] font-bold leading-none text-[var(--color-secondary-dark)]">{stat.value}</p>
                    <p className="mt-2 text-[13px] text-[var(--color-inactive-dark)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="order-2 flex justify-center lg:order-none lg:justify-end">
            <QuoteForm country={country} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AbroadHero
