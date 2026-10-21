'use client'

import { useState, type ReactNode } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import ImageKit from '@/components/atoms/ImageKit'
import { useDemoUser } from '@/common/data/useDemoUser'
import { writeDemoSession, type DemoAddress } from '@/common/data/demoPersona'
import type { Home } from './screens'
import { DayPicker, TextInput } from './ui'

/*
 * Dagens flyttsida, återskapad från live-koden i flyttsmart-next (OffertV2):
 * Från/Till/När, välkomstrutan, Dina framsteg och Kvar att göra, med sajtens
 * texter och klasser. Det enda som byts ut är Flytthjälp-kortet: på desktop
 * öppnas offertflödet inuti kortet precis som live, på mobil som ett ark
 * ovanpå sidan. När samtalet är bokat ersätts kortet av "Offert på väg".
 */

type Item = { type: string; icon: string; title: string; subtitle: string; link: string }

const ITEMS: Item[] = [
  { type: 'movehelp', icon: '/Common/Move_help_new_PtPweqWxS.svg', title: 'Flytthjälp', subtitle: 'Få en prisvärd flyttoffert - anpassad för just din flytt.', link: 'Få offert' },
  {
    type: 'moveclean',
    icon: '/Common/Cleaning_new_Mrf-43onJ.svg',
    title: 'Flyttstädning',
    subtitle: 'Jämför de bästa, mest prisvärda städfirmorna nära dig och boka direkt!',
    link: 'Boka flyttstädning',
  },
  { type: 'power', icon: '/Common/Electricity.svg', title: 'Elavtal', subtitle: 'Jämför, teckna och säg upp elavtal - Allt på ett ställe', link: 'Hantera elavtal' },
  { type: 'internet', icon: '/Common/Broadband_new_3cCspN6bV.svg', title: 'Bredband', subtitle: 'Se och jämför tillgängliga bredband till {{address}}', link: 'Hantera bredband' },
  {
    type: 'insurance',
    icon: '/Common/Insurance_new_s4siMfSOoh.svg',
    title: 'Hemförsäkring',
    subtitle: 'Få hjälp med din hemförsäkring till {{address}}',
    link: 'Flytta hemförsäkring',
  },
  { type: 'addresschange', icon: '/Common/Addresschange_new_wfU_gle-V.svg', title: 'Flyttanmälan', subtitle: 'Anmäl din flytt till Skatteverket här', link: 'Anmäl din flytt' },
]

export const ArrowRightThin = ({ className }: { className?: string }) => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" aria-hidden className={className}>
    <path d="M3.75 12.076H20.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.5 5.326L20.25 12.076L13.5 18.826" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronDown = ({ className }: { className?: string }) => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" aria-hidden className={className}>
    <path d="M6.75 9L12.75 15L18.75 9" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const CalendarPlus = () => (
  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" aria-hidden>
    <path
      d="M8.489 14.129H3C2.724 14.129 2.5 13.905 2.5 13.629V3.629C2.5 3.353 2.724 3.129 3 3.129H13C13.276 3.129 13.5 3.353 13.5 3.629V9.126"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M11 2.129V4.129M5 2.129V4.129M2.5 6.129H13.5M14.5 12.637H9.516M12.008 10.145V15.129" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseThin = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" aria-hidden>
    <path d="M19.25 5.25L5.75 18.75M19.25 18.75L5.75 5.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* En rad i den blå rutan: Från, Till, När. Som live: 70 px etikett, värdet från 88 px, och ett dragspel som fälls ut under raden. */
const HeaderRow = ({ label, value, className, open, onToggle }: { label: string; value: string; className?: string; open: boolean; onToggle: () => void }) => (
  <button
    type="button"
    aria-expanded={open}
    onClick={onToggle}
    className={clsx('relative flex h-10 w-full items-center rounded-[10px] text-left', open ? 'bg-[#3879AD]' : 'bg-[#214766]', className)}
  >
    <span className="flex h-10 w-[70px] shrink-0 items-center rounded-l-[10px] bg-[#3879AD] pl-2.5 text-lg font-bold text-white">{label}</span>
    <span className="absolute left-[88px] right-10 truncate text-lg font-bold text-white">{value}</span>
    <ChevronDown className={clsx('absolute right-3 text-white transition-transform', open && 'rotate-180')} />
  </button>
)

const SaveButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-2 inline-flex h-9 items-center justify-center rounded-full border-2 border-[var(--color-secondary-main)] px-10 text-[15px] font-bold text-[var(--color-secondary-main)]"
  >
    Spara
  </button>
)

