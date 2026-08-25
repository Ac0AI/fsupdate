/**
 * Innehållet för /flytta-utomlands och landssidorna under den.
 *
 * Arkitekturen kommer från artboarden "Sidstruktur och sök" i Paper (sidan
 * Utland). Kort version:
 *
 *  - /flytta-utomlands            hubben
 *  - /flytta-utomlands/spanien    en landssida per land, 15-20 stycken
 *  - Stad x land byggs först när Search Console visar volym. Aldrig autogenererat.
 *
 * Landssidorna ligger under tjänsten, aldrig under bloggen. Den som söker på
 * "flytta till Spanien" vill flytta, inte läsa. Lägger vi det i bloggen
 * konkurrerar vi med vår egen hub om samma ord.
 *
 * Fem saker byts per land, resten står still: landsnamn, transporttider, orter
 * med fast avgång, tullstatus och hero-bilden.
 *
 * SIFFRORNA ÄR ÄNNU INTE BELAGDA. Transporttiderna kommer från Paper-designen
 * och behöver stämmas av mot verkliga avgångar innan sidorna får indexeras.
 * Prisspannet i PRICE_ANCHOR står medvetet som XX tills vi har ett tal att stå
 * för. Utan siffror finns inget att citera, men fel siffror är värre.
 */

export type TransportOption = {
  name: string
  note: string
  days: string
  price: string
  fits: string
  recommended?: boolean
}

export type FaqItem = {
  question: string
  answer: string
}

export type Country = {
  slug: string
  /** Så landet skrivs i löptext: "flytta till Spanien" */
  name: string
  /** Orter vi har fast avgång till. Visas i hubbens landlista. */
  cities: string[]
  /** Transporttid med samlast, räknat från upphämtning. */
  transitDays: string
  transitNote: string
  inEu: boolean
  customsLabel: string
  customsNote: string
  /** Ingressen i heron. Ska säga något sant om just det landet. */
  intro: string
  bullets: string[]
  /** Kort svar högst upp. Tre till fem meningar, med siffror. */
  quickAnswer: string
  /** Datum då uppgifterna senast stämdes av. Syns på sidan. */
  updated: string
  transport: TransportOption[]
  /** Landsspecifika frågor. De generella läggs på automatiskt. */
  faq: FaqItem[]
}

export const ABROAD_UPDATED = '25 augusti 2026'

/** Hubben: hero */
export const ABROAD_HERO = {
  eyebrow: 'Flytta utomlands',
  headline: ['En flytt som håller', 'hela vägen hem'],
  body: 'Vi tar hand om hela flytten – packning, transport, tull och bärning in i det nya hemmet. Sex år har vi lagt på att hitta flyttgubbarna som kör varje sträcka. Det är de som ringer på hos dig.',
  bullets: [
    'Flyttgubbar vi handplockat under sex år. Inte någon vi ringde upp i förra veckan.',
    'Försäkrat ända fram. Skyddet slutar inte vid gränsen.',
    'Fast pris. Tull och pappersarbete ingår, inga tillägg efteråt.',
    'Samma kontaktperson från första samtalet till sista lådan.',
  ],
} as const

/** Hubben: den mörka trygghetsraden under heron */
export const ABROAD_TRUST = [
  {
    title: 'Bohag 2010',
    body: 'Konsumentverkets framförhandlade flyttvillkor gäller. Inte våra egna finstilta.',
  },
  {
    title: 'Fullständigt försäkrat',
    body: 'Transport- och ansvarsförsäkring som gäller dina saker ända fram, inte bara till gränsen.',
  },
  {
    title: 'En att ringa',
    body: 'Blir något försenat eller skadat hör du av dig till oss. Vi löser det, du behöver inte jaga någon.',
  },
] as const

/**
 * Hubben: mäklarsektionen.
 *
 * Paper-designen har även tre omdömen och en presslista under logotyperna, men
 * båda står som PLATSHÅLLARE där. De läggs till när vi har riktiga
 * utlandsomdömen från Google och riktiga artiklar att länka till.
 */
