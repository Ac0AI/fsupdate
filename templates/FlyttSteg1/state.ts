'use client'

import { useCallback, useEffect, useState } from 'react'

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
export type BiytaTyp = 'kallare' | 'vind' | 'forrad' | 'garage' | 'uterum' | 'annat'
export type FonsterTyp = 'fyrsidiga' | 'sprojsade' | 'panorama' | 'svaratkomliga'
export type Tillval = 'packhjalp' | 'lador' | 'bortforsling' | 'montering' | 'forvaring'

export type AdressSvar = {
  bostadstyp: Bostadstyp
  /** Våning som text: 'BV', '1'…'7', fritt tal via Fler, eller 'vet-ej'. */
  vaning?: string
  /** Sant tills kunden själv rört våningen. Visar "Från din flytt". */
  vaningFranFlytten: boolean
  hiss?: Hiss
  avstand?: Avstand
  framkomlighet: string
  /** Boarea i m² om kunden ändrat den, annars hämtas den från flytten. */
  kvm?: string
}

export type Biyta = { id: string; typ?: BiytaTyp; kvm?: string; fullt?: string }
export type Sak = { id: string; vad: string; vikt?: string; varde?: string }
export type Samtal = { dag: string; pass: string }

export type Answers = {
  /** Samtalet är bokat, Opportunityn finns. */
  samtal?: Samtal
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
  stadMer: string[]
  stadMerKvm?: string
  balkong?: JaNej
  balkongStorlek?: 'liten' | 'mellan' | 'stor'
  balkongGlas?: 'halv' | 'hel'
  fonster: Partial<Record<FonsterTyp, number>>
  fonsterInga: boolean
  kansliga?: JaNej
  kansligaText: string
  /* 6 Sista detaljerna */
  tillval: Tillval[]
  ovrigt: string
}

const FRAN: AdressSvar = { bostadstyp: 'lagenhet', vaning: '1', vaningFranFlytten: true, framkomlighet: '' }
const TILL: AdressSvar = { bostadstyp: 'lagenhet', vaningFranFlytten: false, framkomlighet: '' }

export const EMPTY: Answers = {
  telefon: '070-123 45 67',
  sent: false,
  stopp: [],
  fran: FRAN,
  till: TILL,
  biytor: [],
  saker: [],
  stadMer: [],
  fonster: {},
  fonsterInga: false,
  kansligaText: '',
  tillval: [],
  ovrigt: '',
}

const KEY = 'flyttsmart-demo-flytt-steg1-v2'

export const TOTAL = 6

/** Giltigt svar på bärsträckan: ett tal (även 0) eller Vet inte. Gamla sparade värden ("u25") räknas inte. */
export const harAvstand = (v: unknown): v is Avstand => typeof v === 'number' || v === 'vet-ej'

const adressLeft = (s: AdressSvar) => {
  const lagenhet = s.bostadstyp === 'lagenhet'
  return [lagenhet && !s.vaning, lagenhet && !s.hiss, !harAvstand(s.avstand)].filter(Boolean).length
}

/** Obesvarade knappfrågor per steg, i ordningen Adresser, Bära ut, Bära in, Vad ska med, Städning, Sista detaljerna. */
export const questionsLeft = (a: Answers): number[] => [
  a.sammaDag ? 0 : 1,
  adressLeft(a.fran),
  adressLeft(a.till),
  [!a.bohag, !a.biytaSvar, !a.sakerSvar, !a.utemobler].filter(Boolean).length,
  !a.stad ? 1 : a.stad === 'nej' ? 0 : [!a.stadYta, !a.balkong, Object.keys(a.fonster).length === 0 && !a.fonsterInga, !a.kansliga].filter(Boolean).length,
  0,
]

const adressTouched = (s: AdressSvar) => !!(s.hiss || harAvstand(s.avstand) || s.framkomlighet || !s.vaningFranFlytten)

