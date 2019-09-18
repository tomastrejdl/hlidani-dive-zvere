import GroupMembersDB from '@/firebase/group-members-db'
import { firebaseApp } from '@/firebase/init'
import UsersDB from '@/firebase/users-db'
import 'firebase/functions'

const functions = firebaseApp.functions('europe-west1')
const inviteMember = functions.httpsCallable('inviteMemberToGroup')
const acceptInvitationToGroup = functions.httpsCallable(
  'acceptInvitationToGroup',
)

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
  addMember: async ({ commit, dispatch, rootState }, userEmail) => {
    commit('setMemberAddPending', true)
    const groupName = rootState.groups.groups.find(
      group => group.id === rootState.app.activeGroup,
    ).name
    const invitedBy = rootState.authentication.user.displayName
    inviteMember({
      groupId: rootState.app.activeGroup,
      userEmail,
      groupName,
      invitedBy,
    }).then(
      result => {
        dispatch('getActiveGroupMembers')
        if (result.result === 'error')
          console.log('inviteMemberToGroup error: ', result)
      },
      error => console.log('inviteMemberToGroup error: ', error),
    )
    commit('setMemberAddPending', false)
  },

  /**
   * Add a new member to active group reset member email input
   */
  triggerAddMemberAction: async ({ dispatch, state, commit }) => {
    if (state.memberEmailToAdd === null) return

    const user = state.memberEmailToAdd

    commit('setMemberEmailToAdd', null)
    dispatch('addMember', user)
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

  /* Accept invitation to group */
  acceptInvitation: ({ rootState }, groupId) => {
    acceptInvitationToGroup({
      userId: rootState.authentication.user.id,
      groupId,
    }).then(
      result => console.log('Join success', result),
      error => console.error('Join error: ', error),
    )
  },
}
