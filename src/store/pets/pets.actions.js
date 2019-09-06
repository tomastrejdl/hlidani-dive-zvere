import GroupPetsDB from '@/firebase/group-pets-db'

export default {
  /**
   * Fetch pets of current loggedin user
   */
  getActiveGroupPets: async ({ rootState, commit }) => {
    const userPetDb = new GroupPetsDB(rootState.app.activeGroup.id)

    const pets = await userPetDb.readAll()
    commit('setPets', pets)
  },

  /**
   * Create a pet for current loggedin user
   */
  createPet: async ({ commit, rootState }, pet) => {
    const groupPetsDb = new GroupPetsDB(rootState.app.activeGroup.id)

    commit('setPetCreationPending', true)
    const createdPet = await groupPetsDb.create(pet)
    commit('addPet', createdPet)
    commit('setPetCreationPending', false)
  },

  /**
   * Create a new pet for current loggedin user and reset pet name input
   */
  triggerAddPetAction: ({ dispatch, state, commit }) => {
    if (state.petToCreate === null) return

    const pet = state.petToCreate
    commit('setPetToCreate', null)
    dispatch('createPet', pet)
  },

  /**
   * Delete a user pet from its id
   */
  deletePet: async ({ rootState, commit, getters }, petId) => {
    if (getters.isPetDeletionPending(petId)) return

    const groupPetsDb = new GroupPetsDB(rootState.app.activeGroup.id)

    commit('addPetDeletionPending', petId)
    await groupPetsDb.delete(petId)
    commit('removePetById', petId)
    commit('removePetDeletionPending', petId)
  },
}
