'use client'

import { useRouter } from 'next/navigation'
import { clsx } from 'clsx'

type HeroCard = {
  key: 'el' | 'flytt' | 'bredband'
  eyebrow: string
  headline: string
  bullets: string[]
  linkText: string
  ariaLabel: string
  featured?: boolean
}

const heroCards: HeroCard[] = [
  {
    key: 'el',
    eyebrow: 'ELAVTAL',
    headline: 'Spara på elen utan bindning',
    bullets: [
      '800 kr i välkomstrabatt första året',
      'Inga bindningstider eller dolda avgifter',
      'Vi förhandlar med Sveriges elbolag åt dig',
    ],
    linkText: 'Visa mitt elpris',
    ariaLabel:
      'Elavtal: spara på elen utan bindning med 800 kronor välkomstrabatt. Logga in för att se ditt pris.',
  },
  {
    key: 'flytt',
    eyebrow: 'FLYTTHJÄLP & FLYTTSTÄD',
    headline: 'Vi bokar flyttfirma och flyttstäd åt dig',
    bullets: [
      'Personlig flyttrådgivare hela vägen',
      'Bara kvalitetssäkrade firmor, vi har testat dem',
      'Vi tar ansvaret om något krånglar',
    ],
    linkText: 'Boka flytthjälp',
    ariaLabel:
      'Flytthjälp och flyttstäd: vi bokar flyttfirma och städ åt dig med personlig rådgivare. Logga in för att boka.',
    featured: true,
  },
  {
    key: 'bredband',
    eyebrow: 'BREDBAND',
    headline: 'Hitta bästa bredbandet för din adress',
    bullets: [
      'Vi har redan gått igenom operatörerna på din gata',
      'Oberoende, inga provisioner styr förslagen',
      'Förslag på 30 sekunder, bara skriv adressen',
    ],
    linkText: 'Visa mitt bredband',
    ariaLabel:
      'Bredband: vi hittar bästa bredbandet för din adress. Logga in för att se ditt förslag.',
  },
]

const ValueCards = () => {
  const router = useRouter()
  const loginUrl = '/i/testmode'

  const goToLogin = () => router.push(loginUrl)

  return (
    <section
      id="value-cards"
      aria-labelledby="value-cards-heading"
      className="w-screen flex justify-center bg-white py-16 md:py-24"
    >
      <div className="w-full px-4 md:px-8 max-w-[1232px]">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block text-[var(--color-primary-main)] text-sm font-semibold uppercase tracking-wider mb-4">
            Ingår i din flytt
          </span>
          <h2
            id="value-cards-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary-main)] mb-5"
          >
            Det här väntar på dig
          </h2>
          <p className="text-lg text-[var(--color-secondary-main)]/60 max-w-[620px] mx-auto">
            Tre tjänster där vi sparar dig pengar, tid och huvudvärk. Plus allt
            annat du behöver inför flytten.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
          {heroCards.map((card) => {
            const isFeatured = card.featured === true
            const cardStyle: React.CSSProperties = isFeatured
              ? {
                  backgroundColor: 'var(--color-secondary-main)',
                  color: '#ffffff',
                }
              : {
                  backgroundColor: '#ffffff',
                  color: 'var(--color-secondary-main)',
                }
            return (
              <a
                key={card.key}
                href={loginUrl}
                style={cardStyle}
                onClick={(e) => {
                  e.preventDefault()
                  goToLogin()
                }}
                aria-label={card.ariaLabel}
                className={clsx(
                  'group relative flex flex-col rounded-2xl transition-all duration-200 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  'focus-visible:ring-[var(--color-primary-main)]',
                  'motion-safe:hover:-translate-y-1 motion-safe:active:translate-y-0',
                  isFeatured
                    ? 'border border-transparent p-7 md:p-9 md:-my-2 shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]'
                    : 'border border-gray-200 p-6 md:p-7 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-primary-main/40'
                )}
              >
                {/* Eyebrow */}
                <span
                  className={clsx(
                    'text-[11px] font-semibold uppercase tracking-widest mb-4',
                    isFeatured ? 'text-white/60' : 'text-[var(--color-primary-main)]'
                  )}
                >
                  {card.eyebrow}
                </span>

                {/* Headline */}
                <h3
                  className={clsx(
                    'font-bold leading-tight mb-6',
                    isFeatured
                      ? 'text-white text-[24px] md:text-[28px]'
                      : 'text-[var(--color-secondary-main)] text-[22px] md:text-[24px]'
                  )}
                >
                  {card.headline}
                </h3>

                {/* Bullets */}
                <ul className="space-y-3 flex-1">
                  {card.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <svg
                        className={clsx(
                          'w-5 h-5 shrink-0 mt-0.5',
                          isFeatured
                            ? 'text-[var(--color-primary-main)]'
                            : 'text-[var(--color-primary-main)]'
                        )}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span
                        className={clsx(
                          'text-[15px] leading-relaxed',
                          isFeatured
                            ? 'text-white/85'
                            : 'text-[var(--color-secondary-main)]/75'
                        )}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Service-specific hint at bottom */}
                <div
                  className={clsx(
                    'flex items-center gap-2 text-[13px] font-semibold mt-6 pt-5 border-t',
                    'transition-all duration-200',
                    isFeatured
                      ? 'text-white/85 border-white/15 group-hover:text-white group-hover:gap-3'
                      : 'text-[var(--color-primary-main)] border-gray-100 group-hover:gap-3'
                  )}
                >
                  <span>{card.linkText}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </a>
            )
          })}
        </div>

        {/* Secondary services prose */}
        <p className="text-center max-w-[640px] mx-auto text-[15px] text-[var(--color-secondary-main)]/65 mt-10">
          Vi hjälper dig även med{' '}
          <span className="font-semibold text-[var(--color-secondary-main)]/85">
            hemförsäkring
          </span>
          ,{' '}
          <span className="font-semibold text-[var(--color-secondary-main)]/85">
            adressändring
          </span>{' '}
          och{' '}
          <span className="font-semibold text-[var(--color-secondary-main)]/85">
            hantverkare
          </span>
          .
        </p>

        {/* Trust / transparency line */}
        <p className="text-center max-w-[640px] mx-auto text-[13px] text-[var(--color-secondary-main)]/50 mt-3">
          Allt är kostnadsfritt för dig. Vi tjänar pengar när du tecknar via oss,
          aldrig av dig.
        </p>

        {/* Desktop-only login CTA */}
        <div className="hidden lg:flex justify-center mt-10">
          <button
            type="button"
            onClick={goToLogin}
            className={clsx(
              'inline-flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider',
              'text-white',
              'bg-[linear-gradient(135deg,#c45e1a_0%,#e8802e_24%,#ffc08a_50%,#e07628_72%,#a84d12_100%)]',
              'border border-[#ffb87a]',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-6px_10px_rgba(120,40,5,0.28),0_14px_28px_rgba(0,0,0,0.24)]',
              'hover:bg-[linear-gradient(135deg,#d06a22_0%,#f09040_24%,#ffd0a0_50%,#ee8434_72%,#b85818_100%)]',
              'hover:border-[#ffd4a8]',
              'motion-safe:active:scale-[0.99]',
              'transition-all duration-200'
            )}
          >
            Logga in med BankID
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ValueCards
