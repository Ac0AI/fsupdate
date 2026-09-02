# Designkritik · Startsidan · 2026-09-01

Runda 1. Kritiker i färsk kontext enligt `DESIGN-KRITIK.md`, bara skärmdumpar av live (fsupdate-nn98.vercel.app): mobil 390 fold + hel sida, desktop 1280 fold + hel sida. Inga facit-skärmar ännu.

## Betyg: 6/10

Sidan är ren, har en riktig röst i "Så går det till" och klarar mobilgrunderna, men saknar tre bärande delar (vad som ingår, vilka människorna är, en avslutande knapp), säger samma bevis fyra gånger och bryter brandregeln om att kunden inte ska välja. Rätt riktning i delarna, fel byggordning i helheten.

## 1. Estetik och känsla
Lugn skandinavisk fintech-landing: ljusblå himmel, en illustrerad väg hem, rundade piller och mjuk geometrisk sans som ska säga "vi har redan ordnat det, du går bara".

## 2. Toppstudion hade gjort så här
Hade låtit hero-rubriken säga vad tjänsten gör (el, bredband, flytt, städ, bokat på tio minuter) i stället för en slogan Hemnet lika gärna kunde äga. Hade slagit ihop de fyra bevissektionerna (logotyper, mäklarkedjor, testimonials, livefeed) till en och använt utrymmet till det som saknas: en tjänsteöversikt och koordinatorerna med namn och ansikte. Hade satt en stängande "Starta din flytt" efter FAQ och en sticky knapp på mobil, så knappen inte bara finns en gång, åtta skärmar upp. Hade strukit livefeeden eller gjort den bevisbart äkta. Hade tecknat illustrationen som platt vektor utan glow och ritat människorna framifrån.

## 4. De största gapen, rangordnade
1. **Mobil, hela sidan.** "Starta din flytt" finns bara i hero; efter åtta skärmar slutar sidan i FAQ och footer utan knapp. Header-pillret LOGGA IN (ca 145x44) är största tryckytan på skärmen men sekundär handling. Kriterium D, C mobilen först. Åtgärd: CTA-block efter FAQ med samma knapp och mikrocopy, sticky knapp på mobil när hero scrollat förbi, header-pillret blir "Starta din flytt" och Logga in blir textlänk.
2. **Hela sidan.** Ingen sektion visar vad som ingår (el, bredband, flytthjälp, flyttstäd, försäkring, adressändring); kunden får gissa via mockups och feed. Kriterium A (vad hon får och slipper), C minska stress. Åtgärd: checklista direkt under hero, sex rader: ikon, tjänst, vad du slipper, vad du får.
3. **Hela sidan.** Inga människor. Brandet lovar koordinatorer med namn och foto; enda ansiktet är en pytteavatar i mockup 03, och paret i hero står med ryggen mot oss. Kriterium C personligt förtroende. Åtgärd: steg 03 blir egen sektion med Nina och två kollegor, riktiga foton, "svarar inom X min, vardagar 8 till 20".
4. **Mobil, "Det säger de som redan flyttat".** Rubriken bryts ett ord per rad i en smal kolumn bredvid karuselldotsen. Dessutom: dots på ca 6 px är inte tryckbara, sociala ikoner i footern under 44 px, "01/02/03" och footerns juridiktext under rimlig kontrast, hero-H1 lämnar "flytta." ensamt på rad två. Kriterium E, D. Åtgärd: stapla rubrik och dots, rubrik full bredd; balanserad radbrytning i H1; höj kontrast; 44 px på ikoner.
5. **Båda, steg 02.** "Vi rekommenderar. Du väljer." plus "Vill du se fler alternativ ligger de ett klick bort." Kriterium B jämför aldrig, A ett val. Åtgärd: "Ett förslag per tjänst. Du säger ja." Stryk meningen om fler alternativ.
6. **Båda, "Just nu"-feeden.** Anna K. Stockholm, Erik L. Göteborg, Sara M. Malmö, Johan B. Uppsala, Emma S. Solna: största orterna i storleksordning med arketypnamn. Läses som påhittat oavsett om det är sant. Kriterium B, A ansvaret syns. Åtgärd: stryk, eller koppla till riktig data med tidsstämpel och live-indikator som tål granskning. Flytta "ingen har ringt runt eller begärt offerter" till tjänsteöversikten.
7. **Båda, hero.** "Det enklaste sättet att flytta" och "kvalitetssäkrat" har ingen siffra och säger inte vad ni gör. Kommat före "och" är engelskt seriekomma. Kriterium A. Åtgärd: H1 "El, bredband, flytt och städ. Klart på tio minuter." Sub "Färdigförhandlade priser hos X kontrollerade leverantörer, och vi tar ansvar hela vägen."
8. **Båda, hero + steg 01.** "2 min" i hero, "Klar på 10 minuter" i steg 01. Två tidslöften som inte hänger ihop. Kriterium A/B. Åtgärd: ett tal, eller precisera "2 min att logga in, 10 min till färdig lista".
9. **Båda, logotypband + "Hälften av Sveriges mäklarkedjor".** Eyebrow REKOMMENDERAS AV två gånger i rad, "230 000 flyttar sedan 2020" två gånger, "hälften" utan täckning när sex logotyper visas. Kriterium E, B. Åtgärd: en sektion: logotyperna plus "6 av de 10 största mäklarkedjorna, 230 000 flyttar sedan 2020". Stryk den andra.
10. **Båda, FAQ.** Eyebrow "SUPPORT", varumärket i varje fråga, "Vad är Flyttsmart?" längst ner avslöjar att hero inte förklarat, kostnadssvaret gömt i accordion. Kriterium C, A. Åtgärd: eyebrow "Frågor", korta frågor ("Vad kostar det?", "Vilka tjänster ingår?"), kostnadsfrågan öppen som standard, "Fler vanliga frågor" blir "Se alla frågor".