export const ABROAD_BROKERS = {
  headline: 'Mäklarna rekommenderar oss. Även när flytten går utomlands.',
  body: 'Hälften av Sveriges mäklarkår tipsar sina kunder om Flyttsmart. De sätter sitt eget namn på rekommendationen, och det gör ingen som inte litar på vem som dyker upp på flyttdagen.',
  logos: [
    { src: '/images/partners/all/fastighetsbyran-logo-pobmqvfiy.svg', alt: 'Fastighetsbyrån' },
    { src: '/images/partners/all/maklarhuset-logotyp-1wwxhjgay.svg', alt: 'Mäklarhuset' },
    { src: '/images/partners/all/notar-new-4g0mb9fuo.svg', alt: 'Notar' },
    { src: '/images/partners/all/historiska-hem-logo-ri0m3fw-x.svg', alt: 'Historiska Hem' },
    { src: '/images/partners/all/lejons-makleri-logo-njpe-l-5m.svg', alt: 'Lejons Mäkleri' },
    { src: '/images/partners/all/edward-logo-mi5yjp1j1.svg', alt: 'Edward Partners' },
  ],
} as const

/** Hubben: så går det till */
export const ABROAD_STEPS = [
  {
    step: 'Steg 1',
    title: 'Du skickar in flytten',
    body: 'Vart, ungefär när och hur mycket. Detaljerna reder vi ut senare, de behövs inte för att sätta ett upplägg.',
  },
  {
    step: 'Steg 2',
    title: 'Vi sätter upplägget',
    body: 'Efter sex år och tiotusentals flyttar vet vi vilka som ska köra just din sträcka. Du behöver inte jämföra något.',
  },
  {
    step: 'Steg 3',
    title: 'Vi kör din flytt',
    body: 'Ett pris, en kontaktperson, ett företag som ansvarar. Du behöver inte hålla i något själv.',
  },
] as const

/** Hubben: prisankaret */
export const PRICE_ANCHOR = {
  headline: 'Vad landar en utlandsflytt på?',
  body: 'En tvåa till Spanien med samlast hamnar oftast på XX 000–XX 000 kr. Vad just din flytt kostar beror på volym, våning och hur bråttom du har.',
  note: 'Du får en exakt siffra innan du bestämmer dig, och den ändras bara om du lägger till något efter att vi räknat.',
  included: ['Transport dörr till dörr', 'Försäkring hela vägen', 'Tullhandlingar och pappersarbete', 'Lastning och bärning in i nya hemmet'],
  extra: ['Packning', 'Magasinering i endera änden', 'Piano och flygel', 'Bil och husdjur'],
} as const

/** Hubben: ansvarsfördelningen */
export const ABROAD_RESPONSIBILITY = {
  headline: 'Vad du slipper, och vad du gör själv',
  body: 'Otydligt ansvar läses alltid som ditt ansvar. Så här ser gränsen ut.',
  columns: [
    {
      label: 'Det här slipper du',
      items: ['Tullpapper och blanketter', 'Packmaterial och lådor', 'Lastning och lossning', 'Transporten och allt kring den', 'Bärning in i det nya hemmet'],
    },
    {
      label: 'Det här gör du själv',
      items: ['Anmäler utflytten till Skatteverket', 'Avslutar el och bredband hemma'],
      footnote: 'Eller låter oss göra det. Vi sköter redan den delen åt svenskar som flyttar inom landet.',
    },
    {
      label: 'Löser vi separat',
      items: ['Husdjur', 'Bil och motorcykel', 'Piano och flygel'],
      footnote: 'Fråga när du hör av dig, så säger vi rakt ut om vi kan eller inte.',
      dark: true,
    },
  ],
} as const

/**
 * Generella frågor. Ligger sist i FAQ:n på både hubben och varje landssida, så
 * att de landsspecifika frågorna kommer först där de hör hemma.
 */
