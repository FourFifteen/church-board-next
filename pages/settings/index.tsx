import { Button, Container, useColorMode } from "@chakra-ui/react";
import { NextPage } from "next";
import { useProtectedRouteAuth } from "../../hooks/useProtectedRouteAuth";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";


// I'll need to make this separate at some point...
const THEME_ICON_MAP = {
  dark: <RiMoonClearFill />,
  light: <RiSunFill />
}

const SettingsIndexPage: NextPage = () => {
  const { currentUser } = useProtectedRouteAuth()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Container centerContent>
      <Button onClick={toggleColorMode}>
        {THEME_ICON_MAP[colorMode]}
      </Button>
    </Container>
  )
}

export default SettingsIndexPage
