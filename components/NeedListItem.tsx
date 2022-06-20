import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Link,
  ListItem,
  Spinner,
  Stack,
  Text
} from "@chakra-ui/react"
import NextLink from "next/link"
import { useGetPerson } from "../hooks/useGetPerson"
import { Need, NEED_MODAL_DISPLAY_STATES } from "../types"

type NeedListItemProps = {
  need: Need
  updatedNeedErrorMessage: string
  updatedNeedConfirmMessage: string
  setActiveNeed: React.Dispatch<React.SetStateAction<Need | null>>
  setShowModal: React.Dispatch<React.SetStateAction<NEED_MODAL_DISPLAY_STATES>>
}

const NeedListItem: React.FC<NeedListItemProps> = ({
  need,
  setActiveNeed,
  setShowModal,
  updatedNeedConfirmMessage,
  updatedNeedErrorMessage
}) => {
  const {
    assigneeId,
    ownerId,
    id,
    name,
    fulfilledState,
    description
  } = need
  const [assignee, assigneeLoading, assigneeError] = useGetPerson("" + assigneeId)
  const [owner, ownerLoading, ownerError] = useGetPerson("" + ownerId)


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

    if (isFulfilled) {
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

  const renderError = (condition = true, title = "Error!", message = "Encountered an error") => (
    <>
      {condition && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
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
      <Stack spacing={3}>
        <Text>{name}</Text>
        <Text>{description}</Text>
        <Text>{fulfilledState}</Text>
        <Text>{assignee?.name}</Text>
        <Text>{owner?.name}</Text>
        {renderThanksButton("" + id, need)}
        {renderError(Boolean(assigneeError), "Update Error!", "Failed to get Assignee data")}
        {renderError(Boolean(ownerError), "Update Error!", "Failed to get Owner data")}
        {renderError(Boolean(updatedNeedErrorMessage), "Update Error!", updatedNeedErrorMessage)}
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

export default NeedListItem
