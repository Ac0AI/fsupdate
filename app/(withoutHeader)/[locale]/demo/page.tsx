import Link from 'next/link'
import { Metadata } from 'next'
import { PERSONAS, type DemoPersona } from '@/common/data/demoPersona'

export const metadata: Metadata = {
  title: 'Flyttsmart | Demo',
}

const BASE = 'https://fsupdate-nn98.vercel.app'

const BUYER_STEPS = [
  { do: 'Öppna inbjudan som köpare.', see: 'En kort laddningsvy med "Inbjuden av Demomäklaren" och koordinatorerna. Sedan onboardingen.' },
  { do: 'Steg 1 av 2: Vart ska du flytta?', see: 'Ekvägen 8, 41320 Göteborg är förifyllt från mäklaren. Tryck Fortsätt. Testa gärna Ändra också.' },
  { do: 'Steg 2 av 2: När ska du flytta?', see: 'Tillträdesdagen är förvald och kartan visar Göteborg. Tryck Visa min flytt.' },
  { do: 'Välkomstsidan går över till checklistan av sig själv.', see: 'Överst: Från Storgatan 12, Till Ekvägen 8, datumet. Välkomstkortet med Nina, tidslinjen med flyttbilen och allt som är kvar att göra. Flytthjälpen ligger överst: Stockholm till Göteborg är en långflytt, och stora eller långa flyttar börjar med offerten.' },
]

const SELLER_STEPS = [
  { do: 'Öppna inbjudan som säljare.', see: 'Samma laddningsvy, sedan onboardingen utan förifylld adress.' },
  { do: 'Steg 1 av 2: tryck Lägg till adress och skriv en adress.', see: 'Google föreslår riktiga adresser medan du skriver. Välj ett förslag, kontrollera postnummer och ort, tryck Spara och sedan Fortsätt.' },
  { do: 'Alternativt: tryck Jag har inte en ny adress ännu.', see: 'Då hoppar du till datumsteget utan adress. På checklistan står det Uppdatera i Till-raden.' },
  { do: 'Steg 2 av 2: välj datum och tryck Visa min flytt.', see: 'Checklistan visar Från Storgatan 12, den sålda bostaden, och den adress du fyllde i.' },
  { do: 'Titta på ordningen i listan.', see: 'Valde du en adress i Stockholm ligger Flyttstädningen överst och välkomstknappen säger Boka flyttstädningen: kort flytt i samma stad börjar med städet. En adress i en annan stad ger flytthjälpen överst med Få min offert, precis som i köparresan.' },
]

const CHECKLIST_AREAS = [
  {
    where: 'Elavtal',
    what: 'Fem steg: förslag med jämförpris, andra avtal, startdatum och lägenhet, sammanfattning med fullmakt, signering, kvitto. Går inte vidare utan lägenhetsnummer och godkännande.',
    simulated: 'BankID-signeringen tar några sekunder och lyckas alltid. Avbryt signeringen går tillbaka utan att något händer.',
  },
  {
    where: 'Flyttstädning',
    what: 'Boka direkt till fast pris efter RUT: yta, biytor, städdag, bekräfta, klart. Priset räknas medan du fyller i. Efter bokningen byter elkortet pill till Teckna nu: 100 kr rabatt på städet, och punkten bockas av.',
    simulated: 'Ingen bekräftelse skickas. Bokningen ligger kvar i fliken tills du startar en ny resa.',
  },
  {
    where: 'Flytthjälp',
    what: 'Knappen heter Få min offert. Tre steg: bostäderna, bohaget, offert på väg. Offerten räknas på hemmet, ingen blir uppringd som pitch. Stoppar om boarea saknas, om biytan inte har ett val, eller om du kryssat i krångligt utan att skriva något.',
    simulated: 'Offerten kommer aldrig. Steg 3 visar väntan och nästa steg.',
  },
  { where: 'Bredband', what: 'Riktiga bredbandsval för adressen.', simulated: 'Beställningen går inte iväg.' },
  { where: 'Markera som klar', what: 'En textlänk under texten på varje kort. Bocka i, kortet viks ihop och landar i Snabböversikt med en rad som säger hur det blev klart. Där går det att återställa.', simulated: 'Inget.' },
  {
    where: 'Lägg till något eget',
    what: 'Färdiga förslag som Eftersändning och Parkeringsplats, plus ett fritt fält för allt annat. Varje tillagd punkt frågar Hur vill du göra: Jag fixar det själv eller Jag vill ha hjälp, som ger ett kvitto med svarstid och går att ångra.',
    simulated: 'Hjälpvalet mejlar oss i skarp drift. I demon visas bara kvittot.',
  },
  {
    where: 'Den orangea knappen',
    what: 'En åt gången, alltid nästa steg. Välkomstkortet äger den tills det stängs, sedan styr kalendern: över 30 dagar kvar pekar den på flytt och städ, 14 till 30 på el, under 14 på bredband och flyttanmälan. Med 21 dagar kvar i demon blir elavtalet orange när välkomstkortet stängts.',
    simulated: 'Inget.',
  },
  { where: 'Från, Till, När', what: 'Fäll ut och ändra. Kalenderknappen lägger till separat inflyttningsdatum.', simulated: 'Inget.' },
]

