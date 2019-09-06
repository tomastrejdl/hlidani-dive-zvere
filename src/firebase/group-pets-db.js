import GenericDB from './generic-db'

export default class GroupPetsDB extends GenericDB {
  constructor(groupId) {
    super(`groups/${groupId}/pets`)
  }

  // Here you can extend UserProductsDB with custom methods
}
