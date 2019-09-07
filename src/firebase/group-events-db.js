import GenericDB from './generic-db'

export default class GroupEventsDB extends GenericDB {
  constructor(groupId) {
    super(`groups/${groupId}/events`)
  }

  // Here you can extend UserProductsDB with custom methods
}
