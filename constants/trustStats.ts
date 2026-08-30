// Manually maintained marketing stats shown in trust badges. Update here when the
// real Google rating or review count changes.
export const GOOGLE_RATING = 4.7
export const GOOGLE_REVIEW_COUNT = 500
// Samma siffra som brandguiden. Ändras här, inte i komponenterna.
export const MOVES_SINCE_2020 = '230 000'

/**
 * Bevisblocket under heron. En stor sanning i stället för tre små - varje rad
 * ska gå att belägga.
 *
 * Källor:
 *  - "Hälften av Sveriges mäklarkedjor": varumärkesplattformen aug 2026.
 *  - "Över 230 000 flyttar sedan 2020": bekräftad av David 2026-08-29 (höjt från 200 000, samma siffra som brandguiden).
 *  - "Tjänsten kostar dig ingenting": bevis 2, leverantörerna betalar.
 */
export const PROOF_BLOCK = {
  eyebrow: 'Rekommenderas av',
  claim: 'Hälften av Sveriges mäklarkedjor',
  body: 'Vi bokar inte bara åt dig. Vi ser till att arbetet blir gjort – och går något fel hör du av dig till oss.',
  numbers: 'Över 230 000 flyttar sedan 2020. Tjänsten kostar dig ingenting.',
} as const

/**
 * Siffrorna högst upp på /om-oss. Varje rad har en ägare och ett datum, för det
 * här är påståenden en kund kan kolla. Saknar en rad källa ska den bort, inte
 * stå kvar för att den ser bra ut.
 *
 * Bekräftade av David:
 *  - 230 000+ hjälpta flyttare  (2026-08-29)
 *  - 120+ partners              (2026-08-25)
 *  - 3000+ mäklare              (2026-08-25)
 *
 * ÄNNU INTE BELAGDA. Behöver källa och ägare, annars bort vid nästa genomgång:
 *  - 9,6/10 kundbetyg   (varifrån? Google visar 4,7 av 5, se GOOGLE_RATING ovan)
 *  - 98,6 % nöjda med personliga servicen  (används i qualities-listan)
 *  - 16 personer i teamet
 *  - 2 300 användare första året
 */
export const ABOUT_STATS = [
  { value: '230 000+', label: 'Hjälpta flyttare' },
  { value: '120+', label: 'Partners' },
  { value: '3000+', label: 'Mäklare' },
  { value: '9,6/10', label: 'Kundbetyg' },
] as const
