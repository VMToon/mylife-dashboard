# MyLife Dashboard V1.2 — GitHub Pages + Firebase

## Publiceren

1. Open je GitHub repository `VMToon/mylife-dashboard`.
2. Upload **index.html** en **firebase-sync.js** naar de hoofdmap (Add file → Upload files → Commit changes).
3. Ga naar Settings → Pages. Kies Deploy from a branch, branch `main`, folder `/(root)`, en klik Save.
4. Open https://vmtoon.github.io/mylife-dashboard/ nadat GitHub Pages klaar is.
5. Log in met Google. De eerste login maakt automatisch de oorspronkelijke studieplanning aan.
6. Open dezelfde URL op je iPhone (Safari → Delen → Zet op beginscherm).

## Vereiste Firestore-regels

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deze regels scheiden accounts, maar laten *elk* Google-account een eigen dataset aanmaken. Voor strikt enkel-eigen-account toegang moeten de regels beperkt worden tot je Firebase Auth UID. Deel je UID niet publiek.

## Belangrijk

- Internet vereist; offline bewerken wordt nog niet ondersteund.
- Bewerk de app niet tegelijkertijd op twee toestellen: het laatst opgeslagen volledige document kan wijzigingen overschrijven.
- De status 'Alles opgeslagen' betekent dat Firestore de schrijfopdracht bevestigd heeft.
- Exporteer af en toe een JSON-back-up via Instellingen.
- Geen persoonlijke data in GitHub zetten; alleen de websitebestanden uploaden.
- De browsercode is publiek. Firebase-configuratie is geen geheime sleutel; Firestore Rules beschermen de data.
- Gebruik de oude lokale HTML-versie niet meer voor nieuwe wijzigingen; die synchroniseert niet.
