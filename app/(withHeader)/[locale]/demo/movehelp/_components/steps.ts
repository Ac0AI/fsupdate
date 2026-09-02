export type Dwelling = 'apartment' | 'house' | 'townhouse'
// Tom sträng = inte besvarat än. Vet ej är ett riktigt svar, tomt är det inte.
export type Distance = 'd25' | 'd50' | 'd75' | 'd100' | 'far' | 'unknown' | ''
export type Elevator = 'big' | 'small' | 'none' | 'unknown' | ''
export type SecondaryKind = 'basement' | 'attic' | 'storage' | 'garage' | 'other'
export type StartTime = 'morning' | 'forenoon' | 'afternoon' | 'any'
export type KeyHandling = 'present' | 'absent' | 'unknown'
// Städningen ligger aldrig efter flyttdagen: bostaden lämnas städad.
export type CleanDay = 'same' | 'custom'

// Förråd, garage, vind. Bara på från-adressen: frågan är om ytan ska tömmas
// och flyttas, städas, eller båda. Flera får finnas, en villa har ofta både
// garage och förråd.
export type Secondary = {
  id: number
  kind: SecondaryKind
  area: number
  move: boolean
  clean: boolean
}

export type Residence = {
  street: string
  city: string
  dwelling: Dwelling
  size: number
  floor: number
  // Hiss frågas bara i lägenhet. Villa och radhus har ingen.
  elevator: Elevator
  distance: Distance
  hardAccess: boolean
  accessNote: string
  // Bara från-adressen och bara villa eller radhus: trädgårdsmöbler tar plats i bilen.
  outdoorFurniture: boolean
  secondaries: Secondary[]
}

export type Addon = 'packing' | 'moveclean' | 'assembly' | 'storage' | 'recycling'

export type Cleaning = {
  specialWindows: boolean
  glazedBalcony: boolean
  // Ungefärlig yta när balkongen är inglasad. Städas som en del av bostaden.
  balconyArea: number
  sensitiveSurfaces: boolean
  keys: KeyHandling
  // Var nyckeln finns när ingen är hemma: brevlåda, granne, kod.
  keyNote: string
  day: CleanDay
  customDate: string
}

export type HeavyKind = 'piano' | 'safe' | 'aquarium' | 'art' | 'other'

export type QuoteRequest = {
  from: Residence
  to: Residence
  heavyItems: boolean
  // Chips i stället för fritext: kunden pekar, vi räknar. Fritext bara vid Annat.
  heavyKinds: HeavyKind[]
  heavyNote: string
  // Bohag 2010: föremål värda över ett halvt prisbasbelopp ska uppges i förväg.
  valuables: boolean
  valuablesNote: string
  addons: Addon[]
  // fixed = tillträdesdagen, flexible = vi föreslår, custom = kunden väljer själv
  dateMode: 'fixed' | 'flexible' | 'custom'
  customDate: string
  startTime: StartTime
  note: string
  cleaning: Cleaning
}

export const DWELLINGS: { value: Dwelling; label: string }[] = [
  { value: 'apartment', label: 'Lägenhet' },
  { value: 'house', label: 'Villa' },
  { value: 'townhouse', label: 'Radhus' },
]

// Våningen som chips: BV och 1 till 4, sedan 5+ (värdet 5 betyder fem eller högre).
export const FLOORS: { value: number; label: string }[] = [
  { value: 0, label: 'BV' },
  ...[1, 2, 3, 4].map((f) => ({ value: f, label: String(f) })),
  { value: 5, label: '5+' },
]

export const ELEVATORS: { value: Elevator; label: string }[] = [
  { value: 'big', label: 'Stor (6+ pers)' },
  { value: 'small', label: 'Liten' },
  { value: 'none', label: 'Saknas' },
  { value: 'unknown', label: 'Vet ej' },
]

// Samma intervall som flyttfirman räknar med. Vet ej är ett riktigt svar,
// inte ett fel: vi frågar om det behövs.
export const DISTANCES: { value: Distance; label: string }[] = [
  { value: 'd25', label: '0–25 m' },
  { value: 'd50', label: '26–50 m' },
  { value: 'd75', label: '51–75 m' },
  { value: 'd100', label: '76–100 m' },
  { value: 'far', label: 'Över 100 m' },
  { value: 'unknown', label: 'Vet ej' },
]

export const SECONDARY_KINDS: { value: SecondaryKind; label: string }[] = [
  { value: 'storage', label: 'Förråd' },
  { value: 'garage', label: 'Garage' },
  { value: 'attic', label: 'Vind' },
  { value: 'basement', label: 'Källare' },
  { value: 'other', label: 'Annat' },
]

export const START_TIMES: { value: StartTime; label: string; hint: string }[] = [
  { value: 'morning', label: 'Morgon', hint: 'start 08–09' },
  { value: 'forenoon', label: 'Förmiddag', hint: 'start 09–12' },
  { value: 'afternoon', label: 'Eftermiddag', hint: 'start efter 12' },
  { value: 'any', label: 'Spelar ingen roll', hint: 'vi föreslår' },
]

export const KEY_HANDLING: { value: KeyHandling; label: string }[] = [
  { value: 'present', label: 'Jag är hemma' },
  { value: 'absent', label: 'Lämnar nyckel' },
  { value: 'unknown', label: 'Vet ej' },
]

// Förklaringarna sätts i flödet, de innehåller det faktiska datumet.
export const CLEAN_DAYS: { value: CleanDay; title: string }[] = [
  { value: 'same', title: 'Samma dag som flytten' },
  { value: 'custom', title: 'Ett annat datum' },
]

// Packhjälp och städ är toggles, förvalda på: de största merförsäljningarna och de
// flesta vill ha dem. Resten är chips under "Lägg till", så kortet håller sig kort.
export const ADDONS: { value: Addon; label: string; hint: string; defaultOn: boolean; kind: 'toggle' | 'chip' }[] = [
  { value: 'packing', label: 'Packhjälp', hint: 'Vi packar allt, kartonger ingår, du får kvällarna tillbaka', defaultOn: true, kind: 'toggle' },
  { value: 'moveclean', label: 'Flyttstädning', hint: 'Med städgaranti: godkänd besiktning eller omstädning', defaultOn: true, kind: 'toggle' },
  { value: 'assembly', label: 'Montering', hint: 'Vi tar ned och sätter upp möbler, lampor och hyllor', defaultOn: false, kind: 'toggle' },
  { value: 'storage', label: 'Magasinering', hint: 'Från en månad, vi hämtar och lämnar', defaultOn: false, kind: 'toggle' },
  { value: 'recycling', label: 'Bortforsling', hint: 'Vi kör till tippen eller lämnar till återbruk', defaultOn: false, kind: 'toggle' },
]

export const HEAVY_KINDS: { value: HeavyKind; label: string }[] = [
  { value: 'piano', label: 'Piano' },
  { value: 'safe', label: 'Kassaskåp' },
  { value: 'aquarium', label: 'Akvarium' },
  { value: 'art', label: 'Konst eller värdesaker' },
  { value: 'other', label: 'Annat' },
]

// Städytan är boarean plus de biytor som ska städas.
export const cleanArea = (res: Residence) => res.size + res.secondaries.filter((s) => s.clean).reduce((sum, s) => sum + s.area, 0)

export const STEP_TITLES = ['Bostäderna', 'Tjänster och flyttdag', 'Offert på väg'] as const
