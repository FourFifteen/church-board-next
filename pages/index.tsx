import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import isEqual from "lodash/fp/isEqual"
import type { NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import { useDBServiceList } from "../adapters/firebase-database"
import { NeedList } from "../components/themed"
import { QRCode } from "../components/themed/molecules/QRCode"
import { AddNeedModal } from "../components/themed/organisms/AddNeedModal"
import { useAuth } from "../services/auth"
import { Need, NEED_MODAL_DISPLAY_STATES } from "../types"

const CHURCH_NAME = process.env.NEXT_PUBLIC_CHURCH_NAME
const Welcome = () => (
  <Heading as="h1">Welcome to {CHURCH_NAME}&apos;s Needs Board</Heading>
)

const Home: NextPage = () => {
  const { currentUser, isLoading } = useAuth()
  const qrCodeLink = useRef<string | null>(null)
  const [showModal, setShowModal] = useState<NEED_MODAL_DISPLAY_STATES>("none")
  const [activeNeed, setActiveNeed] = useState<Need | null>(null)
  const [hasActiveNeedChanged, setHasActiveNeedChanged] = useState(false)
  const [snapshots, loading, error] = useDBServiceList("needs")

  // Data display
  const [updatedNeedErrorMessage, setUpdatedNeedErrorMessage] = useState("")
  const [updatedNeedConfirmMessage, setUpdatedNeedConfirmMessage] = useState("")

  useEffect(() => {
    qrCodeLink.current = window.location.origin
  }, [])

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
    <Box px="8">
      {isLoading && <Spinner />}
      {/* comment out for demo */}
      {/* {!currentUser && (
        <>
          <Welcome />
          <Text>Let&apos;s get you logged in.</Text>
          <NextLink href="/auth" passHref>
            <Link>Log in</Link>
          </NextLink>
        </>
      )} */}
      {loading && <Spinner />}
      {error && (
        <Text>Encountered an error loading the Needs data. Sorry!</Text>
      )}
      <Stack direction={"column"} spacing={4}>
        <Welcome />
        <Grid
          templateColumns={["1fr", "5fr 1fr"]}
          gap={6}
          justifyContent="center"
          alignItems="center"
        >
          <GridItem colSpan={1}>
            <Box>
              <NeedList
                listSnapshots={[snapshots, loading, error]}
                updatedNeedErrorMessage={updatedNeedErrorMessage}
                updatedNeedConfirmMessage={updatedNeedConfirmMessage}
                setActiveNeed={setActiveNeed}
                setShowModal={setShowModal}
                activeNeed={activeNeed}
                handleSaveActiveNeed={handleSaveActiveNeed(
                  activeNeed || ({} as Need),
                )}
              />
              {currentUser && showModal === "add" && (
                <AddNeedModal
                  userId={currentUser.id}
                  handleCloseModal={() => setShowModal("none")}
                />
              )}
            </Box>
          </GridItem>
          <GridItem colStart={2}>
            <Center w="full">
              {qrCodeLink.current && <QRCode link={qrCodeLink.current} />}
            </Center>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  )
}

export default Home
