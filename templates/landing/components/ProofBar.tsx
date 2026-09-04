import { PROOF_BLOCK } from '@/constants/trustStats'
import LogoMarquee from './LogoMarquee'
import { partnerLogos } from './partnerLogos'

const ProofBar = () => {
  return (
    <section
      aria-labelledby="proof-bar-heading"
      className="w-screen bg-[var(--color-secondary-dark)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-24 flex flex-col gap-10 md:gap-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-end">
          <div>
            <p className="text-[var(--color-primary-main)] text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-4">
              {PROOF_BLOCK.eyebrow}
            </p>
            <h2
              id="proof-bar-heading"
              className="text-white font-bold leading-[1.08] text-[38px] md:text-[52px] lg:text-[56px]"
            >
              {PROOF_BLOCK.claim}
            </h2>
          </div>

          {/* Bara det verifierade talet bredvid rubriken. Leverantörsmeningen togs
              bort härifrån 2026-09-04: mäklarytan ska bara tala om mäklarna. */}
          <div className="lg:pb-3">
            <p className="text-xl md:text-2xl text-white font-medium leading-snug max-w-[520px]">
              {PROOF_BLOCK.numbers}
            </p>
          </div>
        </div>

        {/* Mäklarlogotyperna som en lugn marquee: lika höga slots, tonade
            kanter, enfärgade så att ingen logotyp skriker. Vit remsa eftersom
            flera är opaka. Rullningen och bildladdningen bor i LogoMarquee. */}
        <div className="rounded-2xl bg-white py-6 overflow-hidden">
          <LogoMarquee logos={partnerLogos} imageClassName="max-h-full max-w-[112px] md:max-w-[128px] object-contain grayscale opacity-80" />
        </div>
      </div>
    </section>
  )
}

export default ProofBar
