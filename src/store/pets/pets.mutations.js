export default {
  /* Pet input name */
  setPetToCreate: (state, petToCreate) => (state.petToCreate = petToCreate),

  /* Pets */
  setPets: (state, pets) => (state.pets = pets),
  addPet: (state, pet) => state.pets.push(pet),
  removePetById: (state, petId) => {
    const index = state.pets.findIndex(pet => pet.id === petId)
    state.pets.splice(index, 1)
  },

  /* Pets deletion */
  addPetDeletionPending: (state, petId) => state.petDeletionPending.push(petId),
  removePetDeletionPending: (state, petId) => {
    const index = state.pets.findIndex(pet => pet.id === petId)
    state.petDeletionPending.splice(index, 1)
  },

  /* Pet creation */
  setPetCreationPending: (state, value) => (state.petCreationPending = value),
}
