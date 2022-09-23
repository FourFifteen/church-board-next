// chakra-ui theme management file

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from "@chakra-ui/react"

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
}

// 3. extend the theme
const theme = extendTheme({
  config,
  shadows: {
    "brutal-teal": "0.5rem 0.5rem #319795",
    "brutal-orange": "0.5rem 0.5rem #ED8936",
    "brutal-purple": "0.5rem 0.5rem #9F7AEA",
    "brutal-pink": "0.5rem 0.5rem #ED64A6",
    "hv-brutal-teal": "1rem 1rem #319795",
    "hv-brutal-orange": "1rem 1rem #ED8936",
    "hv-brutal-purple": "1rem 1rem #9F7AEA",
    "hv-brutal-pink": "1rem 1rem #ED64A6",
  },
  fonts: {
    body: `'IBM Plex Sans', Helvetica, Arial, system-ui, sans-serif`,
    heading: `"IBM Plex Serif", Georgia, Times New Roman, serif`,
  },
})

export default theme
