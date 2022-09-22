import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { Need, User, UserID } from "../../../types"

export interface NeedDetailProps {
  activeNeed: Need | null
  boxShadow?: string
  handleCloseDetail: () => void
  saveActiveNeed: (newNeedValues: Need) => void
  userId: UserID
  userName: User["name"]
}

const FULFILLED_STATES: Need["fulfilledState"][] = [
  "Unfulfilled",
  "Assigned",
  "In Progress",
  "Fulfilled",
  "N/A",
]

export const NeedDetail: React.FC<NeedDetailProps> = ({
  boxShadow,
  userId,
  activeNeed,
  saveActiveNeed,
  handleCloseDetail,
}) => {
  const [activeFulfilledState, setActiveFulfilledState] = useState(
    activeNeed?.fulfilledState,
  )
  // use this to change the primary action text for the modal.
  // i.e. from "Close" to "Save changes"
  const hasChangedRef = useRef(false)
  const replaceBrutal = (str?: string) =>
    !str ? null : str.replace(/brutal-/g, "")

  if (!activeNeed || !activeFulfilledState) {
    // don't render or do anything unless we have an active Need.
    return null
  }
  const { ownerId, assigneeId, name } = activeNeed

  // if the logged in user is viewing their own need, we want to let them edit
  const IN_EDIT_MODE = userId === ownerId
  // if the need is assigned, but the viewer is not the assignee, don't let them change anything
  const IN_VIEW_ONLY_MODE = assigneeId && userId !== assigneeId
  // otherwise, we carry on with allowing only changes to assignment

  // if (IN_EDIT_MODE) {
  //   return <Text>Not yet able to edit. Sorry</Text>
  // }

  const updateFulfilledState = (existingState: Need["fulfilledState"]) => {
    // only assignees can say "I'm working on this"
    const isAssigneeOnlyState =
      existingState === "Assigned" || existingState === "In Progress"
    // only owners can mark a Need fulfilled or no longer needed
    const isOwnerOnlyState =
      existingState === "Fulfilled" || existingState === "N/A"

    if (IN_VIEW_ONLY_MODE) {
      return existingState
    } else if (IN_EDIT_MODE && isAssigneeOnlyState) {
      // if the owner is changing the fulfilledState,
      // and the Need is assigned,
      // then we mark the need as no longer needed.
      return "N/A"
    } else if (!IN_EDIT_MODE && isOwnerOnlyState) {
      // if the current user is not the owner,
      // then we allow the user to unassign themselves.
      return "Unfulfilled"
    }

    const index = FULFILLED_STATES.indexOf(existingState)
    if (index === FULFILLED_STATES.length - 1) {
      return FULFILLED_STATES[0]
    }
    return FULFILLED_STATES[index + 1]
  }

  const handleFulfilledStateClick = () => {
    setActiveFulfilledState(updateFulfilledState(activeFulfilledState))
    hasChangedRef.current = true // writing to this each time won't ever be a performance issue
  }

  const handleSaveClick = (closeHandler: () => void) => () => {
    saveActiveNeed({
      ...activeNeed,
      fulfilledState: activeFulfilledState,
      assigneeId: IN_EDIT_MODE ? "" + userId : activeNeed.assigneeId,
    })
    closeHandler()
  }

  // TODO: Turn this so that the Tags are updated with the Assignee's name and picture?
  return (
    <Modal
      isOpen={Boolean(activeNeed)}
      onClose={handleCloseDetail}
      colorScheme="teal"
    >
      <ModalOverlay />
      <ModalContent boxShadow={boxShadow || "brutal-teal"}>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton colorScheme="teal" />
        <ModalBody>
          <Tag
            onClick={handleFulfilledStateClick}
            style={{ cursor: "pointer" }}
          >
            <TagLeftIcon />
            <TagLabel>{activeFulfilledState}</TagLabel>
          </Tag>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={replaceBrutal(boxShadow) || "teal"}
            mr={3}
            onClick={handleSaveClick(handleCloseDetail)}
          >
            {hasChangedRef.current ? "Save changes" : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
