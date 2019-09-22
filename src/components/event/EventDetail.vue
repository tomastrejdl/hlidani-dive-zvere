<template>
  <div class="event-detail">
    <p>{{ from }} - {{ to }}</p>
    <ul>
      <li v-for="pet in event.pets" :key="pet">
        {{ getPetById(pet).displayName }}
      </li>
    </ul>
    {{ event.note }}
    <ion-button
      v-if="!event.isCovered && event.coveredBy !== user.id"
      color="primary"
      :disabled="eventActionPending"
      @click="acceptEvent(event)"
    >
      Accept
    </ion-button>
    <ion-button
      color="danger"
      :disabled="eventActionPending"
      @click="rejectEvent(event)"
    >
      Reject
    </ion-button>
  </div>
</template>

<script>
import * as dateFns from 'date-fns'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  props: {
    event: Object,
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('events', ['eventActionPending']),
    from() {
      return dateFns.format(new Date(this.event.from), 'E, dd MMM yyyy HH:mm')
    },
    to() {
      return dateFns.format(new Date(this.event.to), 'E, dd MMM yyyy HH:mm')
    },
  },
  methods: {
    ...mapGetters('pets', ['getPetById']),
    ...mapActions('events', ['acceptEvent', 'rejectEvent']),
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.event-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
