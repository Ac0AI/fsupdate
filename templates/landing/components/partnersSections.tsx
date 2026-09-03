'use client'

import Image from 'next/image'
import { coordinators } from '@/common/data/coordinators'

// Bakgrund och textfärg på länkar kräver ! : resetten nollar background-color och sätter color på <a>.
const primaryButton =
  'inline-flex items-center justify-center min-h-11 px-6 rounded-full bg-[#FFA65F]! text-[#214766]! font-bold text-[15px] hover:opacity-90 transition-opacity whitespace-nowrap'
const outlineButton =
  'inline-flex items-center justify-center min-h-11 px-6 rounded-full border-2 border-white text-white! font-bold text-[15px] hover:bg-white/10! transition-colors whitespace-nowrap'

const STATS = [
  { value: '5 000', label: 'flyttar i månaden' },
  { value: '300', label: 'mäklarkontor' },
  { value: '4,7 av 5', label: 'på Google, över 500 recensioner' },
]

// Partneransvariga. Sebastians adress finns i Mäklarhuset-mallen; Andreas nås tills vidare via leverantor@.
const CONTACTS = {
  brokers: { name: 'Sebastian Nielsen', role: 'VD', email: 'sebastian@flyttsmart.se', photo: null as string | null },
  suppliers: { name: 'Andreas Burman', role: 'Ansvarig för flytt- och städbolag', email: 'leverantor@flyttsmart.se', photo: '/images/team-andreas.webp' as string | null },
}

// ─── Hero: vad partnern får, sedan valet ─────────────────────────────────────

const PartnersIntro = () => (
  <section className="bg-[var(--color-secondary-main)] text-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-12 md:pb-16">
      <div className="max-w-[680px] mb-10">
        <h1 className="text-[32px] md:text-[44px] font-bold mb-4 leading-[1.1]">
          Dina kunder får en flyttkoordinator.
        </h1>
        <p className="text-white/80 text-lg leading-relaxed">
          Enklare för dem, och en kundupplevelse som sträcker sig bortom själva flytten. Går något fel tar vi ansvaret, inte du.
        </p>
      </div>

      {/* Tre tal med täckning: volymen från ägaren 2026-09-02, betyget från Google. */}
      <dl className="grid grid-cols-3 gap-4 md:flex md:gap-x-10 mb-10">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="text-[22px] md:text-[32px] font-bold leading-none text-[var(--color-primary-main)] whitespace-nowrap">{s.value}</dt>
            <dd className="text-sm text-white/80 mt-1.5">{s.label}</dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 flex flex-col gap-3 items-start">
          <h2 className="text-lg font-bold text-white">Mäklare, hyresvärdar och föreningar</h2>
          <p className="text-white/70 text-sm leading-relaxed">Du möter personer som ska flytta. Vi tar hand om resten, enkelt för kunden och utan extra jobb för dig. Kostnadsfritt, vi tar betalt av leverantörerna.</p>
          <a href={`mailto:${CONTACTS.brokers.email}`} className={`mt-auto pt-2 ${primaryButton}`}>
            Mejla Sebastian
          </a>
        </div>
        <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 flex flex-col gap-3 items-start">
          <h2 className="text-lg font-bold text-white">Flyttfirmor, elbolag och andra leverantörer</h2>
          <p className="text-white/70 text-sm leading-relaxed">Vi skickar kunder som ska flytta inom några veckor. Du betalar per uppdrag.</p>
          <a href={`mailto:${CONTACTS.suppliers.email}`} className={`mt-auto pt-2 ${outlineButton}`}>
            Mejla Andreas
          </a>
        </div>
      </div>
    </div>
  </section>
)

// ─── Partnercitat ─────────────────────────────────────────────────────────────

const PARTNER_QUOTES = [
  {
    quote: 'Tillsammans skapar Valvet och Flyttsmart en trygg och smidig upplevelse hela vägen till det nya hemmet.',
    name: 'Pernilla Modig',
    role: 'Försäljningschef, Valvet',
    logo: '/images/partners/all/valvet-uag4hmg6y.png',
  },
  {
    quote: 'Notar och Flyttsmart – tillsammans skapar vi en smidigare flytt för våra kunder.',
    name: 'Nina Gustavsson',
    role: 'Vice VD, Notar',
    logo: '/images/partners/all/notar-new-4g0mb9fuo.svg',
  },
]

