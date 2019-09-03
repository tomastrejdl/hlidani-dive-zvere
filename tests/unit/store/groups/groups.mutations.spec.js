import mutations from '@/store/groups/groups.mutations'
import { cloneDeep } from 'lodash'

const group1 = { id: 1, name: 'group1' }
const group2 = { id: 2, name: 'group2' }
const baseState = {
  groups: [group1, group2],
  groupNameToCreate: '',
  groupDeletionPending: [1],
  groupCreationPending: false,
}

describe('groups module mutations', () => {
  describe('setGroupNameToCreate', () => {
    it('should set group name to create correctly', () => {
      const state = cloneDeep(baseState)
      mutations.setGroupNameToCreate(state, 'toto')
      expect(state).toEqual({
        ...baseState,
        groupNameToCreate: 'toto',
      })
    })
  })

  describe('setGroups', () => {
    it('should set groups correctly', () => {
      const state = { ...cloneDeep(baseState), groups: [] }
      mutations.setGroups(state, [group2, group1])
      expect(state).toEqual({
        ...baseState,
        groups: [group2, group1],
      })
    })
  })

  describe('addGroups', () => {
    it('should add group correctly', () => {
      const state = { ...cloneDeep(baseState), groups: [] }
      mutations.addGroup(state, group1)
      expect(state).toEqual({
        ...baseState,
        groups: [group1],
      })
    })
  })

  describe('removeGroupById', () => {
    it('should remove group correctly', () => {
      const state = cloneDeep(baseState)
      mutations.removeGroupById(state, 2)
      expect(state).toEqual({
        ...baseState,
        groups: [group1],
      })
    })
  })

  describe('addGroupDeletionPending', () => {
    it('should mark group as deletion correctly', () => {
      const state = cloneDeep(baseState)
      mutations.addGroupDeletionPending(state, 2)
      expect(state).toEqual({
        ...baseState,
        groupDeletionPending: [1, 2],
      })
    })
  })

  describe('removeGroupDeletionPending', () => {
    it('should unmark group as deletion correctly', () => {
      const state = cloneDeep(baseState)
      mutations.removeGroupDeletionPending(state, 1)
      expect(state).toEqual({
        ...baseState,
        groupDeletionPending: [],
      })
    })
  })

  describe('setGroupCreationPending', () => {
    it('should set group creation pending correctly', () => {
      const state = cloneDeep(baseState)
      mutations.setGroupCreationPending(state, true)
      expect(state).toEqual({
        ...baseState,
        groupCreationPending: true,
      })
    })
  })
})
