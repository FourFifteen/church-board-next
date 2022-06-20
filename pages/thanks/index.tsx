import {
  Container,
  Flex,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { NextPage } from "next"
import { RiUser5Fill } from "react-icons/ri"
import { useDBServiceList } from "../../adapters/firebase-database"
import { useProtectedRouteAuth } from "../../hooks/useProtectedRouteAuth"
import { Thanks } from "../../types/entities/Thanks"

const ThanksPage: NextPage = () => {
  const { isLoading } = useProtectedRouteAuth()
  const [snapshots, loading, error] = useDBServiceList("thanks")

  return (
    <Container centerContent>
      {isLoading || (loading && <Spinner />)}
      {error && (
        <Heading>
          Encountered an error. Sorry about that. Try refreshing?
        </Heading>
      )}
      {/* column-reverse seems like it should be most recent first..? */}
      {snapshots && (
        <Stack direction="column-reverse">
          {snapshots.map((snapshot) => {
            if (!snapshot) {
              return null
            }
            const { message, ownerId, assigneeId, needId }: Thanks =
              snapshot.val()
            return (
              <Flex key={snapshot.key}>
                <Flex>
                  <Text fontSize="sm">{needId.slice(-4)}</Text>
                  <Icon as={RiUser5Fill} role="img" />
                  <Text fontSize="sm">Tim Challies {ownerId}</Text>
                </Flex>
                <Text>{message}</Text>
                {assigneeId && (
                  <Text fontSize="sm">{assigneeId.slice(-4)}</Text>
                )}
              </Flex>
            )
          })}
        </Stack>
      )}
    </Container>
  )
}

export default ThanksPage
