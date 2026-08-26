'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

/**
 * Offertformuläret i heron på /flytta-utomlands och landssidorna.
 *
 * OBS: formuläret skickar ingenstans än. Det finns ingen endpoint för
 * utlandsleads, så submit visar en kvittensvy lokalt i webbläsaren. Innan
 * sidorna går skarpt ska det kopplas mot samma flöde som resten av
 * förfrågningarna, annars tappar vi leads i tysthet.
 */

const PROMISES = [
  'Svar från en koordinator inom en arbetsdag',
  'Fast pris med tull och försäkring inräknat',
  'Din förfrågan stannar hos oss, vi säljer den aldrig vidare',
]

const VOLUMES = ['Helt bohag', 'Mindre lass', 'Pall eller paket']
const SIZES = ['1–2 rum', '3–4 rum', '5+ rum']

const labelClass = 'block text-[13px] font-semibold text-[var(--color-secondary-main)] mb-2'

const inputClass = clsx(
  'w-full h-12 px-4 rounded-[var(--radius-border-radius-small)]',
  'border border-[var(--color-inactive-main)] bg-white',
  'text-base text-[var(--color-secondary-main)] placeholder:text-[var(--color-inactive-grey-light)]',
  'outline-none transition-colors duration-200',
  'focus:border-[var(--color-primary-main)] focus:ring-2 focus:ring-[var(--color-primary-border)]'
)

const chipClass = (active: boolean) =>
  clsx(
    // 13px på mobil: kortet är ~340px brett där och tre kolumner ryms inte i 14px
    // utan att varje etikett bryts på tre rader.
    'min-h-11 px-1.5 py-2 rounded-[var(--radius-border-radius-small)] border text-[13px] sm:text-sm font-semibold leading-tight',
    'transition-colors duration-200 ease-[var(--ease-standard)]',
    active
      ? 'bg-[var(--color-secondary-main)] border-[var(--color-secondary-main)] text-white'
      : 'bg-white border-[var(--color-inactive-main)] text-[var(--color-secondary-main)] hover:border-[var(--color-secondary-main)]'
  )

interface Props {
  /** Landsnamnet i rubriken och i Till-fältet. Utelämnas på hubben. */
  country?: string
}

const QuoteForm = ({ country }: Props) => {
  const [volume, setVolume] = useState(VOLUMES[0])
  const [size, setSize] = useState(SIZES[0])
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="w-full max-w-[480px] rounded-[var(--radius-border-radius-main)] bg-white p-8 shadow-[0_24px_48px_rgba(1,22,39,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary-dark)]">Tack</p>
        <h2 className="mt-3 text-2xl font-bold text-[var(--color-secondary-main)]">Vi hör av oss inom en arbetsdag</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-inactive-dark)]">
          En koordinator går igenom sträckan och återkommer med ett upplägg och ett pris. Har du bråttom når du oss på 08-12 00 88 22.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSent(false)}
            className="text-sm font-semibold text-[var(--color-secondary-main)] underline underline-offset-4 hover:text-[var(--color-primary-main)]"
          >
            Räkna på en till flytt
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSent(true)
      }}
      className="w-full max-w-[480px] rounded-[var(--radius-border-radius-main)] bg-white p-6 md:p-8 shadow-[0_24px_48px_rgba(1,22,39,0.12)]"
    >
      <h2 className="text-2xl font-bold text-[var(--color-secondary-main)]">{country ? `Få pris på din flytt till ${country}` : 'Få pris på din flytt'}</h2>
      <p className="mt-2 text-[13px] leading-[20px] text-[var(--color-inactive-dark)]">
        Ett pris från oss, inte sex offerter att jämföra. Tar under en minut, och du behöver inte veta detaljerna än.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="quote-from">
            Från
          </label>
          <input id="quote-from" name="from" className={inputClass} placeholder="Stockholm" autoComplete="address-level2" />
        </div>
        <div>
          <label className={labelClass} htmlFor="quote-to">
            Till
          </label>
          <input id="quote-to" name="to" className={inputClass} placeholder={country ?? 'Land eller stad'} defaultValue={country ?? ''} />
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className={labelClass}>Vad ska flyttas?</legend>
        <div className="grid grid-cols-3 gap-2">
          {VOLUMES.map((option) => (
            <button key={option} type="button" aria-pressed={volume === option} onClick={() => setVolume(option)} className={chipClass(volume === option)}>
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className={labelClass}>Hur stor bostad?</legend>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((option) => (
            <button key={option} type="button" aria-pressed={size === option} onClick={() => setSize(option)} className={chipClass(size === option)}>
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="quote-when">
            Ungefär när
          </label>
          <input id="quote-when" name="when" className={inputClass} placeholder="Oktober 2026" />
        </div>
        <div>
          <label className={labelClass} htmlFor="quote-email">
            E-post
          </label>
          <input id="quote-email" name="email" type="email" required className={inputClass} placeholder="du@exempel.se" autoComplete="email" />
        </div>
      </div>

      {/* Marginalen ligger på wrappern, inte på knappen. styles/_reset.css sätter
          margin:0 på button utan cascade layer, och olagrad CSS slår Tailwinds
          @layer utilities oavsett specificitet. mt-* direkt på en <button> gör
          alltså ingenting i det här repot. */}
      <div className="mt-7">
        <button
          type="submit"
          className={clsx(
            'w-full min-h-14 rounded-[var(--radius-border-radius-main)]',
            'bg-[var(--color-accent-main)] text-base font-bold text-[var(--color-inactive-super-dark)]',
            'transition-transform duration-200 ease-[var(--ease-standard)]',
            'hover:brightness-105 active:scale-[0.99]'
          )}
        >
          Få mitt pris
        </button>
      </div>

      {/* Det här är hela anledningen att fylla i formuläret. Står det inte
          utskrivet gissar besökaren, och gissningen är sex säljsamtal. */}
      <ul className="mt-5 space-y-2">
        {PROMISES.map((promise) => (
          <li key={promise} className="flex gap-2.5 text-[13px] leading-[20px] text-[var(--color-inactive-dark)]">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden className="mt-[3px] shrink-0">
              <circle cx="9" cy="9" r="9" fill="var(--color-primary-main)" />
              <path d="M5 9.2L7.7 11.8L13 6.6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{promise}</span>
          </li>
        ))}
      </ul>
    </form>
  )
}

export default QuoteForm
