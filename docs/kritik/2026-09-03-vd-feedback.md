# VD:s genomgång av nya sajten (2026-09-03)

Sebastian Nielsen (VD) gick igenom startsidan och Om oss mot brandguiden. Ägaren: "kör enligt din rekommendation". Allt nedan är genomfört i kod och speglat i Paper (Startsida, Startsida mobil, Om oss) om inget annat står.

## Startsidan (commit 2b742f8, 970ad5d)

| Var | Före | Efter | Skäl |
|---|---|---|---|
| Eyebrow | Ett beslut. Hela flytten. | Kostnadsfritt · Hela Sverige | Löftet stannar internt; taglinen som H1 sa samma sak |
| H1 | Slipp stressen – vi fixar flytten | Det **enklaste** sättet att flytta | Ledde med förnekelse, "stressen" svepande, "fixar" fel register; orange på "enklaste" |
| Underrubrik | Färdigförhandlade förslag ... Enkelt att göra bra val. | Få färdigförhandlade förslag på el, bredband, flytthjälp och allt annat kring flytten. Tjänsten är kostnadsfri, och vi tar ansvar hela vägen. | "Enkelt att göra bra val" gör oss till jämförelsesajt; ansvaret ska synas ovanför mitten (snabbtest 5); "Tjänsten är kostnadsfri" så flytthjälpen inte läses som gratis |
| Under knappen | Kostnadsfritt. | (borta) | Såg ut som formateringsfel, flyttat in i underrubriken |
| Bevisblocket | Över 230 000 flyttar sedan 2020. | Över 230 000 personer har flyttat med oss sedan 2020. | Det verifierade talet räknar människor |
| Logoremsan | 40 loggor inkl. Tibber | Bara mäklare (Tibber och Mäklarhuset-dubbletten bort, riktiga alt-texter) | Rubriken säger mäklarkedjor |
| Ny sektion | | Förhandlat i förväg: "Priserna är redan förhandlade när du loggar in" + Fortum-kort "1 035 kr rabatt" | Beviset för att jobbet redan är gjort, inte en logovägg. Siffran från ägaren, `FORTUM_DISCOUNT_SEK` |

Slop-fynd efteråt: "kostnadsfritt" står två gånger i heron (eyebrow och underrubrik). Ägaren avgör.

## Om oss (commit 1d6759f)

| Var | Före | Efter | Skäl |
|---|---|---|---|
| Kundbetyg | 9,6/10 | 4,7/5, Kundbetyg på Google, över 500 omdömen | Två skalor på samma sajt; vi lutar oss mot Google |
| Koordinatorkortet | ... 98,6 % av kunderna är nöjda ... | ... samma person hela vägen, inte en ny handläggare varje gång du hör av dig. | Fjärde nöjdhetstalet utan källa; kontinuiteten är det unika |
| Siffrorna | ... till Sveriges största digitala flyttjänst på under fem år. | ... till över 230 000 hjälpta personer på sex år. | 2020 till 2026 är sex år; "största" obelagd |
| Heron | Sveriges första och enda digitala flyttjänst. | en digital flyttjänst för hela flytten. | "Enda" håller inte längre |
| Avtalsparten | När du bokar genom Flyttsmart är vi din avtalspart. | På flytt och städ är vi din avtalspart ... På el och bredband tecknar du avtalet direkt, men du har fortfarande kontakten med oss. En person, hela vägen. | Sant för båda; "skickar dig eller dina uppgifter vidare" ekar guidens offerttjänst-kort |
| Hela Sverige | Samma kvalitet och samma ansvar ... Malmö ... Luleå till Göteborg | Samma ansvar ... Stockholm ... Luleå till Malmö | Kvaliteten varierar med leverantören, ansvaret är strukturellt lika |
| Vart vi är på väg | 1,5 miljoner ... problemet 2020 | Varje år görs nära 1,5 miljoner flyttar inom Sverige ... köper, säljer eller byter hyresrätt ... | Riktning framåt, hyresrätter med utan att skylta partnerstrategin. VD skrev 1,3; SCB säger 1 483 434 flyttar 2025, källa länkad (`MOVES_IN_SWEDEN_PER_YEAR`) |
| Pitch-rubrik | Vi äger inte en enda flyttbil. | (borta) | Förnekelse nummer fem på sajten |
| Layout | Två kolumner, ljus liten brödtext, mint knapp | Centrerad spalt med vänsterställd text, navy 16–18 px, Maila oss i orange | Läsbarhet; mint är bekräftelse, orange är klicket |

## Kräver ägaren

- **120+ partners** på sajten mot brandguidens Block 3 "ett hundratal anslutna bolag". Räknar de olika saker, eller är ett tal fel?
- **Försäkringserbjudandet** ("första månaden kostnadsfritt på hemförsäkringen") väntar på exakta villkor innan det får ett kort bredvid Fortum.
- **Mäklarloggorna**: Camilla levererar rätt loggor i rätt kvalitet till remsan.
- **"Kostnadsfritt" två gånger i heron**: behåll båda, eller stryk en.

## Sebastians kommentar 2026-09-04 (Google-dokumentet, 09:28)

| Var | Före | Efter | Skäl |
|---|---|---|---|
| Bevisblocket, eyebrow + rubrik | Rekommenderas av / Hälften av Sveriges mäklarkedjor | Förtroende från / Över hälften av Sveriges mäklarkedjor | Sebastians formulering; "över hälften" är hans tal |
| Bevisblocket, brödtext | Färdigförhandlade leverantörer, och vi tar ansvar hela vägen till det nya hemmet. | (borta) | "Denna ska inte vara på mäklarytan"; meningen bor redan i hero-underrubriken och Förhandlat i förväg |
| Bevisblocket, siffran | Över 230 000 personer har flyttat med oss sedan 2020. | (oförändrad, nu ensam bredvid rubriken, ett snäpp större) | Bekräftad av Sebastian |
| Logoremsan | 38 loggor, Fortum kvar (filen hette ivy-green), Länsförsäkringar två gånger, alt-texter som råa filnamn | 36 mäklarbyråer, riktiga namn som alt-text, kedjorna först | Ägaren 2026-09-04: "ha bara kvar mäklarloggor"; de fem osäkra (3etage, Alicia Edelman, More, Reveny, Simon Crest) kollade mot Hemnet, alla mäklare |
