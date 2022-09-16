import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Heading,
  Icon,
  Link,
  ListItem,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import NextLink from "next/link"
import { RiUser5Fill } from "react-icons/ri"
import { useGetPerson } from "../../../hooks/useGetPerson"
import { Need, NEED_MODAL_DISPLAY_STATES } from "../../../types"
import { truncate } from "../../../utils/truncate"

type NeedListItemProps = {
  need: Need
  updatedNeedErrorMessage: string
  updatedNeedConfirmMessage: string
  setActiveNeed: React.Dispatch<React.SetStateAction<Need | null>>
  setShowModal: React.Dispatch<React.SetStateAction<NEED_MODAL_DISPLAY_STATES>>
}

export const NeedListItem = ({
  need,
  setActiveNeed,
  setShowModal,
  updatedNeedConfirmMessage,
  updatedNeedErrorMessage,
}: NeedListItemProps) => {
  const { assigneeId, ownerId, id, name, fulfilledState, description } = need
  const [assignee, assigneeLoading, assigneeError] = useGetPerson(
    "" + assigneeId,
  )
  const [owner, ownerLoading, ownerError] = useGetPerson("" + ownerId)
  const borderColorValue = useColorModeValue("teal.500", "teal.300")
  // HANDLERS
  const handleOpenDetail = (need: Need) => {
    setShowModal("detail")
    setActiveNeed(need)
  }

  // RENDER HELPERS
  const renderThanksButton = (
    needId: string,
    {
      assigneeId,
      fulfilledState,
    }: {
      assigneeId: Need["assigneeId"]
      fulfilledState: Need["fulfilledState"]
    },
  ) => {
    // const isNotOwnNeed = assigneeId && assigneeId !== ownerId
    const isFulfilled = fulfilledState === "Fulfilled"

    // don't show the button if the need isn't fulfilled
    if (!isFulfilled) {
      // if (!isNotOwnNeed || isFulfilled) {
      return null
    }

    return (
      <NextLink
        href={{
          pathname: "thanks/add",
          query: { needId, aId: assigneeId },
        }}
        passHref
      >
        <Button as={Link}>Send some thanks</Button>
      </NextLink>
    )
  }

  const renderError = (
    condition = true,
    title = "Error!",
    message = "Encountered an error",
  ) => (
    <>
      {condition && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </>
  )

  if (ownerLoading || assigneeLoading) {
    return <Spinner />
  }

  return (
    <ListItem
      key={id}
      onClick={() => handleOpenDetail(need)}
      style={{ cursor: "pointer" }}
    >
      <Stack
        spacing={3}
        border={1}
        borderColor={borderColorValue}
        borderStyle="solid"
        rounded="md"
        p={6}
        // boxShadow="0.5rem 0.5rem #319795"
        _hover={{
          translate: "-0.5rem -0.5rem",
          transition: "all 0.2s ease-in-out",
          boxShadow: "1rem 1rem #319795",
        }}
        boxShadow="brutal"
      >
        <Heading as="h3">{truncate(name)}</Heading>
        <Text fontSize="sm">{truncate(description)}</Text>
        <Text>
          <Icon as={RiUser5Fill} role="img" />
          {fulfilledState}
        </Text>
        <Text>{assignee?.name}</Text>
        <Text>{owner?.name}</Text>
        {renderThanksButton("" + id, need)}
        {renderError(
          Boolean(assigneeError),
          "Update Error!",
          "Failed to get Assignee data",
        )}
        {renderError(
          Boolean(ownerError),
          "Update Error!",
          "Failed to get Owner data",
        )}
        {renderError(
          Boolean(updatedNeedErrorMessage),
          "Update Error!",
          updatedNeedErrorMessage,
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
}
