import GroupsDB from '@/firebase/groups-db'

export default {
  /**
   * Fetch groups of current loggedin user
   */
  getUserGroups: async ({ rootState, commit }) => {
    const userId = rootState.authentication.user.id
    const userGroupDb = new GroupsDB(userId)

    const groups = await userGroupDb.readAll()
    const userGroups = groups.filter(
      group =>
        group.owner === userId ||
        (group.members && group.members.find(member => member.id === userId)),
    )
    commit('setGroups', userGroups)
  },

  /**
   * Create a group
   */
  createGroup: async ({ commit }, group) => {
    const groupsDb = new GroupsDB()

    commit('setGroupCreationPending', true)
    const createdGroup = await groupsDb.create(group)
    commit('addGroup', createdGroup)
    commit('setGroupCreationPending', false)
  },

  /**
   * Create a new group and reset group name input
   */
  triggerAddGroupAction: ({ dispatch, state, rootState, commit }) => {
    if (state.groupNameToCreate === '') return

    const group = {
      name: state.groupNameToCreate,
      owner: rootState.authentication.user.id,
    }
    commit('setGroupNameToCreate', '')
    dispatch('createGroup', group)
  },

  /**
   * Delete a group from its id
   */
  deleteGroup: async ({ commit, getters }, groupId) => {
    if (getters.isGroupDeletionPending(groupId)) return

    const groupsDb = new GroupsDB()

    commit('addGroupDeletionPending', groupId)
    await groupsDb.delete(groupId)
    commit('removeGroupById', groupId)
    commit('removeGroupDeletionPending', groupId)
  },
}
