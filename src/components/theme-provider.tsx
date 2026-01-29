"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Language = 'ru' | 'en';

type ThemeProviderState = {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  language: Language
  setLanguage: (lang: Language) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use stable initial values to avoid hydration mismatch
  const [primaryColor, setPrimaryColorState] = useState("3 71% 41%")
  const [language, setLanguageState] = useState<Language>("ru")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read from localStorage only after mount
    const savedColor = localStorage.getItem("theme-primary-color")
    const savedLang = localStorage.getItem("app-language") as Language
    
    if (savedColor) setPrimaryColorState(savedColor)
    if (savedLang) setLanguageState(savedLang)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--ring", primaryColor);
    root.style.setProperty("--accent", primaryColor);
    root.style.setProperty("--accent-foreground", "0 0% 98%");

    localStorage.setItem("theme-primary-color", primaryColor);
  }, [primaryColor, mounted])

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("app-language", language);
  }, [language, mounted])

  const setPrimaryColor = (color: string) => {
    if (color.trim().length > 0) {
      setPrimaryColorState(color)
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  }

  // To strictly avoid hydration mismatch on language-dependent text, 
  // we could return null until mounted, but stable default "ru" is better for UX.
  return (
    <ThemeProviderContext.Provider value={{ primaryColor, setPrimaryColor, language, setLanguage }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
