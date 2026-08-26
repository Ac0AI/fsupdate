import { ABROAD_TRUST } from '@/constants/abroad'

/**
 * Den mörka trygghetsraden direkt under heron.
 *
 * Delad mellan hubben och landssidorna med flit. Social proof ska se likadan
 * ut oavsett var besökaren landar, och en landssida som saknar den ser ut som
 * en tunnare sida än hubben även när innehållet är bättre.
 *
 * Ligger först av en anledning: det är den första invändningen efter priset.
 * Vem är det egentligen som kör?
 */
const TrustRow = () => (
  <section className="bg-[var(--color-secondary-dark)]">
    <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3 md:gap-12 md:px-8 md:py-14">
      {ABROAD_TRUST.map((item) => (
        <div key={item.title}>
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
              <path
                d="M10 2.5L16.25 5v4.5c0 3.9-2.6 6.9-6.25 8.25C6.35 16.4 3.75 13.4 3.75 9.5V5L10 2.5z"
                stroke="var(--color-primary-main)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path d="M7.5 10l1.8 1.8L13 8" stroke="var(--color-primary-main)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-[17px] font-bold text-white">{item.title}</h2>
          </div>
          <p className="mt-3 text-[15px] leading-[24px] text-white/70">{item.body}</p>
        </div>
      ))}
    </div>
  </section>
)

export default TrustRow
