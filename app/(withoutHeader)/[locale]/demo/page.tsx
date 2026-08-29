import Link from 'next/link'
import { Metadata } from 'next'
import { PERSONAS, type DemoPersona } from '@/common/data/demoPersona'

export const metadata: Metadata = {
  title: 'Flyttsmart | Demo',
}

/**
 * Startsidan för demon. Två roller, två inbjudningslänkar. Varje länk börjar
 * om från början: inbjudan, onboarding, välkomstsida, checklista.
 */
export default function DemoStartPage() {
  const personas = Object.keys(PERSONAS) as DemoPersona[]
  return (
    <main className="min-h-screen bg-[#F8FAF9] px-4 py-10 md:py-16">
      <div className="mx-auto w-full max-w-[818px] flex flex-col gap-8">
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
      </div>
    </main>
  )
}
