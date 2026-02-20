# Klarmeldt

SaaS-platform til danske ejendomsadministratorer der digitaliserer istandsættelse af lejemål. Prototypen er en interaktiv demo med al data i browseren (ingen backend endnu).

## Hosting & Repository

- **Prototype URL:** https://klarmeldt.frederikhoffmeyer.dk
- **GitHub:** ONLINEERHVERV/klarmeldt-mvp
- **Hosting:** Vercel (automatisk deploy fra GitHub)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Sprog:** JavaScript (JSX), ingen TypeScript
- **React:** 18.3 (client-side rendering via `'use client'`)
- **Styling:** Inline styles (ingen CSS-framework, kun minimal global CSS)
- **Font:** DM Sans (Google Fonts)
- **PWA:** Service worker + manifest.json for installérbar webapp
- **Backend:** Ingen (planlagt: Supabase med PostgreSQL, Auth, Storage)
- **State:** React `useState` – al data lever i hukommelsen

## Filstruktur

```
klarmeldt-app/
├── app/
│   ├── globals.css          # Global reset, scrollbar, font, focus-styles
│   ├── layout.js            # RootLayout: metadata, viewport, PWA-config, service worker registration
│   └── page.js              # Indlæser <Klarmeldt /> som client component
├── components/
│   └── Klarmeldt.jsx         # HELE applikationen (~1245 linjer, én stor fil)
├── public/
│   ├── manifest.json         # PWA manifest (standalone app)
│   ├── sw.js                 # Service worker (cache-first, offline fallback)
│   ├── icon-192.png          # App-ikon 192x192
│   └── icon-512.png          # App-ikon 512x512
├── package.json              # Dependencies: next, react, react-dom
├── next.config.js            # reactStrictMode: true
├── .gitignore
└── README.md                 # Hosting-guide og projektbeskrivelse
```

## Arkitektur i Klarmeldt.jsx

Hele UI'et ligger i `components/Klarmeldt.jsx`. Filen er struktureret som:

### Konfiguration (linje 1-134)
- **`I` objekt:** Inline SVG-ikoner (Home, Folder, Cal, Chat, Users, etc.)
- **`TRADES`:** Faggrupper med farver og emoji (maler, tømrer, gulv, el, vvs, rengøring, murer)
- **`ROOMS`:** Liste over rumtyper (Entré, Stue, Køkken, Soveværelse 1/2, etc.)
- **`STATUS` / `SCOL`:** Projektstatus (Kommende/Igangværende/Afsluttet) med farver
- **`TCOL` / `TL`:** Opgavestatus (Afventer/I gang/Færdig/Godkendt/Rettelse)
- **`CONS`:** Hardcoded håndværkerdata (5 firmaer med kontakt, pris, rating, etc.)
- **`initProjects()`:** 4 demo-projekter med opgaver, beskeder og ansvarsfordeling

### Shared Components (linje 136-194)
- `Badge`, `SBadge`, `TBadge`, `TradeTag` — statusvisning
- `Btn` — knap med varianter (primary, danger, ghost, small)
- `Card` — hover-animeret container
- `Stat` — KPI-kort med ikon
- `Progress` — progress bar
- `Empty` — tom-tilstand placeholder
- `Tab` — fanebladnavigation

### Administrator-view (linje 196-1215)
- **`AdminSidebar`:** Navigation med 7 sider + rolleskifter + brugerinfo ("Pieter Secuur, Driftsleder")
- **`AdminDash`:** Dashboard med KPI'er, advarsler, kommende projekter, indsigt
- **`ProjCard`:** Projektkort med adresse, faggrupper, progress
- **`AdminDetail`:** Projektdetalje med 7 faner:
  - Opgaver (CRUD, statusændring, grupperet pr. faggruppe)
  - Skoleskema (Gantt-lignende tidslinje)
  - Gennemgang (guidet inspektion)
  - Beskeder (chat mellem admin og håndværkere)
  - Hæfter (lejer/udlejer ansvarsfordeling)
  - Stamdata (lejemålsinfo)
  - Økonomi (omkostningsberegning pr. faggruppe)
- **`Schedule`:** Visuelt skema over arbejdsdage pr. faggruppe
- **`CostTab`:** Økonomisk overblik med timepris × timer
- **`GuidedInspection`:** Rum-for-rum gennemgang med foto, kommentar, godkend/rettelse
- **`Analytics`:** Håndværker-evaluering med fejlpct., til-tiden-rate, rating
- **`Contractors`:** Oversigt over tilknyttede håndværkervirksomheder

### Håndværker-view (linje 937-1108)
- **`CraftApp`:** Mobilvenligt view for håndværkere (simulerer Phillip fra Maler Gruppen)
  - "I dag" — aktive opgaver med timer og "meld færdig"
  - "Kommende" — fremtidige opgaver
  - "Udført" — afsluttede opgaver
  - Integreret tidsmåling (start/stop/log timer)
  - Bottom navigation (mobilapp-stil)

### Main Component (linje 1113-1244)
- **`Klarmeldt`:** Root-component med role-switching (admin/craft), routing, responsive sidebar

## Roller i demo

- **Administrator** ("Pieter Secuur, Driftsleder"): Fuld platform med sidebar, dashboard, projekter, analyse
- **Håndværker** ("Phillip Lundholm, Maler Gruppen"): Mobilvenlig dagsoversigt, timer, opgavestyring

Skift med "Skift til Håndværker/Administrator"-knappen i sidebar.

## Demo-data

- **Ejendomsselskab:** Goldschmidt Ejendomme
- **4 projekter:** Klosterparken 14 (igangværende), Klosterparken 8 (kommende), Frederiksbro 22 (kommende), Klosterparken 3 (afsluttet)
- **5 håndværkerfirmaer:** Maler Gruppen, Electi Gulvservice, Tømrer Pedersen, El-Eksperten, ProClean
- **Dato-kontekst:** Applikationen bruger en hardcoded "nu"-dato: 1. november 2025

## Planlagt videreudvikling

- Supabase backend (PostgreSQL) til persistering
- Authentication med roller (NextAuth eller Supabase Auth)
- Filupload til flytterapporter og billeder
- Push-notifikationer til håndværkere
- AI-parsing af flytterapporter

## Kommandoer

```bash
npm run dev     # Start udviklingsserver
npm run build   # Build til produktion
npm run start   # Start produktionsserver
```

## Konventioner

- Alt UI er inline styles (ingen Tailwind, CSS modules, eller styled-components)
- Dansk sprog i hele UI'et
- Kompakt kode-stil med korte variabelnavne (CONS, SCOL, TL, fmt, pct)
- Alle komponenter i én fil (Klarmeldt.jsx)
- Ingen externe dependencies udover React og Next.js
