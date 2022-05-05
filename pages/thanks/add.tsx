import { Button, Container, Stack, Textarea } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from '../../services/auth'

const AddThanksPage: NextPage = () => {
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { currentUser, isLoading } = useAuth()
  const router = useRouter()
  const { needId, aId } = router.query

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
