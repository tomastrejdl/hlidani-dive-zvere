import { find } from 'lodash'

export default {
  /**
   * Check if a group has deletion pending
   */
  isGroupDeletionPending: state => groupId =>
    state.groupDeletionPending.includes(groupId),

  /**
   * Get group by id
   */
  getGroupById: state => groupId =>
    find(state.groups, group => group.id === groupId),
}
