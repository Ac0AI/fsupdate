# Designkritik · Flytthjälp och städning · flödet · 2026-09-01

Runda 1. Kritiker i färsk kontext enligt `DESIGN-KRITIK.md`, bara skärmdumpar av live (fsupdate-nn98.vercel.app/demo/movehelp): mobil 390 fold + hel sida för steg 1 till 3 samt steg 2 med öppnad följdfråga, desktop 1280 hel sida för steg 1 till 3. Inga facit-skärmar ännu. Obs: i helsidesbilderna låg den fasta bottenknappen mitt i bilden (skärmdumpsartefakt, rättad i skriptet inför nästa runda).

## Betyg: 6/10

Förvalen, Nina och de daterade siffrorna är rätt brand och rätt beslut, men mobilen öppnar med hero i stället för formulär, valt läge kolliderar visuellt med primärknappen på varje skärm och steg 2 blandar fyra sätt att välja. Det fungerar, men systemet håller inte ihop än, så det stannar under 7.

## 1. Estetik och känsla
Lugn, myndig svensk tjänstesida i platt navy och mint: en steg-för-steg-checklista där företaget redan gjort jobbet och kunden bara bekräftar.

## 2. Toppstudion hade gjort så här
Tagit bort heron ur själva flödet och låtit stegraden vara hela rubriken, så att 390-skärmen öppnar med tre redan ifyllda frågor i stället för 1,5 fråga under en blå banner. Valt ett enda "valt"-idiom och reserverat solid navy för exakt en knapp per skärm, så ögat aldrig tvekar mellan "Nej" och "Begär offert". Skrivit varje etikett så att den bär sig själv och lämnat noll (i)-ikoner kvar. Låtit Nina finnas med från steg 1 ("Nina räknar på din flytt") och gett hennes bubbla på väntesidan en svara-knapp. På desktop delat container mellan header, innehåll och footer och slopat sticky-fältet helt.

## 4. De största gapen, rangordnade
1. **Alla steg, mobil, hero.** Tillbakalänk + eyebrow + H1 + ingress (+ proofrad på steg 1) tar ~55 % av skärmen; på steg 1 syns Bostadstyp och halva Boarea innan sticky-knappen. Kriterium C. Åtgärd: krymp heron till H1 + en rad, stryk eyebrow och tillbakalänk, flytta proofraden under CTA eller bort. Mål: 3–4 frågor synliga på 390.
2. **Alla steg, chips.** "Lägenhet", "Nej", "26–50 m", "Spelar ingen roll" är samma navyfyllda pill som "Till sista steget" och "Begär offert". På steg 2-folden står två stora navy-"Nej" 300 px ovanför den riktiga knappen. Kriterium E hierarki. Åtgärd: en valt-stil (navy kant + navy text + bock, eller ljus navy-tint), solid navy bara för handlingen.
3. **Steg 2, hela sidan.** Fyra validiom: navy-chips, mint-toggles, små Nej/Ja-segment (Specialfönster, Balkong, Känsliga ytor), mint-radiokort. Kriterium C sammanhållet system. Åtgärd: chips för en-av-flera, radiokort med rekommendation för datum, alla ja/nej som samma chips-par.
4. **Steg 2, mobil, ordning.** Städdatum ("Dagen efter flytten, 23 september") frågas före flyttdatum ("22 september"). Kriterium C. Åtgärd: flytta "Vilken dag vill du ha flytthjälpen?" före Flyttstädningen på mobil.
5. **Knappar, steg 1 och 3.** "Till sista steget" och "Tillbaka till checklistan" är inte verb; tillbakalänken heter "flyttsidan", knappen "checklistan", troligen samma sida. Kriterium B. Åtgärd: verb, ett namn på sidan.
6. **Tio (i)-ikoner** (5 på steg 1, 5 på steg 2), ~20 px tryckytor. "Något värt över 30 000 kr?" har redan en förklaringsmening, (i) är dubbelt. Kriterium D, C. Åtgärd: skriv etiketten så den inte behöver förklaras, stryk ikonerna.
7. **Ansvaret och människan.** Steg 1–2: enda ansvarsordet är "försäkrat" i proofraden. Steg 3: Nina skriver "säg till, så tar jag det direkt" och sidan har ingen kanal. Kriterium A, C. Åtgärd: Nina som rad i CTA-fältet från steg 1; "Skriv till Nina" under bubblan; ansvarsformuleringarna ordagrant på ett ställe i flödet.
8. **Siffror utan täckning.** "1 min" på steg 2 (längsta sidan; steg 1 säger "2 min"). "Vardagar är ofta billigare än helger" (pris utan siffra). "till pris vi redan förhandlat" (elavtalskortet). Kriterium A/B. Åtgärd: mät tiden eller stryk minuterna; siffra eller stryk.
9. **Steg 1, Våning.** Frågas även för villa. Kriterium C, E. Åtgärd: dold för villa/radhus eller ersatt med "Antal plan".
10. **Desktop, alla steg.** Tre vänsterkanter (header-logo, innehåll, footer-logo). Sticky-fält i full bredd klipper tvåkolumnsgriden. Kriterium E. Åtgärd: en container för allt, knappen sist i formuläret på desktop, sticky bara på mobil.

