'use client'

import { useCallback, useEffect, useState } from 'react'
import { getDemoUser, type DemoAddress } from '@/common/data/demoPersona'

/*
 * Svaren i steg 1 utan pris. Frågorna följer Harrys Opportunity-sida ett till
 * ett, så att varje svar kan gå rakt in i Opportunityn. Orden är sajtens egna.
 * Varje steg kräver ett svar per knappfråga, Vet inte räknas. Fritext och
 * tillval är frivilliga. Krysset sparar det som är svarat och stänger.
 */

export type JaNej = 'ja' | 'nej'
export type JaNejVet = 'ja' | 'nej' | 'vet-ej'
export type Bostadstyp = 'lagenhet' | 'radhus' | 'villa'
export type Hiss = 'stor' | 'liten' | 'nej' | 'vet-ej'
/** Bärsträcka i meter i steg om 5, 100 = 100 m eller mer, eller Vet inte. */
export type Avstand = number | 'vet-ej'
export type Bohag = 'lite' | 'normalt' | 'mycket'
export type Framkomlighet = 'god' | 'hinder' | 'vet-ej'
export type BiytaTyp = 'kallare' | 'vind' | 'forrad' | 'garage' | 'uterum' | 'balkong' | 'annat'
export type FonsterTyp = 'fyrsidiga' | 'sprojsade' | 'panorama' | 'svaratkomliga'
export type Tillval = 'packhjalp' | 'lador' | 'bortforsling' | 'montering' | 'forvaring'

export type AdressSvar = {
  /** Saknas tills kunden valt, om inte flytten redan säger lägenhet (våning eller hiss känd). */
  bostadstyp?: Bostadstyp
  bostadstypFranFlytten?: boolean
  /** Våning som text: 'BV', '1'…'7', fritt tal via Fler, eller 'vet-ej'. */
  vaning?: string
  /** Sant tills kunden själv rört våningen. Visar "Från din flytt". */
  vaningFranFlytten: boolean
  hiss?: Hiss
  /** Hissen kom från flytten. Visar "Från din flytt". */
  hissFranFlytten?: boolean
  avstand?: Avstand
  /** Inga hinder, Det finns hinder eller Vet inte (Nils 21 okt: God/Annat var oklart). Hinder öppnar fritexten. */
  framkomlighetVal?: Framkomlighet
  framkomlighet: string
  /** Radhus och villa: antal våningar 1, 1,5, 2, 3 eller 4+ (Nils 20 okt). */
  vaningar?: string
  /** Boarea i m² om kunden ändrat den, annars hämtas den från flytten. */
  kvm?: string
}

/** kvm i steg om 5 (50 = 50 m² eller mer), fullt i fjärdedelar 25–100. klar = kunden har tryckt Klar, först då räknas kortet (David–Nils 20 okt). */
export type Biyta = { id: string; typ?: BiytaTyp; kvm?: number; fullt?: number; klar?: boolean }
export type Sak = { id: string; vad: string; vikt?: string; varde?: string; klar?: boolean }
/** dag som text ('fredag 23/10'); iso YYYY-MM-DD när tiden satts av det nya flödet (förvald eller ändrad i bekräftelsen). */
export type Samtal = { dag: string; pass: string; iso?: string }

