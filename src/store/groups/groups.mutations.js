export default {
  /* Group input name */
  setGroupNameToCreate: (state, groupNameToCreate) =>
    (state.groupNameToCreate = groupNameToCreate),

  /* Groups */
  setGroups: (state, groups) => (state.groups = groups),
  addGroup: (state, group) => state.groups.push(group),
  removeGroupById: (state, groupId) => {
    const index = state.groups.findIndex(group => group.id === groupId)
    state.groups.splice(index, 1)
  },

  /* Groups deletion */
  addGroupDeletionPending: (state, groupId) =>
    state.groupDeletionPending.push(groupId),
  removeGroupDeletionPending: (state, groupId) => {
    const index = state.groups.findIndex(group => group.id === groupId)
    state.groupDeletionPending.splice(index, 1)
  },

  /* Group creation */
  setGroupCreationPending: (state, value) =>
    (state.groupCreationPending = value),
}
