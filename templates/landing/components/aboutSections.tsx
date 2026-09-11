'use client'

import { ABOUT_STATS, MOVES_IN_SWEDEN_PER_YEAR, MOVES_IN_SWEDEN_SOURCE_URL } from '@/constants/trustStats'
import LogoMarquee from './LogoMarquee'
import { partnerLogos } from './partnerLogos'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Siffrorna bor i constants/trustStats.ts tillsammans med sin källa och sitt
// datum. Ändra dem där, inte här.
const stats = ABOUT_STATS

// Copyn följer Sebastians genomgång 2026-09-03 (inga nöjdhetstal utan källa,
// inga superlativ, avtalsparten som den är) och Camillas språkliga putsning
// 2026-09-11: hela meningar i stället för uppräkningar, och "vi" som subjekt.
const qualities = [
  {
    title: 'Kvalitetssäkrade leverantörer',
    description: 'Varje leverantör granskas: försäkringar, trafiktillstånd, F-skatt, omdömen och Konsumentverket. Vi gör uppföljningar löpande och plockar bort de som inte håller måttet.',
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
              Flyttsmart är en digital flyttjänst för hela flytten. Hos oss bokar du allt på ett ställe och får försäkring och support på köpet. Vi hanterar även faktureringen. Enkelt, helt enkelt!
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

        {/* Mäklarkedjorna under siffrorna (Camilla 2026-09-11: "större loggor").
            Samma lista som bevisblocket på startsidan men i större slots, så
            loggorna läses som bevis och inte som en dekorremsa. Vit remsa
            eftersom flera loggor är opaka. */}
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-6 md:pb-8">
          <div className="rounded-xl bg-white py-6 md:py-8 overflow-hidden">
            <LogoMarquee
              logos={partnerLogos}
              slotClassName="h-12 md:h-14 w-[200px] md:w-[240px]"
              imageClassName="max-h-full max-w-[150px] md:max-w-[176px] object-contain"
            />
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
              Vi startade 2020 för att lösa ett problem alla som flyttat känner igen: tio samtal, tio bolag, noll koll. Därför skapade vi en plats där du kan samla allt. Ett nummer, en kontakt.
            </p>
            <p>
              Vi är inte en marknadsplats som skickar dig eller dina uppgifter vidare. På flytt och städ är vi din avtalspart: vi har försäkringarna, supporten och sköter faktureringen. På el och bredband tecknar du avtalet direkt, men du har fortfarande kontakten med oss. En person, hela vägen.
            </p>
            <p>
              120+ kvalitetssäkrade leverantörer i hela Sverige. 16 personer i teamet. Från 2 300 användare första året till över 250 000 hjälpta personer på sex år.
            </p>
          </div>
        </div>

        {/* What sets us apart */}
        <div className="pb-12 md:pb-14">
          <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-6">Vad vi gör annorlunda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden">
            {qualities.map((q) => (
              <div key={q.title} className="bg-white p-6">
                <h3 className="text-sm font-bold text-[var(--color-secondary-main)] mb-1.5">{q.title}</h3>
                <p className="text-[var(--color-secondary-main)]/80 text-[15px] leading-relaxed">{q.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision. På mobil går rutan ut till skärmkanten så texten börjar i
            samma kant som rubriken ovanför (Camilla 2026-09-11: texten låg
            indragen två steg jämfört med stycket ovan). */}
        <div className="pb-12 md:pb-14">
          <div className="bg-[var(--color-background-default)] -mx-4 px-4 py-8 md:mx-0 md:p-10 md:rounded-xl">
            <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-3">Vart vi är på väg</h2>
            <p className="text-[var(--color-secondary-main)]/80 text-base leading-relaxed max-w-[640px]">
              Varje år görs {MOVES_IN_SWEDEN_PER_YEAR} flyttar inom Sverige. Flyttsmart är det självklara valet vid var och en av dem, oavsett om du köper, säljer eller byter hyresrätt, flyttar över gatan eller över halva landet. Vi får din flytt att fungera, från dag ett till sista uppackade kartongen.
            </p>
            <p className="text-[var(--color-secondary-main)]/60 text-sm mt-4">
              Källa:{' '}
              <a href={MOVES_IN_SWEDEN_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                SCB, inrikes flyttningar 2025
              </a>
            </p>
          </div>
        </div>

        {/* CTA. Ljus ruta i stället för svart, och knappen direkt under texten
            i stället för i motsatt hörn (Camilla 2026-09-11: "för mörk och för
            långt till knapp"). Ramen i primärfärg skiljer den från visionsrutan. */}
        <div className="pb-12 md:pb-16">
          <div className="rounded-xl border-2 border-[var(--color-primary-main)] bg-[var(--color-primary-main)]/10 p-7 md:p-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary-main)] mb-1">Vill du veta mer?</h3>
              <p className="text-[var(--color-secondary-main)]/80 text-base">Hör av dig, så berättar vi mer.</p>
            </div>
            <a href="mailto:hej@flyttsmart.se" className="inline-flex items-center justify-center min-h-11 px-6 rounded-full bg-[#FFA65F]! text-[#214766]! font-bold text-[15px] hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-auto shrink-0">
              Maila oss
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export { TeamSection }
