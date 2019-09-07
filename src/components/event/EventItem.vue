<template>
  <div class="event-item">
    <ion-item>
      <ion-label text-wrap>
        <ion-text color="primary">
          <h3>From: {{ from }}</h3>
        </ion-text>
        <ion-text color="primary">
          <h3>To: {{ to }}</h3>
        </ion-text>
      </ion-label>

      <ion-button
        v-if="!disableActions"
        slot="end"
        fill="outline"
        color="danger"
        @click="$emit('deleteEvent', event.id)"
      >
        {{ isEventDeletionPending ? 'delete in progress...' : 'delete' }}
      </ion-button>
    </ion-item>
  </div>
</template>

<script>
import * as dateFns from 'date-fns'

export default {
  props: {
    event: Object,
    index: Number,
    isEventDeletionPending: Boolean,
    disableActions: Boolean,
  },
  computed: {
    from() {
      return dateFns.format(new Date(this.event.from), 'E, dd MMM yyyy HH:mm')
    },
    to() {
      return dateFns.format(new Date(this.event.to), 'E, dd MMM yyyy HH:mm')
    },
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
}
</style>
