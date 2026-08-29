'use client'

import { useRouter, usePathname } from 'next/navigation'
import { isClientDemoMode } from '@/common/utils/demoMode'

const services = [
  {
    title: 'Flytthjälp & städ',
    description: 'Handplockade flyttfirmor och städbolag. Fasta priser.',
    highlight: 'Fasta priser',
    iconPath: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z',
  },
  {
    title: 'Elavtal',
    description: 'Jämför alla Sveriges elleverantörer. Byt på 2 minuter.',
    highlight: 'Upp till 30% billigare',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Bredband & TV',
    description: 'Se vilka leverantörer som finns på din adress.',
    highlight: 'Alla operatörer',
    iconPath: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0',
  },
  {
    title: 'Hemförsäkring',
    description: 'Rätt skydd från dag ett. Vi hjälper dig jämföra.',
    highlight: 'Skyddad från inflyttning',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Adressändring',
    description: 'Anmäl till Skatteverket och uppdatera alla avsändare.',
    highlight: 'Tar 2 minuter',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    title: 'Hantverkare',
    description: 'Montering, målning, installationer. Verifierade proffs.',
    highlight: 'Proffs nära dig',
    iconPath: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
  },
]

const steps = [
  {
    number: '1',
    title: 'Logga in med BankID',
    description: 'Säker identifiering. Vi hämtar din adress och sätter ihop din flytt-profil.',
  },
  {
    number: '2',
    title: 'Få din personliga checklista',
    description: 'Vi vet vad som behöver göras och i vilken ordning.',
  },
  {
    number: '3',
    title: 'Jämför och boka',
    description: 'Välj leverantörer, boka tjänster och bocka av. Allt på ett ställe.',
  },
]

const stats = [
  { value: '230 000+', label: 'Hjälpta flyttare' },
  { value: '40+', label: 'Leverantörer' },
  { value: '96%', label: 'Nöjda kunder' },
]

const Services = () => {
  const router = useRouter()
  const pathname = usePathname()
  const isDemoMode = isClientDemoMode()

  const loginUrl = '/i/testmode'

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-24">
      {/* Header */}
      <div className="mb-10 md:mb-14 max-w-[580px]">
        <p className="text-[var(--color-primary-main)] text-xs font-semibold uppercase tracking-widest mb-3">
          Våra tjänster
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-secondary-main)] mb-3 leading-snug">
          En flytt, ett ställe - allt ordnat
        </h1>
        <p className="text-[var(--color-secondary-main)]/55 text-[15px] leading-relaxed">
          Du slipper springa runt. Vi samlar allt du behöver för flytten på ett ställe.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden mb-14 md:mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white py-6 text-center">
            <div className="text-xl md:text-2xl font-bold text-[var(--color-primary-main)] mb-0.5">{stat.value}</div>
            <div className="text-[var(--color-secondary-main)]/45 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Services grid */}
      <div className="mb-14 md:mb-16">
        <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-5">Vad vi hjälper dig med</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden">
          {services.map((service) => (
            <div key={service.title} className="bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-main)]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-[var(--color-primary-main)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.iconPath} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-secondary-main)] mb-0.5">
                    {service.title}
                  </h3>
                  <p className="text-[var(--color-secondary-main)]/45 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-14 md:mb-16">
        <h2 className="text-base font-bold text-[var(--color-secondary-main)] mb-7">Så fungerar det</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="text-3xl font-bold text-[var(--color-primary-main)]/15 shrink-0 leading-none mt-0.5 select-none">
                {step.number}
              </span>
              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-secondary-main)] mb-1">{step.title}</h3>
                <p className="text-[var(--color-secondary-main)]/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[var(--color-secondary-main)] rounded-xl p-7 md:p-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h3 className="text-[15px] md:text-base font-bold text-white mb-1">Redo att flytta smartare?</h3>
          <p className="text-white/45 text-sm">Skapa ett konto på 2 minuter. Kostnadsfritt, alltid.</p>
        </div>
        <button
          onClick={() => router.push(loginUrl)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-primary-main)] text-white font-semibold text-sm hover:bg-[var(--color-primary-main)]/85 transition-colors shrink-0 whitespace-nowrap"
        >
          Kom igång gratis &rarr;
        </button>
      </div>
    </section>
  )
}

export default Services
