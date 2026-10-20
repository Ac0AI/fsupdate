/*
 * Datumhjälp för ringtiden, i sajtens former: "ons 21 okt" i fältet,
 * "onsdag 21/10" i texten "Vi ringer dig …". Veckan börjar på måndag,
 * helger går inte att välja, max en vecka framåt (som live, maxWeeksAhead 1).
 */

const sv = 'sv-SE'

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const addDays = (d: Date, n: number) => {
  const x = startOfDay(d)
  x.setDate(x.getDate() + n)
  return x
}
export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
/** Måndag i veckan datumet ligger i. */
export const startOfWeek = (d: Date) => addDays(d, -((d.getDay() + 6) % 7))
export const weekDays = (d: Date) => Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(d), i))

export const isBusinessDay = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6
export const isPastDay = (d: Date) => startOfDay(d) < startOfDay(new Date())
/** Sista valbara dagen: slutet på nästa vecka. */
export const maxDay = () => addDays(startOfWeek(new Date()), 13)

export const CLOSING_HOUR = 17

/** Dagen går att välja: vardag, inte passerad, inte efter stängning i dag, högst nästa vecka. */
export const isSelectable = (d: Date) => {
  if (!isBusinessDay(d) || isPastDay(d) || startOfDay(d) > maxDay()) return false
  if (sameDay(d, new Date()) && new Date().getHours() >= CLOSING_HOUR) return false
  return true
}
export const nextSelectable = () => {
  let d = startOfDay(new Date())
  for (let i = 0; i < 14 && !isSelectable(d); i++) d = addDays(d, 1)
  return d
}

/** Passet är passerat i dag: "13-15" är stängt efter kl. 15. */
export const isSlotPassed = (slot: string, d: Date) => {
  if (!sameDay(d, new Date())) return false
  const end = Number(slot.split('-')[1])
  return new Date().getHours() >= end
}
/** Måndag: morgonpassen göms, som live (shouldHideSlots). */
export const hideMorning = (d: Date) => d.getDay() === 1
export const canCallNow = (d: Date) => {
  const now = new Date()
  return sameDay(d, now) && isBusinessDay(now) && now.getHours() >= 8 && now.getHours() < CLOSING_HOUR
}

const strip = (s: string) => s.replace('.', '')
/** "ons 21 okt" */
export const fmtShort = (d: Date) => strip(new Intl.DateTimeFormat(sv, { weekday: 'short', day: 'numeric', month: 'short' }).format(d))
/** "onsdag 21/10" */
export const fmtLong = (d: Date) => `${new Intl.DateTimeFormat(sv, { weekday: 'long' }).format(d)} ${d.getDate()}/${d.getMonth() + 1}`
/** "20 okt - 26 okt 2026" */
export const fmtWeekTitle = (d: Date) => {
  const from = startOfWeek(d)
  const to = addDays(from, 6)
  const dm = (x: Date) => strip(new Intl.DateTimeFormat(sv, { day: 'numeric', month: 'short' }).format(x))
  return `${dm(from)} - ${dm(to)} ${to.getFullYear()}`
}
export const fmtWeekday = (d: Date) => strip(new Intl.DateTimeFormat(sv, { weekday: 'short' }).format(d))

export const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const fromIso = (s: string) => {
  const [y = 1970, m = 1, d = 1] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
/** "onsdag 11 november" */
export const fmtLongDate = (d: Date) => new Intl.DateTimeFormat(sv, { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
/** "november 2026" */
export const fmtMonth = (d: Date) => new Intl.DateTimeFormat(sv, { month: 'long', year: 'numeric' }).format(d)
/** Dagarna i månadens rutnät, måndag först, med tomma rutor före den första. */
export const monthGrid = (d: Date): Array<Date | null> => {
  const first = new Date(d.getFullYear(), d.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return [...Array<null>(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(d.getFullYear(), d.getMonth(), i + 1))]
}
