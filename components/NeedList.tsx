import {
  Box,
  Button,
  List,
  Text
} from "@chakra-ui/react"
import React from "react"
import type { DBServiceList } from "../adapters/firebase-database"
import { Need, NEED_MODAL_DISPLAY_STATES } from "../types"
import NeedListItem from "./NeedListItem"

type NeedListProps = {
  listSnapshots: DBServiceList
  updatedNeedErrorMessage: string
  updatedNeedConfirmMessage: string
  setActiveNeed: React.Dispatch<React.SetStateAction<Need | null>>
  setShowModal: React.Dispatch<React.SetStateAction<NEED_MODAL_DISPLAY_STATES>>
}

const NeedList: React.FC<NeedListProps> = ({
  listSnapshots,
  setActiveNeed,
  setShowModal,
  updatedNeedConfirmMessage,
  updatedNeedErrorMessage
}) => {
  const [snapshots, loading] = listSnapshots

  // RENDER HELPERS
  const renderAddState = (text?: string) => {
    return (
      <>
        {text && <Text>{text}</Text>}
        <Button onClick={() => setShowModal("add")}>Add</Button>
      </>
    )
  }

  return (
    <Box>
      {/* We are: -Loading, -Have no valid db reference, -Have a valid reference with no data */}
      {(!snapshots || (snapshots && !snapshots.length)) &&
        !loading &&
        renderAddState(
          "Looks like no needs have been added. Add your first one now!",
        )}
      {snapshots && snapshots.length && (
        <>
          {renderAddState()}
          <List>
            {snapshots.map((snapshot) => {
              if (!snapshot || !snapshot.key) {
                return null
              }
              const {
                name,
                description,
                fulfilledState,
                ownerId,
                assigneeId,
              } = snapshot.val()
              const key = snapshot.key
              const need: Need = {
                name,
                description,
                fulfilledState,
                id: key,
                ownerId,
                assigneeId,
              }
              return (
                <NeedListItem
                  key={key}
                  need={need}
                  setActiveNeed={setActiveNeed}
                  setShowModal={setShowModal}
                  updatedNeedErrorMessage={updatedNeedErrorMessage}
                  updatedNeedConfirmMessage={updatedNeedConfirmMessage}
                />
              )
            })}
          </List>
        </>
      )}
    </Box>
  )
}

export default NeedList