export type Answers = {
  /** Samtalet är bokat, Opportunityn finns. */
  samtal?: Samtal
  /** Säljaren har skickat offerten: svaren låses och kortet länkar till offerten. */
  offertSkickad?: boolean
  /** Manuell hantering i Harry (väntar på leverantör): svaren låses för kunden, kortet förklarar varför. */
  manuell?: boolean
  telefon: string
  sent: boolean
  /* 1 Adresser */
  stopp: string[]
  sammaDag?: JaNejVet
  /* 2–3 Bära ut, bära in */
  fran: AdressSvar
  till: AdressSvar
  /* 4 Vad ska med */
  bohag?: Bohag
  biytaSvar?: JaNej
  biytor: Biyta[]
  sakerSvar?: JaNej
  saker: Sak[]
  utemobler?: JaNej
  /* 5 Städning */
  stad?: JaNej
  stadYta?: 'boyta' | 'mer'
  /** Utrymmen utöver boarean som ska städas, ett kort per utrymme med Klar, som biytorna (Nils 20 okt). */
  stadYtor: Biyta[]
  balkong?: JaNej
  balkongStorlek?: 'liten' | 'mellan' | 'stor'
  balkongGlas?: 'halv' | 'hel'
  fonster: Partial<Record<FonsterTyp, number>>
  fonsterInga: boolean
  kansliga?: JaNej
  kansligaText: string
  /* 6 Sista detaljerna */
  /** Flyttdag som YYYY-MM-DD. Tom tills kunden valt, kalendern öppnar på tillträdesdagen. */
  flyttDag?: string
  /** Städdag som YYYY-MM-DD, väljs av kunden när städ är med. */
  stadDag?: string
  tillval: Tillval[]
  ovrigt: string
}

const TOM_ADRESS: AdressSvar = { vaningFranFlytten: false, framkomlighet: '' }

/* Det flytten vet om en adress: våning och hiss finns på den sålda bostaden (från mäklaren), inget om den nya.
   Finns våning eller hiss är det en lägenhet. Allt annat frågas (David 21 okt: datan ska stämma, inget påhittat). */
const adressFranFlytten = (adr: Partial<DemoAddress> | null | undefined): AdressSvar => {
  const vaning = typeof adr?.floor === 'number' ? (adr.floor === 0 ? 'BV' : String(adr.floor)) : undefined
  const hiss: Hiss | undefined = adr?.elevator === 'big' ? 'stor' : adr?.elevator === 'small' ? 'liten' : adr?.elevator === 'none' ? 'nej' : undefined
  const lagenhet = vaning !== undefined || hiss !== undefined
  return {
    ...TOM_ADRESS,
    bostadstyp: lagenhet ? 'lagenhet' : undefined,
    bostadstypFranFlytten: lagenhet,
    vaning,
    vaningFranFlytten: vaning !== undefined,
    hiss,
    hissFranFlytten: hiss !== undefined,
  }
}

