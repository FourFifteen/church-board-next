import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Heading,
  Input,
  Link,
  List,
  ListItem,
  Spinner,
  Stack,
  Text,
  Textarea
} from '@chakra-ui/react'
import isEqual from 'lodash/fp/isEqual'
import type { NextPage } from 'next'
import NextLink from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDBServiceList } from '../adapters/firebase-database'
import NeedDetail from '../components/NeedDetail'
import { useAuth } from '../services/auth'
import { Need, NeedData, NEED_MODAL_DISPLAY_STATES, UserID } from '../types'

const CHURCH_NAME = process.env.NEXT_PUBLIC_CHURCH_NAME
const Welcome = () => <Heading as="h1">Welcome to {CHURCH_NAME}&apos;s Needs Board</Heading>


const Home: NextPage = () => {
  const { currentUser, isLoading } = useAuth()
  const [showModal, setShowModal] = useState<NEED_MODAL_DISPLAY_STATES>("none")
  const [activeNeed, setActiveNeed] = useState<Need | null>(null)
  const [hasActiveNeedChanged, setHasActiveNeedChanged] = useState(false)
  const [snapshots, loading, error] = useDBServiceList('needs')

  const [updatedNeedErrorMessage, setUpdatedNeedErrorMessage] = useState('')
  const [updatedNeedConfirmMessage, setUpdatedNeedConfirmMessage] = useState('')

  // PATCH CALL FOR UPDATES
  useEffect(() => {
    console.log(activeNeed)
    console.log(hasActiveNeedChanged)
    if (!activeNeed || !hasActiveNeedChanged) {
      console.log('short circuiting')
      return
    }
    console.log('running the useEffect')

    const post = async () => {
      console.log('running the patch!')
      try {
        const response = await fetch("api/needs/" + activeNeed.id, {
          method: "PATCH",
          headers: {
            "Accept": "application/json"
          },
          // we already updated its values in the handleSaveActiveNeed function
          body: JSON.stringify(activeNeed)
        })
        const data = await response.json()
        if (!data) {
          throw new Error("Got nothing back")
        }
        setUpdatedNeedConfirmMessage("Need saved!")

      } catch (err) {
        console.error(err)
        setUpdatedNeedErrorMessage(
          "Ran into a problem updating your need. Please make sure you are online then try again."
        )
      } finally {
        setHasActiveNeedChanged(false)
        setActiveNeed(null)
      }
    }

    post()
  }, [activeNeed, hasActiveNeedChanged])

  // HANDLERS
  const handleOpenDetail = (need: Need) => {
    setShowModal("detail")
    setActiveNeed(need)
  }

  const handleCloseDetail = () => {
    setShowModal("none")
  }

  // By currying this function, we can "save" the first parameter in the function,
  // then compare it to the new one when we actually run the enclosed function
  const handleSaveActiveNeed = (needBeforeChange: Need) => (newValues: Need) => {
    // only post the write if they're actually different. 
    const areNeedsEqual = !isEqual(needBeforeChange, newValues)
    if (areNeedsEqual) {
      setActiveNeed({
        ...newValues
      })
    }
    console.log('checking save status:', areNeedsEqual, activeNeed)
    setHasActiveNeedChanged(areNeedsEqual)
    return
  }

  // RENDER HELPERS
  const renderAddState = (text?: string) => {
    return (
      <>
        {text && <Text>{text}</Text>}
        <Button onClick={() => setShowModal("add")}>Add</Button>
      </>
    )
  }

  const renderThanksButton = (
    needId: string,
    {
      ownerId,
      assigneeId,
      fulfilledState 
    }: {
      ownerId: Need["ownerId"],
      assigneeId: Need["assigneeId"],
      fulfilledState: Need["fulfilledState"]
    },
  ) => {
    const isNotOwnNeed = assigneeId && assigneeId !== ownerId
    const isFulfilled = fulfilledState === "Fulfilled"

    if (!isNotOwnNeed || !isFulfilled) {
      return null
    }

    return (
      <NextLink
        href={{
          pathname: 'thanks/add',
          query: { needId, aId: assigneeId }
        }}
        passHref
      >
        <Button as={Link}>Send some thanks</Button>
      </NextLink>
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
                if (!snapshot || !snapshot.key) {
                  return null
                }
                const { name, description, fulfilledState, ownerId, assigneeId } = snapshot.val()
                const key = snapshot.key
                const need: Need = {
                  name,
                  description,
                  fulfilledState,
                  id: key,
                  ownerId,
                  assigneeId
                }

                return (
                  <ListItem
                    key={key}
                    onClick={() => handleOpenDetail(need)}
                    style={{ cursor: "pointer" }}
                  >
                    <Stack spacing={3}>
                      <Text>{name}</Text>
                      <Text>{description}</Text>
                      <Text>{fulfilledState}</Text>
                      <Text>{assigneeId}</Text>
                      <Text>{ownerId}</Text>
                      {renderThanksButton(key, need)}
                      {updatedNeedErrorMessage && (
                        <Alert status="error">
                          <AlertIcon />
                          <AlertTitle>Update Error!</AlertTitle>
                          <AlertDescription>{updatedNeedErrorMessage}</AlertDescription>

                        </Alert>
                      )}
                      {/* currently triggering on all */}
                      {updatedNeedConfirmMessage && (
                        <Alert status="success">
                          <AlertIcon />
                          {updatedNeedConfirmMessage}
                        </Alert>
                      )}
                    </Stack>
                  </ListItem>
                )
              })}
            </List>
          </>
        )}
      </Box>
      {currentUser && showModal === "add" && (
        <AddNeedModal userId={currentUser.id} handleCloseModal={() => setShowModal("none")} />
      )}
      {currentUser && activeNeed && showModal === "detail" && (
        <NeedDetail
          userId={currentUser.id}
          activeNeed={activeNeed}
          userName={currentUser.name}
          saveActiveNeed={handleSaveActiveNeed(activeNeed)}
          handleCloseDetail={handleCloseDetail}
        />
      )}
    </Container>
  )
}

interface AddModalProps {
  userId: UserID
  handleCloseModal: () => void
}

const AddNeedModal: React.FC<AddModalProps> = ({ userId, handleCloseModal }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
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

export default Home