## 5. Ta bort
- Båda, sektion 2: eyebrow "REKOMMENDERAS AV" andra gången.
- Båda, sektion 2 body: "Över 230 000 flyttar sedan 2020" (står i bandet ovanför).
- Båda, under testimonialkorten: raden "G 4,7 på Google" med stjärnor (samma siffra som badgen i hero).
- Båda, steg 02 body: "Vill du se fler alternativ ligger de ett klick bort."
- Båda: hela "Just nu"-sektionen om den inte är riktig data.
- Båda, "Just nu" body: "eller läst villkor" (att kunder inte läser villkor är ingen merit).
- Båda, steg 01 till 03: de ljusgrå "01/02/03"-etiketterna.
- Båda, steg 01 till 03 och hero: den radiella orange/mint-glowen bakom telefoner och hus.
- Mobil, testimonials: karuselldotsen.
- Båda, FAQ: eyebrow "SUPPORT".
- Desktop, nav: "Samarbetspartners" (mäklarens ärende, inte kundens; footer-länk "För mäklare").
- Båda, hero sub: kommat före "och".
- Båda, footer: "Användning av denna tjänst omfattas av Flyttsmarts användarvillkor" (Villkor-länken står två rader upp).

## 6. AI-tecken
- Livefeeden med arketypnamn och orter i storleksordning.
- Samma sektionsmall fyra gånger: VERSAL EYEBROW, H2, en menings sub, grid.
- Tre identiska stegkort: grå box, telefon, rubrik, brödtext, grön bock med claim.
- Tre identiska testimonialkort med bara förnamn och G-ikon, ett på engelska mitt i svensk sida.
- FAQ där varumärket står i varje fråga.
- Hero-slogan "Det enklaste sättet att flytta" och triaden "Färdigförhandlat, kvalitetssäkrat, och vi tar ansvar" med seriekomma.
- Radiella glows som dekoration, illustration med mjuk oskärpa bakom huset, människor bakifrån utan ansikten.
- Eyebrow-etiketter av typen SUPPORT och JUST NU.

## 7. Det som redan håller
- Hero-CTA: orange, verb, "Starta din flytt" med pil, mikrocopy "Kostnadsfritt · 2 min · logga in med BankID" direkt under.
- Google-badgen "4,7 av över 500 recensioner" högst upp: siffra med täckning, rätt plats.
- "Att flytta ska inte kräva tio beslut" och "En människa, inte en telefonkö": egna formuleringar med röst, behåll ordagrant.
- Ansvaret återkommer: "vi tar ansvar hela vägen", "går något fel hör du av dig till oss", "Vi tar ansvaret".
- Palett och typografi: navy, mint, orange, geometrisk sans, gott om luft, inget innehåll utanför skärmbredden på 390.

## Byggarens noteringar (inte kritikerns)
- Gap 7: "Det enklaste sättet att flytta." är brandguidens tagline, ägarens ord. Kritikern föreslår byte; det är ägarens beslut, inte byggarens.
- Gap 3 och AI-tecken om paret bakifrån: scenen är vald av ägaren 2026-08-30 (löftet "du slipper bära" i bild). Ansikten på koordinatorerna längre ner på sidan är den rimliga vägen, inte att rita om heron.
- Gap 5: brandguidens regel 01 tillåter att fler alternativ visas, men kunden ska aldrig ombes jämföra. "Fler alternativ ett klick bort" är alltså inom regeln; "Du väljer" är det som skaver.
- Gap 6: om "Just nu"-feeden är riktig data eller exempel behöver ägaren svara på.

## Åtgärdat 2026-09-02 (ägarens beslut)
Byggt: sektionen "Dina flyttkoordinatorer" med Nina, Joel och Maria efter Så går det till, slutknappen "Redo? Det tar två minuter." efter FAQ och en sticky "Starta din flytt" på mobil som visas när herons knapp scrollat ur bild och döljs vid slutknappen. Ägaren behåller "Just nu"-feeden tills riktig data hämtas vid go-live. Inte rört: taglinen, heron, FAQ-copyn, "Vi rekommenderar. Du väljer.".

Tjänsteöversikten "Det här ingår" byggdes och togs bort samma dag på ägarens beslut ("blev bara lökig"). Gap 2 står därmed öppet, löses på annat sätt än en tabell.

## Beslut 2026-09-02, senare på dagen
Heron återställd till den mörka ("Slipp stressen – vi fixar flytten", telefonen) på ägarens beslut. Sidfoten, kontaktraden och slutknappen är navy-deep, samma ton som de mörka banden på Utland som Sebastian gillar. Paper-artboarden Startsida speglar sajten sektion för sektion: Header, Hero, Mäklarlogotyper, Bevisblock, Omdömen, Så går det till, Koordinatorerna, Liveflöde, FAQ, Slutknapp, Kontakt, Sidfot.
