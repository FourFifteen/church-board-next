import {
  Avatar,
  Box,
  Center,
  Link,
  Spinner,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import { RiUser3Fill } from "react-icons/ri"
import { useAuth } from "../../../services/auth"
import { ThemeButton } from "./ThemeButton"

export const GlobalNav = () => {
  const { currentUser, isLoading } = useAuth()
  const { colorMode } = useColorMode()
  const backgroundColor = colorMode === "light" ? "white" : "gray.700"

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Center background={backgroundColor}>
      <Stack
        as="nav"
        justify="space-around"
        direction="row"
        alignItems="center"
      >
        <Box bg="pink.300" w="12" h="12" />
        <Stack direction="row">
          <Link href="/">Home</Link>
          <Link href="/thanks">Thanks</Link>
        </Stack>
        <Link href="/settings">
          <Avatar
            name={currentUser?.name}
            src={currentUser?.photoURL}
            icon={<RiUser3Fill />}
            bg="purple.200"
            referrerPolicy="no-referrer"
          />
        </Link>
        <ThemeButton />
      </Stack>
    </Center>
  )
}
