'use client'

// ─── Shared Intro ─────────────────────────────────────────────────────────────

const PartnersIntro = () => {
  return (
    <section className="bg-[var(--color-secondary-main)] text-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 md:pt-16">
        <div className="max-w-[600px] mb-8">
          <p className="text-[#7dd8c8] text-xs font-semibold uppercase tracking-widest mb-3">
            Samarbetspartners
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
            Tillsammans gör vi flytten enklare för alla.
          </h1>
          <p className="text-white/70 text-[15px] leading-relaxed">
            Flyttsmart samlar allt som hör till en flytt på ett ställe. Det kräver två typer av partners - de som skickar kunder till oss, och de som levererar tjänsterna kunderna behöver.
          </p>
        </div>

        {/* Two partner types overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12 md:pb-16">
          <a
            href="#distributionspartners"
            className="group bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 hover:border-[var(--color-primary-main)]/40 transition-colors"
          >
            <img src="/images/Handshake.svg" alt="" className="w-9 h-9 mb-3 brightness-0 invert opacity-70" />
            <h2 className="text-base font-bold text-white mb-2 group-hover:text-[var(--color-primary-main)] transition-colors">
              Distributionspartners
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Mäklare, hyresvärdar, bostadsrättsföreningar och andra som möter personer som ska flytta.
            </p>
          </a>
          <a
            href="#leverantorer"
            className="group bg-white/5 rounded-xl p-6 md:p-8 border border-white/10 hover:border-[var(--color-primary-main)]/40 transition-colors"
          >
            <img src="/icons/flyttsmart/electricity/Electricity.svg" alt="" className="w-9 h-9 mb-3" />
            <h2 className="text-base font-bold text-white mb-2 group-hover:text-[var(--color-primary-main)] transition-colors">
              Leverantörer
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Elbolag, försäkringsbolag, bredbandsoperatörer, flyttfirmor och andra som levererar tjänster till flyttare.
            </p>
          </a>
        </div>
      </div>
    </section>
  )
}

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
  <section aria-labelledby="partner-quotes-heading" className="bg-white">
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-14 md:py-20">
      <h2 id="partner-quotes-heading" className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] mb-8 md:mb-10 leading-snug">
        Det säger de som redan samarbetar med oss
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {PARTNER_QUOTES.map((q) => (
          <figure key={q.name} className="bg-[var(--color-background-default)] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
            <span className="h-7 flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={q.logo} alt={q.role.split(', ')[1]} loading="lazy" decoding="async" className="max-h-7 w-auto object-contain" />
            </span>
            <blockquote className="text-lg md:text-xl leading-relaxed text-[var(--color-secondary-main)] flex-1">
              ”{q.quote}”
            </blockquote>
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

// ─── Distribution Partners ────────────────────────────────────────────────────

const distributionTypes = [
  {
    title: 'Mäklare',
    description: 'Ge dina köpare en komplett flyttupplevelse. Kontot aktiveras automatiskt via ditt mäklarsystem.',
    icon: '/images/HouseLine.svg',
  },
  {
    title: 'Hyresfastigheter',
    description: 'Erbjud inflyttande hyresgäster en smidig start. Vi tar hand om el, bredband, försäkring och flytt.',
    icon: '/images/Area.svg',
  },
  {
    title: 'Bostadsrättsföreningar',
    description: 'Välkomna nya medlemmar med en samlad flytt-tjänst. Enklare för styrelsen, bättre för de boende.',
    icon: '/images/HomeIcon.svg',
  },
  {
    title: 'Nyproduktion',
    description: 'Köpare av nybyggda bostäder behöver starta allt från noll. Vi samlar hela processen åt dem.',
    icon: '/images/Wrench.svg',
  },
]

const distributionBenefits = [
  'Kunden får en komplett flytt-dashboard från dag ett',
  'Du syns som avsändare genom hela flytten',
  'Nöjdare kunder ger starkare omdömen och fler affärer',
  'Helt kostnadsfritt - vi tar betalt av leverantörerna',
  'Ingen integration krävs',
]

const brokerSteps = [
  {
    number: '1',
    title: 'Affären är klar',
    description: 'Köparens och säljarens konton i Flyttsmart aktiveras automatiskt via ert system. Ni behöver inte göra något extra.',
  },
  {
    number: '2',
    title: 'Vi tar hand om resten',
    description: 'Flytt, städ, el, bredband, försäkring och adressändring - allt samlas på ett ställe med en kontaktpunkt.',
  },
  {
    number: '3',
    title: 'Alla blir nöjda',
    description: 'En smidig flytt skapar nöjda kunder som kommer tillbaka och rekommenderar dig vidare.',
  },
]

const DistributionPartners = () => {
  return (
    <section id="distributionspartners" className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
      {/* Header */}
      <div className="mb-12 md:mb-16 max-w-[640px]">
        <p className="text-[#1a7a6e] text-xs font-semibold uppercase tracking-widest mb-3">
          Distributionspartners
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] mb-4 leading-snug">
          Skicka dina kunder till en flytt de kommer minnas.
        </h2>
        <p className="text-[var(--color-secondary-main)]/80 text-[15px] leading-relaxed">
          Alla som möter personer på väg in i en ny bostad kan bli distributionspartner. Oavsett om du är mäklare, hyresvärd eller föreningsstyrelse - vi gör flytten enkel för dina kunder, helt utan kostnad för dig.
        </p>
      </div>

      {/* Partner types */}
      <div className="mb-14 md:mb-16">
        <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Vem kan bli distributionspartner?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {distributionTypes.map((type) => (
            <div key={type.title} className="bg-[var(--color-background-default)] rounded-xl p-6">
              <img src={type.icon} alt="" className="w-8 h-8 mb-3" />
              <h4 className="text-[15px] font-bold text-[var(--color-secondary-main)] mb-2">{type.title}</h4>
              <p className="text-[var(--color-secondary-main)]/80 text-sm leading-relaxed">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-14 md:mb-16">
        <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-8">Så fungerar det</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {brokerSteps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="text-4xl font-bold text-[var(--color-primary-main)]/15 leading-none mt-0.5 shrink-0 select-none">
                {step.number}
              </span>
              <div>
                <h4 className="text-[15px] font-bold text-[var(--color-secondary-main)] mb-2">{step.title}</h4>
                <p className="text-[var(--color-secondary-main)]/80 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-14 md:mb-16 bg-[var(--color-background-default)] rounded-2xl p-7 md:p-10">
        <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-5">Varför bli distributionspartner?</h3>
        <div className="flex flex-col gap-4">
          {distributionBenefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-main)] mt-2 shrink-0" />
              <p className="text-[var(--color-secondary-main)] text-sm">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[var(--color-secondary-main)] rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h3 className="text-[15px] md:text-base font-bold text-white mb-1">Vill du erbjuda Flyttsmart till dina kunder?</h3>
          <p className="text-white/70 text-sm">Hör av dig så berättar vi mer om hur samarbetet fungerar.</p>
        </div>
        <a
          href="mailto:partner@flyttsmart.se"
          style={{ backgroundColor: '#51c8b4', color: '#ffffff' }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap"
        >
          Kontakta oss &rarr;
        </a>
      </div>
    </section>
  )
}

// ─── Suppliers ─────────────────────────────────────────────────────────────────

const supplierTypes = [
  {
    title: 'Flyttfirmor',
    description: 'Flytthjälp, packhjälp och magasinering.',
    icon: '/icons/flyttsmart/movehelp/Movehelp_circle.svg',
  },
  {
    title: 'Städbolag',
    description: 'Flyttstäd, byggstäd och hemstäd.',
    icon: '/images/Cleaning.svg',
  },
  {
    title: 'Elbolag',
    description: 'Elavtal för nya bostäder - fast och rörligt.',
    icon: '/icons/flyttsmart/electricity/Electricity.svg',
  },
  {
    title: 'Bredbandsoperatörer',
    description: 'Fiber, 5G och bredband via kabel.',
    icon: '/icons/flyttsmart/broadband/Broadband.svg',
  },
  {
    title: 'Försäkringsbolag',
    description: 'Hemförsäkring, tilläggsförsäkringar och bostadsrättsförsäkring.',
    icon: '/icons/flyttsmart/insurance/insurance.svg',
  },
  {
    title: 'Hantverkare',
    description: 'Målning, renovering och reparationer.',
    icon: '/images/Wrench.svg',
  },
]

const vettingSteps = [
  { label: 'Ansökan granskas', description: 'F-skattsedel, försäkringar och certifieringar kontrolleras.' },
  { label: 'Referenscheck', description: 'Vi pratar med tidigare kunder och verifierar omdömen.' },
  { label: 'Provuppdrag', description: 'Leverantören genomför ett kontrollerat uppdrag som vi följer upp.' },
  { label: 'Löpande uppföljning', description: 'Betyg samlas in efter varje uppdrag. Lågt betyg - borttagen.' },
]

const supplierBenefits = [
  'Leads med hög konvertering - kunderna har precis köpt bostad och ska flytta inom veckor',
  'Ingen marknadsföringskostnad - du betalar bara när du får ett uppdrag',
  'Flyttsmart sköter kundkontakt, fakturering och RUT/ROT-hantering',
  'Tillgång till kunder i hela Sverige eller i ditt specifika område',
  'Ditt betyg och kvalitet avgör hur många uppdrag du får',
]

const Suppliers = () => {
  return (
    <section id="leverantorer" className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
      {/* Header */}
      <div className="mb-12 md:mb-16 max-w-[640px]">
        <p className="text-[#1a7a6e] text-xs font-semibold uppercase tracking-widest mb-3">
          Leverantörer
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] mb-4 leading-snug">
          Nå tiotusentals kunder i exakt rätt ögonblick.
        </h2>
        <p className="text-[var(--color-secondary-main)]/80 text-[15px] leading-relaxed">
          Varje månad flyttar tiotusentals svenskar genom Flyttsmart. De behöver flytt, städ, el, bredband, försäkring och mer - och de letar aktivt efter leverantörer. Vi kopplar ihop er, men bara om du håller måttet.
        </p>
      </div>

      {/* Supplier types */}
      <div className="mb-14 md:mb-16">
        <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Leverantörer vi samarbetar med</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {supplierTypes.map((type) => (
            <div key={type.title} className="bg-[var(--color-background-default)] rounded-xl p-5">
              <img src={type.icon} alt="" className="w-8 h-8 mb-2" />
              <h4 className="text-[15px] font-bold text-[var(--color-secondary-main)] mb-1">{type.title}</h4>
              <p className="text-[var(--color-secondary-main)]/80 text-sm leading-relaxed">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why it works */}
      <div className="mb-14 md:mb-16 bg-[var(--color-background-default)] rounded-2xl p-7 md:p-10">
        <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-5">Varför leverantörer väljer Flyttsmart</h3>
        <div className="flex flex-col gap-4">
          {supplierBenefits.map((benefit) => (
            <div key={benefit} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-main)] mt-2 shrink-0" />
              <p className="text-[var(--color-secondary-main)] text-sm">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vetting process */}
      <div className="mb-14 md:mb-16">
        <h3 className="text-base font-bold text-[var(--color-secondary-main)] mb-3">Hur vi väljer leverantörer</h3>
        <p className="text-[var(--color-secondary-main)]/80 text-sm mb-8">Vi är medvetet noggranna. Det skyddar både våra kunder och de leverantörer som gör bra jobb.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {vettingSteps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <span className="text-xs font-bold text-[var(--color-primary-main)] bg-[var(--color-primary-main)]/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div>
                <span className="font-semibold text-[var(--color-secondary-main)] text-sm block mb-1">{step.label}</span>
                <p className="text-[var(--color-secondary-main)]/80 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white border border-gray-100 rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h3 className="text-[15px] md:text-base font-bold text-[var(--color-secondary-main)] mb-1">Vill du nå fler kunder?</h3>
          <p className="text-[var(--color-secondary-main)]/80 text-sm">Skicka en ansökan så hör vi av oss inom ett par dagar.</p>
        </div>
        <a
          href="mailto:leverantor@flyttsmart.se"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-secondary-main)] text-white font-semibold text-sm hover:bg-[var(--color-secondary-main)]/85 transition-colors shrink-0 whitespace-nowrap"
        >
          Ansök som leverantör &rarr;
        </a>
      </div>
    </section>
  )
}

export { PartnersIntro, PartnerQuotes, DistributionPartners, Suppliers }
