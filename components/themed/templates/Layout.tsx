import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource/ibm-plex-sans/400.css"
import "@fontsource/ibm-plex-serif/700.css"
import { FirebaseAuthService } from "../../../adapters/firebase-auth"
import { FirebaseDocDatabaseService } from "../../../adapters/firebase-database"
import { makeAuthContextProvider } from "../../../services/auth"
import { makeDatabaseContextProvider } from "../../../services/database"
import theme from "../../../theme"
import { Background } from "../atoms/Background"
import { GlobalNav } from "../organisms/GlobalNav"
import { BlankPage } from "./BlankPage"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const AuthProvider = makeAuthContextProvider(FirebaseAuthService)
  const DatabaseProvider = makeDatabaseContextProvider(
    FirebaseDocDatabaseService,
  )

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <DatabaseProvider>
          <Background w="100vw" h="100vh">
            <GlobalNav />
            <BlankPage>{children}</BlankPage>
          </Background>
        </DatabaseProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}
