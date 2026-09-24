import Image from 'next/image'
import { FORTUM_DISCOUNT_SEK } from '@/constants/trustStats'
import LogoMarquee from './LogoMarquee'
import { supplierLogos } from './supplierLogos'

const SUPPLIER_POINTS = [
  { title: 'Noga utvalda', text: 'Vi samarbetar bara med leverantörer som klarar våra krav på kvalitet och service.' },
  { title: 'Trygghet hela vägen', text: 'Vi står själva bakom tjänsterna. Om något går fel är det vi som löser det.' },
  { title: 'Förhandlade priser', text: 'Du får priser som vi redan har förhandlat fram, och de ligger klara i din checklista.' },
  { title: 'Allt på ett ställe', text: 'Flytt, städ, el, bredband, försäkring och mycket mer samlas i en och samma lista. Du väljer själv vad du vill ha.' },
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
            Handplockade leverantörer
          </span>
          <h2 id="negotiated-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary-main)] mb-5 leading-[1.08]">
            Vi har valt ut de bästa, så du slipper
          </h2>
          <p className="text-lg text-[var(--color-secondary-main)]/80 leading-relaxed">
            Vi har gått igenom marknaden och valt de leverantörer i Sverige som levererar bäst på kvalitet, service och pris. Du får en trygg, enkel och prisvärd flytt utan att behöva jämföra själv.
          </p>
          <ul className="mt-7 flex flex-col gap-4">
            {SUPPLIER_POINTS.map(({ title, text }) => (
              <li key={title} className="flex gap-3.5">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-main)]" />
                <p className="text-base leading-relaxed text-[var(--color-secondary-main)]/80">
                  <strong className="font-bold text-[var(--color-secondary-main)]">{title}.</strong> {text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Kortet är ett exempel, inte hela erbjudandet (ägaren 2026-09-04).
            Utan den etiketten läses Fortum-rabatten som det enda vi har
            förhandlat fram. Raden står ovanför kortet så den syns före talet,
            och kortets brödtext upprepar därför inte "bara på Flyttsmart". */}
        <div>
          <p className="mb-3 text-[13px] font-semibold text-[var(--color-secondary-main)]/60">
            Exempel på erbjudande som finns exklusivt hos Flyttsmart
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
            logos={supplierLogos}
            slotClassName="h-8 w-[150px] md:w-[180px]"
            imageClassName="max-h-full max-w-[110px] md:max-w-[130px] object-contain"
          />
        </div>
      </div>
    </div>
  </section>
)

export default Negotiated
