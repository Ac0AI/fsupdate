import NextLink from 'next/link'
import {
  ABROAD_FAQ,
  ABROAD_HERO,
  ABROAD_RESPONSIBILITY,
  ABROAD_STEPS,
  ABROAD_WHY,
  COUNTRIES,
  PRICE_ANCHOR,
  TRANSIT_GRID,
} from '@/constants/abroad'
import { GOOGLE_RATING } from '@/constants/trustStats'
import AbroadHero from './components/AbroadHero'
import BrokerProof from './components/BrokerProof'
import FaqSection from './components/FaqSection'
import TrustRow from './components/TrustRow'

/**
 * /flytta-utomlands. Hubben som landssidorna hänger under.
 *
 * Sektionsordningen kommer från artboarden "Flytta utomlands" i Paper: löfte,
 * trygghet, förtroende, process, destinationer, tider, pris, ansvar, frågor.
 * Turordningen är inte godtycklig, den följer frågorna folk ställer i tur och
 * ordning när de ringer.
 */

const sectionHeading = 'text-[28px] md:text-[38px] font-bold leading-tight text-[var(--color-secondary-dark)]'
const sectionBody = 'mt-4 max-w-[620px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75'
const eyebrow = 'text-xs font-semibold uppercase tracking-[0.18em]'

