import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
}

function applyTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('bp-theme', theme);
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('bp-theme') as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return 'light';
}

export const useTheme = create<ThemeStore>((set) => {
  const initial = getInitialTheme();
  // Apply on store creation (ensures class is set if JS loaded after inline script)
  applyTheme(initial);

  return {
    theme: initial,
    toggle: () =>
      set((state) => {
        const next = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        return { theme: next };
      }),
  };
});
