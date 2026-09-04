/**
 * Innehållet för Flyttguiden (/blogg) och artiklarna under den.
 *
 * Ytan heter Flyttguiden, aldrig "bloggen" (Sebastian 2026-09-04): blogg
 * signalerar företagsnyheter, flyttguide är både det folk söker på och det som
 * beskriver innehållet. Ordet står i footern, i headern och som sidans egen
 * etikett. Adressen är kvar på /blogg tills ägaren säger annat.
 *
 * Guiden är redaktionell och länkar in till tjänsten. Den konkurrerar aldrig
 * med landssidorna under /flytta-utomlands om samma köpord: den som söker
 * "flytta till Spanien" ska landa på landssidan, inte på en artikel. Artiklar
 * som gränsar till en tjänst länkar dit i stället för att tävla, se
 * serviceLink nedan. Se artboarden "Sidstruktur och sök" i Paper (sidan Utland).
 *
 * Regel 4 gäller här som överallt: på fysiska tjänster kommer priset aldrig
 * först. Rubrik, ingress och första stycket ska bära tid och trygghet, och
 * kronorna får komma när läsaren redan vet vad hon jämför. Vi ber henne heller
 * aldrig räkna ut svaret själv, det är vårt jobb.
 *
 * Bilderna är platshållare, genererade med nanobanana via
 * `scripts/generate-blog-images.mjs`. De illustrerar ämnet och föreställer
 * varken människor eller något som kan läsas som ett kundcase.
 *
 * Texterna bygger på det koordinatorerna faktiskt får förklara för kunder.
 * Uppgifter som kan ändras, som uppsägningstider och tullregler, ska stämmas av
 * mot källan innan ett inlägg publiceras skarpt.
 */

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'callout'; label: string; text: string }
  | { type: 'steps'; items: string[] }

export type BlogPost = {
  slug: string
  category: string
  title: string
  /** Ingressen. Visas i listan och under rubriken på inlägget. */
  excerpt: string
  /** Lite längre version, bara på inläggssidan. */
  lead: string
  readingMinutes: number
  published: string
  /**
   * Sätts när texten stämts av mot källan igen. Visas som "Uppdaterad" i
   * listan och på artikeln. Uppsägningstider och tullregler ändras, och en
   * text om regler utan datum är inte värd att lita på. Sätt datumet den dag
   * någon faktiskt läst källan, aldrig i förväg.
   */
  updated?: string
  /** Platshållarillustration, genererad med scripts/generate-blog-images.mjs. */
  image: string
  /** Sätts på en artikel. Den får den stora platsen högst upp i guiden. */
  featured?: boolean
  /**
   * Tjänsten artikeln gränsar till. Utan den konkurrerar artikeln och sidan om
   * samma läsare; med den blir artikeln vägen in. Sätts bara när tjänsten
   * verkligen svarar på det artikeln väcker.
   */
  serviceLink?: { href: string; label: string; body: string }
  body: BlogBlock[]
}

export const BLOG_INTRO = {
  eyebrow: 'Flyttguiden',
  headline: 'Det ingen berättar innan du flyttar',
  body: 'Uppsägningstider, dolda avgifter och sådant som bara syns i efterhand. Vi skriver om det vi själva fått reda ut åt kunder.',
} as const

