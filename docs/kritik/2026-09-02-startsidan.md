# Designkritik · Startsidan · 2026-09-02 (runda 2)

Kritiker i färsk kontext enligt `DESIGN-KRITIK.md`, skärmdumpar av live efter dagens ändringar: mörka heron tillbaka med iPhone-ram, svart bevisblock, koordinatorerna, "Redo?"-slutknapp, vit sidfot, "Det här ingår" struken.

## Betyg: 6/10 (runda 1: 6/10)

Hero, siffrorna och Ansvaret-formuleringen ligger på 8-nivå, men mobilen (primärskärmen) har två trasiga trust-sektioner, steg 2 ber kunden välja, och det visuella språket är mockup-ramar, glow och en fejkad feed i stället för brandets illustration. Sidan är 19 skärmar lång på 390 px och upprepar sig i stället för att lugna.

## 1. Estetik och känsla
Nordisk fintech-trygghet: mörk navy-hero med iPhone-mockup, mycket luft, mintbockar och en orange knapp som ska säga "vi har redan gjort jobbet åt dig".

## 2. Toppstudion hade gjort så här
Halverat sidan: hero, ett trust-band med siffra plus logotyper, tre steg, koordinatorerna, FAQ, CTA. Ersatt de tre beskurna iPhone-ramarna och radialtoningarna med brandets platta illustration i navy, mint och orange. Lyft koordinatorerna med riktiga foton och en rad om varje direkt under heron, eftersom det är det enda konkurrenterna inte har. Gett Ansvaret ett eget ställe, en gång, i stället för tre. Byggt en enda knappkomponent och använt den överallt.

## 4. De största gapen, rangordnade
1. **Mobil, Dina flyttkoordinatorer.** Fotona saknas i skärmdumpen. *Byggarens kontroll: skärmdumpsartefakt, bilderna är lazy-laddade och laddar när sektionen scrollas in (verifierat på live 390). Skriptet scrollar nu igenom sidan innan helsidesbilden.*
2. **Mobil, "Det säger de som redan flyttat".** Rubriken bryts ett ord per rad eftersom karuselldottarna delar rad med den. E, D. Rubrik i full bredd, dottar under kortet eller bort.
3. **Alla, steg 2 "Vi rekommenderar. Du väljer." + "Vill du se fler alternativ ligger de ett klick bort".** A, B regel 1. "Vi rekommenderar ett avtal. Du säger ja." Stryk meningen om alternativ eller "Vill du byta gör vi det åt dig".
4. **Alla, "Just nu"-feeden.** Ser fejkad ut, saknar täckning. *Ägarens beslut: kvar tills riktig data hämtas vid go-live.*
5. **Alla, siffror utan täckning eller i konflikt.** "Hälften av Sveriges mäklarkedjor" är ingen siffra; "Klar på 10 minuter" (steg 1) mot "Det tar två minuter" (CTA); 4,7 på Google visas som fem fulla stjärnor. A, B regel 3.
6. **Alla, "Så går det till" och hero.** Tre identiska grå ramar med beskurna telefoner, mintglow under hero-mobilen, ringar bakom rubriken, persikoglow bakom steg 3. En produktbild räcker (heron). Steg 1–3 i brandets illustrationsstil. Radialtoningar bort.
7. **Mobil, rytm och längd.** Tre trust-band i rad (press, logotyper, "Rekommenderas av") innan sidan börjar förklara. Slå ihop till ett band i en navy.
8. **Alla, knappar.** "STARTA DIN FLYTT" i versaler med BankID-logo, botten "Starta din flytt →" i gemener med pil, nav "LOGGA IN". En primärknapp, gemener, samma ikonlogik.
9. **Alla, Ansvaret.** "Går något fel hör du av dig till oss" står tre gånger. Hero-mockupen säger "Deklaration skickad", det heter flyttanmälan. B regel 5, C.
10. **Båda, kanter.** Svart yta under footern (*byggarens kontroll: artefakt, dokumentet slutar vid sidfoten och html/body är #f8faf9*); logotypraden klipper "bocentrum" på mobil, Edward Partners två gånger på desktop (*marqueen dubblerar listan avsiktligt*), MÄKLARE-logon pixlig.

## 5. Ta bort
- Hero: eyebrow "ETT BESLUT. HELA FLYTTEN." H1 säger samma sak.
- Hero: "SOM SETT I Dagens industri / Breakit". Tredje trust-signalen, svag kontrast.
- Hero H1: tankstrecket. "Slipp stressen. Vi fixar flytten." är starkare.
- Hero och steg 3: mintglow, ringar och persikoglow.
- Steg-ramarna: siffrorna 01/02/03.
- Steg 1–3: de tre gröna check-raderna. Upprepar stycket ovanför.
- Rekommenderas av: tankstrecket i "gjort – och". Punkt.
- Just nu: hela sektionen (ägaren behåller).
- Koordinatorer: "från första dagen till sista nyckeln".
- CTA: mikroraden "Kostnadsfritt · 2 min · logga in med BankID".
- FAQ: eyebrow "SUPPORT" och frågan "Vad kan jag göra på Flyttsmart?".
- Reviews: de tio 6 px-dottarna.

## 6. AI-tecken
- Rubrikmönstret "X, inte Y" två gånger plus "Vi rekommenderar. Du väljer.".
- Feeden: fem namn med initial, fem storstäder, minuttal 1, 6, 11, 18, 25.
- Porträtten: tre symmetriska, identiskt beskurna leenden. Nina har ett annat ansikte i mockuparna än i porträttet.
- "Deklaration skickad".
- Samma sektionsmall sex gånger: spärrad eyebrow i mint, H1, grå underrubrik, check-rad.
- Mockup-texter med superlativ utan siffra: "Bästa elavtalet", "Snabbaste bredbandet".
- Copy som är klurig snarare än varm: "Någon annans flytt blir klar medan du läser det här".

## 7. Det som redan håller
- Hero-copyn: "Slipp stressen, vi fixar flytten", listan av tjänster, "Starta din flytt" med BankID.
- "Över 230 000 flyttar sedan 2020. Tjänsten kostar dig ingenting." och Ansvaret-formuleringen.
- Mockup 02: "Rörligt elpris, 412 kr/mån, Därför just det här: elområde 3, lägsta av 14 avtal".
- Chatten med Nina: "Flyttfirman är bokad till 14 sep. Vill du att jag lägger flyttstädet samma dag?"
- Footern: "Har du frågor? 08-12 00 88 22 / hej@flyttsmart.se" och slut-CTA:n i full bredd på mobil.

## Åtgärdat efter runda 2 (2026-09-02, "ok kör")
Valt läge i alla flödens piller är nu mint (designsystemet), flödets steg 2 är en kolumn med städdetaljerna infällda och starttiden som länk, och "Så går det till" har brandets illustrationer i stället för telefonramar, 01/02/03 och glow. Runda 3 körs mot live.