export const SHARED_FAQ: FaqItem[] = [
  {
    question: 'Gäller Bohag 2010 även vid utlandsflytt?',
    answer:
      'Vi tillämpar Bohag 2010 som grund, alltså de villkor Konsumentverket förhandlat fram för flyttbranschen. För själva den gränsöverskridande transporten tillämpas därutöver internationella transportvillkor. Båda står i avtalet du får innan du bestämmer dig.',
  },
  {
    question: 'Hur långt i förväg bör jag boka?',
    answer:
      'Minst en månad före önskat flyttdatum. Till populära destinationer under sommaren behövs oftast två. Ju tidigare du skickar in, desto större chans att du får samlast och därmed lägre pris.',
  },
  {
    question: 'Vad är samlast och varför blir det billigare?',
    answer:
      'Ditt bohag delar lastutrymme med andras på samma sträcka. Du betalar för din volym i stället för hela bilen. Det tar några dagar längre än direktkörning men kostar betydligt mindre.',
  },
  {
    question: 'Kan ni packa åt mig?',
    answer:
      'Ja, och vid utlandsflytt rekommenderar vi det. Hur sakerna packas avgör både hur de klarar en lång transport och vad försäkringen täcker om något ändå går sönder. Packar du själv får du vår packlista.',
  },
  {
    question: 'Vad får inte skickas?',
    answer:
      'Brandfarligt, vätskor under tryck, färg, batterier och vapen. Vissa länder har dessutom egna regler för livsmedel, växter och alkohol. Vi går igenom listan för ditt land innan avresa.',
  },
]

/** Hubbens egna frågor, före de generella. */
export const ABROAD_FAQ: FaqItem[] = [
  {
    question: 'Vilka är det som kommer hem till mig?',
    answer:
      'Flyttgubbar vi handplockat under sex år och samarbetar med över hela landet. Vi vet vilka som gör ett bra jobb på just din sträcka, och det är dem du får. Samma gäng packar, lastar och bär in i det nya hemmet.',
  },
  {
    question: 'Vad kostar det?',
    answer:
      'Du får ett pris från oss, inte ett spann och inte tre att välja mellan. Priset täcker transport, försäkring och tullhantering, och står skrivet innan du bestämmer dig.',
  },
  {
    question: 'Vilka länder gäller det?',
    answer:
      'Hela Europa med lastbil, resten av världen med container eller flyg. Är sträckan ovanlig säger vi det direkt i stället för att lova något vi inte kan hålla.',
  },
  {
    question: 'Gäller försäkringen även i det nya landet?',
    answer:
      'Ja. Försäkringen gäller dina saker ända fram, inte bara till gränsen. Och händer något är det oss du ringer, inte ett flyttbolag i ett annat land, på ett språk du inte pratar.',
  },
  ...SHARED_FAQ,
  {
    question: 'Behöver jag vara på plats vid leverans?',
    answer:
      'Ja, eller någon du litar på. Sakerna ska kvitteras på plats och eventuella skador antecknas direkt. En anmärkning väger tyngst samma dag.',
  },
  {
    question: 'Kan ni magasinera mellan ut- och inflytt?',
    answer:
      'Vanligt när du måste ut ur den gamla bostaden innan du kommer in i den nya. Vi ordnar det inom samma upplägg, så du har fortfarande bara oss att hålla reda på.',
  },
  {
    question: 'Vad händer om något går sönder?',
    answer:
      'Du hör av dig till oss. Vi driver ärendet mot försäkringen och håller dig uppdaterad tills det är löst. Du ska inte behöva jaga någon.',
  },
]

/**
 * Standarduppsättningen transportsätt. Tiderna skrivs över per land där de
 * skiljer sig, resten står still.
 */
