import { Button, Container, Stack, Text, Textarea } from "@chakra-ui/react"
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
  const [assigneeSnapshot, loading, error] = useGetPerson(aId)

  if (!currentUser && !isLoading) {
    window.location.href = "/auth"
  }

  useEffect(() => {
    if (!message || !submitting) {
      return
    }
  }, [message, currentUser, needId, submitting])

  return (
    <Container centerContent>
      <Stack direction="column">
        <Text as="h1" fontSize="xl">
          Send thanks to{" "}
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
