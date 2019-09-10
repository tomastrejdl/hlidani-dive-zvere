import GroupsDB from '@/firebase/groups-db'

export default {
  /**
   * Fetch groups of current loggedin user
   */
  getUserGroups: async ({ rootState, commit, dispatch }) => {
    const groupsDb = new GroupsDB()

    const groups = await Promise.all(
      rootState.authentication.user.groups.map(
        async groupId => await groupsDb.read(groupId),
      ),
    )

    if (groups.length > 0) {
      let activeGroupId = localStorage.getItem('activeGroupId')
      if (!activeGroupId || activeGroupId.id === '')
        activeGroupId = groups[0].id

      await dispatch('app/setActiveGroup', activeGroupId, { root: true })
    }
    commit('setGroups', groups)
  },

  /**
   * Create a group
   */
  createGroup: async ({ rootState, commit, dispatch }, group) => {
    const groupsDb = new GroupsDB()

    commit('setGroupCreationPending', true)
    const createdGroup = await groupsDb.create(group)
    commit('addGroup', createdGroup)

    await dispatch('app/setActiveGroup', createdGroup.id, { root: true })

    const user = rootState.authentication.user
    commit(
      'authentication/setUser',
      { ...user, groups: [...user.groups, createdGroup.id] },
      { root: true },
    )

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
  deleteGroup: async ({ commit, rootState, getters }, groupId) => {
    if (getters.isGroupDeletionPending(groupId)) return

    const groupsDb = new GroupsDB()

    commit('addGroupDeletionPending', groupId)

    const user = rootState.authentication.user
    commit(
      'authentication/setUser',
      {
        ...user,
        groups: user.groups.filter(group => group !== groupId),
      },
      { root: true },
    )

    await groupsDb.delete(groupId)
    commit('removeGroupById', groupId)

    // Clean other vuex stores
    commit('members/setMembers', null, { root: true })
    commit('pets/setPets', null, { root: true })
    commit('events/setEvents', null, { root: true })

    commit('removeGroupDeletionPending', groupId)
  },
}