const LOOK_FOR = [
  'Förstod du i varje steg vad som händer härnäst, utan att gissa?',
  'Fanns det något fält du inte förstod varför du skulle fylla i?',
  'Fastnade du någonstans utan att veta varför? Felet ska stå vid fältet och säga vad som saknas.',
  'Kändes knappar, reglage och kort mjuka att trycka på, eller hoppade något?',
  'Mobil: gick allt att träffa med tummen, och scrollade sidan aldrig i sidled?',
  'Litade du på siffrorna: jämförpris, månadskostnad, besparing? Stod det tillräckligt för att ta beslutet?',
  'Kände du dig trygg med fullmakten innan du signerade?',
  'Hade du gått vidare till nästa tjänst om det var på riktigt?',
]

/**
 * Startsidan för demon. Två roller, två inbjudningslänkar, och instruktionerna
 * för den som testar direkt på sidan. Varje länk börjar om från början:
 * inbjudan, onboarding, välkomstsida, checklista.
 */
export default function DemoStartPage() {
  const personas = Object.keys(PERSONAS) as DemoPersona[]
  return (
    <main className="min-h-screen bg-[#F8FAF9] px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-[818px] flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F6156]">Demo</span>
          <h1 className="text-[32px] md:text-[42px] font-black tracking-[-0.02em] leading-9 md:leading-[48px] text-[#214766]">Testa flytten från inbjudan till checklista</h1>
          <p className="text-[15px] md:text-[18px] leading-[22px] md:leading-[26px] text-[#767678] max-w-[560px]">
            Välj vem du är. Länken gör precis det mejlet från mäklaren gör: öppnar inbjudan, tar dig genom onboardingen och landar på flyttsidan. Allt körs utan backend
            och börjar om varje gång.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {personas.map((persona) => {
            const p = PERSONAS[persona]
            return (
              <Link
                key={persona}
                href={`/demo/i/${persona}`}
                className="group flex flex-col gap-4 rounded-[12px] bg-white border-2 border-[#EEEEF0] p-5 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-[#51C8B4] hover:shadow-[0px_6px_18px_rgba(1,22,39,0.10)] motion-safe:active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51C8B4] focus-visible:ring-offset-2"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#767678]">Testa som</span>
                  <span className="text-[24px] font-black tracking-[-0.01em] text-[#214766]">{p.title}</span>
                </div>
                <p className="text-[15px] leading-[21px] text-[#214766]">{p.lead}</p>
                <ul className="flex flex-col gap-1.5">
                  {p.knows.map((k) => (
                    <li key={k} className="flex items-start gap-2 text-[13px] leading-[19px] text-[#214766]">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#51C8B4] shrink-0" />
                      {k}
                    </li>
                  ))}
                </ul>
                <p className="text-[13px] leading-[19px] text-[#767678]">{p.asks}</p>
                <span className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-[#214766] px-6 text-[15px] font-bold text-white transition-colors group-hover:bg-[#1A3A54]">
                  Öppna inbjudan som {p.title.toLowerCase()}
                </span>
              </Link>
            )
          })}
        </div>

        <div className="flex flex-col gap-2 text-[13px] leading-[19px] text-[#767678]">
          <p>
            Återkommande kund i stället?{' '}
            <Link href="/demo/login" className="font-semibold text-[#214766] underline underline-offset-2">
              Logga in med simulerat BankID
            </Link>{' '}
            eller gå{' '}
            <Link href="/demo/movepage" className="font-semibold text-[#214766] underline underline-offset-2">
              direkt till flyttsidan
            </Link>
            .
          </p>
          <p>Demon sparar dina val i fliken. Öppna en inbjudningslänk igen så börjar allt om.</p>
        </div>

        {/* ---------- Instruktionerna för den som testar ---------- */}
        <div className="flex flex-col gap-2 pt-6 border-t border-[#EEEEF0]">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F6156]">Så testar du</span>
          <h2 className="text-[24px] md:text-[28px] font-black tracking-[-0.01em] leading-8 text-[#214766]">Innan du börjar</h2>
        </div>
        <Card>
          <Bullets
            items={[
              ['Inget sparas på riktigt.', 'Adresser, datum och val ligger bara i din webbläsarflik. Stäng fliken eller öppna en inbjudningslänk igen, så börjar allt om.'],
              ['BankID och signering är simulerade.', 'Inget anrop går till BankID, ingen fullmakt skapas, inget elavtal tecknas.'],
              ['Adresserna är påhittade.', 'Storgatan 12 i Stockholm och Ekvägen 8 i Göteborg. Adressförslagen i onboardingen kommer däremot från Google och är riktiga.'],
              ['Testa gärna i mobilen.', 'Alla flöden är byggda mobil först. Desktop fungerar också.'],
            ]}
          />
        </Card>

        <Section title="Resa 1: Köpare">
          <Card>
            <Steps steps={BUYER_STEPS} />
          </Card>
        </Section>

        <Section title="Resa 2: Säljare">
          <Card>
            <Steps steps={SELLER_STEPS} />
          </Card>
        </Section>

        <Section title="Fortsätt på checklistan" intro="Allt på checklistan går att klicka. Det här är värt att köra igenom:">
          <div className="flex flex-col gap-2">
            {CHECKLIST_AREAS.map((a) => (
              <div key={a.where} className="rounded-[10px] bg-white border border-[#EEEEF0] px-4 py-3.5 flex flex-col gap-1">
                <span className="text-[15px] font-bold text-[#214766]">{a.where}</span>
                <p className="text-[14px] leading-5 text-[#214766]">{a.what}</p>
                <p className="text-[13px] leading-[19px] text-[#767678]">
                  <span className="font-semibold">Simulerat:</span> {a.simulated}
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-[10px] bg-[#EAF6F3] border border-[#9EE0D5] px-4 py-3.5 flex flex-col gap-1">
            <span className="text-[15px] font-bold text-[#1F6156]">Lampan tänd när du flyttar in</span>
            <p className="text-[14px] leading-5 text-[#1F6156]">
              Efter signerat elavtal bockas el av på checklistan och Näst på tur leder till bredband. Kolla att kedjan känns naturlig, det är den vi vill att kunden följer.
            </p>
          </div>
        </Section>

        <Section title="Titta efter det här" intro="Vi vill veta var det tar emot, inte bara om det fungerar.">
          <Card>
            <ol className="flex flex-col gap-2.5">
              {LOOK_FOR.map((q, i) => (
                <li key={q} className="flex items-start gap-3 text-[15px] leading-[21px] text-[#214766]">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF6F3] text-xs font-bold text-[#1F6156]">{i + 1}</span>
                  {q}
                </li>
              ))}
            </ol>
          </Card>
        </Section>

        <Section title="Så rapporterar du">
          <Card>
            <p className="text-[15px] leading-[21px] text-[#214766] mb-3">Skriv en kommentar på rätt skärm i Paper-filen Flyttsmart, sidan Web · Appen, eller skicka i chatten. Ta med:</p>
            <Bullets
              items={[
                ['Roll och steg.', 'Till exempel "Säljare, elavtal steg 3".'],
                ['Vad du gjorde och vad du väntade dig.', ''],
                ['Skärmbild.', 'Gärna hela skärmen så vi ser var på sidan du var.'],
                ['Enhet.', 'Mobil eller desktop, och vilken webbläsare.'],
              ]}
            />
            <p className="text-[13px] leading-[19px] text-[#767678] mt-3">Fel i texter räknas också. Skriv gärna hur du hade velat att det stod.</p>
          </Card>
        </Section>

        <Section title="Bra att veta">
          <div className="flex flex-col gap-2">
            <Note title="Omladdning nollställer det mesta">Laddar du om sidan mitt i ett tjänsteflöde börjar flödet om. Bokat städ och tillagda egna punkter kan också nollas. Det är demon, inte appen.</Note>
            <Note title="Ekvägen 8 finns inte i Göteborg">Skriver du in samma adress i säljarresan föreslår Google Grästorp. Välj vilken riktig adress som helst.</Note>
            <Note title="Kartan kan vara grå ett ögonblick">Onboardingens karta laddas efter adressen. Vänta en sekund innan du dömer.</Note>
            <Note title="Länkar som börjar på /app/">Det är den riktiga appen och fungerar inte i demon. Håll dig till länkar under {BASE.replace('https://', '')}/demo.</Note>
          </div>
        </Section>
      </div>
    </main>
  )
}

/* ---------- byggstenar för instruktionerna ---------- */

const Section = ({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-[24px] md:text-[28px] font-black tracking-[-0.01em] leading-8 text-[#214766]">{title}</h2>
    {intro && <p className="text-[15px] leading-[21px] text-[#767678] max-w-[560px]">{intro}</p>}
    {children}
  </section>
)

const Card = ({ children }: { children: React.ReactNode }) => <div className="rounded-[12px] bg-white border border-[#EEEEF0] p-4 md:p-5">{children}</div>

const Bullets = ({ items }: { items: [string, string][] }) => (
  <ul className="flex flex-col gap-2">
    {items.map(([lead, rest]) => (
      <li key={lead} className="flex items-start gap-2.5 text-[15px] leading-[21px] text-[#214766]">
        <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-[#51C8B4] shrink-0" />
        <span>
          <span className="font-semibold">{lead}</span>
          {rest ? ` ${rest}` : ''}
        </span>
      </li>
    ))}
  </ul>
)

const Steps = ({ steps }: { steps: { do: string; see: string }[] }) => (
  <ol className="flex flex-col">
    {steps.map((s, i) => (
      <li key={s.do} className={`flex items-start gap-3.5 py-3.5 ${i > 0 ? 'border-t border-[#EEEEF0]' : ''}`}>
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#214766] text-[13px] font-bold text-white">{i + 1}</span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold leading-[21px] text-[#214766]">{s.do}</span>
          <span className="text-[14px] leading-5 text-[#767678]">{s.see}</span>
        </span>
      </li>
    ))}
  </ol>
)

const Note = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-[10px] bg-[#FFF1E5] border-l-4 border-[#FFD4B3] px-4 py-3 flex flex-col gap-0.5">
    <span className="text-[15px] font-bold text-[#214766]">{title}</span>
    <p className="text-[14px] leading-5 text-[#214766]">{children}</p>
  </div>
)
