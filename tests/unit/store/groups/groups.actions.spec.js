import actions from '@/store/groups/groups.actions'

jest.mock('@/firebase/groups-db', () => ({
  GroupsDB: jest.mock(),
}))

const mockGroupsDbRead = jest.fn()
const mockGroupsDbReadAll = jest.fn()
const mockGroupsDbCreate = jest.fn()
const mockGroupsDbDelete = jest.fn()
jest.mock('@/firebase/groups-db', () =>
  jest.fn().mockImplementation(() => ({
    read: mockGroupsDbRead,
    readAll: mockGroupsDbReadAll,
    create: mockGroupsDbCreate,
    delete: mockGroupsDbDelete,
  })),
)

jest.mock('@/firebase/users-db', () => ({
  GroupsDB: jest.mock(),
}))

const mockUsersDbRead = jest.fn()
jest.mock('@/firebase/users-db', () =>
  jest.fn().mockImplementation(() => ({
    read: mockUsersDbRead,
  })),
)

const commit = jest.fn()
const dispatch = jest.fn()
const isGroupDeletionPending = jest.fn()
const userId = 11
const user = {
  id: userId,
  groups: [1, 2],
  createTimestamp: '',
  updateTimestamp: '',
}
const group1 = {
  id: 1,
  name: 'group1',
  owner: userId,
  members: [{ userId: 11, accepted: true, owner: true, id: 11 }],
}
const group2 = {
  id: 2,
  name: 'group2',
  owner: userId,
  members: [{ userId: 11, accepted: true, owner: true, id: 11 }],
}
const rootState = {
  authentication: {
    user,
  },
}
const getters = {
  isGroupDeletionPending,
}

afterEach(() => {
  commit.mockReset()
  dispatch.mockReset()
  mockGroupsDbReadAll.mockReset()
  mockGroupsDbCreate.mockReset()
  mockGroupsDbDelete.mockReset()
  isGroupDeletionPending.mockReset()
})

describe('groups module action', () => {
  describe('getUserGroups', () => {
    it('should set groups with ones owned by the current user', async () => {
      mockGroupsDbReadAll.mockResolvedValue([group1, group2])
      mockGroupsDbRead.mockReturnValueOnce(group1)
      mockGroupsDbRead.mockReturnValueOnce(group2)
      mockUsersDbRead.mockResolvedValue(user)
      await actions.getUserGroups({ commit, rootState })
      expect(commit).toHaveBeenCalled()
      expect(commit).toHaveBeenCalledWith('setGroups', [group1, group2])
    })
  })

  describe('createGroup', () => {
    it('should set group creation as pending first', async () => {
      mockGroupsDbCreate.mockResolvedValue(group2)
      await actions.createGroup({ commit, rootState })
      expect(commit).toHaveBeenNthCalledWith(1, 'setGroupCreationPending', true)
    })

    it('should add group', async () => {
      mockGroupsDbCreate.mockResolvedValue(group2)
      await actions.createGroup({ commit, rootState }, group1)
      expect(commit).toHaveBeenNthCalledWith(2, 'addGroup', group2)
    })

    it('should set group creation as not pending after adding group', async () => {
      mockGroupsDbCreate.mockResolvedValue(group2)
      await actions.createGroup({ commit, rootState }, group1)
      expect(commit).toHaveBeenNthCalledWith(
        3,
        'setGroupCreationPending',
        false,
      )
    })
  })

  describe('triggerAddGroupAction', async () => {
    describe('when the name of the group is empty', () => {
      const state = {
        groupNameToCreate: '',
      }

      it('should not set input name to empty', () => {
        actions.triggerAddGroupAction({ dispatch, state, rootState, commit })
        expect(commit).not.toHaveBeenCalled()
      })

      it('should not dispatch create group action', () => {
        actions.triggerAddGroupAction({ dispatch, state, rootState, commit })
        expect(dispatch).not.toHaveBeenCalled()
      })
    })

    describe('when the name of the group is not empty', () => {
      const state = {
        groupNameToCreate: 'todo',
      }

      it('should set input name to empty', () => {
        actions.triggerAddGroupAction({ dispatch, state, rootState, commit })
        expect(commit).toHaveBeenCalledWith('setGroupNameToCreate', '')
      })

      it('should dispatch create group action', () => {
        actions.triggerAddGroupAction({ dispatch, state, rootState, commit })
        expect(dispatch).toHaveBeenCalledWith('createGroup', {
          name: 'todo',
          owner: userId,
          members: [{ userId: 11, accepted: true, owner: true }],
        })
      })
    })
  })

  describe('deleteGroup', () => {
    describe('when the group is currently being deleted', () => {
      it('should not do anything', async () => {
        isGroupDeletionPending.mockReturnValue(true)
        await actions.deleteGroup({ commit, rootState, getters }, 1)
        expect(commit).not.toHaveBeenCalled()
      })
    })

    describe('when the group is not currently being deleted', () => {
      it('should set group as deletion pending first', async () => {
        getters.isGroupDeletionPending.mockReturnValue(false)
        await actions.deleteGroup({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(1, 'addGroupDeletionPending', 1)
      })

      it('should remove group in store', async () => {
        await actions.deleteGroup({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(2, 'removeGroupById', 1)
      })

      it('should remove group in db', async () => {
        await actions.deleteGroup({ commit, rootState, getters }, 1)
        expect(mockGroupsDbDelete).toHaveBeenCalledWith(1)
      })

      it('should set group as not deletion pending after having removed the group', async () => {
        await actions.deleteGroup({ commit, rootState, getters }, 1)
        expect(commit).toHaveBeenNthCalledWith(
          3,
          'removeGroupDeletionPending',
          1,
        )
      })
    })
  })
})
