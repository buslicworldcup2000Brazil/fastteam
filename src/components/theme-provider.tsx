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
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Основной цвет
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--ring", primaryColor);
    
    // Акцентный цвет (используется для hover эффектов на кнопках variant="outline" и "ghost")
    root.style.setProperty("--accent", primaryColor);
    // Цвет текста/иконки на акцентном фоне (белый для темных тем)
    root.style.setProperty("--accent-foreground", "0 0% 98%");

    // Сохраняем в localStorage
    localStorage.setItem("theme-primary-color", primaryColor);
  }, [primaryColor])

  const setPrimaryColor = (color: string) => {
    // Упрощенная проверка формата HSL (числа с процентами или без)
    if (color.trim().length > 0) {
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
