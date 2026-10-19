'use client'

import { useState } from 'react'
import { Check, ChevronRight, Zap } from 'lucide-react'
import clsx from 'clsx'
import {
  AVSTAND_LABEL,
  BIYTA_LABEL,
  BOHAG_LABEL,
  EXTRA_LABEL,
  FLER_LABEL,
  HISS_LABEL,
  answeredCount,
  answeredQuestions,
  flerCount,
  type Answers,
  type Avstand,
  type Biyta,
  type Bohag,
  type Extra,
  type FlerKey,
  type Hiss,
} from './state'
import { Chip, CloseButton, ContactBox, Eyebrow, FieldLabel, GreenHead, JaNejRow, PrimaryButton, SavedStatus, Sheet, TextLink, Timeline, Toggle } from './ui'

export type Home = { from: string; to: string; fromKvm: number; moveDay: string; moveDayLong: string; firstName: string }

export type ScreenProps = {
  a: Answers
  update: (patch: Partial<Answers> | ((prev: Answers) => Partial<Answers>)) => void
  go: (step: number) => void
  home: Home
}

const nextUnanswered = (a: Answers) => {
  const idx = answeredQuestions(a).findIndex((x) => !x)
  return idx === -1 ? 6 : idx + 2
}

/* 1 · Klart, och belöningen */
export const KlartScreen = ({ a, update, go, home }: ScreenProps) => (
  <div className="bg-white pb-8">
    <GreenHead title="Tack, vi ringer dig." sub={`Din förfrågan om flytthjälp, ${home.from} till ${home.to} ${home.moveDay}, är mottagen. En säljare ringer med pris, oftast inom två vardagar.`} />
    <div className="px-4 pt-4">
      <div className="rounded-2xl bg-[var(--color-secondary-extra-extra-light)] p-5">
        <h2 className="text-[18px] font-bold leading-6 text-[var(--color-secondary-main)]">Vill du ha pris snabbare?</h2>
        <p className="mt-2 text-[15px] leading-[22px] text-[var(--color-secondary-main)]">Svara på några frågor om flytten, det tar två minuter. Då ringer vi med priset klart i stället för att fråga.</p>
        <PrimaryButton className="mt-4" onClick={() => go(nextUnanswered(a))}>
          Svara nu · två minuter
        </PrimaryButton>
        <div className="mt-3 flex justify-center">
          <TextLink
            onClick={() => {
              update({ requested: true })
              go(0)
            }}
          >
            Jag väntar på samtalet
          </TextLink>
        </div>
      </div>
    </div>
    <div className="mt-6">
      <Timeline
        rows={[
          { when: 'I dag', what: 'Bekräftelsen kommer på sms.' },
          { when: 'Inom två vardagar', what: 'En säljare ringer med priset.' },
          { when: 'Efter samtalet', what: 'Du bokar om priset känns rätt. Inget betalas nu.' },
        ]}
      />
    </div>
    <div className="mt-5">
      <ContactBox />
    </div>
  </div>
)

