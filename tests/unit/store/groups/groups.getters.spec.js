import getters from '@/store/groups/groups.getters'

const state = { groupDeletionPending: [1, 2, 3] }

describe('groups module getters', () => {
  describe('isGroupDeletionPending', () => {
    it('should return true if the given group id is marked as pending', () => {
      const result = getters.isGroupDeletionPending(state)(1)
      expect(result).toBe(true)
    })

    it('should return false if the given group id is not marked as pending', () => {
      const result = getters.isGroupDeletionPending(state)(4)
      expect(result).toBe(false)
    })
  })
})
