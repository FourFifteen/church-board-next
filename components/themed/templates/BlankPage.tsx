import { Container, useColorMode } from "@chakra-ui/react"

type BlankPageProps = {
  children: React.ReactNode
}

export const BlankPage = ({ children }: BlankPageProps) => {
  const { colorMode } = useColorMode()
  const backgroundColor = colorMode === "light" ? "white" : "gray.700"
  return (
    <Container
      centerContent
      maxW="container.xl"
      py="16"
      my="12"
      backgroundColor={backgroundColor}
      rounded="md"
      shadow="sm"
    >
      {children}
    </Container>
  )
}
