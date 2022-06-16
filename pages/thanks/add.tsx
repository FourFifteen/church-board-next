import {
  Button,
  Container,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useGetPerson } from "../../hooks/useGetPerson"
import { useAuth } from "../../services/auth"

const AddThanksPage: NextPage = () => {
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { currentUser, isLoading } = useAuth()
  const router = useRouter()
  const { needId, aId } = router.query
  const [assignee, loading, error] = useGetPerson("" + aId)

  if (!currentUser && !isLoading) {
    window.location.href = "/auth"
  }

  // TODO: convert this to work with miscellaneous praise later.
  useEffect(() => {
    if (!message || !submitting) {
      return
    }
    const fetcher = async () => {
      await fetch("/api/thanks", {
        method: "POST",
        body: JSON.stringify({
          message,
          needId,
          assigneeId: aId,
          giverId: currentUser?.id,
        }),
      })
    }

    fetcher()
  }, [aId, message, currentUser, needId, submitting])


  if (error) {
    return (
      <Container centerContent>
        <Text as="h2">Encountered an error {JSON.stringify(error)}</Text>
      </Container>
    )
  }
  return (
    <Container centerContent>
      {loading && <Spinner />}
      <Stack direction="column">
        <Text as="h1" fontSize="xl">
          Send thanks to {assignee.name}
        </Text>
        <Textarea
          placeholder="Thank God for meeting my needs through this person"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={() => setSubmitting(true)}>Submit</Button>
      </Stack>
    </Container>
  )
}

export default AddThanksPage
