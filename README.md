# Rithik Jaiswar — Data & AI Portfolio

A premium, recruiter-focused portfolio for a fresher targeting **Data Analyst, Data Scientist,
AI/ML Engineer and GenAI Engineer** roles. Dark futuristic data/AI aesthetic, interactive Three.js
scenes, animated charts and a fully data-driven content layer.

**Stack:** React 19 · TypeScript · Vite · Three.js + React Three Fiber + drei · Framer Motion ·
Tailwind CSS v4 · Lucide icons

---

## Run it

```bash
npm install
npm run dev        # local dev server → http://localhost:5173
npm run build      # type-check + production build → dist/
npm run preview    # serve the production build locally
npm run typecheck  # tsc only
```

## Deploy to Vercel

Vercel detects Vite automatically:

| Setting     | Value          |
| ----------- | -------------- |
| Build command | `npm run build` |
| Output directory | `dist`     |
| Install command  | `npm install` |

No environment variables are required.

---

## Editing content (everything is data-driven)

| What                        | File                                        |
| --------------------------- | ------------------------------------------- |
| Name, roles, links, resume, education, process steps | [`src/data/site.ts`](src/data/site.ts) |
| All 5 projects (text, results, workflow, architecture) | [`src/data/projects.ts`](src/data/projects.ts) |
| Skill categories + hover hints | [`src/data/skills.ts`](src/data/skills.ts) |

Update `contact.github`, `contact.linkedin` and `contact.email` in `src/data/site.ts` if your
handles change — they are used by the navbar, hero, resume CTA, contact section and footer.

The resume is at `public/resume/Rithik-Jaiswar-Resume.pdf`. Regenerate the placeholder with
`node scripts/generate-resume.mjs`, or drop in a designed export with the same filename.

## Performance & accessibility notes

- Three.js lives in its own async chunk and mounts after first paint + browser idle.
- The hero content is pre-rendered in `index.html`, so first paint never waits on JavaScript.
- Web fonts are preloaded with stable filenames (see `vite.config.ts`).
- WebGL failures fall back to a static gradient/SVG scene; `prefers-reduced-motion` disables
  animation throughout.
- Every 3D canvas pauses when scrolled out of view; particle counts drop on mobile.

## Project structure

```
src/
├── components/   Navbar, Hero, About, Skills, Projects (+modal, visuals),
│                 DataViz (+charts), Process, ResumeCTA, Contact, Footer, ui/
├── data/         projects.ts · skills.ts · site.ts
├── scenes/       ParticleNetwork · AgentGraph · DataObjects (R3F)
├── pages/        Home
├── hooks/        useActiveSection · useDeviceTier · useWebGL · useScrollProgress
├── utils/        animations · cn
└── styles/       index.css (Tailwind v4 theme tokens)
```
