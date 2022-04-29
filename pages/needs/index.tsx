import { Box, Button, Center, Container, Input, List, ListItem, Spinner, Text, Textarea } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { Need } from '../../types/entities/Need'
import { useList } from 'react-firebase-hooks/database'
import { FirebaseDocDatabaseService } from '../../adapters/firebase-database'
import { TableRefs } from '../../services/database'

type Props = {
  userId: string
  churchId: string
}

export default function NeedsPage({ userId, churchId }: Props) {
  const [showAddModal, setShowAddModal] = useState(false)
  const needsRef = useRef<TableRefs | null>(null)
  const [snapshots, loading, error] = useList(needsRef.current)

  useEffect(() => {
    FirebaseDocDatabaseService.init()
    needsRef.current = FirebaseDocDatabaseService.getTableRef('needs')
  }, [])
  const renderAddState = (text?: string) => {
    return (
      <>
        {text && <Text>{text}</Text>}
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
      </>
    )
  }

  return (
    <Container>
      {loading && <Center><Spinner /></Center>}
      {error && <Center><Text>Encountered an error loading the Needs data. Sorry!</Text></Center>}
      <Box>
        {/* We are: -Loading, -Have no valid db reference, -Have a valid reference with no data */}
        {(!snapshots || snapshots && !snapshots.length) && !loading &&
          renderAddState("Looks like no needs have been added. Add your first one now!")
        }
        {snapshots && snapshots.length && (
          <>
            {renderAddState()}
            <List>
              {snapshots.map((snapshot) => {
                if (!snapshot) {
                  return null
                }
                const { name, description, fulfilledState, assigneeId } = snapshot.val()
                return (
                  <ListItem key={snapshot.key}>
                    <Text>{name}</Text>
                    <Text>{description}</Text>
                    <Text>{fulfilledState}</Text>
                    <Text>{assigneeId}</Text>
                  </ListItem>
                )
              })}
            </List>
          </>
        )}
      </Box>
      {showAddModal && (
        <AddNeedModal churchId={churchId} userId={userId} setShowAddModal={setShowAddModal} />
      )}
    </Container>
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
      const response = await fetch("api/needs", {
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

