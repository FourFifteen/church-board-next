export type ThanksData = {
  message: string,
  needId: string
  ownerId: string,
  assigneeId?: string,
}

export interface Thanks extends ThanksData {
  id: string | number
}
