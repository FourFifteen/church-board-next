import { Box, BoxProps, useColorMode } from "@chakra-ui/react"

type BackgroundProps = {
  children: React.ReactNode
} & BoxProps

export const Background = ({ children, ...props }: BackgroundProps) => {
  const { colorMode } = useColorMode()
  const background = `url('bg_${colorMode}.png')`
  const backgroundPosition = colorMode === "light" ? "top" : "bottom"
  return (
    <Box
      bgImage={background}
      backgroundPosition={backgroundPosition}
      backgroundRepeat="no-repeat"
      {...props}
    >
      {children}
    </Box>
  )
}
