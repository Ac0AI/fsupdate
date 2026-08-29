'use client'

import { ABOUT_STATS } from '@/constants/trustStats'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Siffrorna bor i constants/trustStats.ts tillsammans med sin källa och sitt
// datum. Ändra dem där, inte här.
const stats = ABOUT_STATS

const qualities = [
  {
    title: 'Kvalitetssäkrade leverantörer',
    description: 'Varje leverantör granskas: försäkringar, trafiktillstånd, F-skatt, omdömen och Konsumentverket. Löpande uppföljning - de som inte håller måttet åker ut.',
  },
  {
    title: 'Personlig koordinator',
    description: 'Ingen chatbot. Du får en riktig person som följer din flytt från bokning till inflyttning. 98,6% av kunderna är nöjda med den personliga servicen.',
  },
  {
    title: 'Hela Sverige',
    description: 'Vi täcker alla 21 län. Samma kvalitet och samma ansvar oavsett om du flyttar inom Malmö eller från Luleå till Göteborg.',
  },
]

// ---------------------------------------------------------------------------
// TeamSection (Om oss)
// ---------------------------------------------------------------------------

const TeamSection = () => {
  return (
    <section>
      {/* Hero */}
      <div className="bg-[var(--color-secondary-main)] text-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 md:pt-16">
          <div className="max-w-[600px] mb-8">
            <p className="text-[var(--color-primary-main)] text-xs font-semibold uppercase tracking-widest mb-3">Om Flyttsmart</p>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-snug">
              Vi äger inte en enda flyttbil. Det är hela poängen.
            </h1>
            <p className="text-white/50 text-[15px] leading-relaxed">
              Flyttsmart är Sveriges första och enda digitala flyttjänst. Du bokar allt på ett ställe - vi tar fullt ansvar för leveransen. Försäkring, support, fakturering. En kontaktperson hela vägen.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 py-6 border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-[var(--color-primary-main)]">{stat.value}</div>
                <div className="text-white/35 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team image */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-10 md:pb-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/team-office.jpg" alt="Teamet på Flyttsmart" className="w-full rounded-xl object-cover aspect-[21/9]" loading="eager" />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* The pitch */}
        <div className="py-12 md:py-14 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-14 items-start">
          <h2 className="text-base font-bold text-[var(--color-secondary-main)] leading-snug">
            Tänk Uber - fast för flytten.
          </h2>
          <div className="space-y-3 text-[var(--color-secondary-main)]/60 text-sm leading-relaxed">
            <p>
              Vi startade 2020 för att lösa ett problem alla som flyttat känner igen: tio samtal, tio bolag, noll koll. Så vi byggde ett ställe där du gör allt en gång - och vi tar ansvar för resten.
            </p>
            <p>
              Vi är inte en marknadsplats som skickar dig vidare. När du bokar genom Flyttsmart är vi din avtalspart. Vi har försäkringarna, vi har supporten, vi sköter faktureringen. Du har en person att ringa om något inte stämmer.
            </p>
            <p>
              120+ kvalitetssäkrade leverantörer i hela Sverige. 16 personer i teamet. 230 000 hjälpta flyttare. Från 2 300 användare första året till Sveriges största digitala flyttjänst på under fem år.
            </p>
          </div>
        </div>

        {/* What sets us apart */}
        <div className="pb-12 md:pb-14">
          <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Vad gör vi annorlunda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden">
            {qualities.map((q) => (
              <div key={q.title} className="bg-white p-6">
                <h3 className="text-sm font-bold text-[var(--color-secondary-main)] mb-1.5">{q.title}</h3>
                <p className="text-[var(--color-secondary-main)]/45 text-sm leading-relaxed">{q.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="pb-12 md:pb-14">
          <div className="bg-[var(--color-background-default)] rounded-xl p-7 md:p-10">
            <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-3">Vart vi är på väg</h2>
            <p className="text-[var(--color-secondary-main)]/55 text-sm leading-relaxed max-w-[600px]">
              1,5 miljoner människor flyttar i Sverige varje år. Ingen av dem borde behöva ringa tio bolag, jämföra offerter i Excel eller hoppas att flyttfirman dyker upp. Vi bygger tjänsten som gör att flytten bara fungerar - från dag ett till sista kartongen.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pb-12 md:pb-16">
          <div className="bg-[var(--color-secondary-main)] rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="text-[15px] md:text-base font-bold text-white mb-1">Vill du veta mer?</h3>
              <p className="text-white/45 text-sm">Hör av dig eller kolla våra lediga tjänster.</p>
            </div>
            <div className="flex gap-3">
              <a href="mailto:hej@flyttsmart.se" style={{ backgroundColor: '#51c8b4', color: '#ffffff' }} className="inline-flex items-center px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                Maila oss &rarr;
              </a>
              <a href="https://jobb.flyttsmart.se/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff' }} className="inline-flex items-center px-5 py-2.5 rounded-lg border border-white/50 font-semibold text-sm hover:bg-white/10 transition-colors whitespace-nowrap">
                Lediga tjänster
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { TeamSection }
