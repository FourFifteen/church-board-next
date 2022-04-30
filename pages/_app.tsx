import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { FirebaseAuthService } from '../adapters/firebase-auth'
import { FirebaseDocDatabaseService } from '../adapters/firebase-database'
import { makeAuthContextProvider } from '../services/auth'
import { makeDatabaseContextProvider } from '../services/database'
import '../styles/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  const AuthProvider = makeAuthContextProvider(FirebaseAuthService)
  const DatabaseProvider = makeDatabaseContextProvider(FirebaseDocDatabaseService)

  // My gut says that order matters here. It makes sense that we should have Auth before Database.
  return (
    <ChakraProvider>
      <AuthProvider>
        <DatabaseProvider>
          <Component {...pageProps} />
        </DatabaseProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default MyApp
