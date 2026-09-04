# Bloggen blir Flyttguiden (2026-09-04)

Sebastians genomgång av bloggen. Ägaren: "gör det". Allt nedan är genomfört i
kod och speglat i Paper (sidan Web - Blogg, artboards Flyttguiden och Guide i
Flyttguiden) om inget annat står.

## 1. Ordet

| Var | Före | Efter |
|---|---|---|
| Header | (ingen länk alls) | Flyttguiden, mellan Våra tjänster och Samarbetspartners |
| Footer | Blogg | Flyttguiden (en: Moving guide) |
| Sidans etikett | BLOGG | FLYTTGUIDEN |
| Sidtitel och OG | Blogg \| Flyttsmart | Flyttguiden \| Flyttsmart |
| Schema | Flyttsmarts blogg, brödsmula "Blogg" | Flyttguiden i båda |
| Knappar i texten | Läs artikeln, Alla artiklar, Mer att läsa | Läs guiden, Hela Flyttguiden, Mer i Flyttguiden |
| 404 | Den artikeln finns inte | Den guiden finns inte, knapp Till Flyttguiden |

Skälet: blogg signalerar företagsnyheter, flyttguide är både det folk söker på
och det som beskriver innehållet.

**Adressen är kvar på /blogg.** Kritiken pekade ut header, footer och etikett,
inte URL:en, och ett byte till /flyttguiden kräver en permanent redirect från
alla indexerade adresser. Säg till så gör jag det med redirect i next.config.

## 2. Regel 4: pris kommer aldrig först

| Artikel | Före | Efter |
|---|---|---|
| Flytthjälp | Rubrik "Vad kostar en flyttfirma egentligen", ingress "Timpris säger lite ..." | Rubrik "Så vet du att flyttfirmans offert håller", ingress "Takpris eller estimat avgör vem som bär risken när flytten drar över. Tre frågor gör offerterna jämförbara." |
| Flytthjälp, första stycket | "Två firmor med samma timpris kan landa tusenlappar ifrån varandra." | Nytt förstastycke om vem som bär risken vid takpris mot estimat. Timpris-stycket ligger kvar som nummer två. |
| Flyttstädning | "Städa själv eller boka: en ärlig kalkyl", "Räkna med tolv timmar för en trea. Sätt ett timpris på din egen tid först." | Ägarens formulering: "Städa själv eller boka" och "Tolv timmar för en trea – så mycket av helgen kostar det att städa själv." |
| Flyttstädning, avsnittet "Så jämför du rakt" | Bad läsaren räkna timpris efter RUT gånger kvadratmeter mot sin egen lön | "Vad du byter bort": en arbetsdag mitt i flyttveckan, flyttad till någon som gör momenten varje vecka. Garantistycket ligger kvar. |

Ordet flyttfirma står kvar i rubriken eftersom det är det folk söker på. Tid och
trygghet leder, kronorna kommer när läsaren vet vad hon jämför.

## 3. Listrubriken

"Fler artiklar" var en tunn rubrik för sidans huvudinnehåll. Nu "Guider för hela
flytten".

## 4. Kategorifilter

Etiketterna på korten går att klicka på. Chipsen följer flödets stil (36 px,
navy när valda, innehållsbreda) och kommer från samma Chip-atom. Filtret ligger
i klienten och tar aldrig bort artiklar ur DOM:en, så både läsare och sökmotorer
ser hela guiden. En ny kategori dyker upp av sig själv via `BLOG_CATEGORIES`.

## 5. Datum och uppdateringsmarkering

Korten visar nu datum, och artikeln säger "Publicerad {datum}". Fältet `updated`
finns i datamodellen och tar över raden när det är satt: "Uppdaterad {datum}".

**Ingen artikel har ett uppdateringsdatum ännu, och jag har inte satt något.**
Datumet ska sättas den dag någon faktiskt läst källan igen. Reglerna i de fyra
regelartiklarna (uppsägningstider på el och bredband, flyttanmälan, tullregler)
är ännu inte avstämda mot källan, det står redan i filhuvudet i `constants/blog.ts`.
Det är ägarens och koordinatorernas jobb, inte något jag kan påstå.

## 6. Utland

Artikeln "Det tullen faktiskt frågar efter" och sidan Flytta utomlands tog förut
samma läsare från två håll. Nu länkar de till varandra: artikeln har ett kort
till tjänsten, hubben ett "Läs först"-kort till artikeln. Landssidorna ligger
kvar under tjänsten, aldrig under guiden.
