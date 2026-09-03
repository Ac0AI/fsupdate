'use client'

import { ABOUT_STATS, MOVES_IN_SWEDEN_PER_YEAR, MOVES_IN_SWEDEN_SOURCE_URL } from '@/constants/trustStats'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Siffrorna bor i constants/trustStats.ts tillsammans med sin källa och sitt
// datum. Ändra dem där, inte här.
const stats = ABOUT_STATS

// Copyn följer Sebastians genomgång 2026-09-03: inga nöjdhetstal utan källa,
// inga superlativ, och avtalsparten beskrivs som den är (flytt och städ hos oss,
// el och bredband direkt hos leverantören).
const qualities = [
  {
    title: 'Kvalitetssäkrade leverantörer',
    description: 'Varje leverantör granskas: försäkringar, trafiktillstånd, F-skatt, omdömen och Konsumentverket. Löpande uppföljning, och de som inte håller måttet åker ut.',
  },
  {
    title: 'Personlig koordinator',
    description: 'Ingen chatbot. Du får en riktig person som följer din flytt från bokning till inflyttning, samma person hela vägen, inte en ny handläggare varje gång du hör av dig.',
  },
  {
    title: 'Hela Sverige',
    description: 'Vi täcker alla 21 län. Samma ansvar oavsett om du flyttar inom Stockholm eller från Luleå till Malmö.',
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
              En enklare flytt. Det är hela poängen.
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              Flyttsmart är en digital flyttjänst för hela flytten. Du bokar allt på ett ställe, och vi tar ansvar för leveransen. Försäkring, support, fakturering. En kontaktperson hela vägen.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 py-6 border-t border-white/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xl font-bold text-[var(--color-primary-main)]">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
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
        {/* The pitch: en centrerad spalt med vänsterställd text (Sebastian 2026-09-03) */}
        <div className="py-12 md:py-14">
          <div className="max-w-[720px] mx-auto space-y-4 text-[var(--color-secondary-main)] text-base md:text-lg leading-relaxed">
            <p>
              Vi startade 2020 för att lösa ett problem alla som flyttat känner igen: tio samtal, tio bolag, noll koll. Så vi byggde ett ställe där du gör allt en gång, och vi tar ansvar för resten.
            </p>
            <p>
              Vi är inte en marknadsplats som skickar dig eller dina uppgifter vidare. På flytt och städ är vi din avtalspart: vi har försäkringarna, supporten och sköter faktureringen. På el och bredband tecknar du avtalet direkt, men du har fortfarande kontakten med oss. En person, hela vägen.
            </p>
            <p>
              120+ kvalitetssäkrade leverantörer i hela Sverige. 16 personer i teamet. Från 2 300 användare första året till över 230 000 hjälpta personer på sex år.
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
                <p className="text-[var(--color-secondary-main)]/80 text-[15px] leading-relaxed">{q.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="pb-12 md:pb-14">
          <div className="bg-[var(--color-background-default)] rounded-xl p-7 md:p-10">
            <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-3">Vart vi är på väg</h2>
            <p className="text-[var(--color-secondary-main)]/80 text-base leading-relaxed max-w-[640px]">
              Varje år görs {MOVES_IN_SWEDEN_PER_YEAR} flyttar inom Sverige. Vi vill vara det självklara valet vid var och en av dem, oavsett om du köper, säljer eller byter hyresrätt, flyttar över gatan eller över landet. Målet är att flytten bara fungerar, från dag ett till sista kartongen.
            </p>
            <p className="text-[var(--color-secondary-main)]/60 text-sm mt-4">
              Källa:{' '}
              <a href={MOVES_IN_SWEDEN_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                SCB, inrikes flyttningar 2025
              </a>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pb-12 md:pb-16">
          <div className="bg-[var(--color-secondary-dark)] rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h3 className="text-[15px] md:text-base font-bold text-white mb-1">Vill du veta mer?</h3>
              <p className="text-white/60 text-sm">Hör av dig.</p>
            </div>
            <div className="flex gap-3">
              <a href="mailto:hej@flyttsmart.se" className="inline-flex items-center min-h-11 px-6 rounded-full bg-[#FFA65F]! text-[#214766]! font-bold text-[15px] hover:opacity-90 transition-opacity whitespace-nowrap">
                Maila oss
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { TeamSection }
