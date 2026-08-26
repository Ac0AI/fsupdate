import { ABROAD_BROKERS } from '@/constants/abroad'

/**
 * Mäklarsektionen. Delad mellan hubben och landssidorna, av samma skäl som
 * [TrustRow]: social proof ska se likadan ut överallt.
 *
 * Bara logotyperna. Omdömena och presslistan i Paper står som platshållare och
 * läggs till när vi har riktiga utlandsomdömen från Google.
 */
const BrokerProof = () => (
  <section className="bg-white">
    <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8 py-16 md:py-24">
      <h2 className="max-w-[760px] text-[28px] md:text-[38px] font-bold leading-tight text-[var(--color-secondary-dark)]">{ABROAD_BROKERS.headline}</h2>
      <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-[var(--color-secondary-main)]/75">{ABROAD_BROKERS.body}</p>

      <ul className="mt-10 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {ABROAD_BROKERS.logos.map((logo) => (
          <li key={logo.src} className="flex h-10 items-center justify-center lg:justify-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt={logo.alt} width={140} height={40} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default BrokerProof
