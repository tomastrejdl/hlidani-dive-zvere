import GroupMembersDB from '@/firebase/group-members-db'
import UsersDB from '@/firebase/users-db'

export default {
  /**
   * Fetch members of active group
   */
  getActiveGroupMembers: async ({ rootState, commit }) => {
    return new Promise(async resolve => {
      const groupMembersDb = new GroupMembersDB(rootState.app.activeGroup)
      const usersDb = new UsersDB()

      let members = await groupMembersDb.readAll()

      members = await Promise.all(
        members.map(async member => {
          const user = await usersDb.read(member.id)
          return {
            ...member,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }
        }),
      )

      commit('setMembers', members)
      resolve()
    })
  },

  /**
   * Add a member to active group
   */
  addMember: async ({ commit, rootState }, member) => {
    const groupMembersDb = new GroupMembersDB(rootState.app.activeGroup)

    const userId = member.userId
    delete member.userId

    commit('setMemberAddPending', true)
    const addedMember = await groupMembersDb.create(member, userId)
    commit('addMember', addedMember)
    commit('setMemberAddPending', false)
  },

  /**
   * Add a new member to active group reset member email input
   */
  triggerAddMemberAction: async ({ dispatch, state, rootState, commit }) => {
    if (state.memberEmailToAdd === null) return

    const usersDb = new UsersDB()
    const users = await usersDb.readAll([
      ['email', '==', state.memberEmailToAdd],
    ])

    if (users.length === 0) {
      console.error('ERROR: User email does not exist!')
      return
    }

    const groupMembersDb = new GroupMembersDB(rootState.app.activeGroup)
    if ((await groupMembersDb.read(users[0].id)) != null) {
      console.error('ERROR: User already invited!')
      return
    }

    const member = {
      userId: users[0].id,
      owner: false,
      accepted: false,
    }

    commit('setMemberEmailToAdd', null)
    dispatch('addMember', member)
  },

  /**
   * Remove a member from active group
   */
  removeMember: async ({ rootState, commit, getters }, memberId) => {
    if (getters.isMemberRemovePending(memberId)) return

    const groupMembersDb = new GroupMembersDB(rootState.app.activeGroup)

    commit('addMemberRemovePending', memberId)
    await groupMembersDb.delete(memberId)
    commit('removeMemberById', memberId)
    commit('addMemberRemovePending', memberId)
  },
}