export const BLOG_CTA = {
  headline: 'Eller så gör vi det åt dig',
  body: 'Elavtal, bredband, försäkring och flyttanmälan. Ett beslut från dig, resten sköter vi med rätt datum på varje sak.',
  action: 'Starta din flytt',
} as const

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'betala-el-for-tva-adresser',
    category: 'Elavtal',
    title: 'Så undviker du att betala el för två adresser samtidigt',
    excerpt: 'Elavtalet följer inte med automatiskt, och uppsägningstiden räknas sällan från den dag du tror. Så här ser tidslinjen ut och det här är datumet som avgör.',
    lead: 'Elavtalet följer inte med när du flyttar, och uppsägningstiden räknas sällan från den dag du tror. Här är tidslinjen, och datumet som avgör allt.',
    readingMinutes: 6,
    published: '18 augusti 2026',
    image: '/images/blog/betala-el-for-tva-adresser.jpg',
    featured: true,
    body: [
      {
        type: 'paragraph',
        text: 'De flesta tror att elavtalet hänger ihop med personen. Det gör det inte. Det hänger ihop med anläggnings-ID, alltså med lägenheten eller huset. Flyttar du utan att säga upp avtalet fortsätter det löpa på den gamla adressen, och nästa person som flyttar in tecknar sitt eget avtal ovanpå.',
      },
      { type: 'heading', text: 'Datumet som avgör' },
      {
        type: 'paragraph',
        text: 'Uppsägningstiden på ett rörligt elavtal är oftast en månad, men den räknas från månadsskiftet efter att uppsägningen kommit in. Säger du upp den 2 september slutar avtalet alltså den 31 oktober, inte den 2 oktober. Två dagars fördröjning kostar en hel månad.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Säg upp elavtalet samma dag som du skriver på hyres- eller köpekontraktet. Inte när du packar.',
      },
      { type: 'heading', text: 'Tre saker att göra i rätt ordning' },
      {
        type: 'steps',
        items: [
          'Säg upp avtalet på gamla adressen med utflyttningsdatum. Gör det via elhandlarens sida, inte via telefon, så har du det skriftligt.',
          'Teckna avtal på nya adressen med tillträdesdatum. Gör det innan du säger upp det gamla, så kan du inte hamna emellan.',
          'Läs av mätaren på utflyttningsdagen och fotografera siffran. Det är din enda motbevisning om slutfakturan ser konstig ut.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Gör du det i den ordningen har du aldrig ett glapp och aldrig en överlappning. Missar du steg två blir du strömlös på inflyttningsdagen, vilket är betydligt dyrare än en extra månadsavgift.',
      },
    ],
  },
  {
    slug: 'tio-saker-att-anmala',
    category: 'Flyttanmälan',
    title: 'Tio saker att anmäla, i rätt ordning',
    excerpt: 'Ordningen spelar roll. Gör du eftersändningen sist hinner räkningarna före.',
    lead: 'Adressändring är inte en sak utan tio, och de hänger ihop. Gör dem i fel ordning och posten hinner till fel adress innan du hunnit ikapp.',
    readingMinutes: 4,
    published: '11 augusti 2026',
    image: '/images/blog/tio-saker-att-anmala.jpg',
    body: [
      {
        type: 'paragraph',
        text: 'Folkbokföringen hos Skatteverket är den som styr allt annat. Banker, försäkringsbolag och myndigheter hämtar adressen därifrån, men de gör det olika ofta. Några uppdaterar över natten, andra en gång i månaden. Det glappet är hela problemet.',
      },
      { type: 'heading', text: 'Börja med folkbokföringen' },
      {
        type: 'paragraph',
        text: 'Anmäl flytten till Skatteverket senast en vecka efter inflyttning. Du kan göra det upp till en månad i förväg, och det är då du ska göra det. Anmälan får ett inflyttningsdatum, så ingenting händer för tidigt bara för att du var ute i god tid.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Eftersändning är inte samma sak som adressändring. Eftersändning flyttar posten, folkbokföringen flyttar dig.',
      },
      { type: 'heading', text: 'Sedan de tio' },
      {
        type: 'steps',
        items: [
          'Skatteverket, folkbokföringen. Allt annat hänger på den.',
          'Eftersändning hos Svensk Adressändring, minst fem dagar före flytt.',
          'Elavtal på båda adresserna, med rätt datum på var och en.',
          'Bredband. Uppsägningstiden är oftast längre än du hinner med.',
          'Hemförsäkringen, som behöver täcka båda adresserna över flyttdagen.',
          'Bank och kreditkort, om de inte hämtar adressen från folkbokföringen.',
          'Facket och a-kassan, som nästan aldrig gör det.',
          'Vårdcentral och tandläkare, om du byter region.',
          'Prenumerationer och tidningar, som har egna adressregister.',
          'Arbetsgivaren, sist, för lönebeskedet ska till rätt ställe.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ordningen är inte godtycklig. Eftersändningen ska ligga tidigt eftersom den tar fem arbetsdagar att aktivera, men den går inte att lita på som enda lösning. Den fångar brev, inte autogiron och inte digitala fakturor som skickas till en adress du inte längre läser.',
      },
    ],
  },
  {
    slug: 'vad-kostar-en-flyttfirma',
    category: 'Flytthjälp',
    // Regel 4: rubrik och ingress bär trygghet, inte pris. Ordet flyttfirma
    // står kvar i rubriken för att det är det folk söker på.
    title: 'Så vet du att flyttfirmans offert håller',
    excerpt: 'Takpris eller estimat avgör vem som bär risken när flytten drar över. Tre frågor gör offerterna jämförbara.',
    lead: 'En offert är inte ett pris förrän du vet vad som ingår. Här är posterna som skiljer offerten från fakturan, och de tre frågorna som gör svaret bindande.',
    readingMinutes: 7,
    published: '4 augusti 2026',
    image: '/images/blog/vad-kostar-en-flyttfirma.jpg',
    body: [
      {
        type: 'paragraph',
        text: 'Ett takpris betyder att firman bär risken om flytten tar längre tid än de räknat med. Ett estimat betyder att du gör det. Den skillnaden avgör hur nära fakturan hamnar offerten, mer än timpriset gör.',
      },
      {
        type: 'paragraph',
        text: 'Två firmor med samma timpris kan därför landa tusenlappar ifrån varandra. Timpriset täcker bara tiden på plats, och tiden på plats är sällan det som kostar mest.',
      },
      { type: 'heading', text: 'Det som ligger utanför timpriset' },
      {
        type: 'paragraph',
        text: 'Framkörningsavgift tas ut för att få bilen till dig, och den räknas ofta både till och från. Tung utrustning, alltså piano, kassaskåp och tvättmaskin, prissätts styckvis. Trappor utan hiss läggs på per våning och per person. Packmaterial debiteras per låda om du inte tar med egna.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Be om ett takpris, inte ett timpris. Då är det firman som bär risken för att det tar längre tid än de trodde.',
      },
      { type: 'heading', text: 'Vad RUT faktiskt drar av' },
      {
        type: 'paragraph',
        text: 'RUT-avdraget gäller arbetskostnaden, inte materialet och inte transporten mellan adresserna. På en flytt där halva notan är körning blir avdraget mindre än de femtio procent folk räknar med. Fråga vilken del av offerten som är RUT-grundande innan du jämför två priser mot varandra.',
      },
      { type: 'heading', text: 'Tre frågor som gör offerten jämförbar' },
      {
        type: 'steps',
        items: [
          'Är det ett takpris eller ett estimat? Ett estimat är inte ett pris.',
          'Vad ingår utöver arbetstiden? Be om posterna, inte en summa.',
          'Vilken del är RUT-grundande? Det avgör vad du faktiskt betalar.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Får du raka svar på de tre kan du jämföra. Får du inte det är prisskillnaden mellan två firmor inte information, bara olika sätt att skriva samma osäkerhet.',
      },
    ],
  },
  {
    slug: 'hemforsakringen-flyttar-inte-sjalv',
    category: 'Försäkring',
    title: 'Hemförsäkringen flyttar inte med av sig själv',
    excerpt: 'Under flyttdagen kan båda adresserna behöva täckning. Det är inte givet att du har det.',
    lead: 'Mellan utflytt och inflytt finns ett glapp där dina saker står i en bil och två bostäder står tomma. Det är då försäkringen prövas.',
    readingMinutes: 5,
    published: '28 juli 2026',
    image: '/images/blog/hemforsakringen-flyttar-inte-sjalv.jpg',
    body: [
      {
        type: 'paragraph',
        text: 'De flesta hemförsäkringar täcker den adress som står i avtalet. Flyttar du utan att meddela bolaget är det fortfarande gamla adressen som är försäkrad, oavsett var du och dina saker faktiskt befinner sig.',
      },
      { type: 'heading', text: 'Dubbel täckning är regel, inte lyx' },
      {
        type: 'paragraph',
        text: 'De flesta bolag ger dubbel bosättning utan extra kostnad under en period runt flytten, ofta en månad. Den perioden aktiveras inte automatiskt. Du får den genom att anmäla flyttdatum och ny adress i förväg, och det är just den anmälan folk gör efter flytten i stället för före.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Anmäl ny adress och flyttdatum minst en vecka innan. Efterhandsanmälan ger sällan retroaktivt skydd.',
      },
      { type: 'heading', text: 'Det försäkringen inte täcker i lastbilen' },
      {
        type: 'paragraph',
        text: 'Skador som uppstår under själva transporten hör till flyttfirmans ansvarsförsäkring, inte till din hemförsäkring. Bär du själv finns det ingen som tar den skadan. En trasig tv i en hyrd släpvagn är därför en dyrare historia än samma tv i en flyttbil.',
      },
      {
        type: 'paragraph',
        text: 'Har du värdesaker över bolagets gräns för lösöre, exempelvis smycken, konst eller instrument, behöver de ofta anmälas separat även när de bara ska transporteras. Det tar fem minuter i förväg och är omöjligt att göra i efterhand.',
      },
    ],
  },
  {
    slug: 'uppsagningstiden-pa-bredband',
    category: 'Bredband',
    title: 'Uppsägningstiden är den dolda kostnaden',
    excerpt: 'Tre månaders bindning på gamla adressen äter snabbt upp rabatten på den nya.',
    lead: 'Bredband är den tjänst med längst uppsägningstid av alla du har hemma. Räkna baklänges från flyttdagen, inte framåt från idag.',
    readingMinutes: 4,
    published: '21 juli 2026',
    image: '/images/blog/uppsagningstiden-pa-bredband.jpg',
    body: [
      {
        type: 'paragraph',
        text: 'Elavtal har en månad. Bredband har ofta tre, och ibland en bindningstid ovanpå det. Säger du upp bredbandet samma vecka som du säger upp elen betalar du för uppkoppling i en tom lägenhet i två månader.',
      },
      { type: 'heading', text: 'Flytta med eller säga upp' },
      {
        type: 'paragraph',
        text: 'Många operatörer erbjuder att flytta med abonnemanget i stället för att avsluta det. Det låter enklare och är ibland det, men bara om den nya adressen har samma teknik. Går du från fiber till en fastighet med gruppavtal betalar du för två uppkopplingar där den ena inte går att använda.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Kolla vilken teknik den nya adressen har innan du väljer mellan att flytta med och att säga upp. Frågan avgör vilket som är billigast.',
      },
      { type: 'heading', text: 'Räkna baklänges' },
      {
        type: 'steps',
        items: [
          'Ta flyttdatumet och räkna bort uppsägningstiden. Där ligger sista dagen att säga upp.',
          'Kolla bindningstiden separat. Uppsägningstid och bindningstid är två olika klockor.',
          'Beställ på nya adressen i god tid. Fiberinstallation kan ta veckor, gruppavtal är igång direkt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Har du redan missat sista uppsägningsdagen är det ofta värt att fråga om flytt av abonnemanget ändå. Många operatörer släpper bindningen vid flytt om du stannar kvar som kund, och det är en fråga som bara ställs av den som vet att den finns.',
      },
    ],
  },
  {
    slug: 'stada-sjalv-eller-boka',
    category: 'Flyttstädning',
    // Ägarens formulering 2026-09-04. Tankstreck, aldrig emdash.
    title: 'Städa själv eller boka',
    excerpt: 'Tolv timmar för en trea – så mycket av helgen kostar det att städa själv.',
    lead: 'Flyttstädningen är det sista som ska göras och det som tar mest tid av allt du gör själv. Här är timmarna, momenten och vad som händer om besiktningen underkänner.',
    readingMinutes: 6,
    published: '14 juli 2026',
    image: '/images/blog/stada-sjalv-eller-boka.jpg',
    body: [
      {
        type: 'paragraph',
        text: 'En flyttstädning är inte en storstädning. Den har en checklista som ska klaras av besiktning, och den innehåller moment du aldrig gör annars: bakom och under spisen, kylens baksida, ventiler, elementens insidor, fönster i alla tre lager.',
      },
      { type: 'heading', text: 'Tidsåtgången folk underskattar' },
      {
        type: 'paragraph',
        text: 'Räkna med sex till åtta timmar för en tvåa och tio till tolv för en trea, om du gör det ensam och gör det ordentligt. Köket tar ungefär hälften av tiden oavsett bostadens storlek. Fönsterputs tar en timme per rum om fönstren har spröjs.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Städningen ska vara klar innan besiktningen, inte innan avflyttningen. Boka den till dagen efter att bohaget är ute.',
      },
      { type: 'heading', text: 'Vad du byter bort' },
      {
        type: 'paragraph',
        text: 'En trea tar ungefär en arbetsdag att städa själv, mitt i den vecka då allt annat också ska hinnas med. Bokar du städningen flyttas den dagen till någon som gör de här momenten varje vecka och vet vad besiktningen tittar efter.',
      },
      {
        type: 'paragraph',
        text: 'Det som avgör är oftast inte pengarna utan garantin. En bokad flyttstädning kommer med omstädning om besiktningen underkänner. Städar du själv och blir underkänd får du göra om det, samma vecka som du packar upp i det nya hemmet.',
      },
    ],
  },
  {
    slug: 'vad-tullen-fragar-efter',
    category: 'Utland',
    title: 'Det tullen faktiskt frågar efter',
    excerpt: 'Flyttgods är tullfritt om du ägt sakerna tillräckligt länge. Listan är kortare än du tror.',
    lead: 'Flyttar du utanför EU ska bohaget deklareras. Det betyder inte att du betalar tull, men det betyder att pappersarbetet måste stämma.',
    // Artikeln och /flytta-utomlands ligger nära varandra. Länken gör artikeln
    // till vägen in i tjänsten i stället för en konkurrent om samma läsare.
    serviceLink: {
      href: '/flytta-utomlands',
      label: 'Flytta utomlands',
      body: 'Vi går igenom handlingarna med dig och bokar transporten. Du får ett datumfönster innan du bokar.',
    },
    readingMinutes: 8,
    published: '7 juli 2026',
    image: '/images/blog/vad-tullen-fragar-efter.jpg',
    body: [
      {
        type: 'paragraph',
        text: 'Inom EU finns ingen tulldeklaration för bohag. Ska du till Norge, Schweiz eller Storbritannien ändras det. Där är flyttgods fortfarande avgiftsfritt när du faktiskt flyttar, men bara mot handlingar som visar att det är flyttgods och inte varor.',
      },
      { type: 'heading', text: 'Ägandetiden är kravet' },
      {
        type: 'paragraph',
        text: 'Huvudregeln i de flesta länder är att du ska ha ägt och använt sakerna i minst sex månader före flytten. Nyinköpt möblemang i originalkartong är per definition inte flyttgods, utan en import. Kvitton på det du köpt nära inpå flytten är därför värda att ha kvar.',
      },
      {
        type: 'callout',
        label: 'Kom ihåg',
        text: 'Inventarielistan ska stämma med vad som faktiskt står i bilen. En lista som inte stämmer är den vanligaste orsaken till att gods blir stående vid gränsen.',
      },
      { type: 'heading', text: 'Handlingarna som ska med' },
      {
        type: 'steps',
        items: [
          'Inventarielista över hela lasset, på landets språk där det krävs.',
          'Intyg om att du bosätter dig i landet, exempelvis hyreskontrakt eller anställningsavtal.',
          'Utflyttningsanmälan till Skatteverket, som visar att du lämnar Sverige.',
          'Passkopia, och för vissa länder personnummer eller motsvarande i det nya landet.',
        ],
      },
      { type: 'heading', text: 'Det som aldrig är flyttgods' },
      {
        type: 'paragraph',
        text: 'Alkohol och tobak har egna kvoter även i ett flyttlass. Livsmedel, växter och fröer stoppas ofta helt. Vapen kräver separata tillstånd i båda länderna. Bil och motorcykel hanteras som fordonsimport, inte som bohag, och har en helt egen process.',
      },
      {
        type: 'paragraph',
        text: 'Går något av det med utan att vara deklarerat är det inte lasset som stoppas, det är hela bilen. Därför går vi igenom listan innan avresa i stället för att hoppas att det löser sig vid gränsen.',
      },
    ],
  },
]

export const getPost = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug)

/**
 * Kategorierna i den ordning artiklarna ligger, utan dubbletter. Etiketterna
 * fanns redan på korten men gick inte att klicka på; filtret i listan använder
 * den här listan så att en ny kategori dyker upp av sig själv.
 */
export const BLOG_CATEGORIES = Array.from(new Set(BLOG_POSTS.map((post) => post.category)))

export const featuredPost = BLOG_POSTS.find((post) => post.featured) ?? BLOG_POSTS[0]

export const otherPosts = BLOG_POSTS.filter((post) => post.slug !== featuredPost.slug)