## 5. Ta bort
- Alla steg, hero: eyebrow "FLYTTHJÄLP OCH STÄDNING · STEG X AV 3" (stegraden säger det 100 px ovanför).
- Alla steg, hero: "‹ Tillbaka till flyttsidan" (på steg 3 finns dessutom knappen).
- Alla steg, header: den tomma grå avatarcirkeln (ser ut som skeleton).
- Alla steg: hela marknadsfootern inne i ett formulärflöde; behåll en rad med Villkor och org-nummer.
- Steg 1, hero: proofraden (kunden är inloggad och inbjuden av mäklaren).
- Steg 1, båda korten: etiketten "Förråd, garage eller vind" ovanför "+ Lägg till biyta"; låt knappen heta "+ Lägg till förråd, garage eller vind".
- Steg 1, fotnot: "Adresser och tillträdesdatum kommer från din flytt. Boarea från Skatteverket." Flytta "från Skatteverket" till fältet, stryk resten.
- Steg 2, ingress: "Sista steget innan vi räknar."
- Steg 2: räknaren "2 valda".
- Steg 2, Flyttstädningen: ordet "Boarean." i "68 m² städyta, Storgatan 12. Boarean. Med städgaranti."
- Steg 2: (i) vid "Något värt över 30 000 kr?".
- Steg 2: stycket "Vardagar är ofta billigare … inom en vecka från tillträdet." Lägg "vi föreslår ett datum inom en vecka från tillträdet" som underrad på Flexibel.
- Steg 2, sist: "Vet du ungefär hur många kubik? (i)"; antingen upp först med förslag från boarean eller bort.
- Steg 3: toasten "Skickat. Vi räknar på din flytt."
- Steg 3, hero: ingressen "Vi räknar på din flytt och hör av oss med pris och datum. Du godkänner eller ändrar det du vill."
- Steg 3: tomrummet mellan elavtalskortet och footern.

## 6. AI-tecken
- (i)-ikon som förklaringsmekanism, tio gånger.
- Dubblerade stegmarkörer på alla tre skärmar.
- Middle dot "·" som listseparator på sju ställen.
- "räknar på" sju gånger i flödet, "godkänner eller ändrar" tre gånger.
- Identisk kortrytm nio gånger: fet rubrik, grå förklaringsmening, kontroll.
- Fyra bekräftelser av samma sak på steg 3 (toast, H1, ingress, bubbla).
- Elavtalskortet i persikotint med ikon i cirkel: generiskt upsell-kort.
- Sticky-knapp med tvåraders microcopy på varje steg, även på "Tillbaka".
- Tom avatarcirkel.

## 7. Det som redan håller
- Förvalen: "Nej" på tungt/värdefullt, "Dagen efter flytten · vanligast", "22 september · tillträdesdagen", "Spelar ingen roll · vi föreslår". Kunden jämför aldrig.
- "Vet ej" som tillåtet svar överallt.
- Nina med namn, foto, tidslöftet "senast nästa vardag, före lunch" och tidslinjen med "Inget är bokat förrän du sagt ja".
- Ingressen på steg 1 och toggle-underraderna ("Vi packar allt, du får kvällarna tillbaka").
- Grön hero som färgskifte för klart på steg 3, och proofraden med daterade siffror.

## Byggarens noteringar (inte kritikerns)
- Proofraden i steg 1, kubikfältet, (i)-ikonerna och alla CRM-fält är ägarens beslut 2026-08-29 och lämnas orörda i ta-bort-passet.
- Avatarcirkeln och marknadsfootern hör till appskalet, inte flödet.
- Chip-stilen (gap 2 och 3) är ett designsystembeslut på Grunder, inte något att ändra i ett flöde.
- "Skriv till Nina" väntar på ägarens beslut om namn/ansikte och kanal.

## Åtgärdat 2026-09-02 (ägarens beslut på öppna frågor)
Ta bort-listan i sin helhet utom det ägaren behöll. Dessutom: städdagen ligger aldrig efter flyttdagen (förval samma dag, "Ett annat datum" spärrat), proofraden är bara Google-betyget, kubikfältet borta, "2 min" på båda stegen, Våning bara i lägenhet, "Öppna chatten" under Ninas bubbla. Kvar för egen runda: chip-stilen (designsystem). Nästa kritikrunda körs mot deployad version.
