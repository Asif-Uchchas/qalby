import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    theme: 'dark' | 'light';
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    onboarded: boolean;

    setTheme: (theme: 'dark' | 'light') => void;
    toggleTheme: () => void;
    setLocation: (location: string, lat: number, lng: number) => void;
    setOnboarded: (onboarded: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            location: null,
            latitude: null,
            longitude: null,
            onboarded: false,

            setTheme: (theme) => {
                set({ theme });
                if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-theme', theme);
                }
            },
            toggleTheme: () => {
                const newTheme = get().theme === 'dark' ? 'light' : 'dark';
                set({ theme: newTheme });
                if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-theme', newTheme);
                }
            },
            setLocation: (location, lat, lng) =>
                set({ location, latitude: lat, longitude: lng }),
            setOnboarded: (onboarded) => set({ onboarded }),
        }),
        {
            name: 'qalby-app-store',
        }
    )
);
