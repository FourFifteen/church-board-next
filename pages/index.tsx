import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Link,
  List,
  ListItem,
  Spinner,
  Text,
  Textarea
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDBServiceList } from '../adapters/firebase-database'
import { useAuth } from '../services/auth'
import { Need } from '../types/entities/Need'

const CHURCH_NAME = process.env.NEXT_PUBLIC_CHURCH_NAME
const Welcome = () => <Heading as="h1">Welcome to {CHURCH_NAME}&apos;s Needs Board</Heading>

const Home: NextPage = () => {
  const { currentUser, isLoading } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [snapshots, loading, error] = useDBServiceList('needs')

  const renderAddState = (text?: string) => {
    return (
      <>
        {text && <Text>{text}</Text>}
        <Button onClick={() => setShowAddModal(true)}>Add</Button>
      </>
    )
  }
  return (
    <Container centerContent>
      {isLoading && <Spinner />}
      {!currentUser && (
        <>
          <Welcome />
          <Text>Let&apos;s get you logged in.</Text>
          <NextLink href="/auth" passHref><Link>Log in</Link></NextLink>
        </>
      )}
      {loading && <Spinner />}
      {error && <Text>Encountered an error loading the Needs data. Sorry!</Text>}
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
      {currentUser && showAddModal && (
        <AddNeedModal userId={currentUser.id} setShowAddModal={setShowAddModal} />
      )}
    </Container>
  )
}

interface AddModalProps {
  userId: string | number
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNeedModal: React.FC<AddModalProps> = ({ userId, setShowAddModal }) => {
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

  }, [name, description, userId, submitting])

  useEffect(() => {
    if (createdNeed) {
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
export default Home
