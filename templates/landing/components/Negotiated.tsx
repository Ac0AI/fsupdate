import Image from 'next/image'
import { FORTUM_DISCOUNT_SEK } from '@/constants/trustStats'

/**
 * Beviset för att förhandlingen redan är gjord (Sebastian 2026-09-03: inte en
 * logovägg, lyft ett starkt varumärke och visa rabatten). Bara erbjudanden med
 * skriftlig täckning får stå här; siffran och ägaren står i constants/trustStats.
 */
const Negotiated = () => (
  <section id="forhandlat" aria-labelledby="negotiated-heading" className="py-16 md:py-24 bg-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
        <div className="max-w-[560px]">
          <span className="inline-block text-[var(--color-primary-main)] text-sm font-semibold uppercase tracking-wider mb-4">
            Förhandlat i förväg
          </span>
          <h2 id="negotiated-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary-main)] mb-5 leading-[1.08]">
            Priserna är redan förhandlade när du loggar in
          </h2>
          <p className="text-lg text-[var(--color-secondary-main)]/80 leading-relaxed">
            Vi förhandlar med leverantörerna för alla som flyttar med oss. Erbjudandena ligger som förslag i din checklista, och du godkänner det du vill ha.
          </p>
        </div>

        <div className="rounded-2xl border border-[#E1E7EE] bg-[var(--color-background-default)] p-7 md:p-9 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary-main)]/60">Elavtal</span>
            <Image src="/images/fortum-logo-240.webp" alt="Fortum" width={120} height={42} className="h-9 w-auto" />
          </div>
          <p className="text-[40px] md:text-[48px] font-bold leading-none text-[var(--color-secondary-main)]">
            {FORTUM_DISCOUNT_SEK}&nbsp;kr rabatt
          </p>
          <p className="text-base text-[var(--color-secondary-main)]/80 leading-relaxed">
            På elavtalet hos Fortum. Erbjudandet finns bara på Flyttsmart.
          </p>
        </div>
      </div>
    </div>
  </section>
)

export default Negotiated
