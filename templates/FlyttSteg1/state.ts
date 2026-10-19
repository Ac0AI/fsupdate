'use client'

import { useCallback, useEffect, useState } from 'react'

export type Bohag = 'lite' | 'normalt' | 'mycket'
export type Biyta = 'forrad' | 'vind' | 'garage' | 'uterum' | 'nej'
export type Hiss = 'stor' | 'liten' | 'ingen'
export type Avstand = 'u25' | '25-50' | '50-75' | '75-100' | 'o100' | 'vet-inte'
export type Extra = 'tungt' | 'omtaligt' | 'balkong' | 'fonster' | 'inget'
export type JaNej = 'ja' | 'nej'

export type FlerKey = 'stadning' | 'packhjalp' | 'lador' | 'forvaring' | 'bortforsling' | 'vardesaker' | 'montering' | 'utemobler'

export type Answers = {
  requested: boolean
  bohag?: Bohag
  biyta?: Biyta
  biytaKvm: number
  biytaStad?: JaNej
  vaning?: string
  hiss?: Hiss
  avstandFran?: Avstand
  avstandTill?: Avstand
  tillNotering: string
  extra: Extra[]
  extraTouched: boolean
  balkongStorlek?: 'liten' | 'mellan' | 'stor'
  fler: Partial<Record<FlerKey, JaNej>>
  paPlats: boolean
  ringtid?: string
  extraDone: boolean
}

export const EMPTY: Answers = {
  requested: false,
  biytaKvm: 8,
  tillNotering: '',
  extra: [],
  extraTouched: false,
  fler: {},
  paPlats: false,
  extraDone: false,
}

const KEY = 'flyttsmart-demo-flytt-steg1'

export const answeredQuestions = (a: Answers) => {
  const q1 = !!a.bohag
  const floor = Number(a.vaning?.replace('+', '') ?? NaN)
  const needsHiss = !Number.isNaN(floor) && floor >= 3
  const q2 = !!a.vaning && (!needsHiss || !!a.hiss) && !!a.avstandFran
  const q3 = !!a.avstandTill
  const q4 = a.extraTouched
  return [q1, q2, q3, q4]
}

export const answeredCount = (a: Answers) => answeredQuestions(a).filter(Boolean).length

export const flerCount = (a: Answers) => Object.keys(a.fler).length + (a.ringtid ? 1 : 0)

export const useDemoState = () => {
  const [answers, setAnswers] = useState<Answers>(EMPTY)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY)
      if (raw) setAnswers({ ...EMPTY, ...(JSON.parse(raw) as Partial<Answers>) })
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

export const AVSTAND_LABEL: Record<Avstand, string> = {
  u25: 'Under 25 m',
  '25-50': '25–50 m',
  '50-75': '50–75 m',
  '75-100': '75–100 m',
  o100: 'Över 100 m',
  'vet-inte': 'Vet inte',
}

export const BOHAG_LABEL: Record<Bohag, string> = { lite: 'Lite bohag', normalt: 'Normalt bohag', mycket: 'Mycket bohag' }
export const BIYTA_LABEL: Record<Biyta, string> = { forrad: 'Förråd', vind: 'Vind', garage: 'Garage', uterum: 'Uterum', nej: 'Ingen biyta' }
export const HISS_LABEL: Record<Hiss, string> = { stor: 'stor hiss', liten: 'liten hiss', ingen: 'ingen hiss' }
export const EXTRA_LABEL: Record<Extra, string> = {
  tungt: 'Tungt (piano, kassaskåp)',
  omtaligt: 'Ömtåligt (konst, glas)',
  balkong: 'Inglasad balkong',
  fonster: 'Spröjsade eller stora fönster',
  inget: 'Inget av det här',
}
export const FLER_LABEL: Record<FlerKey, string> = {
  stadning: 'Flyttstädning',
  packhjalp: 'Packhjälp',
  lador: 'Lådor',
  forvaring: 'Förvaring',
  bortforsling: 'Bortforsling',
  vardesaker: 'Värdesaker',
  montering: 'Montering',
  utemobler: 'Utemöbler',
}
