import { Button, ButtonProps, useColorMode } from "@chakra-ui/react"
import { RiMoonClearFill, RiSunFill } from "react-icons/ri"

const THEME_ICON_MAP = {
  dark: <RiMoonClearFill />,
  light: <RiSunFill />,
}

export const ThemeButton = ({ ...props }: ButtonProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Button
      onClick={toggleColorMode}
      id="colormode"
      colorScheme="teal"
      variant="outline"
      {...props}
    >
      {THEME_ICON_MAP[colorMode]}
    </Button>
  )
}