const ExitSheet = ({ saved, onContinue, onLater, onCall }: { saved: number; onContinue: () => void; onLater: () => void; onCall: (t: string) => void }) => {
  const [times, setTimes] = useState(false)
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end bg-[var(--color-secondary-main)]/40" role="dialog" aria-modal>
      <button type="button" aria-label="Fortsätt svara" className="flex-1" onClick={onContinue} />
      <div className="rounded-t-[28px] bg-white px-6 pb-8 pt-3">
        <span className="mx-auto block h-1.5 w-10 rounded-full bg-[var(--color-inactive-grey-light)]" />
        <p className="mt-5 flex items-center gap-2 text-[14px] text-[var(--color-primary-dark)]">
          <Check size={16} strokeWidth={3} />
          {saved === 0 ? 'Inga svar än' : `${['Ett', 'Två', 'Tre', 'Fyra'][saved - 1]} av fyra svar sparade`}
        </p>
        <h2 className="mt-2 text-[22px] font-bold text-[var(--color-secondary-main)]">Vill du fortsätta senare?</h2>
        <p className="mt-1 text-[15px] text-[var(--color-inactive-dark)]">Dina svar är sparade. Säljaren ser dem när vi ringer.</p>
        <PrimaryButton tone="navy" className="mt-5" onClick={onLater}>
          Spara och fortsätt senare
        </PrimaryButton>
        <div className="mt-4 flex justify-center">
          <TextLink onClick={() => setTimes((v) => !v)}>Hellre att vi ringer och gör klart?</TextLink>
        </div>
        {times && (
          <div className="mt-4">
            <p className="text-[13px] text-[var(--color-inactive-dark)]">Vill du bli uppringd, när passar det?</p>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {['08–10', '10–12', '13–15', '15–17'].map((t) => (
                <Chip key={t} onClick={() => onCall(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        )}
        <p className="mt-4 text-center text-[12px] text-[var(--color-inactive-dark)]">Vi påminner dig en gång, i morgon förmiddag.</p>
      </div>
    </div>
  )
}

const QuestionFrame = ({ a, update, go, step, title, sub, savedChip, children, cta, foot, ctaTone = 'navy', onNext, nextDisabled }: ScreenProps & { step: number; title: string; sub?: string; savedChip?: string; children: React.ReactNode; cta: string; foot: string; ctaTone?: 'navy' | 'orange'; onNext: () => void; nextDisabled?: boolean }) => {
  const [exit, setExit] = useState(false)
  const saved = answeredCount(a)
  return (
    <div className="relative bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-inactive-main)] px-5 py-3">
        <SavedStatus>{savedChip}</SavedStatus>
        <CloseButton onClick={() => setExit(true)} />
      </div>
      <Sheet step={step} total={4} title={title} sub={sub}>
        {children}
        <PrimaryButton tone={ctaTone} className="mt-6" onClick={onNext} disabled={nextDisabled}>
          {cta}
        </PrimaryButton>
        <p className="mt-3 text-center text-[12px] text-[var(--color-inactive-dark)]">{foot}</p>
      </Sheet>
      {exit && (
        <ExitSheet
          saved={saved}
          onContinue={() => setExit(false)}
          onLater={() => {
            update({ requested: true })
            go(0)
          }}
          onCall={(t) => {
            update({ requested: true, ringtid: t })
            go(0)
          }}
        />
      )}
    </div>
  )
}

const Tile = ({ label, hint, selected, onClick, icon }: { label: string; hint: string; selected: boolean; onClick: () => void; icon: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={clsx('flex flex-col items-center gap-1 rounded-2xl border-[1.5px] px-2 py-4 text-center transition-colors', selected ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-grey-light)] bg-white')}
  >
    <span className="text-[var(--color-secondary-main)]">{icon}</span>
    <span className="mt-1 text-[15px] font-bold text-[var(--color-secondary-main)]">{label}</span>
    <span className="text-[12px] text-[var(--color-inactive-dark)]">{hint}</span>
  </button>
)

const BoxIcon = ({ count }: { count: 1 | 2 | 3 }) => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    {count >= 1 && <rect x="10" y="14" width="16" height="12" rx="1.5" />}
    {count >= 2 && <rect x="1" y="14" width="16" height="12" rx="1.5" fill="#fff" />}
    {count >= 2 && <rect x="19" y="14" width="16" height="12" rx="1.5" fill="#fff" />}
    {count >= 3 && <rect x="10" y="2" width="16" height="12" rx="1.5" fill="#fff" />}
  </svg>
)

/* 2 · Hur mycket ska med */
export const BohagScreen = (p: ScreenProps) => {
  const { a, update, go, home } = p
  const set = (patch: Partial<Answers>) => update(patch)
  return (
    <QuestionFrame {...p} step={1} title="Hur mycket ska med?" sub={`Jämfört med andra hem på ${home.fromKvm} kvadrat.`} cta="Fortsätt" foot="Osäker? Välj Normalt. Säljaren stämmer av i samtalet." onNext={() => go(3)} nextDisabled={!a.bohag}>
      <div className="mt-5 grid grid-cols-3 gap-3">
        {(
          [
            ['lite', 'Lite', 'Glest möblerat', 1],
            ['normalt', 'Normalt', 'Som de flesta', 2],
            ['mycket', 'Mycket', 'Fulla skåp', 3],
          ] as [Bohag, string, string, 1 | 2 | 3][]
        ).map(([v, label, hint, n]) => (
          <Tile key={v} label={label} hint={hint} selected={a.bohag === v} onClick={() => set({ bohag: v })} icon={<BoxIcon count={n} />} />
        ))}
      </div>
      <div className="mt-6">
        <FieldLabel>Förråd, vind eller garage också?</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {(['forrad', 'vind', 'garage', 'uterum', 'nej'] as Biyta[]).map((v) => (
            <Chip key={v} selected={a.biyta === v} onClick={() => set({ biyta: v })}>
              {v === 'nej' ? 'Nej' : BIYTA_LABEL[v]}
            </Chip>
          ))}
        </div>
      </div>
      {a.biyta && a.biyta !== 'nej' && (
        <div className="mt-4 rounded-2xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] text-[var(--color-secondary-main)]">{BIYTA_LABEL[a.biyta]}et är ungefär</span>
            <label className="flex h-11 w-24 items-center rounded-xl border-[1.5px] border-[var(--color-secondary-main)] bg-white px-3">
              <input type="number" inputMode="numeric" value={a.biytaKvm} onChange={(e) => set({ biytaKvm: Number(e.target.value) })} className="w-10 bg-transparent text-[16px] font-bold text-[var(--color-secondary-main)] outline-none" aria-label="Kvadratmeter" />
              <span className="text-[13px] text-[var(--color-inactive-dark)]">kvm</span>
            </label>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[15px] text-[var(--color-secondary-main)]">Ska det städas också?</span>
            <div className="flex gap-2">
              {(['nej', 'ja'] as const).map((v) => (
                <Chip key={v} small selected={a.biytaStad === v} onClick={() => set({ biytaStad: v })}>
                  {v === 'ja' ? 'Ja' : 'Nej'}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}
    </QuestionFrame>
  )
}

const FLOORS = ['BV', '1', '2', '3', '4', '5', '6+']

/* 3 · Där hon bor i dag */
export const FranScreen = (p: ScreenProps) => {
  const { a, update, go, home } = p
  const floor = Number(a.vaning?.replace('+', '') ?? NaN)
  const askHiss = !Number.isNaN(floor) && floor >= 3
  const ok = !!a.vaning && (!askHiss || !!a.hiss) && !!a.avstandFran
  return (
    <QuestionFrame {...p} step={2} title={`Hur ser det ut på ${home.from}?`} savedChip={a.biyta && a.biyta !== 'nej' ? `Sparat. ${BIYTA_LABEL[a.biyta]}et är med i underlaget.` : a.bohag ? 'Sparat. Bohaget är med i underlaget.' : undefined} cta="Fortsätt" foot="Hissen och bärsträckan avgör hur många som behövs." onNext={() => go(4)} nextDisabled={!ok}>
      <div className="mt-5">
        <FieldLabel>Vilken våning bor du på?</FieldLabel>
        <div className="flex gap-1.5">
          {FLOORS.map((f) => (
            <button key={f} type="button" aria-pressed={a.vaning === f} onClick={() => update({ vaning: f, hiss: Number(f.replace('+', '')) >= 3 ? a.hiss : undefined })} className={clsx('flex h-11 min-w-0 flex-1 items-center justify-center rounded-full text-[14px] transition-colors', a.vaning === f ? 'bg-[var(--color-secondary-main)] font-bold text-white' : 'border-[1.5px] border-[var(--color-inactive-grey-light)] bg-white text-[var(--color-secondary-main)]')}>
              {f}
            </button>
          ))}
        </div>
      </div>
      {askHiss && (
        <div className="mt-4 rounded-2xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <FieldLabel>Finns det hiss? Antalet står på skylten i hissen.</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ['stor', 'Stor, minst 4 personer'],
                ['liten', 'Liten, 2–3 personer'],
                ['ingen', 'Ingen hiss'],
              ] as [Hiss, string][]
            ).map(([v, label]) => (
              <Chip key={v} selected={a.hiss === v} onClick={() => update({ hiss: v })}>
                {label}
              </Chip>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5">
        <FieldLabel sub="Från porten till där en lastbil kan stanna. En gissning räcker.">Hur nära kan flyttbilen stå?</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(AVSTAND_LABEL) as Avstand[]).map((v) => (
            <Chip key={v} selected={a.avstandFran === v} onClick={() => update({ avstandFran: v })}>
              {AVSTAND_LABEL[v]}
            </Chip>
          ))}
        </div>
      </div>
    </QuestionFrame>
  )
}

/* 4 · Dit hon flyttar */
export const TillScreen = (p: ScreenProps) => {
  const { a, update, go, home } = p
  const [note, setNote] = useState(false)
  return (
    <QuestionFrame {...p} step={3} title={`Och på ${home.to}?`} sub="Villa enligt onboardingen, så vi hoppar över våning och hiss." savedChip={a.hiss ? `Sparat. ${HISS_LABEL[a.hiss].charAt(0).toUpperCase() + HISS_LABEL[a.hiss].slice(1)} är med i underlaget.` : undefined} cta="Fortsätt" foot="Kortaste frågan. Bara det som ändrar priset." onNext={() => go(5)} nextDisabled={!a.avstandTill}>
      <div className="mt-5">
        <FieldLabel sub="Från där lastbilen kan stå till dörren. En gissning räcker.">Hur nära kan flyttbilen stå?</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(AVSTAND_LABEL) as Avstand[]).map((v) => (
            <Chip key={v} selected={a.avstandTill === v} onClick={() => update({ avstandTill: v })}>
              {AVSTAND_LABEL[v]}
            </Chip>
          ))}
        </div>
      </div>
      <div className="mt-5">
        {note ? (
          <textarea value={a.tillNotering} onChange={(e) => update({ tillNotering: e.target.value })} placeholder="Till exempel: brant backe, bommen är låst, smal grusväg" className="min-h-24 w-full rounded-xl border-[1.5px] border-[var(--color-inactive-grey-light)] p-3 text-[15px] text-[var(--color-secondary-main)] outline-none focus:border-[var(--color-secondary-main)]" />
        ) : (
          <TextLink onClick={() => setNote(true)}>Trappor, backe eller trång gata? Skriv en rad</TextLink>
        )}
      </div>
    </QuestionFrame>
  )
}

/* 5 · Sista frågan */
export const SistaScreen = (p: ScreenProps) => {
  const { a, update, go } = p
  const toggle = (v: Extra) =>
    update((prev) => {
      let extra: Extra[]
      if (v === 'inget') extra = prev.extra.includes('inget') ? [] : ['inget']
      else extra = prev.extra.includes(v) ? prev.extra.filter((x) => x !== v) : [...prev.extra.filter((x) => x !== 'inget'), v]
      return { extra, extraTouched: extra.length > 0 }
    })
  const has = (v: Extra) => a.extra.includes(v)
  return (
    <QuestionFrame {...p} step={4} title="Finns något av det här?" sub="Välj det som stämmer, eller inget." savedChip={a.avstandTill ? 'Sparat. Bärsträckan är med i underlaget.' : undefined} cta="Spara och gå vidare" ctaTone="orange" foot="Inget bokas. Svaren sparas, säljaren ringer." onNext={() => go(6)} nextDisabled={!a.extraTouched}>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {(['tungt', 'omtaligt', 'balkong', 'fonster'] as Extra[]).map((v) => {
          const [label, hint] = EXTRA_LABEL[v].split(' (')
          return (
            <button key={v} type="button" aria-pressed={has(v)} onClick={() => toggle(v)} className={clsx('flex min-h-[88px] flex-col justify-between rounded-2xl border-[1.5px] p-3 text-left transition-colors', has(v) ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-grey-light)] bg-white')}>
              <span className={clsx('flex h-6 w-6 items-center justify-center rounded-md border-[1.5px]', has(v) ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] text-white' : 'border-[var(--color-inactive-grey-light)]')}>{has(v) && <Check size={14} strokeWidth={3} />}</span>
              <span>
                <span className="block text-[15px] font-bold text-[var(--color-secondary-main)]">{label}</span>
                {hint && <span className="block text-[12px] text-[var(--color-inactive-dark)]">{hint.replace(')', '')}</span>}
              </span>
            </button>
          )
        })}
      </div>
      <div className="pt-3">
        <button type="button" aria-pressed={has('inget')} onClick={() => toggle('inget')} className={clsx('flex h-12 w-full items-center justify-center rounded-2xl border-[1.5px] text-[15px] font-bold transition-colors', has('inget') ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)] text-[var(--color-secondary-main)]' : 'border-[var(--color-inactive-grey-light)] bg-white text-[var(--color-secondary-main)]')}>
          Inget av det här
        </button>
      </div>
      {has('balkong') && (
        <div className="mt-4 rounded-2xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <FieldLabel>Hur stor är balkongen?</FieldLabel>
          <div className="flex gap-2">
            {(['liten', 'mellan', 'stor'] as const).map((v) => (
              <Chip key={v} selected={a.balkongStorlek === v} onClick={() => update({ balkongStorlek: v })}>
                {v === 'liten' ? 'Liten' : v === 'mellan' ? 'Mellan' : 'Stor'}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </QuestionFrame>
  )
}

const RINGTIDER = ['Mån 13–15', 'Mån 15–17', 'Tis 08–10', 'Tis 10–12']

/* 6 · Fler frågor, frivilligt */
export const FlerScreen = ({ a, update, go }: ScreenProps) => {
  const setFler = (k: FlerKey, v: 'ja' | 'nej') => update((prev) => ({ fler: { ...prev.fler, [k]: v } }))
  const rows: [FlerKey, string][] = [
    ['stadning', 'Vill du ha flyttstädning när det är tomt?'],
    ['packhjalp', 'Vill du ha packhjälp?'],
    ['lador', 'Vill du låna flyttlådor?'],
    ['forvaring', 'Behöver du förvaring en tid?'],
    ['bortforsling', 'Något som ska bort, till återvinning?'],
    ['vardesaker', 'Har du något som är värt över 30 000 kr?'],
    ['montering', 'Vill du ha hjälp att skruva isär och ihop möbler?'],
    ['utemobler', 'Utemöbler som ska med?'],
  ]
  return (
    <div className="bg-white pb-8">
      <GreenHead title="Fyra av fyra sparade." sub="Vill du berätta mer? Allt här är frivilligt. Varje svar sparas direkt, och säljaren slipper fråga." />
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-[var(--color-inactive-main)] px-4 pt-4 pb-1">
          <h2 className="text-[16px] font-bold text-[var(--color-secondary-main)]">Mer om flytten</h2>
          <p className="mb-2 text-[13px] text-[var(--color-inactive-dark)]">Svara på det du vet. Resten tar vi i samtalet.</p>
          {rows.map(([k, label]) => (
            <JaNejRow key={k} label={label} value={a.fler[k]} onChange={(v) => setFler(k, v)} />
          ))}
          <div className="flex items-center justify-between gap-4 border-t border-[var(--color-inactive-main)] py-3">
            <span className="text-[15px] text-[var(--color-secondary-main)]">Jag är på plats vid flytten</span>
            <Toggle on={a.paPlats} onChange={(v) => update({ paPlats: v })} />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[var(--color-inactive-main)] py-3">
            <span className="text-[15px] text-[var(--color-secondary-main)]">Portkod och nycklar</span>
            <Chip>Lägg till</Chip>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-[var(--color-inactive-main)] py-3">
            <span className="text-[15px] text-[var(--color-secondary-main)]">Något mer vi bör veta?</span>
            <Chip>Skriv</Chip>
          </div>
        </div>
        <div className="mt-6">
          <FieldLabel>När passar det att vi ringer?</FieldLabel>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {RINGTIDER.map((t) => (
              <Chip key={t} selected={a.ringtid === t} onClick={() => update({ ringtid: t })}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <PrimaryButton
          tone="navy"
          className="mt-6"
          onClick={() => {
            update({ requested: true, extraDone: true })
            go(7)
          }}
        >
          Klar
        </PrimaryButton>
        <p className="mt-3 text-center text-[12px] text-[var(--color-inactive-dark)]">Allt sparas direkt. Du kan ändra tills vi ringer.</p>
      </div>
    </div>
  )
}

export const answerLines = (a: Answers, home: Home): string[] => {
  const lines: string[] = []
  const l1 = [a.bohag ? `${BOHAG_LABEL[a.bohag]}, ${home.fromKvm} kvm` : null, a.biyta && a.biyta !== 'nej' ? `${BIYTA_LABEL[a.biyta]} ${a.biytaKvm} kvm` : null].filter(Boolean)
  if (l1.length) lines.push(l1.join(' · '))
  const l2 = [a.vaning ? `Våning ${a.vaning}${a.hiss ? `, ${HISS_LABEL[a.hiss]}` : ''}` : null, a.avstandFran ? `${AVSTAND_LABEL[a.avstandFran]} till bilen` : null].filter(Boolean)
  if (l2.length) lines.push(l2.join(' · '))
  if (a.avstandTill) lines.push(`${home.to}: ${AVSTAND_LABEL[a.avstandTill].toLowerCase()} från bilen`)
  if (a.extra.length) lines.push(a.extra.map((e) => EXTRA_LABEL[e].split(' (')[0]).join(', '))
  const fler = (Object.keys(a.fler) as FlerKey[]).map((k) => `${FLER_LABEL[k]}: ${a.fler[k]}`)
  if (fler.length) lines.push(fler.join(' · '))
  if (a.ringtid) lines.push(`Ring gärna ${a.ringtid.toLowerCase()}`)
  return lines
}

/* 7 · Allt sparat */
export const SparatScreen = ({ a, go, home }: ScreenProps) => (
  <div className="bg-white pb-8">
    <GreenHead title="Allt sparat. Tack!" sub="En säljare ringer med ett pris som bygger på dina svar, oftast inom två vardagar." />
    <div className="pt-5">
      <Timeline
        rows={[
          { when: 'I dag', what: 'Dina svar är sparade.' },
          { when: 'Inom två vardagar', what: 'Vi ringer med priset. Samtalet blir kort, vi har dina svar.' },
          { when: 'Efter samtalet', what: 'Du bokar om priset känns rätt. Inget betalas nu.' },
        ]}
      />
    </div>
    <div className="mx-4 mt-5 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-bold text-[var(--color-secondary-main)]">Dina svar</span>
        <TextLink onClick={() => go(2)}>Ändra</TextLink>
      </div>
      <ul className="mt-2 space-y-1 text-[14px] leading-[21px] text-[var(--color-inactive-dark)]">
        {answerLines(a, home).map((l) => (
          <li key={l}>{l}</li>
        ))}
        {answerLines(a, home).length === 0 && <li>Inga svar än. Säljaren frågar i samtalet.</li>}
      </ul>
    </div>
    <div className="mt-4">
      <ContactBox />
    </div>
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-[var(--color-inactive-main)] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-lighter)] text-[var(--color-accent-main)]">
        <Zap size={20} />
      </span>
      <span className="flex-1">
        <Eyebrow>Näst på tur · 5 av 7</Eyebrow>
        <span className="block text-[15px] font-bold text-[var(--color-secondary-main)]">El till {home.to}</span>
        <span className="block text-[13px] text-[var(--color-inactive-dark)]">1 035 kr rabatt hos Fortum, bara via Flyttsmart.</span>
      </span>
      <Chip onClick={() => go(0)}>Välj</Chip>
    </div>
  </div>
)

/* 8 · Sms:et nästa förmiddag */
export const SmsScreen = ({ home }: ScreenProps) => (
  <div className="flex min-h-[640px] flex-col items-center bg-gradient-to-b from-[#2B4A68] to-[#0E2236] px-4 pb-10 pt-14 text-white">
    <p className="text-[15px] text-white/80">i morgon förmiddag</p>
    <p className="text-[72px] font-bold leading-none">09:05</p>
    <div className="mt-10 w-full rounded-2xl bg-white/95 p-4 text-[var(--color-inactive-super-dark)] shadow-xl">
      <div className="flex items-center justify-between text-[12px] text-[var(--color-inactive-dark)]">
        <span className="flex items-center gap-2">
          <span className="block h-5 w-5 rounded-md bg-[#34C759]" /> MEDDELANDEN
        </span>
        <span>nu</span>
      </div>
      <p className="mt-1 text-[15px] font-bold">Flyttsmart</p>
      <p className="whitespace-pre-wrap text-[15px] leading-[21px]">{`Hej ${home.firstName}! Tack för din förfrågan om flytthjälp till ${home.to}. Vi ringer dig inom två vardagar. Vill du ha pris snabbare? Svara på några frågor här, det tar två minuter: flyttsmart.se/p/K7Q2M9XA\nUndrar du något? Svara här så ringer vi.\n/Flyttsmart`}</p>
    </div>
  </div>
)

/* 9 · Säljaren ringer med svaren framför sig */
export const SaljareScreen = ({ a, home }: ScreenProps) => {
  const n = answeredCount(a)
  const rank = a.ringtid ? 1 : n === 4 ? 2 : n > 0 ? 3 : a.requested ? 4 : 5
  const events = [`lör 19:32 · begärde pris${n ? ` och svarade på ${['en', 'två', 'tre', 'fyra'][n - 1]} frågor` : ''}`, 'mån 09:05 · fick sms:et med länken', n < 4 ? 'mån 10:02 · öppnade frågorna igen, svarade inte' : 'mån 10:02 · svarade på alla fyra, från mobilen']
  const ordering = ['Har valt en tid för samtal', 'Svarade på alla fyra frågorna', 'Svarade på några', 'Begärde pris utan att svara', 'Tryckte på kortet utan att begära']
  return (
    <div className="bg-[var(--color-inactive-quite-light)] px-4 py-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">{home.firstName} Andersson</p>
            <p className="text-[13px] text-[var(--color-inactive-dark)]">Demomäklaren · flytt {home.moveDay}</p>
          </div>
          <span className="rounded-full bg-[var(--color-accent-lighter)] px-3 py-1 text-[12px] font-bold text-[var(--color-accent-dark-main)]">Svarade {n} av 4</span>
        </div>
        <div className="mt-4 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">Pris begärt, inget pris ännu</p>
          <p className="text-[13px] text-[var(--color-inactive-dark)]">
            Flytthjälp. {n} av 4 prisfrågor svarade, {flerCount(a)} av 9 övriga. Guiden hoppar över dem.
          </p>
        </div>
        <Eyebrow className="mt-5">Det här har hon gjort</Eyebrow>
        <ul className="mt-2 space-y-1 text-[14px] text-[var(--color-secondary-main)]">
          {events.map((e, i) => (
            <li key={e} className={clsx(i === events.length - 1 && 'font-bold')}>
              {e}
            </li>
          ))}
        </ul>
        <Eyebrow className="mt-5">Öppna så här</Eyebrow>
        <p className="mt-2 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4 text-[15px] leading-[22px] text-[var(--color-secondary-main)]">
          Hej {home.firstName}, det är Nina på Flyttsmart. Jag ser att du begärt pris på flytten till {home.to.split(' ')[0]}
          {n > 0 ? ' och svarat på några frågor' : ''}. Jag har {n === 4 ? 'inga' : ['fyra', 'tre', 'två', 'en'][n]} frågor till, sedan har jag ett pris till dig.
        </p>
        <Eyebrow className="mt-5">Sortering i kön · ett ärende i taget, alltid kö</Eyebrow>
        <ol className="mt-2 space-y-1">
          {ordering.map((o, i) => (
            <li key={o} className={clsx('flex gap-3 text-[14px]', i + 1 === rank ? 'font-bold text-[var(--color-secondary-main)]' : 'text-[var(--color-inactive-dark)]')}>
              <span className="w-4">{i + 1}</span>
              {o}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* Kortet på flyttsidan när hon begärt pris: läget, inte priset. */
export const RequestedCard = ({ a, go, home }: ScreenProps) => {
  const n = answeredCount(a)
  const done = n === 4 && a.extraDone
  return (
    <div className="rounded-2xl bg-[var(--color-secondary-main)] p-5 text-white">
      <Eyebrow className="text-white/70">Pris begärt i dag</Eyebrow>
      <p className="mt-1 text-[28px] font-bold leading-8">{done ? 'Allt sparat' : 'Vi ringer dig'}</p>
      <p className="mt-2 text-[15px] text-white/90">
        Flytt {home.moveDay}. {done ? 'Vi ringer med priset inom två vardagar.' : n === 0 ? 'Inga svar sparade än.' : `${['Ett', 'Två', 'Tre', 'Fyra'][n - 1]} av fyra svar sparade.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-bold">
        <span className="rounded-full bg-white/15 px-3 py-1">Fredagar fylls först</span>
        <span className="rounded-full bg-white/15 px-3 py-1">4,7 av 5 på Google</span>
      </div>
      {done ? (
        <PrimaryButton tone="ghost" className="mt-4" onClick={() => go(7)}>
          Mina svar
        </PrimaryButton>
      ) : (
        <PrimaryButton className="mt-4" onClick={() => go(nextUnanswered(a))}>
          Fortsätt svara · två minuter
        </PrimaryButton>
      )}
      <p className="mt-3 text-center text-[13px] text-white/80">Inget bokas förrän du säger ja.</p>
      <div className="mt-2 flex justify-center gap-5 text-[14px] underline underline-offset-4">
        <button type="button" onClick={() => go(7)}>
          Mina svar
        </button>
        <button type="button" onClick={() => go(9)}>
          Prata med oss
        </button>
      </div>
    </div>
  )
}

export const NextLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 text-[14px] font-bold text-[var(--color-secondary-main)]">
    {label}
    <ChevronRight size={16} />
  </button>
)
