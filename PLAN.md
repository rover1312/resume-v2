# Portfolio Site — Build Plan
**Codename: "FLIGHT DECK"** — an interactive Neumorphic 3D portfolio for Rishav H. Shukla

---

## 1. Concept & Narrative (the "game" feeling)

The site is framed as a **preflight-to-landing mission**. The visitor is the pilot; you are mission control. Scroll = throttle. Every section is a waypoint on a flight path — this delivers the "led from one point to another by the author's imagination" feel.

### Narrative arc

| Waypoint | Section | Story beat |
|---|---|---|
| 00 | Boot screen | POST-style loading (`MEM CHECK… OK` / `GIMBAL… OK` / `LINK… ESTABLISHED`), skippable, <1.5s |
| 01 | **Hero / Tarmac** | Name + headline; interactive 3D FPV drone hovering center stage |
| 02 | **Who Am I** | Engineer at the hardware/software boundary — short and punchy |
| 03 | **Mission Log** | Experience as flight-log entries: ArcelorMittal, Cognizant |
| 04 | **The Hangar** | 10+ years of drones/electronics; exploded-view drone interaction |
| 05 | **Open Source** | ShutterLink launch showcase — the embedded × FPV fusion story |
| 06 | **Systems** | Skills matrix as an interactive switchboard / payload bay |
| 07 | **Comms** | Contact links styled as radio channels/frequencies |

### Persistent HUD chrome
- Vertical **flight-path progress rail** with waypoint dots; labels appear on hover
- Altitude readout tied to scroll %
- Dark/light **rocker switch** (neumorphic physical toggle)
- Optional sound toggle

---

## 2. Theme & Visual Direction

### Style: dark-first Neumorphism + OSD accents
Dark mode is the default (neumorphism reads best dark); light mode via toggle.

**Design tokens (CSS custom properties):**

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#24282F` | `#E6E9EF` |
| `--surface` | `#2A2F37` | `#EBEEF3` |
| `--shadow-dark` | `#1E2127` | `#C4CBD6` |
| `--shadow-light` | `#343A44` | `#FFFFFF` |
| `--text-hi` | `#E8EAED` | `#23272F` |
| `--text-mid` | `#9AA3AF` | `#5B6472` |
| `--accent` (OSD green) | `#4ADE80` | `#16A34A` |
| `--accent-2` (amber) | `#FBBF24` | `#D97706` |

Rationale: OSD green nods to Betaflight overlays; amber = goggle/HUD warning color. Both pass contrast on both surfaces.

**Neumorphic recipe:** raised element = `background: var(--surface)` + dual shadow
(`-6px -6px 12px var(--shadow-light), 6px 6px 12px var(--shadow-dark)`).
Pressed/inset state flips the shadows + slight translateY. Every interactive element gets a real press state — this is what makes neumorphism feel *physical*, like game UI.

**Contrast guardrail:** decorative surfaces can be soft, but all text/icons must meet WCAG AA against `--bg`.

### Typography
- Headings/display: **Space Grotesk**
- Body: **Inter**
- HUD/mono: **JetBrains Mono**
- Self-hosted via Fontsource (no runtime Google request, no layout shift)

### Iconography
**Lucide** icons (tree-shakeable, MIT). No icon fonts.

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite + React 18 + TypeScript | Fast; static output = perfect GitHub Pages fit |
| 3D | three.js via @react-three/fiber + drei | Declarative scene graph; drei gives OrbitControls, PerformanceMonitor, Html-in-3D for free |
| Scroll | Lenis smooth scroll + custom scroll-rig | Buttery scrollytelling from one persistent canvas |
| DOM animation | framer-motion | Enter/exit reveals, magnetic buttons, springs |
| State | zustand | Tiny store: theme, sound, journey progress |
| Styling | CSS custom props + CSS Modules | Neumorphism is shadow-math; zero runtime CSS cost |
| Content | single `src/data/content.ts` | ALL copy centralized — edit text without touching components |

No router needed: single-page vertical journey with anchor waypoints.

---

## 4. 3D Design & Interactions

