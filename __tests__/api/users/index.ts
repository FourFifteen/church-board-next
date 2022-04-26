import { Database } from 'firebase/database'
import { addUser } from '../../../pages/api/users'
import { User } from '../../../types'

describe('api/users', () => {
  describe('addUser', () => {
    let user: User
    let database: Database
    beforeEach(() => {
      user = {
        name: "John Knox",
        churchId: '1',
        id: '1'
      }
    })
    it('returns true', () => {
      expect(addUser(user, database)).toBe(user)
    })
  })
})
