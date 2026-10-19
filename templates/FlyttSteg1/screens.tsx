'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Boxes, Check, ChevronRight, Package, Trash2, Warehouse, Zap } from 'lucide-react'
import clsx from 'clsx'
import {
  AVSTAND_LABEL,
  BIYTA_KVM,
  BIYTA_LABEL,
  BOHAG_LABEL,
  FLOORS,
  FONSTER_LABEL,
  FULLT,
  RINGTIDER,
  STAD_MER,
  STARTTIDER,
  TILLVAL_LABEL,
  TOTAL,
  VARDE,
  VIKT,
  answeredCount,
  answeredQuestions,
  newId,
  type AdressSvar,
  type Answers,
  type Avstand,
  type BiytaTyp,
  type Bohag,
  type FonsterTyp,
  type Tillval,
} from './state'
import { AddCard, CheckTile, Chip, ChipRow, ChoiceRow, ContactBox, Eyebrow, Field, Frame, GreenHead, InfoNote, ItemCard, MoreLink, PrimaryButton, Section, Stepper, SubCard, SwitchRow, TextField, TextInput, TextLink, Tile, Timeline } from './ui'

export type Home = { from: string; to: string; fromKvm: number; moveDay: string; moveDayLong: string; cleanDay: string; firstName: string }

export type ScreenProps = {
  a: Answers
  update: (patch: Partial<Answers> | ((prev: Answers) => Partial<Answers>)) => void
  go: (step: number) => void
  home: Home
}

/* Stegen i demoraden: 0 flyttsidan, 1 klart, 2–7 frågorna, 8 allt sparat, 9 sms, 10 säljaren */
const FIRST = 2
const DONE = 8
const SALJARE = 10
const ORD = ['en', 'två', 'tre', 'fyra', 'fem', 'sex']
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
/* Fast mellanslag före sista ordet, så att husnumret inte hamnar ensamt på en rad. */
const nb = (s: string) => s.replace(/ (\S+)$/, '\u00a0$1')

const nextUnanswered = (a: Answers) => {
  const i = answeredQuestions(a).findIndex((x) => !x)
  return i === -1 ? DONE : FIRST + i
}

