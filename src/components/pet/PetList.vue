<template>
  <div>
    <h1>Pets</h1>
    <p v-if="pets === null" class="infos-label">Loading...</p>
    <p v-if="pets && !pets.length" class="infos-label">
      You don't have any pet yet
    </p>
    <pet-item
      v-for="(pet, index) in pets"
      :key="pet.id"
      class="pet-row"
      :index="index"
      :is-pet-deletion-pending="isPetDeletionPending(pet.id)"
      :disable-actions="!networkOnLine"
      :data="pet"
      @deletePet="deletePet"
    ></pet-item>
  </div>
</template>

<script>
import PetItem from '@/components/pet/PetItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { PetItem },
  computed: {
    ...mapGetters('pets', ['isPetDeletionPending']),
    ...mapGetters('users', ['getUserById']),
    ...mapState('pets', ['pets']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: mapActions('pets', ['deletePet']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.pet-row {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;
  justify-content: space-between;
}
</style>
