import { Box, BoxProps, useColorMode } from "@chakra-ui/react"
import backgroundDark from "../../../public/bg_dark.png"
import backgroundLight from "../../../public/bg_light.png"

type BackgroundProps = {
  children: React.ReactNode
} & BoxProps

export const Background = ({ children, ...props }: BackgroundProps) => {
  const { colorMode } = useColorMode()
  const background = colorMode === "light" ? backgroundLight : backgroundDark
  return (
    <Box
      bgImage={`url('bg_light.png')`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      {...props}
    >
      {children}
    </Box>
  )
}