/** En flagga per steg: har kunden svarat på något där. */
export const answeredQuestions = (a: Answers) => [
  a.sammaDag !== undefined || a.stopp.length > 0,
  adressTouched(a.fran),
  adressTouched(a.till),
  !!a.bohag || !!a.biytaSvar || !!a.sakerSvar || a.utemobler !== undefined,
  a.stad !== undefined,
  a.tillval.length > 0 || !!a.ovrigt || a.sent,
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
        if (saved.fran && saved.till && Array.isArray(saved.stopp)) setAnswers({ ...EMPTY, ...saved })
      }
    } catch {
      // sessionStorage kan saknas, då börjar demon om varje gång
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
    setAnswers(EMPTY)
  }, [])

  return { answers, update, reset, loaded }
}

export const newId = () => Math.random().toString(36).slice(2, 8)

export const FLOORS = ['BV', '1', '2', '3', '4', '5', '6', '7']
export const PASS: [string, string][] = [
  ['08-10', 'Förmiddag'],
  ['10-12', 'Lunchtid'],
  ['13-15', 'Tidig em.'],
  ['15-17', 'Sen em.'],
]

export const BOSTADSTYP_LABEL: Record<Bostadstyp, string> = { lagenhet: 'Lägenhet', radhus: 'Radhus', villa: 'Villa' }
export const HISS_LABEL: Record<Hiss, string> = { stor: 'Stor hiss', liten: 'Liten hiss', nej: 'Ingen hiss', 'vet-ej': 'Vet inte' }
export const AVSTAND_STEG = 5
export const AVSTAND_MAX = 100
export const avstandText = (v: Avstand) => (v === 'vet-ej' ? 'Vet inte' : v >= AVSTAND_MAX ? `${AVSTAND_MAX} m eller mer` : `${v} m`)
export const BOHAG_LABEL: Record<Bohag, string> = { lite: 'Lite bohag', normalt: 'Normalt bohag', mycket: 'Mycket bohag' }
export const BIYTA_LABEL: Record<BiytaTyp, string> = { kallare: 'Källare', vind: 'Vind', forrad: 'Förråd', garage: 'Garage', uterum: 'Uterum', annat: 'Annat' }
export const BIYTA_KVM = ['5', '10', '20', '30', '50+']
export const FULLT = ['25 %', '50 %', '75 %', 'Fullt']
export const VIKT = ['0–80 kg', '80–150 kg', '150–200 kg', '200+ kg']
export const VARDE = ['0–30 000 kr', '30 000–50 000 kr', '50 000–100 000 kr', '100 000+ kr']
export const STAD_MER = ['Källare', 'Balkong', 'Förråd', 'Garage']
export const FONSTER_LABEL: Record<FonsterTyp, [string, string]> = {
  fyrsidiga: ['Fyrsidiga', 'Två bågar, fyra sidor att putsa'],
  sprojsade: ['Spröjsade', 'Många små rutor'],
  panorama: ['Panoramafönster', 'Stora glaspartier'],
  svaratkomliga: ['Svåråtkomliga', 'Högt upp eller svåra att nå'],
}
export const TILLVAL_LABEL: Record<Tillval, [string, string]> = {
  packhjalp: ['Packhjälp', 'Vi packar, lån av flyttlådor ingår'],
  lador: ['Lån av flyttlådor', 'Levereras hem före flytten'],
  bortforsling: ['Bortforsling', 'Återvinning av det som inte ska med'],
  montering: ['Montering', 'Vi plockar isär och sätter ihop möbler som inte går in hela'],
  forvaring: ['Förvaring', 'Mellan ut- och inflytt'],
}

/** "fredag 23/10 kl. 13-15" eller "snart", i sajtens egen form. */
export const samtalText = (s?: Samtal) => {
  if (!s) return ''
  if (s.pass === 'nu') return 'snart'
  if (s.pass === 'flexibel') return s.dag
  return `${s.dag} kl. ${s.pass}`
}
