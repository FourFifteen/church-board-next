import { Box, Button, Input, List, ListItem, Spinner, Text, Textarea } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Need } from '../../types/entities/Need'
import { useObject } from 'react-firebase-hooks/database'
import { ref } from 'firebase/database'
import firebase from '../../firebase/client'

type Props = {
  userId: string
  churchId: string
}

// const fetcher = async (url: string): Promise<Array<Need>> => {
//   const response = await fetch(url)
//   return await response.json()
// }

export default function NeedsPage({ userId, churchId }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  const needsRef = ref(firebase.database, 'needs/')
  const [snapshot, loading, error] = useObject(needsRef)
  const data: Need[] | null = snapshot?.val()
  console.log(data)

  if (loading) {
    return (
      <main>
        <Spinner />
      </main>
    )
  }
  if (error) {
    return (
      <main>
        <p>Encountered an error loading the Needs data. Sorry!</p>
      </main>
    )
  }
  return (
    <main>
      <div>
        {!data
          ? (
            <>
              <p>No needs found yet. Want to add your first one?</p>
              <Button onClick={() => setShowAddModal(true)}>Add</Button>
            </>
          )
          : (
            <>
              <List>
                <ListItem>{JSON.stringify(data)}</ListItem>
                {/*
              {data.map(({ name, description, fulfilledState, assigneeId, id }, index) => (
                <ListItem key={`${index}-${id.slice(-4)}`}>
                  <p>{name}</p>
                  <p>{description}</p>
                  <p>{fulfilledState}</p>
                  <p>{assigneeId}</p>
                </ListItem>
              ))}
            */}
              </List>
              <Button onClick={() => setShowAddModal(true)}>Add</Button>
            </>
          )}
      </div>
      {showAddModal && (
        <AddNeedModal churchId={churchId} userId={userId} setShowAddModal={setShowAddModal} />
      )}
    </main>
  )
}

interface AddModalProps extends Props {
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNeedModal: React.FC<AddModalProps> = ({ userId, churchId, setShowAddModal }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createdNeed, setCreatedNeed] = useState<Need | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!name || !description || !submitting) {
      return
    }

    const post = async () => {
      const response = await fetch("api/needs/add", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          fulfilledState: "Unfulfilled",
          ownerId: userId
        })
      })
      const data = await response.json()
      setCreatedNeed(data.need)
    }

    post()

  }, [name, description, churchId, userId, submitting])

  useEffect(() => {
    if (createdNeed && createdNeed.id) {
      setSubmitting(false)
    }
  }, [createdNeed])

  if (createdNeed && createdNeed.name) {
    return (
      <Box>
        <Text>Created new need: <strong>{createdNeed.name}</strong></Text>
        <Button onClick={() => setShowAddModal(false)}>Close</Button>
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

