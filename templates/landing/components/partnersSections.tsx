'use client'

import Image from 'next/image'
import { coordinators } from '@/common/data/coordinators'

// Bakgrund på länkar kräver ! : resetten nollar background-color på <a>.
const primaryButton =
  'inline-flex items-center justify-center min-h-11 px-6 rounded-full bg-[var(--color-primary-main)]! text-[var(--color-secondary-main)] font-bold text-[15px] hover:opacity-90 transition-opacity whitespace-nowrap'
const outlineButton =
  'inline-flex items-center justify-center min-h-11 px-6 rounded-full border-2 border-white text-white font-bold text-[15px] hover:bg-white/10! transition-colors whitespace-nowrap'

// ─── Hero: vad partnern får, sedan valet ─────────────────────────────────────

const PartnersIntro = () => (
  <section className="bg-[var(--color-secondary-main)] text-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-12 md:pb-16">
      <div className="max-w-[680px] mb-10">
        <h1 className="text-[32px] md:text-[44px] font-bold mb-4 leading-[1.1] text-balance">Dina kunder får en flyttkoordinator. Du står som avsändare.</h1>
        <p className="text-white/80 text-lg leading-relaxed">
          Kunden får en namngiven koordinator. Går något fel tar vi ansvaret, inte du.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 flex flex-col gap-3 items-start">
          <h2 className="text-lg font-bold text-white">Mäklare, hyresvärdar och föreningar</h2>
          <p className="text-white/70 text-sm leading-relaxed">Du möter personer som ska flytta. Vi tar hand om resten och du syns som avsändare genom hela flytten. Kostnadsfritt, vi tar betalt av leverantörerna.</p>
          <a href="#distributionspartners" className={`mt-2 ${primaryButton}`}>
            Bli partner
          </a>
        </div>
        <div className="bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 flex flex-col gap-3 items-start">
          <h2 className="text-lg font-bold text-white">Flyttfirmor, elbolag och andra leverantörer</h2>
          <p className="text-white/70 text-sm leading-relaxed">Du levererar tjänsten. Vi skickar kunder som ska flytta inom några veckor. Du betalar per uppdrag.</p>
          <a href="#leverantorer" className={`mt-2 ${outlineButton}`}>
            Ansök som leverantör
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
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
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

const SectionHeader = ({ title, text }: { title: string; text: string }) => (
  <div className="mb-12 md:mb-16 max-w-[640px]">
    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] mb-4 leading-snug text-balance">{title}</h2>
    <p className="text-[var(--color-secondary-main)]/80 text-[15px] leading-relaxed">{text}</p>
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

const Bullets = ({ title, items }: { title: string; items: string[] }) => (
  <div className="mb-14 md:mb-16 max-w-[640px]">
    <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-5">{title}</h3>
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-main)] mt-2 shrink-0" />
          <p className="text-[var(--color-secondary-main)] text-[15px]">{item}</p>
        </li>
      ))}
    </ul>
  </div>
)

const Cta = ({ title, href, label }: { title: string; href: string; label: string }) => (
  <div className="bg-[var(--color-secondary-main)] rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
    <h3 className="text-lg md:text-xl font-bold text-white text-balance">{title}</h3>
    <a href={href} className={`${primaryButton} shrink-0`}>
      {label}
    </a>
  </div>
)

// ─── Distributionspartners ────────────────────────────────────────────────────

const brokerSteps = [
  { title: 'Kunden bjuds in', description: 'Mäklare: automatiskt via mäklarsystemet när affären är klar. Andra partners: du bjuder in kunden, inget att bygga.' },
  { title: 'Vi tar hand om resten', description: 'Flytt, städ, el, bredband, försäkring och adressändring, samlat på ett ställe med en kontaktpunkt.' },
  { title: 'Kunden får en koordinator', description: 'Nina, Joel eller Maria bokar, följer upp och svarar i chatten, på mejl och i telefon.', people: true },
]

const DistributionPartners = () => (
  <section id="distributionspartners" className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
    <SectionHeader
      title="Skicka dina kunder till en flytt de kommer minnas."
      text="Vi gör flytten enkel för dina kunder och du står som avsändare, helt utan kostnad för dig."
    />

    <div className="mb-14 md:mb-16">
      <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Så fungerar det</h3>
      <Steps items={brokerSteps} cols={3} />
    </div>

    <Cta title="Vill du erbjuda Flyttsmart till dina kunder?" href="mailto:partner@flyttsmart.se" label="Bli partner" />
  </section>
)

// ─── Leverantörer ─────────────────────────────────────────────────────────────

const vettingSteps = [
  { title: 'Ansökan granskas', description: 'F-skattsedel, försäkringar och certifieringar kontrolleras.' },
  { title: 'Referenscheck', description: 'Vi pratar med tidigare kunder och verifierar omdömen.' },
  { title: 'Provuppdrag', description: 'Du genomför ett kontrollerat uppdrag som vi följer upp.' },
  { title: 'Löpande uppföljning', description: 'Betyg samlas in efter varje uppdrag. Lågt betyg, borttagen.' },
]

const supplierBenefits = ['Ingen marknadsföringskostnad, du betalar bara när du får ett uppdrag', 'Flyttsmart sköter kundkontakt, fakturering och rut- och rothantering']

const Suppliers = () => (
  <section id="leverantorer" className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
    <SectionHeader
      title="Nå kunder i exakt rätt ögonblick."
      text="Varje månad flyttar tusentals svenskar genom Flyttsmart. De behöver flyttfirma, städbolag, el, bredband, försäkring och hantverkare, och de letar just nu. Vi kopplar ihop er, men bara om du håller måttet."
    />

    <Bullets title="Varför leverantörer väljer Flyttsmart" items={supplierBenefits} />

    <div className="mb-14 md:mb-16">
      <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Hur vi väljer leverantörer</h3>
      <Steps items={vettingSteps} cols={2} />
    </div>

    <Cta title="Vill du nå fler kunder?" href="mailto:leverantor@flyttsmart.se" label="Ansök som leverantör" />
  </section>
)

export { PartnersIntro, PartnerQuotes, DistributionPartners, Suppliers }
