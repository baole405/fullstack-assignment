"use client"

/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"
type ThemePalette = "vega" | "nova" | "maia" | "lyra" | "mira" | "luma" | "sera"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultPalette?: ThemePalette
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  palette: ThemePalette
  setPalette: (palette: ThemePalette) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Theme[] = ["dark", "light", "system"]
const THEME_PALETTES: ThemePalette[] = [
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
]
const PALETTE_STORAGE_KEY = "theme-palette"

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

function isPalette(value: string | null): value is ThemePalette {
  if (value === null) {
    return false
  }

  return THEME_PALETTES.includes(value as ThemePalette)
}

function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const editableParent = target.closest(
    "input, textarea, select, [contenteditable='true']"
  )
  if (editableParent) {
    return true
  }

  return false
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultPalette = "vega",
  storageKey = "theme",
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey)
    if (isTheme(storedTheme)) {
      return storedTheme
    }

    return defaultTheme
  })
  const [palette, setPaletteState] = React.useState<ThemePalette>(() => {
    const storedPalette = localStorage.getItem(PALETTE_STORAGE_KEY)
    if (isPalette(storedPalette)) {
      return storedPalette
    }

    return defaultPalette
  })

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey]
  )

  const setPalette = React.useCallback((nextPalette: ThemePalette) => {
    localStorage.setItem(PALETTE_STORAGE_KEY, nextPalette)
    setPaletteState(nextPalette)
  }, [])

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const root = document.documentElement
      const resolvedTheme =
        nextTheme === "system" ? getSystemTheme() : nextTheme
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null

      root.classList.remove("light", "dark")
      root.classList.add(resolvedTheme)

      if (restoreTransitions) {
        restoreTransitions()
      }
    },
    [disableTransitionOnChange]
  )

  const PALETTE_STYLES: Record<ThemePalette, Record<string, string>> = {
    vega: {
      "--primary": "#5b93ff",
      "--accent": "#7c9bff",
      "--secondary": "#94a3ff",
      "--sidebar-primary": "#5b93ff",
      "--sidebar-accent": "#7c9bff",
      "--accent-foreground": "#ffffff",
      "--primary-foreground": "#ffffff",
      "--sidebar-primary-foreground": "#ffffff",
      "--chart-1": "#5b93ff",
    },
    nova: {
      "--primary": "#8b5cf6",
      "--accent": "#c084fc",
      "--secondary": "#a78bfa",
      "--sidebar-primary": "#8b5cf6",
      "--sidebar-accent": "#c084fc",
      "--accent-foreground": "#ffffff",
      "--primary-foreground": "#ffffff",
      "--sidebar-primary-foreground": "#ffffff",
      "--chart-1": "#8b5cf6",
    },
    maia: {
      "--primary": "#ec4899",
      "--accent": "#f472b6",
      "--secondary": "#fb7185",
      "--sidebar-primary": "#ec4899",
      "--sidebar-accent": "#f472b6",
      "--accent-foreground": "#ffffff",
      "--primary-foreground": "#ffffff",
      "--sidebar-primary-foreground": "#ffffff",
      "--chart-1": "#ec4899",
    },
    lyra: {
      "--primary": "#22c55e",
      "--accent": "#4ade80",
      "--secondary": "#86efac",
      "--sidebar-primary": "#22c55e",
      "--sidebar-accent": "#4ade80",
      "--accent-foreground": "#ffffff",
      "--primary-foreground": "#ffffff",
      "--sidebar-primary-foreground": "#ffffff",
      "--chart-1": "#22c55e",
    },
    mira: {
      "--primary": "#f59e0b",
      "--accent": "#fbbf24",
      "--secondary": "#fde68a",
      "--sidebar-primary": "#f59e0b",
      "--sidebar-accent": "#fbbf24",
      "--accent-foreground": "#000000",
      "--primary-foreground": "#000000",
      "--sidebar-primary-foreground": "#000000",
      "--chart-1": "#f59e0b",
    },
    luma: {
      "--primary": "#14b8a6",
      "--accent": "#2dd4bf",
      "--secondary": "#67e8f9",
      "--sidebar-primary": "#14b8a6",
      "--sidebar-accent": "#2dd4bf",
      "--accent-foreground": "#ffffff",
      "--primary-foreground": "#ffffff",
      "--sidebar-primary-foreground": "#ffffff",
      "--chart-1": "#14b8a6",
    },
    sera: {
      "--primary": "#9333ea",
      "--accent": "#c084fc",
      "--secondary": "#a855f7",
      "--sidebar-primary": "#9333ea",
      "--sidebar-accent": "#c084fc",
      "--accent-foreground": "#ffffff",
      "--primary-foreground": "#ffffff",
      "--sidebar-primary-foreground": "#ffffff",
      "--chart-1": "#9333ea",
    },
  }

  const applyPalette = React.useCallback((nextPalette: ThemePalette) => {
    const root = document.documentElement
    const paletteStyles = PALETTE_STYLES[nextPalette]

    Object.entries(paletteStyles).forEach(([name, value]) => {
      root.style.setProperty(name, value)
    })
  }, [])

  React.useEffect(() => {
    applyTheme(theme)

    if (theme !== "system") {
      return undefined
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const handleChange = () => {
      applyTheme("system")
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme, applyTheme])

  React.useEffect(() => {
    applyPalette(palette)
  }, [palette, applyPalette])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (isEditableTarget(event.target)) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      setThemeState((currentTheme) => {
        const nextTheme =
          currentTheme === "dark"
            ? "light"
            : currentTheme === "light"
              ? "dark"
              : getSystemTheme() === "dark"
                ? "light"
                : "dark"

        localStorage.setItem(storageKey, nextTheme)
        return nextTheme
      })
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [storageKey])

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) {
        return
      }

      if (event.key === storageKey) {
        if (isTheme(event.newValue)) {
          setThemeState(event.newValue)
          return
        }

        setThemeState(defaultTheme)
        return
      }

      if (event.key === PALETTE_STORAGE_KEY) {
        if (isPalette(event.newValue)) {
          setPaletteState(event.newValue)
          return
        }

        setPaletteState(defaultPalette)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [defaultPalette, defaultTheme, storageKey])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
      palette,
      setPalette,
    }),
    [theme, setTheme, palette, setPalette]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}

export type { ThemePalette }
