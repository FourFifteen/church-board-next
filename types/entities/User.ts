export type User = {
  name: string
  churchId: string
  id: string
}

export interface Admin extends User {
  isAdmin: boolean
}
