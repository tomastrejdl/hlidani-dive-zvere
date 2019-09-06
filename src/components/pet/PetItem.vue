<template>
  <div class="pet-item">
    <span class="pet-name">
      <img :src="data.photoURL" width="50px" />
      #{{ index }} {{ data.displayName }}
      {{ data.animalType + ' - ' + data.breed }}
    </span>
    <div
      v-if="!disableActions"
      class="delete-btn"
      @click="$emit('deletePet', data.id)"
    >
      {{ isPetDeletionPending ? 'delete in progress...' : 'delete' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    index: Number,
    isPetDeletionPending: Boolean,
    disableActions: Boolean,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.pet-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .pet-name {
    color: $vue-color;
  }

  .delete-btn {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    margin-left: 10px;
    color: $danger-color;
    border-color: $danger-color;
  }
}
</style>
