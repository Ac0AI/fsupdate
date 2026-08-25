import { PROOF_BLOCK } from '@/constants/trustStats'

const ProofBar = () => {
  return (
    <section
      aria-labelledby="proof-bar-heading"
      className="w-screen bg-[var(--color-background-default)]"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 lg:items-end">
          <div>
            <p className="text-[var(--color-primary-main)] text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-4">
              {PROOF_BLOCK.eyebrow}
            </p>
            <h2
              id="proof-bar-heading"
              className="text-[var(--color-secondary-main)] font-bold leading-[1.08] text-[38px] md:text-[52px] lg:text-[56px]"
            >
              {PROOF_BLOCK.claim}
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="text-lg text-[var(--color-secondary-main)]/65 leading-relaxed max-w-[520px]">
              {PROOF_BLOCK.body}
            </p>
            <p className="text-lg text-[var(--color-secondary-main)] font-medium leading-relaxed max-w-[520px] mt-4">
              {PROOF_BLOCK.numbers}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProofBar
