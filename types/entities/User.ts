export type User = {
  name: string
  email: string | null
  id: string | number
}

export interface Admin extends User {
  isAdmin: boolean
}
