import GroupsDB from '@/firebase/groups-db'
import UsersDB from '@/firebase/users-db'

export default {
  /**
   * Fetch groups of current loggedin user
   */
  getUserGroups: async ({ rootState, commit, dispatch }) => {
    const groupsDb = new GroupsDB()
    const usersDb = new UsersDB()

    let groups = await Promise.all(
      rootState.authentication.user.groups.map(
        async groupId => await groupsDb.read(groupId),
      ),
    )

    groups = await Promise.all(
      groups.map(async group => ({
        ...group,
        members: await Promise.all(
          group.members.map(async member => {
            const user = await usersDb.read(member.userId)
            delete user.groups
            delete user.createTimestamp
            delete user.updateTimestamp
            return {
              accepted: member.accepted,
              owner: member.owner,
              userId: user.id,
              ...user,
            }
          }),
        ),
      })),
    )

    commit('setSelectedGroup', groups[0])

    dispatch('app/setActiveGroup', groups[0], { root: true })

    dispatch('pets/getActiveGroupPets', null, { root: true })

    commit('setGroups', groups)
  },

  /**
   * Create a group
   */
  createGroup: async ({ rootState, commit }, group) => {
    const groupsDb = new GroupsDB()
    const usersDb = new UsersDB()

    commit('setGroupCreationPending', true)
    const createdGroup = await groupsDb.create(group)

    const user = rootState.authentication.user
    user.groups.push(createdGroup.id)
    usersDb.update(user)

    commit('addGroup', createdGroup)
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
      members: [
        {
          userId: userId,
          accepted: true,
          owner: true,
        },
      ],
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
    const index = user.groups.findIndex(group => group === groupId)
    user.groups.splice(index, 1)
    usersDb.update(user)

    await groupsDb.delete(groupId)
    commit('removeGroupById', groupId)
    commit('removeGroupDeletionPending', groupId)
  },

  /**
   * Invite user
   */
  inviteUser: async ({ commit }, userEmail) => {
    const groupsDb = new GroupsDB()
    const usersDb = new UsersDB()

    const groupId = userEmail.groupId

    const users = await usersDb.readAll([['email', '==', userEmail.email]])

    if (users.length == 0) {
      console.error('ERROR: User email does not exist!')
      return
    }

    commit('setUserInvitationPending', true)

    const group = await groupsDb.read(groupId)
    group.members.push({ userId: users[0].id, accepted: false })
    await groupsDb.update(group)

    commit('updateGroup', group)
    commit('setUserInvitationPending', true)
  },

  triggerInviteUserAction: ({ dispatch, state, commit }) => {
    if (state.userEmailToInvite === '') return

    const userEmail = state.userEmailToInvite

    commit('setUserEmailToInvite', '')
    dispatch('inviteUser', userEmail)
  },
}
