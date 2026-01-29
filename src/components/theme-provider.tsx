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
  const [primaryColor, setPrimaryColorState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme-primary-color") || "3 71% 41%"
    }
    return "3 71% 41%"
  })

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("app-language") as Language) || "ru"
    }
    return "ru"
  })

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--ring", primaryColor);
    root.style.setProperty("--accent", primaryColor);
    root.style.setProperty("--accent-foreground", "0 0% 98%");

    localStorage.setItem("theme-primary-color", primaryColor);
  }, [primaryColor])

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("app-language", language);
  }, [language])

  const setPrimaryColor = (color: string) => {
    if (color.trim().length > 0) {
      setPrimaryColorState(color)
    }
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  }

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
