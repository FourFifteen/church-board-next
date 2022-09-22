import { Box, Button, Input, Spinner, Text, Textarea } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { NeedData, UserID } from "../../../types"

export interface AddModalProps {
  userId: UserID
  handleCloseModal: () => void
}

export const AddNeedModal = ({ userId, handleCloseModal }: AddModalProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [createdNeed, setCreatedNeed] = useState<NeedData | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!name || !description || !submitting) {
      return
    }

    const post = async () => {
      const response = await fetch("api/needs", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          fulfilledState: "Unfulfilled",
          ownerId: userId,
        }),
      })
      const data = await response.json()
      setCreatedNeed(data.need)
    }

    post()
  }, [name, description, userId, submitting])

  useEffect(() => {
    if (createdNeed) {
      setSubmitting(false)
    }
  }, [createdNeed])

  if (createdNeed && createdNeed.name) {
    return (
      <Box>
        <Text>
          Created new need: <strong>{createdNeed.name}</strong>
        </Text>
        <Button onClick={handleCloseModal}>Close</Button>
      </Box>
    )
  }
  if (submitting) {
    return <Spinner />
  }
  return (
    <Box>
      <Input
        placeholder="Name of your need"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        placeholder="A fitting description of your need with appropriate details"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={() => setSubmitting(true)}>Submit</Button>
    </Box>
  )
}
