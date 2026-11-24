import { createContext, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'tonematrix-theme'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(THEME_KEY) || 'light',
  )

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
