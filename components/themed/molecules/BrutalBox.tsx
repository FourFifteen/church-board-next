import { Box, BoxProps } from "@chakra-ui/react"
import { BrutalThemeColor } from "../../../utils/brutalThemeColors"

type BrutalBoxProps = {
  children: React.ReactNode
  color?: BrutalThemeColor
} & BoxProps

export const BrutalBox = ({
  children,
  color = "teal",
  ...props
}: BrutalBoxProps) => {
  return (
    <Box borderRadius="md" boxShadow={"brutal-" + color} {...props}>
      {children}
    </Box>
  )
}
