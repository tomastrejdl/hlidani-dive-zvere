<template>
  <div class="page-wrapper">
    <!-- <p class="text-center">Selected Date: {{ formattedDate }}</p> -->
    <!-- <calendar v-model="curr" /> -->
    <event-list class="event-list"></event-list>
    <ion-fab
      v-if="eventsLoaded"
      slot="fixed"
      vertical="bottom"
      horizontal="end"
    >
      <ion-fab-button @click="openAddEventModal">
        <ion-icon name="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </div>
</template>

<script>
// import Calendar from '@/components/Calendar
import { mapState, mapActions, mapGetters } from 'vuex'
import * as dateFns from 'date-fns'
import EventList from '@/components/event/EventList'

import AddEvent from '@/components/AddEvent'

export default {
  components: { EventList /*, Calendar*/ },
  data: () => ({
    curr: new Date(),
  }),
  head: function() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    }
  },
  computed: {
    ...mapState('app', ['appTitle']),
    ...mapState('pets', ['pets']),
    ...mapGetters('events', ['eventsLoaded']),
    formattedDate() {
      return dateFns.format(this.curr, 'MM/dd/yyyy')
    },
  },
  methods: {
    ...mapActions('events', ['createEvent']),
    openAddEventModal() {
      console.log('open modal')
      this.$ionic.modalController
        .create({
          component: AddEvent,
          mode: 'ios',
          componentProps: {
            data: {
              content: 'New Content',
            },
            propsData: {
              pets: this.pets,
              close: data => {
                this.$ionic.modalController.dismiss()
                if (data) this.createEvent(data)
              },
            },
          },
        })
        .then(m => m.present())
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.week {
  width: 100%;
  display: flex;
  flex-direction: row;

  &.first {
    justify-content: flex-end;
  }
}

.day {
  height: 2rem;
  width: 2rem;
  border: 1px solid grey;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    margin-bottom: 3rem;
  }

  .home-page-title {
    text-align: center;
  }

  .documentation-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #5d6788;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color 0.1s ease;
    box-sizing: border-box;
    text-decoration: none;
    width: fit-content;
    font-weight: 500;
  }
}
</style>
