export type FulfilledState =
  | "Unfulfilled"
  | "Assigned"
  | "In Progress"
  | "Fulfilled"
  | "N/A"


export type Need = {
  name: string
  description: string
  fulfilledState: FulfilledState
  ownerId: string
  assigneeId: string | null
}

