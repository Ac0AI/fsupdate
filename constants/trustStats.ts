// Manually maintained marketing stats shown in trust badges. Update here when the
// real Google rating or review count changes.
export const GOOGLE_RATING = 4.7
export const GOOGLE_REVIEW_COUNT = 500
// Samma siffra som brandguiden. Ändras här, inte i komponenterna.
export const MOVES_SINCE_2020 = '230 000'

// Rabatten på elavtalet hos Fortum, bara via Flyttsmart. Siffran från ägaren 2026-09-03
// ("1035 rabatt på fortum"); ändras avtalet, ändra här och ingen annanstans.
export const FORTUM_DISCOUNT_SEK = '1 035'

// Inrikes flyttar i Sverige per år enligt SCB: 1 483 434 år 2025 ("nära 1,5 miljoner",
// sidan Flyttar inom Sverige, uppdaterad 2026-02-24). SCB räknar flyttar, inte
// personer. Kollat 2026-09-03 sedan VD föreslog 1,3 miljoner.
export const MOVES_IN_SWEDEN_PER_YEAR = 'nära 1,5 miljoner'
export const MOVES_IN_SWEDEN_SOURCE_URL = 'https://www.scb.se/hitta-statistik/sverige-i-siffror/manniskorna-i-sverige/flyttar-inom-sverige/'

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
  body: 'Färdigförhandlade leverantörer, och vi tar ansvar hela vägen till det nya hemmet.',
  numbers: 'Över 230 000 personer har flyttat med oss sedan 2020.',
} as const

/**
 * Siffrorna högst upp på /om-oss. Varje rad har en ägare och ett datum, för det
 * här är påståenden en kund kan kolla. Saknar en rad källa ska den bort, inte
 * stå kvar för att den ser bra ut.
 *
 * Bekräftade av David:
 *  - 230 000+ hjälpta flyttare  (2026-08-29)
 *  - 120+ partners              (2026-08-25). OBS: brandguidens Block 3 säger
 *    "ett hundratal anslutna bolag" (Sebastian 2026-09-03); ägaren avgör vilket
 *    tal som gäller eller om de räknar olika saker.
 *  - 3000+ mäklare              (2026-08-25)
 *  - 4,7/5 på Google, över 500 omdömen (samma tal som startsidan, GOOGLE_RATING
 *    och GOOGLE_REVIEW_COUNT ovan). 9,6/10 ströks 2026-09-03: två skalor på
 *    samma sajt.
 *
 * Strukna 2026-09-03 (Sebastian): 98,6 % nöjda (fjärde nöjdhetstalet utan källa),
 * "Sveriges största" och "under fem år" (2020 till 2026 är sex år).
 *
 * ÄNNU INTE BELAGDA:
 *  - 16 personer i teamet
 *  - 2 300 användare första året
 */
export const ABOUT_STATS = [
  { value: '230 000+', label: 'Hjälpta flyttare' },
  { value: '120+', label: 'Partners' },
  { value: '3000+', label: 'Mäklare' },
  { value: '4,7/5', label: `Kundbetyg på Google, över ${GOOGLE_REVIEW_COUNT} omdömen` },
] as const