/* Det utfällda formuläret under Från och Till, som live: vitt kort med adressen och, för Från, boarean. */
export const AddressForm = ({ address, kvm, onSave }: { address: DemoAddress; kvm?: number; onSave: (a: DemoAddress, kvm?: number) => void }) => {
  const [street, setStreet] = useState(address.street)
  const [zip, setZip] = useState(address.zip)
  const [city, setCity] = useState(address.city)
  const [area, setArea] = useState(kvm ? String(kvm) : '')
  return (
    <div className="mt-1 rounded-[10px] bg-white p-2.5">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <TextInput value={street} onChange={setStreet} placeholder="Gatuadress" label="Gatuadress" />
        </div>
        <TextInput value={zip} onChange={setZip} placeholder="Postnummer" label="Postnummer" type="tel" />
        <TextInput value={city} onChange={setCity} placeholder="Ort" label="Ort" />
        {kvm !== undefined && <TextInput value={area} onChange={setArea} placeholder="Boarea (m²)" label="Boarea i kvadratmeter" type="number" />}
      </div>
      <SaveButton
        onClick={() => onSave({ ...address, street: street.trim() || address.street, zip: zip.trim(), city: city.trim() }, kvm !== undefined ? Number(area) || kvm : undefined)}
      />
    </div>
  )
}

const ActivityCard = ({ item, address, onClick }: { item: Item; address: string; onClick?: () => void }) => (
  <div
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={(e) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick()
    }}
    className="group relative mb-3 flex min-h-22 w-full cursor-pointer flex-col items-start justify-start rounded-[8px] border-2 border-white bg-white p-3 shadow-[0_4px_8px_rgba(0,0,0,0.08)] md:min-h-[84px] hover:[&_.activity-title]:underline"
  >
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center pr-2">
        <div className="relative mr-2 h-7 w-7 shrink-0 md:mx-[14px] md:h-9 md:w-9">
          <ImageKit src={item.icon} alt="" />
        </div>
        <div>
          <div className="activity-title pb-1 text-[15px] font-bold leading-4 text-[var(--color-text-main)] md:text-[18px]">{item.title}</div>
          <div className="text-[13px] font-normal text-[#626263] md:text-[15px]">{item.subtitle.replace('{{address}}', address)}</div>
        </div>
      </div>
      <div className="ml-2 flex shrink-0 items-center justify-center text-[var(--color-secondary-main)]">
        <span className="hidden pr-1 underline md:inline">{item.link}</span>
        <ArrowRightThin />
      </div>
    </div>
  </div>
)

type Props = {
  home: Home
  /** Steget som ska visas inuti Flytthjälp-kortet (desktop). */
  inline?: ReactNode
  /** Kortet "Offert på väg" som ersätter Flytthjälp-kortet när samtalet är bokat. */
  card?: ReactNode
  /** Begär offert: välkomstrutans knapp och Flytthjälp-kortet. */
  onOffer: () => void
}

