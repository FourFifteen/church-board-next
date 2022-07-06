import {
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useProtectedRouteAuth } from "../../hooks/useProtectedRouteAuth";
import { RiMoonClearFill, RiSunFill } from "react-icons/ri";
import EditableWithButton from "../../components/themed/EditableWithButton";
import { useMemo } from "react";


// I'll need to make this separate at some point...
const THEME_ICON_MAP = {
  dark: <RiMoonClearFill />,
  light: <RiSunFill />
}

const SettingsIndexPage: NextPage = () => {
  const { currentUser } = useProtectedRouteAuth()
  const { colorMode, toggleColorMode } = useColorMode()

  const [
    defaultName,
    defaultEmail,
    defaultPhotoURL
  ] = useMemo(() => [
    currentUser?.name ?? "name",
    currentUser?.email ?? "email@example.com",
    currentUser?.photoURL ?? "photoURL",
  ], [currentUser])


  return (
    <Container>
      <Stack
        direction="column"
        py={8}
        w="full"
        justifyContent="start"
      >
        <Heading as="h1">Settings</Heading>
        <Text>Here&apos;s where you can review and update your profile settings.</Text>
      </Stack>
      <Grid
        templateColumns={["2fr 1fr", "1fr"]}
      >
        <GridItem w="full">
          <Stack
            spacing="6"
            w="full"
          >
            <EditableWithButton defaultValue={defaultName} />
            <EditableWithButton defaultValue={defaultEmail} type="email" />
            <EditableWithButton defaultValue={defaultPhotoURL} type="textarea" />
          </Stack>
        </GridItem>
        <GridItem ml={[6, 0]} mt={[0, 6]}>
          <Button onClick={toggleColorMode} id="colormode" colorScheme="teal" variant="outline">
            {THEME_ICON_MAP[colorMode]}
          </Button>
        </GridItem>
      </Grid>
    </Container >
  )
}

export default SettingsIndexPage