### Hero drone — procedural, not downloaded
Build a stylized low-poly 5" FPV quad from primitives (boxes, cylinders, torus prop-discs):
- ~zero asset weight (no multi-MB GLB), no licensing risk, unique look
- Full **part-level interactivity**: raycast per mesh group

**Hero interactions:**
- Idle hover bob + spinning props; subtle parallax with mouse move
- Drag to orbit (damped OrbitControls), scroll continues the journey
- Hover a part → it glows accent-green + HUD tooltip (`MOTOR 2207 · 1750KV`)
- Click part → camera nudges toward it + info chip appears
- Props spin up on page load ("arming" sequence tied to boot screen)

### Journey rig (the game feel)
- One fixed full-screen `<Canvas>` behind DOM sections
- Scroll progress drives a **camera path** through "zones": tarmac → city grid → hangar interior → circuit board macro → landing pad
- Each section's content is DOM floating over its zone
- drei `PerformanceMonitor` auto-scales DPR/particles if FPS drops
- Background: soft fog + floating dust particles + a faint grid plane (OSD vibe)

### Section-specific interactive set pieces
| Section | Set piece |
|---|---|
| Mission Log | Timeline nodes as 3D waypoints along path; cards tilt on hover (magnetic) |
| The Hangar | **Exploded-view slider**: drag slider → drone parts separate in 3D with labels |
| Open Source | ShutterLink PCB board in 3D; hovering traces lights up signal path FC→ESP32→camera; live GitHub stars/commit badge |
| Systems | Skill groups as neumorphic switches; toggling flips a related 3D gadget state |
| Comms | Contact buttons as radio channel cards; hover = "frequency tune-in" micro-animation |

### Game-like interaction details
- Magnetic buttons (cursor proximity pull)
- Press physics on all neumorphic elements
- Custom cursor ring that expands over interactive targets (desktop only)
- Konami-code / triple-click logo easter egg → **FPV MODE**: camera drops to first-person cockpit view flying through the site (scroll still navigates)

---

## 5. Content Curation (best qualities only)

Rule: every bullet answers "what did YOU do that others didn't". No resume dumping.

### Hero headline options
1. `Senior Software Engineer — Salesforce × Agentic AI × Embedded`
2. `I build software, hardware, and the occasional aircraft.`

### Who Am I
3–4 lines max: engineer who ships enterprise Salesforce by day and solders FPV quads by night; recently opened-sourcing hardware/firmware work.

### Mission Log — ArcelorMittal GBT (Europe Flat IT), Engineer
Picked highlights (each = card or log entry):
1. **First developer on the Salesforce team** — built the team's understanding of a 15-year-old system from ground zero; led multiple KT sessions
2. **Top delivery velocity** — consistently 6–7 stories/release vs team norm of 2–3
3. **Org-to-org data migration tool** — metadata-driven config to migrate any object/data between orgs; killed the post-sandbox-refresh pain of loading large dynamic product data
4. **Aura → LWC modernization lead** — converted a large component base
5. **BAU & incident support** — worked production incidents while onboarding new members into system flows

### Mission Log — Cognizant
One compact entry (need your pasted resume text for accurate bullets).

### Open Source — ShutterLink ⭐ flagship project
- ESP32-C3 BLE bridge: RC switch → DJI Osmo record control, battery/rec telemetry into Betaflight OSD
- Frame as the fusion story: reverse-engineered DUML-over-BLE protocol + MSPv2 + non-blocking firmware state machine
- Link: github.com/rover1312/shutterlink + MIT license + roadmap chips

### Systems (skills matrix)
Grouped, honest levels:
- **Platform:** Apex, LWC/Aura, Integration (REST/SOAP), SFDX, data migration
- **AI:** Agentic AI patterns, tooling/orchestration
- **Embedded:** ESP32 firmware, BLE/DUML/MSP, C/C++, PlatformIO, PCB-level debugging
- **Hardware:** drone building/tuning 10+ yrs, electronics repair/build, soldering
- **Ways of working:** KT leadership, incident management, mentoring

