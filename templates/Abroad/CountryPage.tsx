import NextLink from 'next/link'
import { COUNTRIES, SHARED_FAQ, type Country } from '@/constants/abroad'
import { GOOGLE_RATING } from '@/constants/trustStats'
import AbroadHero from './components/AbroadHero'
import BrokerProof from './components/BrokerProof'
import FaqSection from './components/FaqSection'
import TrustRow from './components/TrustRow'

/**
 * Mallen för /flytta-utomlands/[land]. En sida per land.
 *
 * Kraven kommer från artboarden "Sidstruktur och sök" i Paper. Saknas något av
 * det här blir sidan inte citerad av AI-sök:
 *
 *  - köpfrågan som H1, ordagrant som folk söker
 *  - kort svar högst upp, tre till fem meningar med siffror
 *  - metodrad med datum: var uppgifterna kommer från och när de stämde
 *  - jämförelsetabell för transportsätten, med en tydlig rekommendation
 *  - FAQ där de landsspecifika frågorna kommer först
 *  - schema: Service, FAQPage och BreadcrumbList (ligger i page.tsx)
 */

const sectionHeading = 'text-[28px] md:text-[38px] font-bold leading-tight text-[var(--color-secondary-dark)]'

interface Props {
  country: Country
}

const CountryPage = ({ country }: Props) => {
  const related = COUNTRIES.filter((item) => item.slug !== country.slug)

  return (
    <>
      <AbroadHero
        eyebrow={country.name}
        breadcrumb={{ label: 'Flytta utomlands', href: '/flytta-utomlands' }}
        headline={[`Flytta till ${country.name}`, 'från Sverige']}
        body={country.intro}
        bullets={country.bullets}
        country={country.name}
        /* Landsfakta först, sedan samma två bevistal som hubben. Kommentar i
           Paper 2026-08-26: siffrorna ska finnas här också. Landsfakta ligger
           kvar eftersom de är hela skälet till att sidan finns. */
        stats={[
          { value: country.transitDays, label: country.transitNote },
          { value: country.customsLabel, label: country.customsNote },
          { value: '230 000+', label: 'personer har flyttat med oss' },
          { value: String(GOOGLE_RATING).replace('.', ','), label: 'betyg på Google' },
        ]}
      />

      <TrustRow />

      {/* Kort svar. Ligger högst upp av en anledning: det är den här biten en
          språkmodell lyfter ordagrant. */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
          <div className="max-w-[818px] border-l-2 border-[var(--color-primary-main)] pl-6 md:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">Kort svar</p>
            <p className="mt-5 text-[20px] md:text-[24px] leading-[34px] text-[var(--color-secondary-dark)]">{country.quickAnswer}</p>
            <p className="mt-6 text-[13px] leading-[22px] text-[var(--color-inactive-dark)]">
              Uppgifterna bygger på Flyttsmarts egna avgångar till {country.name}. Senast uppdaterad {country.updated}.
            </p>
          </div>
        </div>
      </section>

      {/* Jämförelsetabellen */}
      <section className="bg-[var(--color-background-default)]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
          <h2 className={sectionHeading}>Tre sätt att komma till {country.name}</h2>
          <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75">
            Vi rekommenderar samlast till nio av tio kunder. Direktbil är värt pengarna bara när datumet är låst.
          </p>

          <div className="mt-8 overflow-x-auto rounded-[var(--radius-border-radius-main)]">
            <table className="w-full min-w-[720px] border-collapse bg-white text-left">
              <thead>
                <tr className="bg-[var(--color-secondary-dark)] text-white">
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                    Transportsätt
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                    Tid
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                    Relativt pris
                  </th>
                  <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em]">
                    Passar dig som
                  </th>
                </tr>
              </thead>
              <tbody>
                {country.transport.map((option, index) => (
                  <tr key={option.name} className={index === 0 ? '' : 'border-t border-[var(--color-inactive-main)]'}>
                    <th scope="row" className="px-6 py-5 align-top font-normal">
                      <span className="block text-[15px] font-bold text-[var(--color-secondary-dark)]">{option.name}</span>
                      <span
                        className={`mt-1 block text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          option.recommended ? 'text-[var(--color-primary-dark)]' : 'text-[var(--color-inactive-dark)]'
                        }`}
                      >
                        {option.note}
                      </span>
                    </th>
                    <td className="px-6 py-5 align-top text-[15px] text-[var(--color-secondary-main)]">{option.days}</td>
                    <td className="px-6 py-5 align-top text-[15px] text-[var(--color-secondary-main)]">{option.price}</td>
                    <td className="px-6 py-5 align-top text-[15px] leading-[24px] text-[var(--color-secondary-main)]">{option.fits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <BrokerProof />

      {/* Orterna med fast avgång */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 pb-16 md:pb-24">
          <h2 className={sectionHeading}>Hit i {country.name} har vi fast avgång</h2>
          <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75">
            Ligger din adress på en av de här sträckorna får du samlast och kortare väntan. Andra orter löser vi också, med något längre framförhållning.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {country.cities.map((city) => (
              <li
                key={city}
                className="flex min-h-11 items-center rounded-[var(--radius-border-radius-small)] border border-[var(--color-inactive-main)] px-5 text-[15px] font-semibold text-[var(--color-secondary-dark)]"
              >
                {city}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection heading={`Frågor om ${country.name}`} items={[...country.faq, ...SHARED_FAQ]} />

      {/* Vidare till övriga landssidor. Håller ihop hubben internt. */}
      <section className="bg-[var(--color-background-default)]">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-14 md:py-20">
          <h2 className="text-xl font-bold text-[var(--color-secondary-dark)]">Andra länder vi kör till</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {related.map((item) => (
              <li key={item.slug}>
                <NextLink
                  href={`/flytta-utomlands/${item.slug}`}
                  className="flex min-h-11 items-center gap-3 rounded-[var(--radius-border-radius-small)] bg-white! px-5 py-3 transition-shadow duration-200 hover:shadow-[var(--shadow-regular)]"
                >
                  <span className="text-[15px] font-bold text-[var(--color-secondary-dark)]">{item.name}</span>
                  <span className="text-[15px] text-[var(--color-inactive-dark)]">{item.transitDays}</span>
                </NextLink>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] text-[var(--color-inactive-dark)]">
            <NextLink href="/flytta-utomlands" className="font-semibold text-[var(--color-secondary-main)] underline underline-offset-4 hover:text-[var(--color-primary-main)]">
              Tillbaka till Flytta utomlands
            </NextLink>
          </p>
        </div>
      </section>
    </>
  )
}

export default CountryPage
