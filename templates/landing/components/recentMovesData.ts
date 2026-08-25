/**
 * SIMULERAD DATA. Flödet i RecentMoves visar påhittade händelser så att designen
 * går att bedöma. Byt ut hela den här filen mot en endpoint med verkliga,
 * avidentifierade händelser innan flödet läggs på flyttsmart.se - ett påhittat
 * aktivitetsflöde är precis den sorts påstående som spricker när någon kollar.
 */

export type MoveEvent = {
  person: string
  city: string
  action: string
  service: 'el' | 'bredband' | 'flytt' | 'stad' | 'forsakring' | 'adress'
}

export const SERVICE_ICONS: Record<MoveEvent['service'], string> = {
  el: 'M13 10V3L4 14h7v7l9-11h-7z',
  bredband:
    'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  flytt: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  stad: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  forsakring:
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  adress:
    'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
}

export const MOVE_EVENTS: MoveEvent[] = [
  { person: 'Anna K.', city: 'Stockholm', action: 'fick sitt elavtal tecknat', service: 'el' },
  { person: 'Erik L.', city: 'Göteborg', action: 'fick flyttfirma bokad till 14 sep', service: 'flytt' },
  { person: 'Sara M.', city: 'Malmö', action: 'fick bredband inkopplat till inflyttning', service: 'bredband' },
  { person: 'Johan B.', city: 'Uppsala', action: 'fick flyttstädning bokad', service: 'stad' },
  { person: 'Emma S.', city: 'Solna', action: 'fick hemförsäkringen flyttad', service: 'forsakring' },
  { person: 'Oskar T.', city: 'Nacka', action: 'fick adressen ändrad hos Skatteverket', service: 'adress' },
  { person: 'Linnea H.', city: 'Linköping', action: 'fick sitt elavtal tecknat', service: 'el' },
  { person: 'Marcus P.', city: 'Västerås', action: 'fick flyttfirma bokad till 3 okt', service: 'flytt' },
  { person: 'Ida R.', city: 'Lund', action: 'fick bredband inkopplat till inflyttning', service: 'bredband' },
  { person: 'Fredrik A.', city: 'Örebro', action: 'fick flyttstädning bokad', service: 'stad' },
  { person: 'Nora W.', city: 'Sollentuna', action: 'fick hemförsäkringen flyttad', service: 'forsakring' },
  { person: 'Daniel E.', city: 'Helsingborg', action: 'fick adressen ändrad hos Skatteverket', service: 'adress' },
]

/** Åldern på de rader som renderas på servern, så att första paint är identisk i båda ändar. */
export const INITIAL_AGES_SECONDS = [95, 380, 700, 1080, 1500]
