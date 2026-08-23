export type SectionId =
  | 'hero'
  | 'about'
  | 'missionlog'
  | 'hangar'
  | 'opensource'
  | 'systems'
  | 'comms'

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'hero', label: 'TARMAC' },
  { id: 'about', label: 'WHO AM I' },
  { id: 'missionlog', label: 'MISSION LOG' },
  { id: 'hangar', label: 'HANGAR' },
  { id: 'opensource', label: 'OPEN SOURCE' },
  { id: 'systems', label: 'SYSTEMS' },
  { id: 'comms', label: 'COMMS' },
]

export const profile = {
  name: 'Rishavh Shukla',
  roleLine: ['Senior Software Engineer', 'Salesforce', 'Agentic AI', 'Embedded'],
  tagline:
    'I build enterprise software by day and flyable hardware by night. Currently engineering Salesforce platforms at ArcelorMittal — and open-sourcing what my workshop produces.',
  location: 'HYDERABAD · IN // OPEN TO RELOCATE',
  email: 'Rishavh1312@gmail.com',
  phone: '+91 77359 23380',
  linkedin: 'https://www.linkedin.com/in/rishavh-shukla-775aa61ba/',
  github: 'https://github.com/rover1312',
}

export const bootLines = [
  '> FD-OS v2.6.0 ................ BOOT',
  '> MEM CHECK 64K .............. OK',
  '> IMU CALIBRATION ............ OK',
  '> OSD ELEMENTS ............... OK',
  '> RF LINK .................... ESTABLISHED',
  '> ARMING ..................... READY',
]

export const aboutStats = [
  { num: '4+', label: 'YRS ENTERPRISE SALESFORCE' },
  { num: '7×', label: 'CERTIFIED (PD1 · ADMIN · nCINO…)' },
  { num: '10+', label: 'YEARS BUILDING & FLYING DRONES' },
  { num: '0', label: 'SCREWS LEFT UNTURNED' },
]

export interface LogEntry {
  company: string
  role: string
  period: string
  current?: boolean
  client?: string
  bullets: string[]
  tags?: string[]
  award?: string
}

export const logEntries: LogEntry[] = [
  {
    company: 'ArcelorMittal GBT',
    role: 'Engineer — Europe Flat IT · Salesforce',
    period: '2025 → PRESENT',
    current: true,
    client: 'STEEL MANUFACTURING · EUROPE FLAT PRODUCTS',
    bullets: [
      "Joined as the first developer on the Salesforce team — built the team's working knowledge of a 15-year-old system from ground zero and led multiple KT sessions.",
      'Consistent top delivery velocity: 6–7 stories per release against a team norm of 2–3.',
      'Built a metadata-configured org-to-org data migration tool — eliminated the post-sandbox-refresh pain of reloading large dynamic product data.',
      'Led the Aura → LWC modernization of a large component base.',
      'Handled BAU production incidents while onboarding new members into system flows.',
    ],
    tags: ['APEX', 'LWC', 'DATA MIGRATION', 'KT LEADERSHIP'],
  },
  {
    company: 'Cognizant',
    role: 'Associate · Salesforce Developer',
    period: '2022 → 2025',
    client: 'CLIENTS — TD BANK · BLOOMBERG MEDIA CLOUD · NEW ECONOMY FORUM',
    bullets: [
      'TD Bank: delivered 8+ interactive LWC & nCino upskilling sessions; migrated legacy integrations to a modern platform; set up OIDC auth (Auth Providers + custom Apex) for secure API access.',
      'Bloomberg Media Cloud: unified the opportunity pipeline — merged separated general & event opportunities into one streamlined process; shipped a bulk lead approval utility in LWC.',
      'Bloomberg New Economy Forum: built a high-scale email service (LWC + Apex Batch) sending to 1000+ users with scheduled sends; kept test coverage above 90%.',
      'Revamped the Experience Cloud home — Lightning Message Service + SOQL tuning cut load time by 25%; multi-participant event onboarding improved efficiency by 90%.',
      'Transformed synchronous Apex into batch classes for scale; delivered every milestone across Agile ceremonies.',
      'Started as Salesforce Developer Intern (Jan–Aug 2022): foundations in declarative + programmatic customization.',
    ],
    award: 'DIAMOND IN THE ROUGH — COGNIZANT 2023',
    tags: ['nCINO', 'MEDIA CLOUD', 'EXPERIENCE CLOUD', 'OIDC', 'BATCH APEX'],
  },
]

export const education = {
  school: 'Kalinga Institute of Industrial Technology',
  detail: 'B.Tech — Electronics & Telecommunications · 2018 – 2022',
}

