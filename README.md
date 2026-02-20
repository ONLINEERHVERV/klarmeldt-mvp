# Klarmeldt MVP – Prototype

Interaktiv prototype af Klarmeldt-platformen til ejendomsadministratorer.

## 🚀 Sådan hoster du det (trin-for-trin)

### Trin 1: Opret en GitHub-konto (gratis)
1. Gå til **github.com** og opret en konto
2. Klik **"New repository"** (den grønne knap)
3. Kald det `klarmeldt-mvp`
4. Vælg **Public** og klik **Create repository**

### Trin 2: Upload filerne til GitHub
Du har to muligheder:

**Mulighed A – Via GitHub's hjemmeside (nemmest):**
1. Klik **"uploading an existing file"** på dit nye repository
2. Træk ALLE filer og mapper fra denne zip ind i browseren
3. Klik **"Commit changes"**

**Mulighed B – Via terminal (hvis du har git installeret):**
```bash
cd klarmeldt-app
git init
git add .
git commit -m "Klarmeldt MVP prototype"
git branch -M main
git remote add origin https://github.com/DIT-BRUGERNAVN/klarmeldt-mvp.git
git push -u origin main
```

### Trin 3: Deploy på Vercel (gratis)
1. Gå til **vercel.com** og klik **"Sign Up"** – vælg **"Continue with GitHub"**
2. Klik **"Add New Project"**
3. Find `klarmeldt-mvp` på listen og klik **"Import"**
4. Du behøver IKKE ændre nogen indstillinger – Vercel genkender automatisk Next.js
5. Klik **"Deploy"**
6. Vent 1-2 minutter – så får du et link som `klarmeldt-mvp.vercel.app`

### Trin 4 (valgfrit): Tilføj eget domæne
1. I Vercel, gå til **Settings → Domains**
2. Skriv dit domæne (f.eks. `demo.klarmeldt.dk`)
3. Følg instruktionerne for at ændre DNS hos din domæne-udbyder

## 🏗 Projektstruktur

```
klarmeldt-app/
├── app/
│   ├── globals.css      ← Globale styles
│   ├── layout.js        ← HTML-layout med metadata + fonts
│   └── page.js          ← Indlæser hovedkomponenten
├── components/
│   └── Klarmeldt.jsx    ← Hele applikationen
├── package.json         ← Dependencies
├── next.config.js       ← Next.js config
└── README.md            ← Denne fil
```

## 💡 Videreudvikling

Denne prototype er bygget som en **interaktiv demo** med data i browseren.
For at bygge den rigtige app skal I tilføje:

- **Database** (Supabase/PostgreSQL) – til at gemme projekter, opgaver, beskeder
- **Authentication** (NextAuth/Supabase Auth) – login med roller
- **File upload** – til flytterapporter og billeder
- **Push-notifikationer** – til håndværkere
- **AI-parsing** – til automatisk at læse flytterapporter

Prototypen fungerer som en 1:1 specifikation for en udvikler.

## 📋 Roller i demo

Brug **"Skift til Håndværker"**-knappen i sidebaren for at skifte mellem:
- **Administrator** – fuld platform med dashboard, projekter, analyse
- **Håndværker** – mobil-venlig dagsoversigt (som Phillip fra Maler Gruppen ser den)

---

© 2025 Klarmeldt ApS
