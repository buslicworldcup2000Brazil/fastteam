"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeProviderState = {
  primaryColor: string
  setPrimaryColor: (color: string) => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  primaryColor: "3 71% 41%",
  setPrimaryColor: () => null,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme-primary-color") || "3 71% 41%"
    }
    return "3 71% 41%"
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--primary", primaryColor)
    root.style.setProperty("--ring", primaryColor)
    
    // Устанавливаем цвет акцента (для наведения на кнопки) таким же как основной цвет
    root.style.setProperty("--accent", primaryColor)
    // Текст на акцентном фоне должен быть контрастным (белым/светлым)
    root.style.setProperty("--accent-foreground", "0 0% 98%")

    if (typeof window !== 'undefined') {
        localStorage.setItem("theme-primary-color", primaryColor)
    }
  }, [primaryColor])

  const setPrimaryColor = (color: string) => {
    // Basic validation for HSL format
    if (/^\d{1,3}\s\d{1,3}%\s\d{1,3}%$/.test(color)) {
      setPrimaryColorState(color)
    }
  }

  return (
    <ThemeProviderContext.Provider value={{ primaryColor, setPrimaryColor }}>
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
