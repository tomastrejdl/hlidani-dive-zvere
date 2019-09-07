export default {
  /* Member input name */
  setMemberEmailToAdd: (state, memberEmailToAdd) =>
    (state.memberEmailToAdd = memberEmailToAdd),

  /* Members */
  setMembers: (state, members) => (state.members = members),
  addMember: (state, member) => state.members.push(member),
  removeMemberById: (state, memberId) => {
    const index = state.members.findIndex(member => member.id === memberId)
    state.members.splice(index, 1)
  },

  /* Members remove */
  addMemberRemovePending: (state, memberId) =>
    state.memberRemovePending.push(memberId),
  removeMemberRemovePending: (state, memberId) => {
    const index = state.members.findIndex(member => member.id === memberId)
    state.memberRemovePending.splice(index, 1)
  },

  /* Member add */
  setMemberAddPending: (state, value) => (state.memberAddPending = value),
}
