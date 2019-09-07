import GenericDB from './generic-db'

export default class GroupMembersDB extends GenericDB {
  constructor(groupId) {
    super(`groups/${groupId}/members`)
  }

  // Here you can extend GroupMembersDB with custom methods
}
