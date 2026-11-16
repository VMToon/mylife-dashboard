# MyLife V1.4 - dagplanning vanuit dagelijkse check-in

Upload `index.html` en `firebase-sync.js` in de root van je bestaande GitHub Pages-repository. Maak eerst een JSON-back-up in MyLife. Verwijder of reset geen Firestore-data.

- Op 16 november 2026 worden bij de eerste opening van het overzicht 2 AMS-lessen en 1 DSP-les voorgesteld en als afvinkbare taken aangemaakt, mits die dag nog geen eerder ingestelde dagdoelen heeft.
- Daarna kun je elke dag op het overzicht je aantallen kiezen en op **Dagdoelen bewaren** klikken. De gekozen lessen verschijnen onder **Planning** als afzonderlijke taken.
- Afvinken werkt de resterende achterstand bij; terug openzetten herstelt de teller.
- Oude Excel-blokken blijven in de data staan, maar worden niet meer als actuele dagplanning getoond. Oefenzittingen, andere taken en deadlines blijven bewaard.
- De taken en tellers worden via de bestaande Firebase-save gesynchroniseerd. Test na upload met herladen op twee toestellen; niet tegelijk bewerken vanwege het bestaande last-write-wins model.
- Handmatig toevoegen van studie-uren blijft mogelijk in het tabblad Studie.

Niet live getest met je Firebase-account. Houd je JSON-back-up bij.
