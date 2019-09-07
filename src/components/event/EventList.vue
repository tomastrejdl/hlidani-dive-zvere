<template>
  <div>
    <p v-if="events === null" class="infos-label">Loading...</p>
    <p v-if="events && !events.length" class="infos-label">
      You don't have any event yet
    </p>
    <event-item
      v-for="(event, index) in events"
      :key="event.id"
      class="event-row"
      :index="index"
      :is-event-deletion-pending="isEventDeletionPending(event.id)"
      :disable-actions="!networkOnLine"
      :event="event"
      @deleteEvent="deleteEvent"
    ></event-item>
  </div>
</template>

<script>
import EventItem from '@/components/event/EventItem'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { EventItem },
  computed: {
    ...mapGetters('events', ['isEventDeletionPending']),
    ...mapGetters('users', ['getUserById']),
    ...mapState('events', ['events']),
    ...mapState('app', ['networkOnLine']),
  },
  methods: mapActions('events', ['deleteEvent']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.infos-label {
  text-align: center;
}

.event-row {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin: 10px auto;
  justify-content: space-between;
}
</style>