const LiveMovePage = ({ home, inline, card, onOffer }: Props) => {
  const [welcome, setWelcome] = useState(true)
  const [open, setOpen] = useState<'fran' | 'till' | 'nar' | null>(null)
  const move = useDemoUser().currentMove
  const toggle = (row: 'fran' | 'till' | 'nar') => setOpen((o) => (o === row ? null : row))

  return (
    <div className="flex w-full flex-col items-center bg-[#E7ECF0] pb-10">
      {/* TopSection */}
      <div className="w-full px-3 pb-0 pt-8 md:w-[818px] md:px-0">
        <div className="mx-auto flex w-full max-w-[900px] items-start justify-center gap-4 md:w-[818px]">
          <div className="relative w-full rounded-[10px] bg-[#244D71] p-3 sm:p-4 md:px-4 md:py-6">
            <HeaderRow label="Från" value={home.from} open={open === 'fran'} onToggle={() => toggle('fran')} />
            {open === 'fran' && (
              <AddressForm
                key={`fran-${home.from}`}
                address={move.fromAddress}
                kvm={home.fromKvm}
                onSave={(a, kvm) => {
                  writeDemoSession({ fromAddress: a, fromResidenceSize: kvm })
                  setOpen(null)
                }}
              />
            )}
            <HeaderRow label="Till" value={home.to} className="mt-1" open={open === 'till'} onToggle={() => toggle('till')} />
            {open === 'till' && (
              <AddressForm
                key={`till-${home.to}`}
                address={move.toAddress}
                onSave={(a) => {
                  writeDemoSession({ toAddress: a })
                  setOpen(null)
                }}
              />
            )}
            <div className="mt-1 flex w-full items-center">
              <HeaderRow label="När" value={home.moveDateFull} className="flex-1" open={open === 'nar'} onToggle={() => toggle('nar')} />
              <span className="ml-2 flex h-[30px] w-[33.5px] shrink-0 items-center justify-center rounded-full border border-white">
                <CalendarPlus />
              </span>
            </div>
            {open === 'nar' && (
              <div className="mt-1 rounded-[10px] bg-white p-2.5">
                <DayPicker
                  value={home.moveDateIso}
                  start={home.moveDateIso}
                  label="Flyttdag"
                  placeholder="Välj flyttdag"
                  onChange={(iso) => {
                    writeDemoSession({ movingDate: `${iso}T12:00:00` })
                    setOpen(null)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* WelcomeSection. Borta när samtalet är bokat: då bär kortet i listan läget och vägen vidare (David 20 okt). */}
      {welcome && !card && (
        <section className="relative mx-[15px] mt-8 flex w-[calc(100%-30px)] items-center justify-start rounded-[10px] bg-white p-[30px_16px_24px_24px] shadow-[0_4px_8px_rgba(0,0,0,0.08)] md:mx-auto md:mt-12 md:w-[818px]">
          <div className="flex w-full flex-col">
            <p className="text-left text-[20px] font-bold leading-6 text-[var(--color-secondary-main)]">Välkommen till din flyttsida!</p>
            <div className="flex flex-col items-center justify-center gap-6 pt-4 md:flex-row md:items-start md:gap-8 md:pr-4 md:pt-3">
              <div className="flex w-full flex-col">
                <p className="text-left text-[16px] leading-5 text-[var(--color-secondary-dark)]">Dags att göra din flytt smidig och stressfri.</p>
                <p className="text-left text-[16px] leading-5 text-[var(--color-secondary-dark)]">Börja med att få en kostnadsfri offert på flytthjälp och flyttstädning.</p>
                {/* Ingen namngiven koordinator: löftet är att vi hör av oss, och den som ringer är sällan samma person (David 21 okt). */}
              </div>
              <button
                type="button"
                onClick={onOffer}
                className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2.5 rounded-full border-2 border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] py-2.5 pl-8 pr-4 text-[16px] font-bold text-white md:w-auto md:px-8 md:py-1"
              >
                Få kostnadsfri offert
                <ArrowRightThin className="h-5 w-5" />
              </button>
            </div>
          </div>
          <button type="button" aria-label="Stäng" onClick={() => setWelcome(false)} className="absolute right-2 top-2 text-[var(--color-secondary-main)] md:right-4 md:top-3">
            <CloseThin />
          </button>
        </section>
      )}

      {/* ProgressBar */}
      <div className="w-full max-w-[818px] px-3 md:px-0">
        <div className="mt-6 w-full rounded-lg bg-white px-3 py-4 shadow-sm md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--color-secondary-dark)] md:text-lg">Dina framsteg</h3>
            <span className="text-sm font-bold text-[var(--color-secondary-main)] md:text-base">1 av 6 klara</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#5DD3CA]">
            <div className="h-full rounded-full bg-[#2C4C6E]" style={{ width: '17%' }} />
          </div>
        </div>
      </div>

      {/* ActivitiesSection */}
      <div className="mx-auto w-full max-w-[818px] px-3 pb-6 pt-6 md:w-[818px] md:px-0">
        <p className="pb-3 text-center text-lg leading-tight tracking-wider text-[var(--color-secondary-dark)] md:text-left md:text-xl">Kvar att göra</p>
        {ITEMS.map((item) => {
          if (item.type === 'movehelp' && inline) {
            return (
              <div
                key={item.type}
                id="flytt-inline"
                className="mb-3 w-full scroll-mt-20 rounded-[8px] border-2 border-white bg-white p-3 shadow-[0_4px_8px_rgba(0,0,0,0.08)] md:p-5"
              >
                {inline}
              </div>
            )
          }
          if (item.type === 'movehelp' && card) {
            return (
              <div key={item.type} id="flytt-inline" className="scroll-mt-20">
                {card}
              </div>
            )
          }
          return <ActivityCard key={item.type} item={item} address={home.to} onClick={item.type === 'movehelp' ? onOffer : undefined} />
        })}
      </div>
    </div>
  )
}

export default LiveMovePage
