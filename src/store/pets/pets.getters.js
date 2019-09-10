import { find, isNil } from 'lodash'

export default {
  /**
   * Check if a pet has deletion pending
   */
  isPetDeletionPending: state => petId =>
    state.petDeletionPending.includes(petId),

  /**
   * Get pet by id
   */
  getPetById: state => petId => find(state.pets, pet => pet.id === petId),

  /* Check if pets are loaded */
  petsLoaded: state => !isNil(state.pets),
}
