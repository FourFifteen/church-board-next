import { As, Box, Container, Icon, Spinner, Stack, Text } from '@chakra-ui/react'
import { NextPage } from 'next'
import { FC, useEffect } from 'react'
import { RiFacebookCircleFill, RiGoogleFill, RiAtFill } from 'react-icons/ri'
import { AuthProviders, useAuth } from '../../services/auth'

type SignInOptions = { provider: AuthProviders, icon: As, text?: string }

const AuthPage: NextPage = () => {
  const { isLoading, currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      window.location.href = '/needs'
    }
  }, [currentUser])

  const signInOptions: SignInOptions[] = [
    { provider: "Google", icon: RiGoogleFill },
    { provider: "Facebook", icon: RiFacebookCircleFill },
    { provider: "Email", icon: RiAtFill, text: "your email" }
  ]

  return (
    <Container centerContent>
      <Box>
        {isLoading && <Spinner />}
        {!currentUser && (
          <>
            {signInOptions.map(({ provider, icon, text }, index) => (
              <SignInButton
                provider={provider}
                icon={icon}
                text={text}
                key={`${index}${provider}`}
              />
            ))}
          </>
        )}
      </Box>
    </Container>
  )
}

const SignInButton: FC<SignInOptions> = ({ provider, icon, text }) => {
  const { signIn } = useAuth()
  return (

    <Stack as="button" direction="row" onClick={() => signIn(provider)}>
      <Icon as={icon} role="presentation" />
      <Text size="sm">Sign in with {text ? text : provider}</Text>
    </Stack>
  )
}

export default AuthPage
