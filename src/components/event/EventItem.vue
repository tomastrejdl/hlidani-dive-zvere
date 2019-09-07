<template>
  <div class="event-item">
    #{{ index }} {{ event.from }} - {{ event.to }}
    <div
      v-if="!disableActions"
      class="delete-btn"
      @click="$emit('deleteEvent', event.id)"
    >
      {{ isEventDeletionPending ? 'delete in progress...' : 'delete' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: Object,
    index: Number,
    isEventDeletionPending: Boolean,
    disableActions: Boolean,
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .event-link {
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