const transportFor = (country: Country['name'], samlast: string, direkt: string, paket: string): TransportOption[] => [
  {
    name: 'Samlast med lastbil',
    note: 'Vi rekommenderar',
    days: samlast,
    price: 'Lägst',
    fits: 'Har ett par veckors marginal på flyttdatumet och vill hålla nere kostnaden.',
    recommended: true,
  },
  {
    name: 'Direktbil',
    note: 'När datumet är låst',
    days: direkt,
    price: 'Högst',
    fits: 'Måste ha sakerna på plats ett bestämt datum, till exempel vid tillträde eller jobbstart.',
  },
  {
    name: 'Pall eller paket',
    note: 'Mindre volym',
    days: paket,
    price: 'Lågt, per kolli',
    fits: `Ska skicka delar av hemmet, inte hela. Bor möblerat i ${country}.`,
  },
]

export const COUNTRIES: Country[] = [
  {
    slug: 'spanien',
    name: 'Spanien',
    cities: ['Costa del Sol', 'Barcelona', 'Alicante'],
    transitDays: '6–10 dagar',
    transitNote: 'med samlast till Costa del Sol',
    inEu: true,
    customsLabel: 'Ingen tull',
    customsNote: 'Spanien ligger inom EU',
    intro:
      'Spanien är vår mest trafikerade sträcka. Vi kör den varje månad, vilket både kortar tiden och sänker priset – du kan dela lastutrymme i stället för att betala för hela bilen.',
    bullets: [
      'Fast avgång varje månad till Costa del Sol, Costa Blanca och Barcelona.',
      'Inom EU – ditt bohag passerar utan tulldeklaration.',
      'Samma flyttgubbar packar i Sverige och bär in i Spanien.',
      'Magasinering i båda ändar om tillträdet glappar.',
    ],
    quickAnswer:
      'En flytt från Sverige till Spanien tar 6–10 dagar med samlast och kräver ingen tulldeklaration, eftersom båda länderna ligger inom EU. Boka minst en månad i förväg, två under sommaren. Flyttsmart ansvarar för hela flytten: packning, transport, försäkring och bärning in i den nya bostaden.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Spanien', '6–10 dagar', '3–4 dagar', '5–8 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Spanien?',
        answer:
          'Nej. Både Sverige och Spanien ligger inom EU:s inre marknad, så ditt bohag passerar utan tulldeklaration. Kanarieöarna är undantaget – de står utanför EU:s momsområde och kräver pappersarbete. Det sköter vi.',
      },
      {
        question: 'Hur lång tid tar en flytt till Spanien?',
        answer:
          '6–10 dagar med samlast till Costa del Sol, Costa Blanca eller Barcelona. Direktbil tar 3–4 dagar men kostar betydligt mer. Till Kanarieöarna tillkommer båttiden.',
      },
      {
        question: 'Vilka delar av Spanien kör ni till?',
        answer:
          'Fasta avgångar till Costa del Sol, Costa Blanca och Barcelona. Madrid, Valencia, Marbella, Málaga, Alicante och Kanarieöarna löser vi också, med något längre framförhållning.',
      },
      {
        question: 'Måste jag vara på plats i Spanien vid leverans?',
        answer:
          'Ja, eller någon du utsett. Många löser det med en granne eller mäklare. Godset ska kvitteras och eventuella skador noteras direkt – det är då en anmärkning är som starkast.',
      },
    ],
  },
  {
    slug: 'portugal',
    name: 'Portugal',
    cities: ['Lissabon', 'Algarve', 'Porto'],
    transitDays: '8–12 dagar',
    transitNote: 'med samlast till Algarve',
    inEu: true,
    customsLabel: 'Ingen tull',
    customsNote: 'Portugal ligger inom EU',
    intro:
      'Portugal ligger längst bort av våra europeiska sträckor, vilket gör samlast till det självklara valet. Vi kör via Spanien och lastar av på vägen ner, så tiden blir längre men priset lägre.',
    bullets: [
      'Fast avgång till Lissabon, Algarve och Porto.',
      'Inom EU – ingen tulldeklaration för ditt bohag.',
      'Samma kontaktperson hela vägen, på svenska.',
      'Magasinering i Portugal om tillträdet dröjer.',
    ],
    quickAnswer:
      'En flytt från Sverige till Portugal tar 8–12 dagar med samlast och kräver ingen tulldeklaration, eftersom båda länderna ligger inom EU. Sträckan går via Spanien, så avgångarna är färre än till Costa del Sol. Boka minst sex veckor i förväg, mer under sommaren.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Portugal', '8–12 dagar', '4–5 dagar', '7–10 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Portugal?',
        answer: 'Nej. Portugal ligger inom EU:s inre marknad, så ditt bohag passerar utan tulldeklaration. Madeira och Azorerna kräver båtfrakt och något mer pappersarbete, som vi sköter.',
      },
      {
        question: 'Hur lång tid tar en flytt till Portugal?',
        answer: '8–12 dagar med samlast till Lissabon, Algarve eller Porto. Direktbil tar 4–5 dagar. Skillnaden är större här än till Spanien, eftersom samlasten lastar av på vägen ner.',
      },
      {
        question: 'Vilka delar av Portugal kör ni till?',
        answer: 'Fasta avgångar till Lissabon, Algarve och Porto. Coimbra, Cascais och inlandet löser vi med något längre framförhållning.',
      },
      {
        question: 'Måste jag vara på plats i Portugal vid leverans?',
        answer: 'Ja, eller någon du utsett. Godset ska kvitteras och eventuella skador noteras direkt, det är då en anmärkning väger tyngst.',
      },
    ],
  },
  {
    slug: 'frankrike',
    name: 'Frankrike',
    cities: ['Paris', 'Riviera', 'Bordeaux'],
    transitDays: '6–9 dagar',
    transitNote: 'med samlast till Paris',
    inEu: true,
    customsLabel: 'Ingen tull',
    customsNote: 'Frankrike ligger inom EU',
    intro:
      'Frankrike är stort, och skillnaden mellan Paris och Rivieran är flera dagar på lastbilen. Vi kör båda, men lägger upp dem olika – säg vart du ska så räknar vi på den sträckan, inte på ett snitt.',
    bullets: [
      'Fast avgång till Paris, Rivieran och Bordeaux.',
      'Inom EU – ingen tulldeklaration för ditt bohag.',
      'Trånga innerstadsgator och gamla trapphus är vardag för oss.',
      'Magasinering i båda ändar om tillträdet glappar.',
    ],
    quickAnswer:
      'En flytt från Sverige till Frankrike tar 6–9 dagar med samlast och kräver ingen tulldeklaration, eftersom båda länderna ligger inom EU. Till Rivieran tar det ett par dagar längre än till Paris. Boka minst en månad i förväg, två under sommaren.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Frankrike', '6–9 dagar', '3–4 dagar', '5–8 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Frankrike?',
        answer: 'Nej. Frankrike ligger inom EU:s inre marknad, så ditt bohag passerar utan tulldeklaration.',
      },
      {
        question: 'Hur lång tid tar en flytt till Frankrike?',
        answer: '6–9 dagar med samlast till Paris, Bordeaux eller Rivieran. Direktbil tar 3–4 dagar. Södra Frankrike ligger i den övre delen av spannet.',
      },
      {
        question: 'Vilka delar av Frankrike kör ni till?',
        answer: 'Fasta avgångar till Paris, Bordeaux och Rivieran med Nice, Cannes och Antibes. Lyon, Toulouse och Bretagne löser vi med längre framförhållning.',
      },
      {
        question: 'Kommer lastbilen fram i franska innerstäder?',
        answer:
          'Oftast ja, men gamla kvarter har smala gator och portar som en långtradare inte tar sig in i. Då lastar vi om till en mindre bil på plats. Säg till om adressen ligger i en gammal stadskärna, så planerar vi för det från början.',
      },
    ],
  },
  {
    slug: 'italien',
    name: 'Italien',
    cities: ['Milano', 'Rom', 'Toscana'],
    transitDays: '7–10 dagar',
    transitNote: 'med samlast till Milano',
    inEu: true,
    customsLabel: 'Ingen tull',
    customsNote: 'Italien ligger inom EU',
    intro:
      'Italien delar sig i norr och söder. Milano ligger nära nog för att köras som en vanlig kontinental sträcka, medan Rom och söderut lägger på ett par dagar. Vi kör båda.',
    bullets: [
      'Fast avgång till Milano, Rom och Toscana.',
      'Inom EU – ingen tulldeklaration för ditt bohag.',
      'Bärning in i gamla trapphus utan hiss ingår.',
      'Magasinering i Italien om tillträdet dröjer.',
    ],
    quickAnswer:
      'En flytt från Sverige till Italien tar 7–10 dagar med samlast och kräver ingen tulldeklaration, eftersom båda länderna ligger inom EU. Milano ligger i den nedre delen av spannet, Rom och söderut i den övre. Boka minst en månad i förväg.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Italien', '7–10 dagar', '3–5 dagar', '6–9 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Italien?',
        answer: 'Nej. Italien ligger inom EU:s inre marknad, så ditt bohag passerar utan tulldeklaration.',
      },
      {
        question: 'Hur lång tid tar en flytt till Italien?',
        answer: '7–10 dagar med samlast. Milano ligger i den nedre delen av spannet, Rom och Toscana i mitten, Syditalien och Sicilien över. Direktbil tar 3–5 dagar.',
      },
      {
        question: 'Vilka delar av Italien kör ni till?',
        answer: 'Fasta avgångar till Milano, Rom och Toscana. Bologna, Turin, Neapel och Sicilien löser vi med längre framförhållning.',
      },
      {
        question: 'Bär ni in i hus utan hiss?',
        answer:
          'Ja. Italienska trapphus är ofta smala och hissarna små eller obefintliga. Det ingår, men vi vill veta om det i förväg – bärning fyra trappor tar tid som ska finnas i planeringen.',
      },
    ],
  },
  {
    slug: 'tyskland',
    name: 'Tyskland',
    cities: ['Berlin', 'Hamburg', 'München'],
    transitDays: '4–6 dagar',
    transitNote: 'med samlast till Berlin',
    inEu: true,
    customsLabel: 'Ingen tull',
    customsNote: 'Tyskland ligger inom EU',
    intro:
      'Tyskland är den enklaste utlandsflytten vi gör. Kort sträcka, inga tullpapper och avgångar varannan vecka. Många av våra Europaflytter passerar ändå landet, vilket gör samlast lätt att få plats i.',
    bullets: [
      'Avgång varannan vecka till Berlin, Hamburg och München.',
      'Inom EU – ingen tulldeklaration för ditt bohag.',
      'Kortast transporttid av alla våra utlandssträckor efter Norden.',
      'Magasinering i båda ändar om tillträdet glappar.',
    ],
    quickAnswer:
      'En flytt från Sverige till Tyskland tar 4–6 dagar med samlast och kräver ingen tulldeklaration, eftersom båda länderna ligger inom EU. Norra Tyskland går snabbare än Bayern. Boka minst tre veckor i förväg, en månad under sommaren.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Tyskland', '4–6 dagar', '2–3 dagar', '3–5 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Tyskland?',
        answer: 'Nej. Tyskland ligger inom EU:s inre marknad, så ditt bohag passerar utan tulldeklaration.',
      },
      {
        question: 'Hur lång tid tar en flytt till Tyskland?',
        answer: '4–6 dagar med samlast. Hamburg och Berlin ligger i den nedre delen av spannet, München i den övre. Direktbil tar 2–3 dagar.',
      },
      {
        question: 'Vilka delar av Tyskland kör ni till?',
        answer: 'Fasta avgångar till Berlin, Hamburg och München. Köln, Frankfurt, Düsseldorf och Stuttgart löser vi löpande.',
      },
      {
        question: 'Måste jag anmäla mig till Anmeldung innan flytten?',
        answer:
          'Nej, folkbokföringen i Tyskland gör du på plats efter inflytt och den påverkar inte transporten. Vi behöver bara en adress att leverera till och någon som kvitterar.',
      },
    ],
  },
  {
    slug: 'norge',
    name: 'Norge',
    cities: ['Oslo', 'Bergen', 'Stavanger'],
    transitDays: '2–4 dagar',
    transitNote: 'med samlast till Oslo',
    inEu: false,
    customsLabel: 'Tull krävs',
    customsNote: 'Norge står utanför EU:s tullunion',
    intro:
      'Norge är kort på kartan men inte i pappersarbete. Landet står utanför EU:s tullunion, så ditt bohag ska tulldeklareras även om det bara är en kort körning över gränsen. Flyttgods är tullfritt när du faktiskt flyttar, men deklarationen ska ändå göras rätt.',
    bullets: [
      'Avgång varje vecka till Oslo, Bergen och Stavanger.',
      'Utanför EU – vi upprättar tulldeklarationen åt dig.',
      'Kortaste transporttiden av alla våra utlandssträckor.',
      'Fjordvägar och trånga tillfarter är vardag för våra förare.',
    ],
    quickAnswer:
      'En flytt från Sverige till Norge tar 2–4 dagar med samlast. Norge står utanför EU:s tullunion, så bohaget ska tulldeklareras – flyttgods är tullfritt om du ägt sakerna innan flytten, men deklarationen måste ändå upprättas. Flyttsmart sköter den. Boka minst tre veckor i förväg.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Norge', '2–4 dagar', '1–2 dagar', '2–4 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Norge?',
        answer:
          'Ja. Norge står utanför EU:s tullunion, så allt bohag ska deklareras vid gränsen. Har du ägt och använt sakerna innan flytten är de tullfria, men deklarationen ska ändå upprättas och det gör vi åt dig.',
      },
      {
        question: 'Hur lång tid tar en flytt till Norge?',
        answer: '2–4 dagar med samlast till Oslo, Bergen eller Stavanger. Direktbil tar 1–2 dagar. Nordnorge ligger längre bort och planeras separat.',
      },
      {
        question: 'Vilka delar av Norge kör ni till?',
        answer: 'Veckoavgångar till Oslo, Bergen och Stavanger. Trondheim, Kristiansand och Tromsö löser vi med längre framförhållning.',
      },
      {
        question: 'Vad händer om jag har alkohol eller livsmedel i flyttlasset?',
        answer:
          'Norge har egna kvoter för alkohol, tobak och vissa livsmedel, och de gäller även i ett flyttlass. Det enklaste är att lämna det hemma. Vi går igenom listan med dig innan avresa så inget stoppas vid gränsen.',
      },
    ],
  },
  {
    slug: 'danmark',
    name: 'Danmark',
    cities: ['Köpenhamn', 'Århus'],
    transitDays: '2–4 dagar',
    transitNote: 'med samlast till Köpenhamn',
    inEu: true,
    customsLabel: 'Ingen tull',
    customsNote: 'Danmark ligger inom EU',
    intro:
      'Danmark är den enda utlandsflytten som kan gå på en dag om du vill. Köpenhamn ligger närmare Malmö än Malmö ligger Göteborg, och inom EU finns inga tullpapper att vänta på.',
    bullets: [
      'Avgång varje vecka till Köpenhamn och Århus.',
      'Inom EU – ingen tulldeklaration för ditt bohag.',
      'Från Skåne kan flytten göras på en dag med direktbil.',
      'Magasinering i båda ändar om tillträdet glappar.',
    ],
    quickAnswer:
      'En flytt från Sverige till Danmark tar 2–4 dagar med samlast och kräver ingen tulldeklaration, eftersom båda länderna ligger inom EU. Från Skåne går flytten på en dag med direktbil. Boka minst två veckor i förväg.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Danmark', '2–4 dagar', '1 dag', '2–4 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Danmark?',
        answer: 'Nej. Danmark ligger inom EU:s inre marknad, så ditt bohag passerar utan tulldeklaration.',
      },
      {
        question: 'Hur lång tid tar en flytt till Danmark?',
        answer: '2–4 dagar med samlast till Köpenhamn eller Århus. Med direktbil från Skåne går det på en dag, från Stockholm på två.',
      },
      {
        question: 'Vilka delar av Danmark kör ni till?',
        answer: 'Veckoavgångar till Köpenhamn och Århus. Odense, Aalborg och Jylland i övrigt löser vi löpande.',
      },
      {
        question: 'Är det värt att ta direktbil till Köpenhamn?',
        answer:
          'Oftare än till andra länder, ja. Sträckan är kort nog att prisskillnaden blir liten, och du slipper vänta på att samlasten fylls. Har du ett låst tillträdesdatum är det ofta rätt val här.',
      },
    ],
  },
  {
    slug: 'schweiz',
    name: 'Schweiz',
    cities: ['Zürich', 'Genève', 'Basel'],
    transitDays: '5–8 dagar',
    transitNote: 'med samlast till Zürich',
    inEu: false,
    customsLabel: 'Tull krävs',
    customsNote: 'Schweiz står utanför EU',
    intro:
      'Schweiz står utanför EU, vilket gör pappersarbetet till den svåra delen av flytten – inte körningen. Landet kräver en särskild flyttgodsdeklaration och ett intyg om att du faktiskt bosätter dig där. Det är den biten vi tar.',
    bullets: [
      'Fast avgång till Zürich, Genève och Basel.',
      'Utanför EU – vi upprättar flyttgodsdeklarationen åt dig.',
      'Inventarielista på tyska eller franska ingår.',
      'Magasinering i båda ändar om tillträdet glappar.',
    ],
    quickAnswer:
      'En flytt från Sverige till Schweiz tar 5–8 dagar med samlast. Schweiz står utanför EU, så bohaget ska tulldeklareras med en inventarielista och ett intyg om bosättning. Flyttgods är avgiftsfritt om du ägt sakerna i minst sex månader. Flyttsmart sköter pappersarbetet. Boka minst sex veckor i förväg.',
    updated: ABROAD_UPDATED,
    transport: transportFor('Schweiz', '5–8 dagar', '3–4 dagar', '4–7 dagar'),
    faq: [
      {
        question: 'Behöver jag tulldeklarera till Schweiz?',
        answer:
          'Ja. Schweiz står utanför EU och kräver en flyttgodsdeklaration med inventarielista samt ett intyg om att du bosätter dig i landet. Har du ägt sakerna i minst sex månader är de avgiftsfria. Vi upprättar handlingarna.',
      },
      {
        question: 'Hur lång tid tar en flytt till Schweiz?',
        answer: '5–8 dagar med samlast till Zürich, Genève eller Basel. Direktbil tar 3–4 dagar. Tullhanteringen vid gränsen ligger inne i tiden.',
      },
      {
        question: 'Vilka delar av Schweiz kör ni till?',
        answer: 'Fasta avgångar till Zürich, Genève och Basel. Bern, Lausanne, Lugano och alpdalarna löser vi med längre framförhållning.',
      },
      {
        question: 'Måste inventarielistan vara på tyska eller franska?',
        answer:
          'Ja, och på rätt språk för rätt kanton. Vi skriver listan åt dig utifrån vad som faktiskt lastas, så den stämmer med bilen när den kommer till gränsen. En lista som inte stämmer är den vanligaste orsaken till att gods blir stående.',
      },
    ],
  },
]

export const getCountry = (slug: string) => COUNTRIES.find((country) => country.slug === slug)

/** Transporttidsrutnätet på hubben, kortast först. */
export const TRANSIT_GRID = [...COUNTRIES]
  .sort((a, b) => parseInt(a.transitDays, 10) - parseInt(b.transitDays, 10))
  .map(({ slug, name, transitDays }) => ({ slug, name, transitDays }))
