<template>
  <div class="pet-action-bar">
    <input
      placeholder="pet name..."
      class="pet-name-input"
      type="text"
      :value="petToCreate && petToCreate.displayName"
      @input="setPetToCreate({ displayName: $event.target.value })"
      @keypress.enter="triggerAddPetAction"
    />
    <div
      :class="{ disabled: petCreationPending }"
      class="create-pet-btn"
      @click="triggerAddPetAction"
    >
      add pet
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  computed: mapState('pets', ['petToCreate', 'petCreationPending']),
  methods: {
    ...mapMutations('pets', ['setPetToCreate']),
    ...mapActions('pets', ['triggerAddPetAction']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.pet-action-bar {
  display: flex;
  align-items: center;
  justify-content: center;

  .pet-name-input {
    padding-left: 5px;
    height: 30px;
    width: 150px;
    outline: none;
    font: inherit;
    border: 1px solid;
    border-color: #2c3e50;
    border-radius: 3px;
  }

  .create-pet-btn {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    border-color: #2c3e50;

    &.disabled {
      pointer-events: none;
      background-color: #aaa;
    }

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }
}
</style>
