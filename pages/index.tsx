import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Input,
  Link,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import isEqual from "lodash/fp/isEqual"
import type { NextPage } from "next"
import NextLink from "next/link"
import React, { useEffect, useState } from "react"
import { useDBServiceList } from "../adapters/firebase-database"
import { NeedDetail, NeedList } from "../components/themed"
import { useAuth } from "../services/auth"
import { Need, NeedData, NEED_MODAL_DISPLAY_STATES, UserID } from "../types"

const CHURCH_NAME = process.env.NEXT_PUBLIC_CHURCH_NAME
const Welcome = () => (
  <Heading as="h1">Welcome to {CHURCH_NAME}&apos;s Needs Board</Heading>
)

const Home: NextPage = () => {
  const { currentUser, isLoading } = useAuth()
  const [showModal, setShowModal] = useState<NEED_MODAL_DISPLAY_STATES>("none")
  const [activeNeed, setActiveNeed] = useState<Need | null>(null)
  const [hasActiveNeedChanged, setHasActiveNeedChanged] = useState(false)
  const [snapshots, loading, error] = useDBServiceList("needs")

  // Data display
  const [updatedNeedErrorMessage, setUpdatedNeedErrorMessage] = useState("")
  const [updatedNeedConfirmMessage, setUpdatedNeedConfirmMessage] = useState("")

  // PATCH CALL FOR UPDATES
  useEffect(() => {
    console.log(activeNeed)
    console.log(hasActiveNeedChanged)
    if (!activeNeed || !hasActiveNeedChanged) {
      console.log("short circuiting")
      return
    }
    console.log("running the useEffect")

    const post = async () => {
      console.log("running the patch!")
      try {
        const response = await fetch("api/needs/" + activeNeed.id, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
          },
          // we already updated its values in the handleSaveActiveNeed function
          body: JSON.stringify(activeNeed),
        })
        const data = await response.json()
        if (!data) {
          throw new Error("Got nothing back")
        }
        setUpdatedNeedConfirmMessage("Need saved!")
      } catch (err) {
        console.error(err)
        setUpdatedNeedErrorMessage(
          "Ran into a problem updating your need. Please make sure you are online then try again.",
        )
      } finally {
        setHasActiveNeedChanged(false)
        setActiveNeed(null)
      }
    }

    post()
  }, [activeNeed, hasActiveNeedChanged])

  const handleCloseDetail = () => {
    setShowModal("none")
  }

  // By currying this function, we can "save" the first parameter in the function,
  // then compare it to the new one when we actually run the enclosed function
  const handleSaveActiveNeed =
    (needBeforeChange: Need) => (newValues: Need) => {
      // only post the write if they're actually different.
      const areNeedsEqual = !isEqual(needBeforeChange, newValues)
      if (areNeedsEqual) {
        setActiveNeed({
          ...newValues,
        })
      }
      console.log("checking save status:", areNeedsEqual, activeNeed)
      setHasActiveNeedChanged(areNeedsEqual)
      return
    }

  // RENDER
  return (
    <Box w="100vw" h="100vh">
      <Container centerContent w="100%">
        {isLoading && <Spinner />}
        {!currentUser && (
          <>
            <Welcome />
            <Text>Let&apos;s get you logged in.</Text>
            <NextLink href="/auth" passHref>
              <Link>Log in</Link>
            </NextLink>
          </>
        )}
        {loading && <Spinner />}
        {error && (
          <Text>Encountered an error loading the Needs data. Sorry!</Text>
        )}
        <Stack direction={"column"} spacing={4}>
          <Welcome />
          <Grid templateColumns={["1fr", "7fr 1fr"]}>
            <GridItem colSpan={1}>
              <Box>
                <NeedList
                  listSnapshots={[snapshots, loading, error]}
                  updatedNeedErrorMessage={updatedNeedErrorMessage}
                  updatedNeedConfirmMessage={updatedNeedConfirmMessage}
                  setActiveNeed={setActiveNeed}
                  setShowModal={setShowModal}
                />
                {currentUser && showModal === "add" && (
                  <AddNeedModal
                    userId={currentUser.id}
                    handleCloseModal={() => setShowModal("none")}
                  />
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
              </Box>
            </GridItem>
            <GridItem colStart={2}>
              <Center w="full">
                <Box
                  w={["200px, 100px"]}
                  h={["200px, 100px"]}
                  border="1px"
                  borderColor="teal.200"
                >
                  <Text>Enter your QR code here!</Text>
                </Box>
              </Center>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}

interface AddModalProps {
  userId: UserID
  handleCloseModal: () => void
}

const AddNeedModal: React.FC<AddModalProps> = ({
  userId,
  handleCloseModal,
}) => {
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

export default Home
