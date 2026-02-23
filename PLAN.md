# Klarmeldt – Projektplan

> Opdater denne fil løbende. Kryds af når opgaver er færdige.
> Claude Code: Tjek denne fil ved sessionstart for aktuel status og næste opgave.

---

## Fase 0 – Fundament ✅

- [x] Prototype frontend – Komplet interaktivt UI med mock-data, admin + håndværker (3 dage, Claude)
- [x] Hosting & deploy pipeline – Vercel + GitHub auto-deploy + custom domæne (1 dag, Fred + Claude)
- [x] PWA support – Manifest, service worker, app-ikoner (0.5 dag, Claude)
- [x] Responsivt design – Hamburger-menu, mobil-layout for admin (0.5 dag, Claude)
- [x] Claude Code setup – Node.js, Homebrew, gh CLI, CLAUDE.md (1 dag, Fred + Claude)
- [x] Supabase oprettet – Projekt, database-tabeller, RLS, seed-data (1 dag, Fred + Claude)
- [x] Login-system – Supabase Auth, rolle-routing, logout (1 dag, Claude Code)
- [x] Vercel environment vars – Supabase-nøgler i Vercel produktion (10 min, Fred)

---

## Fase 1 – Data & CRUD (estimat: 1-1.5 uge)

- [x] Projekter fra database – Hent projekter fra Supabase i stedet for mock-data. Dashboard viser rigtige data (1 dag, Claude Code) [afhænger: Fase 0]
- [x] Opret/rediger projekter – Admin kan oprette nye istandsættelser. Formularer med adresse, datoer, noter (1 dag, Claude Code) [afhænger: projekter fra db]
- [x] Opgaver fra database – Opgaver hentes og vises per projekt. Inkl. status, faggruppe, tildeling (1 dag, Claude Code) [afhænger: projekter fra db]
- [ ] Opret/rediger opgaver – Admin kan oprette og tildele opgaver. Dropdown for faggruppe + håndværker (1 dag, Claude Code) [afhænger: opgaver fra db]
- [x] Håndværkere fra database – Håndværkerliste med kontaktinfo og rating (0.5 dag, Claude Code) [afhænger: Fase 0]
- [ ] Beskeder fra database – Real-time chat per projekt. Supabase Realtime subscriptions (1.5 dag, Claude Code) [afhænger: projekter fra db]

---

## Fase 2 – Håndværker-app (estimat: 1 uge)

- [ ] Håndværker ser egne opgaver – Kun opgaver tildelt til logget-ind håndværker. RLS sikrer data-isolation (1 dag, Claude Code) [afhænger: opgaver fra db]
- [ ] Meld opgave færdig – Håndværker markerer opgave som afsluttet. Status opdateres i database (0.5 dag, Claude Code) [afhænger: egne opgaver]
- [ ] Timer-tracking – Start/stop timer, logges i time_logs tabel. Estimat vs. faktisk sammenligning (1 dag, Claude Code) [afhænger: egne opgaver]
- [ ] Håndværker-beskeder – Håndværker kan sende beskeder på projekt. Ses af admin i realtid (0.5 dag, Claude Code) [afhænger: beskeder fra db + egne opgaver]
- [ ] Kommende jobs oversigt – Håndværker ser planlagte jobs 2-3 mdr. frem (0.5 dag, Claude Code) [afhænger: egne opgaver]

---

## Fase 3 – Gennemgang & Dokumentation (estimat: 1.5 uge)

- [ ] Billedupload – Upload fotos via kamera eller filsystem. Supabase Storage, komprimering (1.5 dag, Claude Code) [afhænger: projekter fra db]
- [ ] Guidet gennemgang – Rum-for-rum inspektion med fotos. Godkend/rettelse per rum (2 dage, Claude Code) [afhænger: billedupload]
- [ ] Før/efter dokumentation – Sammenlign fotos før og efter istandsættelse. Juridisk bevisførelse (1 dag, Claude Code) [afhænger: billedupload]
- [ ] Hæfter (lejer/udlejer) – Ansvarsfordeling per mangel. liability_items tabel (1 dag, Claude Code) [afhænger: guidet gennemgang]
- [ ] PDF-rapport generering – Generer afslutningsrapport som PDF. Kan deles med lejer/udlejer (1.5 dag, Claude Code) [afhænger: gennemgang + hæfter]

---

## Fase 4 – Notifikationer & Polish (estimat: 1 uge)

- [ ] Resend.com integration – Email-service opsætning. Gratis op til 3.000 emails/måned (0.5 dag, Fred + Claude)
- [ ] Email: ny opgave tildelt – Håndværker får email ved ny opgave. Med link direkte til opgaven (0.5 dag, Claude Code) [afhænger: Resend + opret opgaver]
- [ ] Email: besked modtaget – Notifikation ved ny besked. Max 1 per time (0.5 dag, Claude Code) [afhænger: Resend + beskeder]
- [ ] Email: gennemgang planlagt – Påmindelse dagen før gennemgang (0.5 dag, Claude Code) [afhænger: Resend + gennemgang]
- [ ] Analyse-dashboard med rigtige data – KPI'er baseret på faktisk data. Gns. tid, omkostning, performance (1.5 dag, Claude Code) [afhænger: timer-tracking]
- [ ] Kalender med rigtige datoer – Projekttidslinjer fra database (0.5 dag, Claude Code) [afhænger: projekter fra db]
- [ ] Arkiv – Afsluttede projekter flyttes til arkiv. Historik bevares (0.5 dag, Claude Code) [afhænger: projekter fra db]

---

## Fase 5 – Klar til salg (estimat: 2-3 uger)

- [ ] Onboarding-flow – Ny administrator opretter konto + ejendom. Self-service signup (2 dage, Claude Code)
- [ ] Invite-system for håndværkere – Admin inviterer håndværker via email. Link → opretter konto (1.5 dag, Claude Code) [afhænger: Resend + onboarding]
- [ ] Multi-tenant isolation – Hver administrator ser kun egne ejendomme. RLS baseret på organisation (2 dage, Claude Code) [afhænger: onboarding]
- [ ] Stripe betalingsintegration – Abonnementsbetaling. Gratis trial → betalt plan (2 dage, Fred + Claude) [afhænger: onboarding]
- [ ] Landing page – Marketing-site med features, priser, demo (2 dage, Claude Code)
- [ ] Brugervenlighedstest – Test med Goldschmidt + 2-3 andre. Feedback-runde, fejlrettelser (3 dage, Fred) [afhænger: Fase 2 + 3]
- [ ] GDPR compliance – Privatlivspolitik, databehandleraftale, cookie-banner (1 dag, Fred + Claude) [afhænger: onboarding]
- [ ] Fejlhåndtering & loading states – Graceful errors, skeletons, tomme states (1.5 dag, Claude Code) [afhænger: Fase 1]
- [ ] Performance optimering – Lazy loading, image optimization, caching (1 dag, Claude Code) [afhænger: billedupload]

---

## Fase 6 – Nice-to-have (efter launch)

- [ ] AI-parsing af flytterapporter – Upload PDF → auto-generér opgaver. Kræver Claude API (3 dage, Claude Code)
- [ ] Push-notifikationer – Browser push via service worker (1.5 dag, Claude Code)
- [ ] Ejendomstemplates – Standard opgavesæt per ejendomstype. "Klosterparken-standard" (1 dag, Claude Code)
- [ ] Auto-fakturering – Timer + materialer → faktura-PDF. Integration med regnskab (2 dage, Claude Code)
- [ ] Historisk data per lejemål – Se alle tidligere istandsættelser. "Gulv slebet 3x på 5 år" (1 dag, Claude Code)
- [ ] BBR/CVR integration – Auto-udfyld ejendomsdata. Offentlige API'er (2 dage, Claude Code)
- [ ] Benchmarking – Sammenlign performance på tværs af ejendomme. Kræver volumen af data (2 dage, Claude Code)

---

## Samlet estimat: 8-12 uger til fuldt salgsklar produkt