const AbroadHub = () => (
  <>
    <AbroadHero
      eyebrow={ABROAD_HERO.eyebrow}
      headline={ABROAD_HERO.headline}
      body={ABROAD_HERO.body}
      bullets={ABROAD_HERO.bullets}
      stats={[
        { value: '230 000+', label: 'personer har flyttat med oss' },
        { value: String(GOOGLE_RATING).replace('.', ','), label: 'betyg på Google' },
      ]}
    />

    <TrustRow />

    {/* Varför Flyttsmart. Ligger tidigt, före allt annat vi vill berätta, för
        det är den fråga besökaren faktiskt har: varför just er? */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
        <h2 className={sectionHeading}>{ABROAD_WHY.headline}</h2>
        <p className={sectionBody}>{ABROAD_WHY.body}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ABROAD_WHY.options.map((option) => {
            const ours = 'ours' in option && option.ours
            return (
              <div
                key={option.label}
                className={`rounded-[var(--radius-border-radius-main)] p-7 ${
                  ours ? 'bg-[var(--color-secondary-dark)]' : 'border border-[var(--color-inactive-main)] bg-white'
                }`}
              >
                <p className={`${eyebrow} ${ours ? 'text-[var(--color-primary-main)]' : 'text-[var(--color-inactive-dark)]'}`}>{option.cost}</p>
                <h3 className={`mt-3 text-xl font-bold ${ours ? 'text-white' : 'text-[var(--color-secondary-dark)]'}`}>{option.label}</h3>
                <p className={`mt-4 text-[15px] leading-[24px] ${ours ? 'text-white/70' : 'text-[var(--color-inactive-dark)]'}`}>{option.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>

    <BrokerProof />

    {/* Så går det till */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
        <h2 className={sectionHeading}>Så går det till</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {ABROAD_STEPS.map((step, index) => (
            <div key={step.step} className={`border-t pt-6 ${index === 0 ? 'border-[var(--color-secondary-dark)]' : 'border-[var(--color-inactive-main)]'}`}>
              <p className={`${eyebrow} text-[var(--color-inactive-dark)]`}>{step.step}</p>
              <h3 className="mt-3 text-xl font-bold text-[var(--color-secondary-dark)]">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-[24px] text-[var(--color-inactive-dark)]">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Destinationerna. Det här är hubbens viktigaste block: härifrån går
        länkarna vidare till varje landssida.

        bg-white! med utropstecken: styles/_reset.css sätter background-color:
        transparent på a utan cascade layer, och olagrad CSS slår Tailwinds
        @layer utilities. Utan important blir varje länkkort genomskinligt.
        Ta inte bort utropstecknen. */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 pb-16 md:pb-24">
        <h2 className={sectionHeading}>Hit kör vi regelbundet</h2>
        <p className={sectionBody}>
          Ligger din flytt på en sträcka vi redan kör blir den billigare, för då delar du lastutrymme med någon annan. Saknas ditt land löser vi det ändå.
        </p>

        <ul className="mt-8 flex flex-wrap gap-3">
          {COUNTRIES.map((country) => (
            <li key={country.slug}>
              <NextLink
                href={`/flytta-utomlands/${country.slug}`}
                className="group flex min-h-11 items-center gap-3 rounded-[var(--radius-border-radius-small)] border border-[var(--color-inactive-main)] bg-white! px-5 py-3 transition-colors duration-200 ease-[var(--ease-standard)] hover:border-[var(--color-secondary-main)]"
              >
                <span className="text-[15px] font-bold text-[var(--color-secondary-dark)]">{country.name}</span>
                <span className="text-[15px] text-[var(--color-inactive-dark)]">{country.cities.join(', ')}</span>
                <span className="text-[var(--color-primary-main)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden>
                  →
                </span>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Transporttider */}
    <section className="bg-[var(--color-background-default)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
        <h2 className={sectionHeading}>Så lång tid tar det</h2>
        <p className={sectionBody}>
          Med samlast, räknat från upphämtning. Direktkörning går fortare och kostar mer. Du får ett datumfönster innan du bokar, inte ett &quot;vi hör av oss&quot;.
        </p>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSIT_GRID.map((row) => (
            <li key={row.slug}>
              <NextLink
                href={`/flytta-utomlands/${row.slug}`}
                className="flex min-h-14 items-center justify-between gap-4 rounded-[var(--radius-border-radius-small)] bg-white! px-5 py-4 transition-shadow duration-200 hover:shadow-[var(--shadow-regular)]"
              >
                <span className="text-[15px] font-bold text-[var(--color-secondary-dark)]">{row.name}</span>
                <span className="text-[15px] font-semibold text-[var(--color-primary-dark)]">{row.transitDays}</span>
              </NextLink>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* Prisankaret */}
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="max-w-[560px]">
            <h2 className={sectionHeading}>{PRICE_ANCHOR.headline}</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[var(--color-secondary-main)]/80">{PRICE_ANCHOR.body}</p>

            {/* Marknadsspann, tydligt märkta som sådana. Tomma prisrutor gör
                att besökaren gissar, och gissningen är alltid för hög. */}
            <dl className="mt-7 divide-y divide-[var(--color-inactive-main)] border-y border-[var(--color-inactive-main)]">
              {PRICE_ANCHOR.bands.map((band) => (
                <div key={band.route} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5">
                  <dt className="text-[15px] font-bold text-[var(--color-secondary-dark)]">{band.route}</dt>
                  <dd className="text-[15px] text-[var(--color-secondary-main)]">
                    {band.small}
                    <span className="mx-2 text-[var(--color-inactive-grey-light)]">/</span>
                    {band.large}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[13px] leading-[22px] text-[var(--color-inactive-dark)]">{PRICE_ANCHOR.bandNote}</p>

            <p className="mt-6 rounded-[var(--radius-border-radius-small)] bg-[var(--color-primary-extra-light)] p-5 text-[15px] leading-[24px] text-[var(--color-secondary-dark)]">
              {PRICE_ANCHOR.lever}
            </p>

            <p className="mt-5 text-[13px] leading-[22px] text-[var(--color-inactive-dark)]">{PRICE_ANCHOR.note}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
            <div>
              <div className="h-0.5 w-full bg-[var(--color-primary-main)]" />
              <p className={`${eyebrow} mt-4 text-[var(--color-primary-dark)]`}>Ingår i priset</p>
              <ul className="mt-4 space-y-2.5">
                {PRICE_ANCHOR.included.map((item) => (
                  <li key={item} className="text-[15px] text-[var(--color-secondary-main)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="h-0.5 w-full bg-[var(--color-accent-main)]" />
              <p className={`${eyebrow} mt-4 text-[var(--color-inactive-dark)]`}>Kostar extra</p>
              <ul className="mt-4 space-y-2.5">
                {PRICE_ANCHOR.extra.map((item) => (
                  <li key={item} className="text-[15px] text-[var(--color-secondary-main)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Ansvarsfördelningen */}
    <section className="bg-[var(--color-secondary-extra-extra-light)]">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
        <h2 className={sectionHeading}>{ABROAD_RESPONSIBILITY.headline}</h2>
        <p className={sectionBody}>{ABROAD_RESPONSIBILITY.body}</p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ABROAD_RESPONSIBILITY.columns.map((column) => (
            <div
              key={column.label}
              className={`rounded-[var(--radius-border-radius-main)] p-7 ${'dark' in column && column.dark ? 'bg-[var(--color-secondary-dark)]' : 'bg-white'}`}
            >
              <p className={`${eyebrow} ${'dark' in column && column.dark ? 'text-[var(--color-primary-main)]' : 'text-[var(--color-inactive-dark)]'}`}>{column.label}</p>
              <ul className="mt-5 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item} className={`text-[15px] ${'dark' in column && column.dark ? 'text-white' : 'text-[var(--color-secondary-main)]'}`}>
                    {item}
                  </li>
                ))}
              </ul>
              {'footnote' in column && column.footnote && (
                <p className={`mt-6 text-[15px] leading-[24px] ${'dark' in column && column.dark ? 'text-white/70' : 'text-[var(--color-inactive-dark)]'}`}>
                  {column.footnote}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    <FaqSection heading="Det folk brukar undra" items={ABROAD_FAQ} />
  </>
)

export default AbroadHub
