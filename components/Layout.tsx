import { ChakraProvider, Spinner } from "@chakra-ui/react"
import { FirebaseAuthService } from "../adapters/firebase-auth"
import { FirebaseDocDatabaseService } from "../adapters/firebase-database"
import { makeAuthContextProvider, useAuth } from "../services/auth"
import { makeDatabaseContextProvider } from "../services/database"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const AuthProvider = makeAuthContextProvider(FirebaseAuthService)
  const DatabaseProvider = makeDatabaseContextProvider(
    FirebaseDocDatabaseService,
  )

  return (
    <ChakraProvider>
      <AuthProvider>
        <DatabaseProvider>
          {children}
        </DatabaseProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default Layout

const GlobalNav = () => {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return <Spinner />
  }

  return
}
