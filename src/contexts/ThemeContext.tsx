import React, { useState } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { dark, light } from 'theme'

const CACHE_KEY = 'IS_DARK'

const ThemeContext = React.createContext({
  isDark: null,
  toggleTheme: () => null,
  setPageForcedDark: (_forced: boolean) => null,
})

const ThemeContextProvider = ({ children }) => {
  const [pageForcedDark, setForcedDark] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY)
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false
  })

  const toggleTheme = () => {
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState))
      return !prevState
    })
  }

  const setPageForcedDark = (forced) => {
    setForcedDark(forced)
  }

  return (
    <ThemeContext.Provider value={{ isDark: isDark || pageForcedDark, toggleTheme, setPageForcedDark }}>
      <SCThemeProvider theme={isDark || pageForcedDark ? dark : light}>{children}</SCThemeProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
