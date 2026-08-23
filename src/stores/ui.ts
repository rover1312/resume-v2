import { create } from 'zustand'

export type ThemeName = 'dark' | 'light'

interface UIState {
  theme: ThemeName
  soundOn: boolean
  booted: boolean
  fpvMode: boolean
  activeSection: string
  scrollPct: number
  reducedMotion: boolean

  setTheme: (t: ThemeName) => void
  toggleTheme: () => void
  toggleSound: () => void
  setBooted: (b: boolean) => void
  toggleFpv: () => void
  setActiveSection: (id: string) => void
  setScrollPct: (pct: number) => void
  setReducedMotion: (r: boolean) => void
}

function initialTheme(): ThemeName {
  if (typeof document !== 'undefined') {
    const t = document.documentElement.dataset.theme
    if (t === 'light' || t === 'dark') return t
  }
  return 'light'
}

export const useUI = create<UIState>()((set, get) => ({
  theme: initialTheme(),
  soundOn: false,
  booted: false,
  fpvMode: false,
  activeSection: 'hero',
  scrollPct: 0,
  reducedMotion: false,

  setTheme: (t) => {
    document.documentElement.dataset.theme = t
    try {
      localStorage.setItem('fd-theme', t)
    } catch {
      /* private mode */
    }
    set({ theme: t })
  },

  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),

  toggleSound: () =>
    set((s) => ({ soundOn: !s.soundOn })),

  setBooted: (b) => set({ booted: b }),

  toggleFpv: () => set((s) => ({ fpvMode: !s.fpvMode })),

  setActiveSection: (id) => {
    if (get().activeSection !== id) set({ activeSection: id })
  },

  setScrollPct: (pct) => {
    if (get().scrollPct !== pct) set({ scrollPct: pct })
  },

  setReducedMotion: (r) => {
    if (get().reducedMotion !== r) set({ reducedMotion: r })
  },
}))
