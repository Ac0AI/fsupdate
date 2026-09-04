import Image from 'next/image'
import { FORTUM_DISCOUNT_SEK } from '@/constants/trustStats'
import LogoMarquee from './LogoMarquee'

/**
 * Leverantörerna vi förhandlat med. Egen remsa här, aldrig i bevisblocket:
 * den rubriken säger mäklarkedjor (Sebastian 2026-09-03).
 *
 * Ordningen är el, bredband, tv och försäkring, så remsan läser som tjänsterna.
 *
 * Logotyperna är Flyttsmarts egna, hämtade från företagets ImageKit 2026-09-04
 * och sparade lokalt: en marknadsföringssida ska inte vara beroende av ett
 * externt CDN mitt i sidan. Telia låg som SVG med en inbäddad base64-bild på
 * 164 kB, den ligger som 4,6 kB webp i stället.
 */
const SUPPLIER_LOGOS = [
  { src: '/images/suppliers/fortum.svg', alt: 'Fortum' },
  { src: '/images/suppliers/vattenfall.svg', alt: 'Vattenfall' },
  { src: '/images/suppliers/skekraft.svg', alt: 'Skellefteå Kraft' },
  { src: '/images/suppliers/tibber-crop.svg', alt: 'Tibber' },
  { src: '/images/suppliers/telia.webp', alt: 'Telia' },
  { src: '/images/suppliers/telenor.svg', alt: 'Telenor' },
  { src: '/images/suppliers/tele2.svg', alt: 'Tele2' },
  { src: '/images/Bredbandsval.svg', alt: 'Bredbandsval' },
  { src: '/images/suppliers/allente.svg', alt: 'Allente' },
  { src: '/images/hedvig_logotype_black.png', alt: 'Hedvig' },
]

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

        {/* Kortet är ett exempel, inte hela erbjudandet (ägaren 2026-09-04).
            Utan den etiketten läses Fortum-rabatten som det enda vi har
            förhandlat fram. Raden står ovanför kortet så den syns före talet,
            och kortets brödtext upprepar därför inte "bara på Flyttsmart". */}
        <div>
          <p className="mb-3 text-[13px] font-semibold text-[var(--color-secondary-main)]/60">
            Exempel på erbjudande som finns bara på Flyttsmart
          </p>
          <div className="rounded-2xl border border-[#E1E7EE] bg-[var(--color-background-default)] p-7 md:p-9 flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary-main)]/60">Elavtal</span>
              <Image src="/images/fortum-logo-240.webp" alt="Fortum" width={120} height={42} className="h-9 w-auto" />
            </div>
            <p className="text-[40px] md:text-[48px] font-bold leading-none text-[var(--color-secondary-main)]">
              {FORTUM_DISCOUNT_SEK}&nbsp;kr rabatt
            </p>
            <p className="text-base text-[var(--color-secondary-main)]/80 leading-relaxed">På elavtalet hos Fortum.</p>
          </div>
        </div>
      </div>

      {/* Loggorna i färg, inte gråskala: poängen är att varumärkena känns igen. */}
      <div className="mt-14 md:mt-20">
        <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-secondary-main)]/60">
          Trygga partnerskap från bland annat
        </p>
        <div className="mt-6">
          <LogoMarquee
            logos={SUPPLIER_LOGOS}
            slotClassName="h-8 w-[150px] md:w-[180px]"
            imageClassName="max-h-full max-w-[110px] md:max-w-[130px] object-contain"
          />
        </div>
      </div>
    </div>
  </section>
)

export default Negotiated
