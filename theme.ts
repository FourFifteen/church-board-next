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
    brutal: "0.5rem 0.5rem #319795",
  },
  fonts: {
    body: `'IBM Plex Sans', Helvetica, Arial, system-ui, sans-serif`,
    heading: `"IBM Plex Serif", Georgia, Times New Roman, serif`,
  },
})

export default theme
