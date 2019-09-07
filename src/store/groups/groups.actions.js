import GroupsDB from '@/firebase/groups-db'
import UsersDB from '@/firebase/users-db'

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
      dispatch('loadActiveGroupData')
    }
    commit('setGroups', groups)
  },

  /**
   * Load active group data
   */
  loadActiveGroupData: async ({ dispatch }) => {
    dispatch('members/getActiveGroupMembers', null, { root: true })
    dispatch('pets/getActiveGroupPets', null, { root: true })
    dispatch('events/getActiveGroupEvents', null, { root: true })
  },

  /**
   * Create a group
   */
  createGroup: async ({ rootState, commit, dispatch }, group) => {
    const groupsDb = new GroupsDB()
    const usersDb = new UsersDB()

    commit('setGroupCreationPending', true)
    const createdGroup = await groupsDb.create(group)
    commit('addGroup', createdGroup)

    await dispatch('app/setActiveGroup', createdGroup, { root: true })
    commit('members/setMembers', [], { root: true })
    commit('pets/setPets', [], { root: true })
    commit('events/setEvents', [], { root: true })
    dispatch(
      'members/addMember',
      {
        userId: rootState.authentication.user.id,
        owner: true,
        accepted: true,
      },
      { root: true },
    )

    const user = rootState.authentication.user
    const newUser = { ...user, groups: [...user.groups, createdGroup.id] }
    usersDb.update(newUser)
    commit('authentication/setUser', newUser, { root: true })

    commit('setGroupCreationPending', false)
  },

  /**
   * Create a new group and reset group name input
   */
  triggerAddGroupAction: ({ dispatch, state, rootState, commit }) => {
    if (state.groupNameToCreate === '') return

    const userId = rootState.authentication.user.id
    const group = {
      name: state.groupNameToCreate,
      owner: userId,
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
    const usersDb = new UsersDB()

    commit('addGroupDeletionPending', groupId)

    const user = rootState.authentication.user
    const newUser = {
      ...user,
      groups: user.groups.filter(group => group !== groupId),
    }
    usersDb.update(newUser)
    commit('authentication/setUser', newUser, { root: true })

    await groupsDb.delete(groupId)
    commit('removeGroupById', groupId)

    // Clean other vuex stores
    commit('members/setMembers', null, { root: true })
    commit('pets/setPets', null, { root: true })
    commit('events/setEvents', null, { root: true })

    commit('removeGroupDeletionPending', groupId)
  },
}
