export type FulfilledState =
  | "Unfulfilled"
  | "Assigned"
  | "In Progress"
  | "Fulfilled"
  | "N/A"


export type NeedData = {
  name: string
  description: string
  fulfilledState: FulfilledState
  ownerId: string
  assigneeId: string | null
}


export interface Need extends NeedData {
  id: string | number
}
