import {
  Avatar,
  Box,
  Center,
  ChakraProvider,
  Spinner,
  Stack,
} from "@chakra-ui/react"
import { RiUser3Fill } from "react-icons/ri"
import { Link } from ".."
import { FirebaseAuthService } from "../../../adapters/firebase-auth"
import { FirebaseDocDatabaseService } from "../../../adapters/firebase-database"
import { makeAuthContextProvider, useAuth } from "../../../services/auth"
import { makeDatabaseContextProvider } from "../../../services/database"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const AuthProvider = makeAuthContextProvider(FirebaseAuthService)
  const DatabaseProvider = makeDatabaseContextProvider(
    FirebaseDocDatabaseService,
  )

  return (
    <ChakraProvider>
      <AuthProvider>
        <DatabaseProvider>
          <Box w="100vw" h="100vh">
            <GlobalNav />
            {children}
          </Box>
        </DatabaseProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

const GlobalNav = () => {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return <Spinner />
  }

  return (
    <Center>
      <Stack
        as="nav"
        justify="space-around"
        direction="row"
        alignItems="center"
      >
        <Box bg="red.50" />
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
      </Stack>
    </Center>
  )
}
