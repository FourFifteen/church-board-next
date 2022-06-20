export type OwnerEditableStates = "Unfulfilled" | "N/A" | "Fulfilled"
export type AssigneeEditableStates = "Unfulfilled" | "Assigned" | "In Progress"

export type FulfilledState = OwnerEditableStates | AssigneeEditableStates

export type OwnerEditableStateUpdater = (
  existingState: OwnerEditableStates,
) => OwnerEditableStates
export type AssigneeEditableStateUpdater = (
  existingState: AssigneeEditableStates,
) => AssigneeEditableStates
export type FulfilledStateUpdater = (
  existingState: FulfilledState,
) => FulfilledState

export type NeedData = {
  name: string
  description: string
  fulfilledState: FulfilledState
  ownerId: string
  assigneeId: string | null
  thanksIds?: string[]
}

export interface Need extends NeedData {
  id: string | number
}
