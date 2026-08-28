export type Distance = 'near' | 'medium' | 'far'
export type Elevator = 'big' | 'small' | 'none'

export type Residence = {
  street: string
  city: string
  size: number
  floor: number
  elevator: Elevator
  distance: Distance
  hardAccess: boolean
  accessNote: string
}

export type Addon = 'packing' | 'moveclean' | 'boxes' | 'assembly' | 'storage' | 'recycling'

export type QuoteRequest = {
  from: Residence
  to: Residence
  heavyItems: boolean
  heavyNote: string
  addons: Addon[]
  dateMode: 'fixed' | 'flexible'
}

// Tre svar i stället för fem metersintervall. Kunden vet inte om det är 40
// eller 60 meter till porten, men vet om det är nära eller långt.
export const DISTANCES: { value: Distance; label: string; hint: string }[] = [
  { value: 'near', label: 'Nära', hint: 'under 25 m' },
  { value: 'medium', label: 'En bit', hint: '25 till 50 m' },
  { value: 'far', label: 'Långt', hint: 'över 50 m' },
]

export const ELEVATORS: { value: Elevator; label: string }[] = [
  { value: 'big', label: 'Stor' },
  { value: 'small', label: 'Liten' },
  { value: 'none', label: 'Ingen' },
]

// Packhjälp och städ förvalda: de största merförsäljningarna och de flesta
// vill ha dem. Resten är nischade nog att kräva ett aktivt val.
export const ADDONS: { value: Addon; label: string; hint: string; defaultOn: boolean }[] = [
  { value: 'packing', label: 'Packhjälp', hint: 'Tar i snitt 70 timmar för en tvåa', defaultOn: true },
  { value: 'moveclean', label: 'Flyttstädning', hint: 'Med städgaranti', defaultOn: true },
  { value: 'boxes', label: 'Flyttkartonger', hint: 'Lån, levereras hem', defaultOn: false },
  { value: 'assembly', label: 'Montering', hint: 'Ned och upp av möbler', defaultOn: false },
  { value: 'storage', label: 'Magasinering', hint: 'Om datumen inte går ihop', defaultOn: false },
  { value: 'recycling', label: 'Bortforsling', hint: 'Det du inte vill ta med', defaultOn: false },
]

export const STEP_TITLES = ['Bostaden', 'Bohaget', 'Nina räknar'] as const
