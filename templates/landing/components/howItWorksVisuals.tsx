import type { ReactNode } from 'react'
import { clsx } from 'clsx'

/**
 * Beskurna gränssnittsbilder till "Så funkar det". Telefonen blöder ut ur kortets
 * underkant i stället för att visas hel - poängen är skärmen, inte enheten.
 * Innehållet är ritat i 232 px logisk bredd, samma bredd som ramen ger.
 */

const StatusBar = () => (
  <div className="relative h-9 flex items-center justify-between px-4 pt-1">
    <span className="text-[10px] font-semibold text-[var(--color-secondary-main)] tracking-tight">9:41</span>
    <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[72px] h-[21px] bg-black rounded-full" />
    <div className="flex items-center gap-1 text-[var(--color-secondary-main)]">
      <svg className="w-3 h-2.5" viewBox="0 0 16 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.5" />
        <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
        <rect x="9" y="3" width="3" height="9" rx="0.5" />
        <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.35" />
      </svg>
      <svg className="w-[18px] h-2.5" viewBox="0 0 25 12" fill="none">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.45" />
        <rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor" />
        <path d="M23 4v4c1-.3 1.7-1 1.7-2S24 4.3 23 4z" fill="currentColor" opacity="0.45" />
      </svg>
    </div>
  </div>
)

const PhoneCrop = ({ children }: { children: ReactNode }) => (
  <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[248px]">
    <div className="rounded-t-[34px] bg-[#1a1a1a] px-[8px] pt-[8px] shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
      <div className="rounded-t-[28px] overflow-hidden bg-[var(--color-background-default)] h-[236px]">
        <StatusBar />
        <div className="px-2.5 pt-1">{children}</div>
      </div>
    </div>
  </div>
)

/** 01 - den personliga tidslinjen: har varit, ar nu, kommer sen */
export const ChecklistVisual = () => (
  <PhoneCrop>
    <div className="flex items-baseline justify-between mb-3 px-0.5">
      <p className="text-[11px] font-bold text-[var(--color-secondary-main)]">Din flytt</p>
      <p className="text-[9px] text-[var(--color-secondary-main)]/45">Inflytt 14 sep</p>
    </div>
    <ol className="relative">
      <span className="absolute left-[8px] top-2 bottom-2 w-px bg-[var(--color-secondary-main)]/12" />
      {[
        { label: 'Elavtal tecknat', state: 'done' },
        { label: 'Bredband inkopplat', state: 'done' },
        { label: 'Boka flyttstäd', state: 'now' },
        { label: 'Adressändring', state: 'next' },
        { label: 'Försäkring flyttas', state: 'next' },
      ].map((step) => (
        <li key={step.label} className="relative flex items-center gap-3 mb-2 pl-0">
          {step.state === 'done' ? (
            <span className="relative z-10 w-[17px] h-[17px] rounded-full bg-[var(--color-primary-main)] flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ) : (
            <span
              className={clsx(
                'relative z-10 w-[17px] h-[17px] rounded-full flex-shrink-0 bg-[var(--color-background-default)]',
                step.state === 'now'
                  ? 'border-[3px] border-[var(--color-primary-main)]'
                  : 'border-2 border-[var(--color-secondary-main)]/15'
              )}
            />
          )}
          <span
            className={clsx(
              'flex-1 rounded-lg px-3 py-2.5 text-[11px] leading-tight',
              step.state === 'now'
                ? 'bg-white font-bold text-[var(--color-secondary-main)] shadow-[0_2px_8px_rgba(0,0,0,0.07)]'
                : step.state === 'done'
                  ? 'bg-white/70 font-medium text-[var(--color-secondary-main)]/55'
                  : 'bg-white/70 font-medium text-[var(--color-secondary-main)]/55'
            )}
          >
            {step.label}
            {step.state === 'now' && (
              <span className="block text-[9px] font-medium text-[var(--color-primary-main)] mt-0.5">Här är du nu</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  </PhoneCrop>
)

/** 02 - ett rekommenderat val, med skälet utskrivet */
export const RecommendationVisual = () => (
  <PhoneCrop>
    <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-[var(--color-primary-main)] bg-[var(--color-primary-main)]/12 rounded px-2 py-1 mb-2">
      Vi rekommenderar
    </span>
    <div className="bg-white rounded-lg px-3 py-3 mb-2 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-[var(--color-primary-main)]/30">
      <p className="text-[11px] font-bold text-[var(--color-secondary-main)] mb-0.5">Rörligt elpris</p>
      <p className="text-[9px] text-[var(--color-secondary-main)]/45 mb-2.5">Ingen bindningstid</p>
      <div className="flex items-baseline gap-1">
        <span className="text-[9px] text-[var(--color-secondary-main)]/45">Din kostnad</span>
        <span className="text-[17px] font-bold text-[var(--color-secondary-main)] leading-none">412</span>
        <span className="text-[10px] text-[var(--color-secondary-main)]/60">kr/mån</span>
      </div>
    </div>
    <div className="bg-white rounded-lg px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <p className="text-[9px] font-bold text-[var(--color-secondary-main)] mb-1.5">Därför just det här</p>
      {['Din bostad ligger i elområde 3', 'Lägsta månadskostnaden av 14 avtal'].map((reason) => (
        <p key={reason} className="flex items-start gap-1.5 text-[9px] text-[var(--color-secondary-main)]/60 leading-snug mb-1">
          <span className="mt-[3px] w-1 h-1 rounded-full bg-[var(--color-primary-main)] flex-shrink-0" />
          {reason}
        </p>
      ))}
    </div>
    <p className="text-center text-[9px] font-semibold text-[var(--color-secondary-main)]/45 underline underline-offset-2 mt-2.5">
      Visa fler alternativ
    </p>
  </PhoneCrop>
)

/** 03 - koordinatorn som svarar */
export const SupportVisual = () => (
  <PhoneCrop>
    <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-[var(--color-secondary-main)]/10">
      <img
        src="/images/team-nina.webp"
        alt=""
        width={28}
        height={28}
        className="w-7 h-7 rounded-full object-cover"
      />
      <div>
        <p className="text-[10px] font-bold text-[var(--color-secondary-main)] leading-tight">Nina</p>
        <p className="text-[8px] text-[var(--color-primary-main)] leading-tight">Din flyttkoordinator</p>
      </div>
    </div>
    <div className="bg-white rounded-lg rounded-tl-sm px-3 py-2.5 mb-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <p className="text-[10px] text-[var(--color-secondary-main)] leading-relaxed">
        Hej! Flyttfirman är bokad till 14 sep. Vill du att jag lägger flyttstädet samma dag?
      </p>
    </div>
    <div className="flex justify-end mb-2">
      <div className="bg-[var(--color-primary-main)] rounded-lg rounded-tr-sm px-3 py-2">
        <p className="text-[10px] text-white">Ja tack, gör det</p>
      </div>
    </div>
    <div className="bg-white rounded-lg rounded-tl-sm px-3 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <p className="text-[10px] text-[var(--color-secondary-main)] leading-relaxed">Klart. Du får en bekräftelse nu.</p>
    </div>
  </PhoneCrop>
)