const PartnerQuotes = () => (
  <section className="bg-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 md:pt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] mb-8 leading-snug">Det säger de som redan samarbetar med oss</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {PARTNER_QUOTES.map((q) => (
          <figure key={q.name} className="bg-[var(--color-background-default)] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <span className="h-6 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={q.logo} alt={q.role.split(', ')[1]} loading="lazy" decoding="async" className="h-6 w-auto object-contain mix-blend-multiply" />
            </span>
            <blockquote className="text-lg md:text-xl leading-relaxed text-[var(--color-secondary-main)] flex-1">”{q.quote}”</blockquote>
            <figcaption className="flex flex-col">
              <span className="text-sm font-bold text-[var(--color-secondary-main)]">{q.name}</span>
              <span className="text-sm text-[var(--color-secondary-main)]/70">{q.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
)

// ─── Delade byggstenar ────────────────────────────────────────────────────────

// Etiketten säger vem sektionen är till, så leverantören inte läser mäklarens sida.
const SectionHeader = ({ audience, title, text }: { audience: string; title: string; text?: string }) => (
  <div className="mb-12 md:mb-16 max-w-[640px]">
    <p className="text-[#1a7a6e] text-xs font-semibold uppercase tracking-widest mb-3">{audience}</p>
    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] leading-snug text-balance">{title}</h2>
    {text && <p className="text-[var(--color-secondary-main)]/80 text-[15px] leading-relaxed mt-4">{text}</p>}
  </div>
)

// De tre som nämns i steget, med förnamn. Inte hela laget som en avatarhög.
const TEAM = ['nina-fredriksson', 'joel-berg', 'maria-karlsson']

const Coordinators = () => (
  <span className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
    {coordinators
      .filter((c) => TEAM.includes(c.id))
      .map((c) => (
        <span key={c.id} className="flex items-center gap-2">
          <Image src={`${c.imageKitPath.split('?')[0]}?tr=w-96,h-96,fo-face`} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <span className="text-sm font-semibold text-[var(--color-secondary-main)]">{c.name.split(' ')[0]}</span>
        </span>
      ))}
  </span>
)

const Steps = ({ items, cols }: { items: { title: string; description: string; people?: boolean }[]; cols: 2 | 3 }) => (
  <ol className={cols === 3 ? 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10' : 'grid grid-cols-1 sm:grid-cols-2 gap-6'}>
    {items.map((step, i) => (
      <li key={step.title} className="flex gap-4 items-start">
        <span className="text-xs font-bold text-[#1a7a6e] bg-[var(--color-primary-main)]/15 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
        <div>
          <h4 className="text-[15px] font-bold text-[var(--color-secondary-main)] mb-1">{step.title}</h4>
          <p className="text-[var(--color-secondary-main)]/80 text-sm leading-relaxed">{step.description}</p>
          {step.people && <Coordinators />}
        </div>
      </li>
    ))}
  </ol>
)

// En människa att höra av sig till, inte bara en knapp.
const Cta = ({ title, contact, label }: { title: string; contact: (typeof CONTACTS)[keyof typeof CONTACTS]; label: string }) => (
  <div className="bg-[var(--color-secondary-dark)] rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    <div className="flex flex-col gap-4">
      <h3 className="text-lg md:text-xl font-bold text-white text-balance">{title}</h3>
      <div className="flex items-center gap-3">
        {contact.photo ? (
          <Image src={contact.photo} alt="" width={44} height={44} className="w-11 h-11 rounded-full object-cover shrink-0" />
        ) : (
          <span className="w-11 h-11 rounded-full bg-[var(--color-primary-main)] text-[var(--color-secondary-main)] font-bold text-sm flex items-center justify-center shrink-0">
            {contact.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
        )}
        <span className="flex flex-col">
          <span className="text-sm font-bold text-white">{contact.name}</span>
          <span className="text-sm text-white/70">{contact.role}</span>
        </span>
      </div>
    </div>
    <a href={`mailto:${contact.email}`} className={`${primaryButton} shrink-0`}>
      {label}
    </a>
  </div>
)

// ─── Distributionspartners ────────────────────────────────────────────────────

const brokerSteps = [
  { title: 'Kunden bjuds in', description: 'Vi kopplar in oss i ditt mäklarsystem, du gör inget. Hyresvärdar och föreningar bjuder in kunden själva.' },
  { title: 'Vi tar hand om resten', description: 'Flytt, städ, el, bredband, försäkring och adressändring, samlat på ett ställe med en kontaktpunkt.' },
  { title: 'Kunden får en koordinator', description: 'Koordinatorn bokar, följer upp och svarar i chatten, på mejl och i telefon.', people: true },
]

const DistributionPartners = () => (
  <section id="distributionspartners" className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-12 md:pt-16 md:pb-16">
    <SectionHeader audience="För mäklare, hyresvärdar och föreningar" title="Du slipper frågorna om flytten. Kunden minns vem som bjöd in." />

    <div className="mb-14 md:mb-16">
      <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Så fungerar det</h3>
      <Steps items={brokerSteps} cols={3} />
    </div>

    <Cta title="Vill du erbjuda Flyttsmart till dina kunder?" contact={CONTACTS.brokers} label="Mejla Sebastian" />
  </section>
)

// ─── Leverantörer ─────────────────────────────────────────────────────────────

const vettingSteps = [
  { title: 'Ansökan granskas', description: 'F-skattsedel, försäkringar och certifieringar kontrolleras.' },
  { title: 'Referenscheck', description: 'Vi pratar med tidigare kunder och verifierar omdömen.' },
  { title: 'Provuppdrag', description: 'Du genomför ett kontrollerat uppdrag som vi följer upp.' },
  { title: 'Löpande uppföljning', description: 'Betyg samlas in efter varje uppdrag. Håller det inte tar vi bort dig.' },
]

const Suppliers = () => (
  <section id="leverantorer" className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
    <SectionHeader
      audience="För leverantörer"
      title="Nå kunder i exakt rätt ögonblick."
      text="Varje månad går 5 000 flyttar genom Flyttsmart, och de som flyttar letar efter leverantörer just nu. Vi sköter kundkontakt, fakturering och rut- och rothantering. Vi kopplar ihop er, men bara om du håller måttet."
    />

    <div className="mb-14 md:mb-16">
      <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Hur vi väljer leverantörer</h3>
      <Steps items={vettingSteps} cols={2} />
    </div>

    <Cta title="Vill du nå fler kunder?" contact={CONTACTS.suppliers} label="Mejla Andreas" />
  </section>
)

export { PartnersIntro, PartnerQuotes, DistributionPartners, Suppliers }