### Comms
GitHub (`rover1312`), LinkedIn, email, optional YouTube/Instagram FPV clips. Placeholders until you provide exact links.

---

## 6. Performance Strategy

Budgets: LCP < 2.5s · CLS < 0.1 · TBT < 200ms · initial JS ≤ ~300KB gzip

- **Single canvas**, `frameloop="demand"` where possible (render on scroll/mouse deltas)
- Procedural geometry instead of heavy GLBs; if GLB ever needed → Draco/KTX2
- `React.lazy` per section below the fold; Suspense fallbacks styled as neumorphic skeletons
- Fonts subsetted + `font-display: swap`; preload only 2 weights
- DPR clamped `[1, 2]`; adaptive quality via PerformanceMonitor (particle count, shadows off first)
- Shadows: cheap blob shadow, not shadow maps
- Mobile: simplified scene (fewer particles, no custom cursor), touch orbit retained
- `prefers-reduced-motion`: disable camera flythrough, props spin-down, instant section reveals
- Lighthouse CI check before each deploy

---

## 7. Accessibility & SEO

- Semantic landmarks (`header/main/section/footer`), real headings hierarchy
- All 3D decorative content `aria-hidden`; every interaction has a keyboard-accessible DOM equivalent
- Visible focus rings (accent green) — never removed
- Theme toggle respects `prefers-color-scheme` on first visit; persisted in localStorage
- Meta: OG/Twitter cards, JSON-LD `Person` schema, canonical URL, `robots.txt`, `sitemap.xml`, favicon set (+ maskable PWA icon)

---

## 8. Hosting — GitHub Pages (free)

- Repo: `rover1312/portfolio` (or `<user>.github.io`)
- Vite `base: '/<repo>/'` for correct asset paths
- Deploy via GitHub Actions: push to main → build → deploy `dist/` to Pages
- Custom domain optional later (CNAME + DNS)
- Alternative free options if you outgrow Pages: Cloudflare Pages / Netlify / Vercel

---

## 9. Project Structure

```
portfolio/
├─ .github/workflows/deploy.yml
├─ public/            # favicon, og-image, icons
└─ src/
   ├─ data/content.ts        # ALL copy + links
   ├─ styles/                # tokens.css, neu.css (neumorphic utility classes)
   ├─ components/
   │  ├─ ui/                 # NeuButton, NeuCard, NeuToggle, NeuSlider, HudChip…
   │  └─ three/              # DroneModel, SceneRig, Zones, Particles, PcbBoard
   ├─ sections/              # Boot, Hero, About, MissionLog, Hangar, OpenSource, Systems, Comms
   ├─ hooks/                 # useTheme, useScrollProgress, useMagnetic, useReducedMotion
   ├─ stores/ui.ts           # zustand store
   └─ App.tsx                # layout + Lenis + Canvas host
```

---

## 10. Build Phases

| Phase | Deliverable | Est. sessions |
|---|---|---|
| 0 | Scaffold Vite+TS, tokens, theme system w/ rocker switch, Lenis, content.ts skeleton | 1 |
| 1 | Static sections + all copy + neumorphic UI kit + flight-path rail | 1 |
| 2 | 3D hero drone + hero interactions (orbit, hover tooltips, arming sequence) | 1 |
| 3 | Scroll-rig journey: camera path through zones, section set pieces (exploded view, PCB, switches) | 2 |
| 4 | Game polish: magnetic cursor, press physics, FPV-mode easter egg, sound (optional) | 1 |
| 5 | Perf pass (lazy, budgets), a11y audit, SEO meta, reduced-motion | 1 |
| 6 | GitHub repo init + Actions deploy + Lighthouse verify | 0.5 |

---

## 11. Open Questions (answer when we start)

1. Exact display name spelling + preferred headline (option 1 or 2 above?)
2. Cognizant bullets (paste from resume as text)
3. Contact links: LinkedIn URL, email, socials?
4. Any real FPV footage/photos to feature? (would elevate Hangar section)
5. Sound effects on/off by default?
6. Custom domain now or later?

