'use client'

import { useCallback, useEffect, useState } from 'react'

/*
 * Svaren i steg 1 utan pris. Frågorna följer Harrys guide ett till ett, så att
 * varje svar kan gå rakt in i Opportunityn. Orden är sajtens egna, inte Nils.
 * Allt är frivilligt: ett tomt fält betyder att säljaren frågar i samtalet.
 */

export type JaNej = 'ja' | 'nej'
export type Hiss = 'ja' | 'nej' | 'vet-ej'
export type HissStorlek = 'liten' | 'stor'
export type Avstand = 'u25' | '25-50' | '50-75' | '75-100' | 'o100' | 'vet-ej'
export type Bohag = 'lite' | 'normalt' | 'mycket'
export type BiytaTyp = 'kallare' | 'vind' | 'forrad' | 'garage' | 'uterum' | 'annat'
export type FonsterTyp = 'fyrsidiga' | 'sprojsade' | 'panorama' | 'svaratkomliga'
export type Tillval = 'packhjalp' | 'lador' | 'bortforsling' | 'forvaring'

export type AdressSvar = {
  vaning?: string
  hiss?: Hiss
  hissStorlek?: HissStorlek
  avstand?: Avstand
  notering: string
}

export type Biyta = { id: string; typ?: BiytaTyp; kvm?: string; fullt?: string }
export type Sak = { id: string; vad: string; vikt?: string; varde?: string }

export type Answers = {
  requested: boolean
  sent: boolean
  /* 1 Adresser */
  stopp: string
  sammaDag?: JaNej
  /* 2–3 Bära ut, bära in */
  fran: AdressSvar
  till: AdressSvar
  /* 4 Vad ska med */
  bohag?: Bohag
  biytor: Biyta[]
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
  starttid?: string
  paPlatsFlytt: boolean
  paPlatsStad: boolean
  tillval: Tillval[]
  portkod: string
  ovrigt: string
  ringtid?: string
}

const EMPTY_ADRESS: AdressSvar = { notering: '' }

export const EMPTY: Answers = {
  requested: false,
  sent: false,
  stopp: '',
  fran: EMPTY_ADRESS,
  till: EMPTY_ADRESS,
  biytor: [],
  saker: [],
  stadMer: [],
  fonster: {},
  fonsterInga: false,
  kansligaText: '',
  paPlatsFlytt: false,
  paPlatsStad: false,
  tillval: [],
  portkod: '',
  ovrigt: '',
}

const KEY = 'flyttsmart-demo-flytt-steg1'

const adressTouched = (s: AdressSvar) => !!(s.vaning || s.hiss || s.avstand || s.notering)

/** En flagga per frågeskärm, i ordningen Adresser, Bära ut, Bära in, Vad ska med, Städning, Sista detaljerna. */
export const answeredQuestions = (a: Answers) => [
  a.sammaDag !== undefined || !!a.stopp,
  adressTouched(a.fran),
  adressTouched(a.till),
  !!a.bohag || a.biytor.length > 0 || a.saker.length > 0 || a.utemobler !== undefined,
  a.stad !== undefined,
  !!a.starttid || a.paPlatsFlytt || a.paPlatsStad || a.tillval.length > 0 || !!a.ringtid || a.sent,
]

export const TOTAL = 6

export const answeredCount = (a: Answers) => answeredQuestions(a).filter(Boolean).length

export const useDemoState = () => {
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY)
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Answers>
        // Gammalt format utan fran/till kastas, annars kraschar skärmarna
        if (saved.fran && saved.till) setAnswers({ ...EMPTY, ...saved })
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

export const FLOORS = ['BV', '1', '2', '3', '4', '5+']

export const AVSTAND_LABEL: Record<Avstand, string> = {
  u25: '0–25 m',
  '25-50': '26–50 m',
  '50-75': '51–75 m',
  '75-100': '76–100 m',
  o100: 'Över 100 m',
  'vet-ej': 'Vet inte',
}

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
export const STARTTIDER = ['08:00–09:00', '13:00–14:00', 'Vet inte']
export const TILLVAL_LABEL: Record<Tillval, [string, string]> = {
  packhjalp: ['Packhjälp', 'Vi packar, lån av flyttlådor ingår'],
  lador: ['Lån av flyttlådor', 'Levereras hem före flytten'],
  bortforsling: ['Bortforsling', 'Återvinning av det som inte ska med'],
  forvaring: ['Förvaring', 'Mellan ut- och inflytt'],
}
export const RINGTIDER = ['Mån 13–15', 'Mån 15–17', 'Tis 08–10', 'Tis 10–12']