export const ossFlagship = {
  name: 'ShutterLink',
  sub: '// ESP32-C3 BLE BRIDGE — OPEN-SOURCE CAMLINK ALTERNATIVE',
  desc: 'Turns any RC switch on your radio into a DJI Osmo record trigger — and pipes battery + REC telemetry straight into the Betaflight HD OSD. Reverse-engineered DUML-over-BLE protocol, MSPv2 SET_TEXT injection, non-blocking NimBLE state machine. The commercial alternative costs money; this one ships firmware.',
  repoUrl: 'https://github.com/rover1312/shutterlink',
  meta: ['MIT LICENSE', 'ESP32-C3', 'BETAFLIGHT ≥ 4.4', 'PLATFORMIO'],
}

export const ossSteps = [
  { title: 'RADIO SWITCH', desc: 'AUX channel read from Betaflight via MSP v1 polling (debounced).' },
  { title: 'SHUTTERLINK ESP32-C3', desc: 'Non-blocking state machine: scan → connect → auth → ready.' },
  { title: 'DUML OVER BLE', desc: 'Record start/stop commands to the DJI Osmo Action camera.' },
  { title: 'TELEMETRY RETURN', desc: 'Battery + REC status pushed to the HD OSD via MSP2 SET_TEXT.' },
]

export const sideProjects = [
  {
    name: 'QuantDeck',
    desc: 'Agentic AI trading platform for NSE equities — dual screening engines (technical confluence + thesis-driven STAWKS high-alpha framework) feed LangGraph agent pipelines with risk vetting, exit-discipline portfolio management and paper/live broker execution. Fully local via Ollama.',
    url: 'https://github.com/rover1312/quantdeck',
  },
  {
    name: 'Text → Lookup Migrator',
    desc: 'Salesforce LWC + Batch Apex component that converts Text fields into lookup relationships — config-driven bulk migration.',
    url: 'https://github.com/rover1312/Salesforce_TexttoLookupMigrator',
  },
  {
    name: 'OCR Document Scanner',
    desc: 'LWC component scanning documents inside Salesforce using Einstein OCR + Google Vision APIs.',
    url: null as string | null,
  },
]

export const skillGroups = [
  {
    title: 'SALESFORCE PLATFORM',
    skills: ['Apex', 'LWC / Aura', 'Flows & Process Automation', 'REST API', 'Async Apex', 'Data Migration', 'Sales Cloud', 'Experience Cloud', 'Media Cloud', 'nCino', 'SFDX / Git'],
  },
  {
    title: 'AI & AGENTIC SYSTEMS',
    skills: ['Agentic AI patterns', 'Einstein AI', 'Google Vision AI', 'OCR pipelines', 'Prompt-to-prototype'],
  },
  {
    title: 'EMBEDDED & FIRMWARE',
    skills: ['ESP32 · C/C++', 'BLE (NimBLE)', 'DUML / MSP protocols', 'PlatformIO', 'Non-blocking state machines', 'UART / GATT'],
  },
  {
    title: 'HARDWARE',
    skills: ['FPV quad design & tuning', 'Betaflight', 'Electronics repair & rework', 'Soldering', 'Teardowns of anything with screws'],
  },
  {
    title: 'WAYS OF WORKING',
    skills: ['KT leadership', 'Production incident response', 'Mentoring', 'Agile / Scrum', 'Code review discipline'],
  },
]

export const certs = [
  'Platform Developer I',
  'Administrator',
  'Platform App Builder',
  'AI Associate',
  'FSC Accredited Pro',
  'Process Automation AP',
  'nCino 301',
]

export const interests = ['FPV DRONES', 'TABLE TENNIS', 'OPEN SOURCE', 'ELECTRONICS', 'MUSIC']

export type ChannelId = 'email' | 'linkedin' | 'github' | 'phone' | 'trailhead'

export const channels: { id: ChannelId; label: string; value: string; href: string }[] = [
  { id: 'email', label: 'CH 01 — EMAIL', value: profile.email, href: `mailto:${profile.email}` },
  { id: 'linkedin', label: 'CH 02 — LINKEDIN', value: '/in/rishavh-shukla', href: profile.linkedin },
  { id: 'github', label: 'CH 03 — GITHUB', value: '@rover1312', href: profile.github },
  { id: 'trailhead', label: 'CH 04 — TRAILHEAD RESUME', value: 'salesforce trailblazer profile', href: 'https://resilient-goat-ianow7-dev-ed.trailblaze.my.site.com/Resume' },
  { id: 'phone', label: 'CH 05 — VOICE', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
]