/** +46701234567 → 070-123 45 67, som sajten visar numret. */
const fmtTel = (p?: string) => {
  const d = (p ?? '').replace(/\D/g, '').replace(/^46/, '0')
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}` : (p ?? '')
}

/** Startläget med det flytten redan vet: kundens nummer, våning och hiss på den sålda bostaden. */
export const prefill = (): Answers => {
  const u = getDemoUser()
  return {
    ...EMPTY,
    telefon: fmtTel(u.contact?.phone) || EMPTY.telefon,
    fran: adressFranFlytten(u.currentMove.fromAddress),
    till: adressFranFlytten(u.currentMove.toAddress),
  }
}

export const EMPTY: Answers = {
  telefon: '070-123 45 67',
  sent: false,
  stopp: [],
  fran: TOM_ADRESS,
  till: TOM_ADRESS,
  biytor: [],
  saker: [],
  stadYtor: [],
  fonster: {},
  fonsterInga: false,
  kansligaText: '',
  tillval: [],
  ovrigt: '',
}

const KEY = 'flyttsmart-demo-flytt-steg1-v4'

export const TOTAL = 6

/** Giltigt svar på bärsträckan: ett tal (även 0) eller Vet inte. Gamla sparade värden ("u25") räknas inte. */
export const harAvstand = (v: unknown): v is Avstand => typeof v === 'number' || v === 'vet-ej'

const adressLeft = (s: AdressSvar) => {
  // Utan bostadstyp: typen, bärsträckan och framkomligheten är minst tre frågor kvar.
  if (!s.bostadstyp) return 3
  const lagenhet = s.bostadstyp === 'lagenhet'
  return [lagenhet && !s.vaning, lagenhet && !s.hiss, !lagenhet && !s.vaningar, !harAvstand(s.avstand), !s.framkomlighetVal].filter(Boolean).length
}

/** Öppnade städytor som inte klarmarkerats. */
const oppnaStadYtor = (a: Answers) => (a.stadYta === 'mer' ? Math.max(0, Math.max(1, a.stadYtor.length) - a.stadYtor.filter((y) => y.klar).length) : 0)

/** Öppnade kort som inte klarmarkerats: ett halvfärdigt utrymme eller föremål stoppar Fortsätt tills det är Klar eller borttaget. */
const oppnaKort = (a: Answers) => {
  const biytor = a.biytaSvar === 'ja' ? Math.max(1, a.biytor.length) - a.biytor.filter((b) => b.klar).length : 0
  const saker = a.sakerSvar === 'ja' ? Math.max(1, a.saker.length) - a.saker.filter((s) => s.klar).length : 0
  return Math.max(0, biytor) + Math.max(0, saker)
}

/** Obesvarade knappfrågor per steg, i ordningen Adresser, Bära ut, Bära in, Vad ska med, Städning, Sista detaljerna. */
export const questionsLeft = (a: Answers): number[] => [
  a.sammaDag ? 0 : 1,
  adressLeft(a.fran),
  adressLeft(a.till),
  [!a.bohag, !a.biytaSvar, !a.sakerSvar, !a.utemobler].filter(Boolean).length + oppnaKort(a),
  !a.stad ? 1 : a.stad === 'nej' ? 0 : [!a.stadYta, !a.balkong, Object.keys(a.fonster).length === 0 && !a.fonsterInga, !a.kansliga].filter(Boolean).length + oppnaStadYtor(a),
  (!a.flyttDag ? 1 : 0) + (a.stad === 'ja' && !a.stadDag ? 1 : 0),
]

/** Kunden har rört steget: något som inte kom från flytten är svarat. (Förr räknades en tom adress som rörd, så Bära in låg ett steg för högt.) */
const adressTouched = (s: AdressSvar) =>
  !!((s.hiss && !s.hissFranFlytten) || harAvstand(s.avstand) || s.framkomlighetVal || s.vaningar || (s.vaning && !s.vaningFranFlytten) || (s.bostadstyp && !s.bostadstypFranFlytten))

/** En flagga per steg: har kunden svarat på något där. */
export const answeredQuestions = (a: Answers) => [
  a.sammaDag !== undefined || a.stopp.length > 0,
  adressTouched(a.fran),
  adressTouched(a.till),
  !!a.bohag || !!a.biytaSvar || !!a.sakerSvar || a.utemobler !== undefined,
  a.stad !== undefined,
  a.tillval.length > 0 || !!a.ovrigt || !!a.flyttDag || !!a.stadDag || a.sent,
]

export const answeredCount = (a: Answers) => answeredQuestions(a).filter(Boolean).length

export const useDemoState = () => {
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Answers>
        if (saved.fran && saved.till && Array.isArray(saved.stopp)) setAnswers({ ...prefill(), ...saved })
        else setAnswers(prefill())
      } else setAnswers(prefill())
    } catch {
      // sessionStorage kan saknas, då börjar demon om varje gång
      setAnswers(prefill())
    }
    setLoaded(true)
  }, [])

  const update = useCallback((patch: Partial<Answers> | ((prev: Answers) => Partial<Answers>)) => {
    setAnswers((prev) => {
      const next = { ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(next))
      } catch {
        // ignoreras
      }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    try {
      window.sessionStorage.removeItem(KEY)
    } catch {
      // ignoreras
    }
    setAnswers(prefill())
  }, [])

  return { answers, update, reset, loaded }
}

export const newId = () => Math.random().toString(36).slice(2, 8)

export const FLOORS = ['BV', '1', '2', '3', '4', '5', '6', '7']
export const PASS: [string, string][] = [
  ['10-12', 'Förmiddag'],
  ['13-15', 'Tidig em.'],
  ['15-17', 'Sen em.'],
]

export const BOSTADSTYP_LABEL: Record<Bostadstyp, string> = { lagenhet: 'Lägenhet', radhus: 'Radhus', villa: 'Villa' }
export const HISS_LABEL: Record<Hiss, string> = { stor: 'Stor hiss', liten: 'Liten hiss', nej: 'Ingen hiss', 'vet-ej': 'Vet inte' }
export const AVSTAND_STEG = 5
export const AVSTAND_MAX = 100
export const avstandText = (v: Avstand) => (v === 'vet-ej' ? 'Vet inte' : v >= AVSTAND_MAX ? `${AVSTAND_MAX} m eller mer` : `${v} m`)
export const BOHAG_LABEL: Record<Bohag, string> = { lite: 'Lite bohag', normalt: 'Normalt bohag', mycket: 'Mycket bohag' }
export const BIYTA_LABEL: Record<BiytaTyp, string> = { kallare: 'Källare', vind: 'Vind', forrad: 'Förråd', garage: 'Garage', uterum: 'Uterum', balkong: 'Balkong', annat: 'Annat' }
export const BIYTA_KVM = ['5', '10', '20', '30', '50+']
export const BIYTA_KVM_MAX = 50
export const biytaKvmText = (n: number) => (n >= BIYTA_KVM_MAX ? `${BIYTA_KVM_MAX} m² eller mer` : `${n} m²`)
export const FULLT_LABEL: Record<number, string> = { 25: 'En fjärdedel', 50: 'Halvfullt', 75: 'Trekvart', 100: 'Fullt' }
export const fulltText = (n: number) => FULLT_LABEL[n] ?? `${n} %`
export const VIKT = ['0–80 kg', '80–150 kg', '150–200 kg', '200+ kg']
export const VARDE = ['0–30 000 kr', '30 000–50 000 kr', '50 000–100 000 kr', '100 000+ kr']
export const VANINGAR = ['1', '1,5', '2', '3', '4+']
export const FRAMKOMLIGHET_LABEL: Record<Framkomlighet, string> = { god: 'Inga hinder', hinder: 'Det finns hinder', 'vet-ej': 'Vet inte' }
export const FONSTER_LABEL: Record<FonsterTyp, [string, string]> = {
  fyrsidiga: ['Fyrsidiga', 'Öppnas åt alla håll, fyra sidor att putsa'],
  sprojsade: ['Spröjsade', 'Spröjs som delar glaset i små rutor'],
  panorama: ['Panoramafönster', 'Från golv till tak, kräver specialutrustning'],
  svaratkomliga: ['Svåråtkomliga', 'Högt upp eller svåra att nå'],
}
export const TILLVAL_LABEL: Record<Tillval, [string, string]> = {
  packhjalp: ['Packhjälp', 'Vi packar, lån av flyttlådor ingår'],
  lador: ['Lån av flyttlådor', 'Ingår i flytten, hemleverans kostar extra'],
  bortforsling: ['Bortforsling', 'Återbruk ger RUT-avdrag, återvinning gör det inte'],
  montering: ['Montering', 'Möbler som måste tas isär för att bäras ut, t.ex. garderober och sängar'],
  forvaring: ['Förvaring', 'Mellan ut- och inflytt, per påbörjad månad'],
}

/** "i morgon mellan 10 och 12", "fredag 23/10 kl. 13-15" eller "snart", i sajtens egen form. */
export const samtalText = (s?: Samtal) => {
  if (!s) return ''
  // '2d' = löftet utan klockslag (David–Nils 21 okt).
  if (s.pass === '2d') return 'inom två arbetsdagar'
  if (s.pass === 'nu') return 'snart'
  if (s.pass === 'flexibel') return s.dag
  if (s.iso) {
    const [y, m, d] = s.iso.split('-').map(Number)
    const [a, b] = s.pass.split('-').map(Number)
    return `${relativDag(new Date(y, m - 1, d))} mellan ${a} och ${b}`
  }
  return `${s.dag} kl. ${s.pass}`
}

const relativDag = (d: Date) => {
  const idag = new Date()
  const same = (x: Date, y: Date) => x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
  const imorgon = new Date(idag.getFullYear(), idag.getMonth(), idag.getDate() + 1)
  if (same(d, idag)) return 'i dag'
  if (same(d, imorgon)) return 'i morgon'
  return `på ${new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)}`
}
