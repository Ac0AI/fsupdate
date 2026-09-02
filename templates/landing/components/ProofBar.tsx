import { PROOF_BLOCK } from '@/constants/trustStats'
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

          <div className="lg:pb-2">
            <p className="text-lg text-white/75 leading-relaxed max-w-[520px]">
              {PROOF_BLOCK.body}
            </p>
            <p className="text-lg text-white font-medium leading-relaxed max-w-[520px] mt-4">
              {PROOF_BLOCK.numbers}
            </p>
          </div>
        </div>

        {/* Mäklarlogotyperna, statiska, bredvid påståendet de bevisar. Ljus remsa eftersom flera logotyper är opaka. */}
        <div className="rounded-2xl bg-white px-6 py-5 md:py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {partnerLogos.slice(0, 8).map((logo) => (
            <span key={logo.src} className="h-8 md:h-9 w-[110px] md:w-[130px] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProofBar
