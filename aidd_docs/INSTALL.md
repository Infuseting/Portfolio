# INSTALL.md — Portfolio V2.0.0

Technical vision and installation guide.

## Vision

Développeur fullstack TypeScript — vitrine personnelle et outil de prospection.

Portfolio V2.0.0 conçu pour impressionner recruteurs et clients dès le premier regard : visuellement audacieux (brutaliste moderne), performant (Lighthouse 100), et SEO-first. Le site sert à la fois de galerie de projets personnels, de blog technique, et de première impression professionnelle — avec le CV téléchargeable en accès direct.

## Decisions

| Décision         | Choix                         | Pourquoi                                                                                    |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------- |
| Architecture     | Monolith statique (SSG)       | Portfolio = site contenu, pas de backend, pas de multi-tenant. Static-first optimal.        |
| Front-end        | Astro 5 + TypeScript          | Champion SEO (zéro JS par défaut), islands architecture, Content Collections pour le blog.  |
| Back-end         | Aucun                         | Pas de formulaire, pas d'auth, pas de DB. Redirect email suffisant pour le contact.         |
| Base de données  | Aucune (MDX via fichiers)     | Blog et projets = fichiers MDX typés par Zod. Zéro overhead base de données.               |
| Auth             | Aucune                        | Site public, pas de zone privée prévue en V2.                                               |
| Hébergement      | Self-hosted — Docker + nginx  | Infra perso existante. Image nginx:alpine ~30-50 MB, dist/ statique servi directement.      |
| Animations       | GSAP + ScrollTrigger (natif)  | Vanilla .astro scripts, zéro framework overhead. React islands uniquement si interactivité complexe. |
| Transitions page | Astro ClientRouter            | View Transitions API native, SPA-like sans JS bundle additionnel.                           |
| Thème            | CSS custom properties         | Light-first + prefers-color-scheme auto + toggle manuel. Script is:inline anti-FOUC.       |

## Stack summary

- **Front-end:** Astro 5 (SSG, output: static) + TypeScript strict
- **Back-end:** Aucun
- **Base de données:** Aucune — contenu via Content Layer API (MDX + Zod)
- **Auth:** Aucune
- **Hébergement:** Self-hosted — Docker multi-stage + nginx:alpine
- **Animations:** GSAP 3 + ScrollTrigger, Astro ClientRouter (View Transitions)
- **Thème:** CSS custom properties, light-first, dark auto (prefers-color-scheme)
- **Typographie:** À définir lors de l'UI/UX (brutaliste -> typo grasse expressive)
- **Couleur signature:** Bleu canard (teal) — à affiner lors du design token sprint
- **Intégrations clés:**
  - @astrojs/sitemap — sitemap auto
  - @astrojs/image — WebP/AVIF + lazy load intégrés
  - @fontsource/* — fonts auto-hébergées (SEO + perf)
  - sharp — traitement image build-time
  - gsap — animations scroll
  - Zod — validation schémas Content Collections

## Folder structure

```
portfolio/
├── public/
│   ├── cv.pdf                          <- CV téléchargeable (action call hero + footer)
│   ├── favicon.svg
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── ui/                         <- Atoms : Button, Tag, Badge, Icon
│   │   ├── layout/                     <- Header, Footer, Nav, ThemeToggle
│   │   └── sections/                   <- Hero, Projects, Blog, Stack, Contact
│   ├── content/
│   │   ├── blog/                       <- Articles : *.mdx
│   │   └── projects/                   <- Fiches projets : *.mdx
│   ├── layouts/
│   │   ├── BaseLayout.astro            <- Head SEO, ClientRouter, theme script
│   │   └── BlogLayout.astro            <- Layout article avec meta OG
│   ├── pages/
│   │   ├── index.astro                 <- Page principale (toutes sections)
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── projects/
│   │       └── [slug].astro
│   ├── styles/
│   │   ├── tokens.css                  <- Variables CSS : couleurs, typo, spacing
│   │   ├── animations.css              <- @keyframes globaux
│   │   └── global.css                  <- Reset, base, dark/light theme rules
│   └── utils/
│       ├── formatDate.ts
│       └── getReadingTime.ts
├── content.config.ts                   <- Schémas Zod pour blog + projects (Astro 5)
├── astro.config.mjs
├── tsconfig.json
├── Dockerfile                          <- Multi-stage : build Astro -> serve nginx:alpine
└── package.json
```

## Install steps

```bash
# 1. Créer le projet Astro
npm create astro@latest . -- --template minimal --typescript strict --install --no-git

# 2. Ajouter les intégrations officielles
npx astro add sitemap image

# 3. Installer les dépendances animation + contenu
npm install gsap @fontsource/[police-choisie]

# 4. Installer sharp (traitement image build-time)
npm install --save-dev sharp

# 5. Configurer astro.config.mjs
# -> site: 'https://[ton-domaine]'  (obligatoire pour sitemap + canonical)
# -> output: 'static'
# -> integrations: [sitemap()]

# 6. Créer le content.config.ts avec schémas Zod (blog + projects)

# 7. Build de vérification
npm run build && npm run preview

# 8. Docker
docker build -t portfolio:v2 .
docker run -p 80:80 portfolio:v2
```

## Audit summary

| Candidat              | Verdict    | Notes                                                               |
| --------------------- | ---------- | ------------------------------------------------------------------- |
| Astro 5 — SEO/Perf    | PASS       | Lighthouse 100 standard, sitemap officiel, Content Layer API mature |
| Astro 5 — Animations  | PASS       | GSAP natif parfait, View Transitions mature, dark mode sans FOUC   |
| Next.js 15            | PASS écarté | Excellent mais overhead React inutile pour un portfolio statique   |
| SvelteKit 2           | PASS écarté | Perf comparable à Astro, courbe d'apprentissage non justifiée ici  |

## Points d attention

- site: est obligatoire dans astro.config.mjs — sans ça, sitemap et canonical sont cassés silencieusement.
- is:inline sur le script thème dans <head> — sans ce flag, Astro bundle et diffère le script -> FOUC garanti.
- astro:page-load à utiliser à la place de DOMContentLoaded pour les animations GSAP compatibles View Transitions.
- Three.js : faisable comme island React (client:only), évaluer impact LCP avant de l intégrer dans le hero.