/* 1 · Klart, och belöningen */
export const KlartScreen = ({ a, update, go, home }: ScreenProps) => (
  <div className="bg-white pb-8">
    <GreenHead title="Tack, vi ringer dig." sub={`Din förfrågan om flytthjälp, ${home.from} till ${home.to} ${home.moveDay}, är mottagen. En säljare ringer med pris, oftast inom två vardagar.`} />
    <div className="px-4 pt-4">
      <div className="rounded-2xl bg-[var(--color-secondary-extra-extra-light)] p-5">
        <h2 className="text-[18px] font-bold leading-6 text-[var(--color-secondary-main)]">Vill du ha pris snabbare?</h2>
        <p className="mt-2 text-[15px] leading-[22px] text-[var(--color-secondary-main)]">Svara på frågorna om flytten, det tar ett par minuter. Då har säljaren priset klart när vi ringer.</p>
        <PrimaryButton className="mt-4" onClick={() => go(nextUnanswered(a))}>
          Berätta om flytten
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

/* Arket när hon trycker på krysset. Portal, annars fastnar fixed i demons animerade ram. */
const ExitSheet = ({ saved, onContinue, onLater, onCall }: { saved: number; onContinue: () => void; onLater: () => void; onCall: (t: string) => void }) => {
  const [times, setTimes] = useState(false)
  if (typeof document === 'undefined') return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-[var(--color-secondary-main)]/40" role="dialog" aria-modal>
      <button type="button" aria-label="Fortsätt svara" className="flex-1" onClick={onContinue} />
      <div className="mx-auto w-full max-w-[430px] rounded-t-[28px] bg-white px-6 pb-8 pt-3">
        <span className="mx-auto block h-1.5 w-10 rounded-full bg-[var(--color-inactive-grey-light)]" />
        <p className="mt-5 flex items-center gap-2 text-[14px] text-[var(--color-primary-dark)]">
          <Check size={16} strokeWidth={3} />
          {saved === 0 ? 'Inga svar än' : `${cap(ORD[saved - 1])} av sex steg sparade`}
        </p>
        <h2 className="mt-2 text-[22px] font-bold text-[var(--color-secondary-main)]">Vill du fortsätta senare?</h2>
        <p className="mt-1 text-[15px] text-[var(--color-inactive-dark)]">Dina svar är sparade. Säljaren ser dem när vi ringer.</p>
        <PrimaryButton tone="navy" className="mt-5" onClick={onLater}>
          Spara och fortsätt senare
        </PrimaryButton>
        <div className="mt-4 flex justify-center">
          <TextLink onClick={() => setTimes((v) => !v)}>Vill du hellre svara i telefon?</TextLink>
        </div>
        {times && (
          <div className="mt-4">
            <p className="text-[13px] text-[var(--color-inactive-dark)]">När passar det att vi ringer?</p>
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
    </div>,
    document.body,
  )
}

const Q = ({ p, idx, title, sub, children, cta, ctaTone, foot, onNext }: { p: ScreenProps; idx: number; title: string; sub?: string; children: React.ReactNode; cta?: string; ctaTone?: 'navy' | 'orange'; foot?: string; onNext?: () => void }) => {
  const { a, update, go } = p
  const [exit, setExit] = useState(false)
  return (
    <>
      <Frame step={idx - FIRST} title={title} sub={sub} cta={cta} ctaTone={ctaTone} foot={foot} onNext={onNext ?? (() => go(idx + 1))} onBack={() => go(idx - 1)} onClose={() => setExit(true)}>
        {children}
      </Frame>
      {exit && (
        <ExitSheet
          saved={answeredCount(a)}
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
    </>
  )
}

const JA_NEJ: ['ja' | 'nej', string][] = [
  ['ja', 'Ja'],
  ['nej', 'Nej'],
]

/* 2 · Adresser */
const AdressRad = ({ eyebrow, street, sub, filled }: { eyebrow: string; street: string; sub: string; filled?: boolean }) => (
  <div className="flex items-start gap-3">
    <span className={clsx('mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--color-secondary-main)]', filled && 'bg-[var(--color-secondary-main)]')} />
    <span className="min-w-0 flex-1">
      <Eyebrow>{eyebrow}</Eyebrow>
      <span className="block text-[17px] font-bold leading-6 text-[var(--color-text-main)]">{street}</span>
      <span className="block text-[13px] text-[var(--color-inactive-dark)]">{sub}</span>
    </span>
    <TextLink>Ändra</TextLink>
  </div>
)

export const AdresserScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const [stopp, setStopp] = useState(!!a.stopp)
  return (
    <Q p={p} idx={2} title="Stämmer adresserna?" sub="Hämtade från din flytt. Ändra om något inte stämmer.">
      <div className="mt-5 rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] p-4">
        <AdressRad eyebrow="Från" street={home.from} sub={`${home.fromKvm} m² enligt dina uppgifter`} />
        <div className="ml-[7px] border-l-2 border-dotted border-[var(--color-inactive-grey-light)] py-2 pl-5">
          {stopp ? (
            <div>
              <TextInput value={a.stopp} onChange={(v) => update({ stopp: v })} placeholder="Adress, t.ex. ett förråd eller magasin" label="Stopp på vägen" />
              <div className="mt-1">
                <TextLink
                  onClick={() => {
                    setStopp(false)
                    update({ stopp: '' })
                  }}
                >
                  Ta bort stoppet
                </TextLink>
              </div>
            </div>
          ) : (
            <MoreLink onClick={() => setStopp(true)}>Lägg till ett stopp på vägen</MoreLink>
          )}
        </div>
        <AdressRad eyebrow="Till" street={home.to} sub={`Flytt ${home.moveDay}`} filled />
      </div>
      <Section title="Flyttar du ut och in samma dag?" sub="Om inte ordnar vi tillfällig förvaring däremellan.">
        <ChoiceRow options={JA_NEJ} value={a.sammaDag} onChange={(v) => update({ sammaDag: v })} />
        {a.sammaDag === 'nej' && <InfoNote>Vi förvarar sakerna tills du kan flytta in. Säljaren räknar in förvaringen i priset.</InfoNote>}
      </Section>
    </Q>
  )
}

/* 3 och 4 · Bära ut, bära in */
const HISS: [string, string, Partial<AdressSvar>][] = [
  ['stor', 'Stor hiss', { hiss: 'ja', hissStorlek: 'stor' }],
  ['liten', 'Liten hiss', { hiss: 'ja', hissStorlek: 'liten' }],
  ['nej', 'Ingen hiss', { hiss: 'nej', hissStorlek: undefined }],
  ['vet-ej', 'Vet inte', { hiss: 'vet-ej', hissStorlek: undefined }],
]

const BaraScreen = ({ side, ...p }: ScreenProps & { side: 'fran' | 'till' }) => {
  const { a, update, home } = p
  const s = a[side]
  const set = (patch: Partial<AdressSvar>) => update((prev) => ({ [side]: { ...prev[side], ...patch } }))
  const [note, setNote] = useState(!!s.notering)
  const ut = side === 'fran'
  return (
    <Q p={p} idx={ut ? 3 : 4} title={ut ? `Utflytt från ${nb(home.from)}` : `Inflytt till ${nb(home.to)}`} sub={ut ? 'Våning, hiss och bärsträcka avgör hur många flyttare vi skickar.' : 'Samma frågor för den nya bostaden.'}>
      <Section title="Vilket våningsplan ligger bostaden på?" className="mt-5">
        <div className="flex gap-1.5">
          {FLOORS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={s.vaning === f}
              onClick={() => set({ vaning: f })}
              className={clsx('flex h-11 min-w-0 flex-1 items-center justify-center rounded-full border-[1.5px] text-[15px] transition-colors', s.vaning === f ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] font-bold text-white' : 'border-[var(--color-inactive-main)] bg-white text-[var(--color-text-main)]')}
            >
              {f}
            </button>
          ))}
        </div>
      </Section>
      <Section title="Finns det hiss?" sub="Stor hiss rymmer sex personer eller fler.">
        <ChipRow>
          {HISS.map(([key, label, patch]) => (
            <Chip key={key} selected={(s.hiss === 'ja' ? s.hissStorlek : s.hiss) === key} onClick={() => set(patch)}>
              {label}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <Section title={ut ? 'Hur långt bär vi till flyttbilen?' : 'Hur långt bär vi från flyttbilen?'} sub={ut ? 'Från dörren till närmaste plats bilen kan stå. Ungefärligt räcker.' : 'Från närmaste plats bilen kan stå till dörren. Ungefärligt räcker.'}>
        <ChipRow>
          {(Object.keys(AVSTAND_LABEL) as Avstand[]).map((v) => (
            <Chip key={v} selected={s.avstand === v} onClick={() => set({ avstand: v })}>
              {AVSTAND_LABEL[v]}
            </Chip>
          ))}
        </ChipRow>
      </Section>
      <div className="mt-6">{note ? <TextField value={s.notering} onChange={(v) => set({ notering: v })} placeholder="T.ex. tre trappor utan hiss, bom vid infarten eller trång gata" label="Mer om adressen" /> : <MoreLink onClick={() => setNote(true)}>Mer om adressen, t.ex. trappor eller bom</MoreLink>}</div>
    </Q>
  )
}

export const BaraUtScreen = (p: ScreenProps) => <BaraScreen side="fran" {...p} />
export const BaraInScreen = (p: ScreenProps) => <BaraScreen side="till" {...p} />

const BoxIcon = ({ count }: { count: 1 | 2 | 3 }) => (
  <svg width="36" height="28" viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    {count >= 1 && <rect x="10" y="14" width="16" height="12" rx="1.5" />}
    {count >= 2 && <rect x="1" y="14" width="16" height="12" rx="1.5" fill="#fff" />}
    {count >= 2 && <rect x="19" y="14" width="16" height="12" rx="1.5" fill="#fff" />}
    {count >= 3 && <rect x="10" y="2" width="16" height="12" rx="1.5" fill="#fff" />}
  </svg>
)

/* 5 · Vad ska med */
export const BohagScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const setBiyta = (id: string, patch: Partial<Answers['biytor'][number]>) => update((prev) => ({ biytor: prev.biytor.map((b) => (b.id === id ? { ...b, ...patch } : b)) }))
  const setSak = (id: string, patch: Partial<Answers['saker'][number]>) => update((prev) => ({ saker: prev.saker.map((s) => (s.id === id ? { ...s, ...patch } : s)) }))
  return (
    <Q p={p} idx={5} title="Hur mycket ska med?" sub={`Jämfört med ett vanligt hem på ${home.fromKvm} m².`}>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {(
          [
            ['lite', 'Lite', 'Få möbler och lådor', 1],
            ['normalt', 'Normalt', 'Som ett vanligt hem', 2],
            ['mycket', 'Mycket', 'Fullt i alla rum', 3],
          ] as [Bohag, string, string, 1 | 2 | 3][]
        ).map(([v, label, hint, n]) => (
          <Tile key={v} label={label} hint={hint} selected={a.bohag === v} onClick={() => update({ bohag: v })} icon={<BoxIcon count={n} />} />
        ))}
      </div>
      <Section title="Har du saker i förråd eller annat utrymme utöver boarean?">
        <div className="flex flex-col gap-3">
          {a.biytor.map((b, i) => (
            <ItemCard key={b.id} title={b.typ ? BIYTA_LABEL[b.typ] : `Utrymme ${i + 1}`} onRemove={() => update((prev) => ({ biytor: prev.biytor.filter((x) => x.id !== b.id) }))}>
              <Field label="Vilket utrymme?">
                <ChipRow>
                  {(Object.keys(BIYTA_LABEL) as BiytaTyp[]).map((t) => (
                    <Chip key={t} small selected={b.typ === t} onClick={() => setBiyta(b.id, { typ: t })}>
                      {BIYTA_LABEL[t]}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
              <Field label="Hur stort är det?">
                <ChipRow>
                  {BIYTA_KVM.map((k) => (
                    <Chip key={k} small selected={b.kvm === k} onClick={() => setBiyta(b.id, { kvm: k })}>
                      {k} m²
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
              <Field label="Hur fullt är det?">
                <ChipRow>
                  {FULLT.map((f) => (
                    <Chip key={f} small selected={b.fullt === f} onClick={() => setBiyta(b.id, { fullt: f })}>
                      {f}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
            </ItemCard>
          ))}
          <AddCard label={a.biytor.length ? 'Lägg till ett utrymme till' : 'Lägg till förråd eller annat utrymme'} hint="Vind, källare, garage eller förråd" onClick={() => update((prev) => ({ biytor: [...prev.biytor, { id: newId() }] }))} />
        </div>
      </Section>
      <Section title="Har du föremål som kräver tunga lyft eller är extra ömtåliga?">
        <div className="flex flex-col gap-3">
          {a.saker.map((s, i) => (
            <ItemCard key={s.id} title={s.vad || `Föremål ${i + 1}`} onRemove={() => update((prev) => ({ saker: prev.saker.filter((x) => x.id !== s.id) }))}>
              <Field label="Vad är det?">
                <TextInput value={s.vad} onChange={(v) => setSak(s.id, { vad: v })} placeholder="T.ex. piano eller marmorbord" label="Vad är det?" />
              </Field>
              <Field label="Ungefärlig vikt">
                <ChipRow>
                  {VIKT.map((v) => (
                    <Chip key={v} small selected={s.vikt === v} onClick={() => setSak(s.id, { vikt: v })}>
                      {v}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
              <Field label="Ungefärligt värde" sub="Värdefulla föremål kan behöva extra försäkring under flytten.">
                <ChipRow>
                  {VARDE.map((v) => (
                    <Chip key={v} small selected={s.varde === v} onClick={() => setSak(s.id, { varde: v })}>
                      {v}
                    </Chip>
                  ))}
                </ChipRow>
              </Field>
            </ItemCard>
          ))}
          <AddCard label={a.saker.length ? 'Lägg till ett föremål till' : 'Lägg till föremål'} hint="Så tar flyttfirman med rätt utrustning" onClick={() => update((prev) => ({ saker: [...prev.saker, { id: newId(), vad: '' }] }))} />
        </div>
      </Section>
      <Section title="Har du utemöbler som ska med?" sub="Från balkong, altan eller trädgård.">
        <ChoiceRow options={JA_NEJ} value={a.utemobler} onChange={(v) => update({ utemobler: v })} />
      </Section>
    </Q>
  )
}

/* 6 · Städning */
const FONSTER_FRAGA: Record<FonsterTyp, string> = {
  fyrsidiga: 'fyrsidiga fönster',
  sprojsade: 'spröjsade fönster',
  panorama: 'panoramafönster',
  svaratkomliga: 'svåråtkomliga fönster',
}

export const StadScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const valda = Object.keys(a.fonster) as FonsterTyp[]
  const toggleFonster = (t: FonsterTyp) =>
    update((prev) => {
      const fonster = { ...prev.fonster }
      if (fonster[t]) delete fonster[t]
      else fonster[t] = 1
      return { fonster, fonsterInga: false }
    })
  const toggleStadMer = (m: string) => update((prev) => ({ stadMer: prev.stadMer.includes(m) ? prev.stadMer.filter((x) => x !== m) : [...prev.stadMer, m] }))
  return (
    <Q p={p} idx={6} title="Flyttstädning" sub={`${home.from} · ${home.fromKvm} m²`}>
      <Section title="Vill du ha flyttstädning?" sub="Nöjd-kund-garanti: anmärkningar vid besiktningen åtgärdas kostnadsfritt." className="mt-5">
        <ChoiceRow options={JA_NEJ} value={a.stad} onChange={(v) => update({ stad: v })} />
        {a.stad === 'nej' && <InfoNote>Då räknar vi bara på flytthjälp. Flyttstädning går att lägga till när som helst före flytten.</InfoNote>}
      </Section>
      {a.stad === 'ja' && (
        <>
          <Section title="Hur mycket ska städas?">
            <div className="grid grid-cols-2 gap-2">
              <Tile label="Boarean" hint={`${home.fromKvm} m²`} selected={a.stadYta === 'boyta'} onClick={() => update({ stadYta: 'boyta', stadMer: [], stadMerKvm: undefined })} />
              <Tile label="Mer än boarean" hint="Källare, förråd, garage" selected={a.stadYta === 'mer'} onClick={() => update({ stadYta: 'mer' })} />
            </div>
            {a.stadYta === 'mer' && (
              <SubCard className="mt-3">
                <Field label="Vad mer ska städas?">
                  <ChipRow>
                    {STAD_MER.map((m) => (
                      <Chip key={m} small selected={a.stadMer.includes(m)} onClick={() => toggleStadMer(m)}>
                        {m}
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
                <Field label="Ungefär hur många m² extra?">
                  <ChipRow>
                    {BIYTA_KVM.map((k) => (
                      <Chip key={k} small selected={a.stadMerKvm === k} onClick={() => update({ stadMerKvm: k })}>
                        {k} m²
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
              </SubCard>
            )}
          </Section>
          <Section title="Finns det inglasad balkong?">
            <ChoiceRow options={JA_NEJ} value={a.balkong} onChange={(v) => update({ balkong: v })} />
            {a.balkong === 'ja' && (
              <SubCard className="mt-3">
                <Field label="Hur stor är den?" sub="Liten under 6 m², mellan 6–8 m², stor över 8 m².">
                  <ChoiceRow
                    options={[
                      ['liten', 'Liten'],
                      ['mellan', 'Mellan'],
                      ['stor', 'Stor'],
                    ]}
                    value={a.balkongStorlek}
                    onChange={(v) => update({ balkongStorlek: v })}
                  />
                </Field>
                <Field label="Inglasning">
                  <ChoiceRow
                    options={[
                      ['halv', 'Halvinglasad'],
                      ['hel', 'Helinglasad'],
                    ]}
                    value={a.balkongGlas}
                    onChange={(v) => update({ balkongGlas: v })}
                  />
                </Field>
              </SubCard>
            )}
          </Section>
          <Section title="Har du fönster som tar extra tid att putsa?" sub="Välj de typer som finns, sedan hur många.">
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FONSTER_LABEL) as FonsterTyp[]).map((t) => (
                <CheckTile key={t} label={FONSTER_LABEL[t][0]} hint={FONSTER_LABEL[t][1]} selected={!!a.fonster[t]} onClick={() => toggleFonster(t)} />
              ))}
            </div>
            <div className="mt-2">
              <CheckTile label="Inga sådana fönster" selected={a.fonsterInga} onClick={() => update({ fonsterInga: !a.fonsterInga, fonster: {} })} className="min-h-[52px] w-full" />
            </div>
            {valda.length > 0 && (
              <SubCard className="mt-3">
                {valda.map((t) => (
                  <div key={t} className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[14px] text-[var(--color-text-main)]">Antal {FONSTER_FRAGA[t]}</span>
                    <Stepper value={a.fonster[t] ?? 1} onChange={(n) => update((prev) => ({ fonster: { ...prev.fonster, [t]: n } }))} />
                  </div>
                ))}
              </SubCard>
            )}
          </Section>
          <Section title="Finns det känsliga ytor?" sub="Natursten, oljade golv eller högglansluckor.">
            <ChoiceRow options={JA_NEJ} value={a.kansliga} onChange={(v) => update({ kansliga: v })} />
            {a.kansliga === 'ja' && (
              <div className="mt-3">
                <TextField value={a.kansligaText} onChange={(v) => update({ kansligaText: v })} placeholder="Vilka ytor och var? T.ex. marmorgolv i badrummet" label="Känsliga ytor" />
              </div>
            )}
          </Section>
        </>
      )}
    </Q>
  )
}

/* 7 · Sista detaljerna */
const TILLVAL_IKON: Record<Tillval, React.ReactNode> = {
  packhjalp: <Package size={24} />,
  lador: <Boxes size={24} />,
  bortforsling: <Trash2 size={24} />,
  forvaring: <Warehouse size={24} />,
}

export const SistaScreen = (p: ScreenProps) => {
  const { a, update, go, home } = p
  const [portkod, setPortkod] = useState(!!a.portkod)
  const [ovrigt, setOvrigt] = useState(!!a.ovrigt)
  const toggleTillval = (t: Tillval) => update((prev) => ({ tillval: prev.tillval.includes(t) ? prev.tillval.filter((x) => x !== t) : [...prev.tillval, t] }))
  const stad = a.stad === 'ja'
  return (
    <Q
      p={p}
      idx={7}
      title="Sista detaljerna"
      cta="Skicka svaren"
      ctaTone="orange"
      foot="Inget bokas nu. Säljaren ringer med priset."
      onNext={() => {
        update({ requested: true, sent: true })
        go(DONE)
      }}
    >
      <Section title="När ska vi börja?" className="mt-5">
        <div className="rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] p-4">
          <p className="text-[15px] font-bold text-[var(--color-text-main)]">Flytt {home.moveDay}</p>
          <p className="text-[13px] text-[var(--color-inactive-dark)]">Datumet från din flytt. Vill du byta dag säger du det i samtalet.</p>
          <div className="mt-3">
            <ChipRow>
              {STARTTIDER.map((t) => (
                <Chip key={t} selected={a.starttid === t} onClick={() => update({ starttid: t })}>
                  {t}
                </Chip>
              ))}
            </ChipRow>
          </div>
          {stad && (
            <p className="mt-3 border-t border-[var(--color-inactive-main)] pt-3 text-[15px] font-bold text-[var(--color-text-main)]">
              Städning {home.cleanDay}
              <span className="block text-[13px] font-normal text-[var(--color-inactive-dark)]">Dagen efter flytten, när bostaden är tömd.</span>
            </p>
          )}
        </div>
      </Section>
      <Section title="Kan du vara på plats?">
        <div className="rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] px-4">
          <SwitchRow label="Vid flytten" on={a.paPlatsFlytt} onChange={(v) => update({ paPlatsFlytt: v })} />
          {stad && <SwitchRow label="Vid städningen" on={a.paPlatsStad} onChange={(v) => update({ paPlatsStad: v })} />}
        </div>
      </Section>
      <Section title="Vill du även ha pris på?" sub="Valfritt. Säljaren tar med det i priset.">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(TILLVAL_LABEL) as Tillval[]).map((t) => (
            <CheckTile key={t} label={TILLVAL_LABEL[t][0]} hint={TILLVAL_LABEL[t][1]} selected={a.tillval.includes(t)} onClick={() => toggleTillval(t)} icon={TILLVAL_IKON[t]} />
          ))}
        </div>
      </Section>
      <Section title="Bra att veta inför flytten">
        <div className="flex flex-col gap-3">
          {portkod ? <TextInput value={a.portkod} onChange={(v) => update({ portkod: v })} placeholder="Portkod, nyckelskåp eller vem som öppnar" label="Portkod och nycklar" /> : <MoreLink onClick={() => setPortkod(true)}>Portkod och nycklar</MoreLink>}
          {ovrigt ? <TextField value={a.ovrigt} onChange={(v) => update({ ovrigt: v })} placeholder="Önskemål om flytten, t.ex. ömtåliga saker eller speciella omständigheter" label="Något mer" /> : <MoreLink onClick={() => setOvrigt(true)}>Något mer vi bör veta?</MoreLink>}
        </div>
      </Section>
      <Section title="När passar det att vi ringer?">
        <ChipRow>
          {RINGTIDER.map((t) => (
            <Chip key={t} selected={a.ringtid === t} onClick={() => update({ ringtid: t })}>
              {t}
            </Chip>
          ))}
        </ChipRow>
      </Section>
    </Q>
  )
}

const adressLine = (label: string, s: AdressSvar) => {
  const hiss = s.hiss === 'ja' ? `${s.hissStorlek === 'stor' ? 'stor ' : s.hissStorlek === 'liten' ? 'liten ' : ''}hiss` : s.hiss === 'nej' ? 'ingen hiss' : s.hiss === 'vet-ej' ? 'hiss: vet inte' : null
  const parts = [s.vaning ? `våning ${s.vaning}` : null, hiss, s.avstand ? (s.avstand === 'vet-ej' ? 'bärsträcka: vet inte' : `${AVSTAND_LABEL[s.avstand].toLowerCase()} att bära`) : null, s.notering || null].filter(Boolean)
  return parts.length ? `${label}: ${parts.join(', ')}` : null
}

export const answerLines = (a: Answers, home: Home): string[] => {
  const L: (string | null)[] = []
  if (a.stopp) L.push(`Stopp på vägen: ${a.stopp}`)
  if (a.sammaDag) L.push(a.sammaDag === 'ja' ? 'Flyttar in samma dag' : 'Flyttar inte in samma dag, behöver förvaring')
  L.push(adressLine(home.from, a.fran), adressLine(home.to, a.till))
  if (a.bohag) L.push(`${BOHAG_LABEL[a.bohag]}, ${home.fromKvm} m²`)
  a.biytor.forEach((b) => L.push(`${b.typ ? BIYTA_LABEL[b.typ] : 'Utrymme'}${b.kvm ? ` ${b.kvm} m²` : ''}${b.fullt ? `, ${b.fullt.toLowerCase()}` : ''}`))
  a.saker.forEach((s) => L.push(`${s.vad || 'Föremål'}${s.vikt ? `, ${s.vikt}` : ''}${s.varde ? `, värde ${s.varde}` : ''}`))
  if (a.utemobler === 'ja') L.push('Utemöbler ska med')
  if (a.stad === 'nej') L.push('Ingen flyttstädning')
  if (a.stad === 'ja') {
    const mer = a.stadYta === 'mer' ? ` + ${a.stadMer.map((m) => m.toLowerCase()).join(', ') || 'mer'}${a.stadMerKvm ? ` ${a.stadMerKvm} m²` : ''}` : ''
    L.push(`Flyttstäd: boarean ${home.fromKvm} m²${mer}`)
    if (a.balkong === 'ja') L.push(`Inglasad balkong${a.balkongStorlek ? `, ${a.balkongStorlek}` : ''}${a.balkongGlas ? `, ${a.balkongGlas === 'hel' ? 'helinglasad' : 'halvinglasad'}` : ''}`)
    const f = (Object.keys(a.fonster) as FonsterTyp[]).map((t) => `${FONSTER_LABEL[t][0].toLowerCase()} ×${a.fonster[t]}`)
    if (f.length) L.push(`Fönster: ${f.join(', ')}`)
    else if (a.fonsterInga) L.push('Inga specialfönster')
    if (a.kansliga === 'ja') L.push(`Känsliga ytor: ${a.kansligaText || 'ja'}`)
  }
  if (a.starttid) L.push(`Start ${a.starttid}`)
  if (a.paPlatsFlytt || a.paPlatsStad) L.push(`På plats ${[a.paPlatsFlytt && 'vid flytten', a.paPlatsStad && 'vid städningen'].filter(Boolean).join(' och ')}`)
  if (a.tillval.length) L.push(`Vill ha pris på ${a.tillval.map((t) => TILLVAL_LABEL[t][0].toLowerCase()).join(', ')}`)
  if (a.portkod) L.push(`Portkod och nycklar: ${a.portkod}`)
  if (a.ovrigt) L.push(a.ovrigt)
  if (a.ringtid) L.push(`Ring gärna ${a.ringtid.toLowerCase()}`)
  return L.filter((x): x is string => !!x)
}

/* 8 · Allt sparat */
export const SparatScreen = ({ a, go, home }: ScreenProps) => {
  const lines = answerLines(a, home)
  return (
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
          <TextLink onClick={() => go(FIRST)}>Ändra</TextLink>
        </div>
        <ul className="mt-2 space-y-1 text-[14px] leading-[21px] text-[var(--color-inactive-dark)]">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
          {lines.length === 0 && <li>Inga svar än. Säljaren frågar i samtalet.</li>}
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
}

/* 9 · Sms:et nästa förmiddag */
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
      <p className="whitespace-pre-wrap text-[15px] leading-[21px]">{`Hej ${home.firstName}! Tack för din förfrågan om flytthjälp till ${home.to}. Vi ringer dig inom två vardagar. Vill du ha pris snabbare? Berätta om flytten här, det tar några minuter: flyttsmart.se/p/K7Q2M9XA\nUndrar du något? Svara här så ringer vi.\n/Flyttsmart`}</p>
    </div>
  </div>
)

/* 10 · Säljaren ringer med svaren framför sig */
export const SaljareScreen = ({ a, home }: ScreenProps) => {
  const n = answeredCount(a)
  const rank = a.ringtid ? 1 : n === TOTAL ? 2 : n > 0 ? 3 : a.requested ? 4 : 5
  const events = [`lör 19:32 · begärde pris${n ? ` och fyllde i ${ORD[n - 1]} av sex steg` : ''}`, 'mån 09:05 · fick sms:et med länken', n < TOTAL ? 'mån 10:02 · öppnade frågorna igen, svarade inte' : 'mån 10:02 · skickade alla svar, från mobilen']
  const ordering = ['Har valt en tid för samtal', 'Fyllde i alla sex stegen', 'Fyllde i några', 'Begärde pris utan att svara', 'Tryckte på kortet utan att begära']
  const lines = answerLines(a, home)
  return (
    <div className="bg-[var(--color-inactive-quite-light)] px-4 py-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">{home.firstName} Andersson</p>
            <p className="text-[13px] text-[var(--color-inactive-dark)]">Demomäklaren · flytt {home.moveDay}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-accent-lighter)] px-3 py-1 text-[12px] font-bold text-[var(--color-accent-dark-main)]">
            {n} av {TOTAL} steg
          </span>
        </div>
        <div className="mt-4 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">Pris begärt, inget pris ännu</p>
          <p className="text-[13px] text-[var(--color-inactive-dark)]">Flytthjälp{a.stad === 'ja' ? ' och flyttstäd' : ''}. Svaren ligger i Opportunityn, guiden hoppar över det som redan är svarat.</p>
        </div>
        <Eyebrow className="mt-5">Kundens svar</Eyebrow>
        <ul className="mt-2 space-y-1 text-[14px] leading-[20px] text-[var(--color-secondary-main)]">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
          {lines.length === 0 && <li className="text-[var(--color-inactive-dark)]">Inga svar. Guiden ställer alla frågor.</li>}
        </ul>
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
          {n > 0 ? ' och berättat om flytten' : ''}. Jag har {n === TOTAL ? 'bara ett par saker att stämma av' : 'några frågor till'}, sedan har jag ett pris till dig.
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
  const done = a.sent
  return (
    <div className="rounded-2xl bg-[var(--color-secondary-main)] p-5 text-white">
      <Eyebrow className="text-white/70">Pris begärt i dag</Eyebrow>
      <p className="mt-1 text-[28px] font-bold leading-8">{done ? 'Allt sparat' : 'Vi ringer dig'}</p>
      <p className="mt-2 text-[15px] text-white/90">
        Flytt {home.moveDay}. {done ? 'Vi ringer med priset inom två vardagar.' : n === 0 ? 'Inga svar sparade än.' : `${cap(ORD[n - 1])} av sex steg sparade.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-bold">
        <span className="rounded-full bg-white/15 px-3 py-1">Fredagar fylls först</span>
        <span className="rounded-full bg-white/15 px-3 py-1">4,7 av 5 på Google</span>
      </div>
      {done ? (
        <PrimaryButton tone="ghost" className="mt-4" onClick={() => go(DONE)}>
          Mina svar
        </PrimaryButton>
      ) : (
        <PrimaryButton className="mt-4" onClick={() => go(nextUnanswered(a))}>
          {n === 0 ? 'Berätta om flytten' : 'Fortsätt berätta'}
        </PrimaryButton>
      )}
      <p className="mt-3 text-center text-[13px] text-white/80">Inget bokas förrän du säger ja.</p>
      <div className="mt-2 flex justify-center gap-5 text-[14px] underline underline-offset-4">
        <button type="button" onClick={() => go(DONE)}>
          Mina svar
        </button>
        <button type="button" onClick={() => go(SALJARE)}>
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
