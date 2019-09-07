import { find } from 'lodash'

export default {
  /**
   * Check if a member has remove pending
   */
  isMemberRemovePending: state => memberId =>
    state.memberRemovePending.includes(memberId),

  /**
   * Get member by id
   */
  getMemberById: state => memberId =>
    find(state.members, member => member.id === memberId),
}
