import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("chatbudz-theme") || "night",
    setTheme: (theme) => {
        localStorage.setItem("chatbudz-theme", theme);
        set({ theme })
    },
}))