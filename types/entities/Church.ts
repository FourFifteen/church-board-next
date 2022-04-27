export type ChurchData = {
  name: string
  address: string
  addressTwo?: string
  city: string
  state: string
  country?: string
}

export interface Church extends ChurchData {
  id: string
}
