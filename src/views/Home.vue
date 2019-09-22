<template>
  <div class="page-wrapper">
    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
      <ion-refresher-content
        pulling-icon="arrow-dropdown"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing..."
      ></ion-refresher-content>
    </ion-refresher>
    <inline-notification
      v-for="(invitation, index) in getUserInvitations"
      :key="'invitation' + index"
      :message="
        `You have been invited by ${invitation.invitedBy} to join group ${invitation.groupName}.`
      "
      @buttonClicked="acceptInvitation(invitation.groupId)"
    ></inline-notification>

    <ion-button v-if="view === 'calendar'" shape="round" @click="toggleView()">
      <i class="material-icons">menu</i>
      List view
    </ion-button>
    <ion-button v-if="view === 'list'" shape="round" @click="toggleView()">
      <i class="material-icons">today</i>
      Calendar view
    </ion-button>

    <calendar v-if="view === 'calendar'" v-model="selectedDate" />
    <event-list v-if="view === 'list'" class="event-list"></event-list>

    <ion-fab
      v-if="eventsLoaded"
      slot="fixed"
      vertical="bottom"
      horizontal="end"
    >
      <ion-fab-button @click="openAddEventModal">
        <i class="material-icons">add</i>
      </ion-fab-button>
    </ion-fab>
  </div>
</template>

<script>
import EventList from '@/components/event/EventList'
import Calendar from '@/components/Calendar'
import InlineNotification from '@/components/InlineNotification'
import { mapState, mapActions, mapGetters } from 'vuex'
import * as dateFns from 'date-fns'

import AddEvent from '@/components/event/AddEvent'

export default {
  components: { EventList, Calendar, InlineNotification },
  data: () => ({
    selectedDate: new Date(),
    view: 'calendar',
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
    ...mapGetters('authentication', ['isUserLoggedIn', 'getUserInvitations']),
    ...mapState('app', ['appTitle']),
    ...mapState('pets', ['pets']),
    ...mapGetters('events', ['eventsLoaded']),
    formattedDate() {
      return dateFns.format(this.selectedDate, 'MM/dd/yyyy')
    },
  },
  methods: {
    ...mapActions('events', ['createEvent', 'getActiveGroupEvents']),
    ...mapActions('members', ['acceptInvitation']),
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
    doRefresh(event) {
      this.getActiveGroupEvents().then(() => {
        event.target.complete()
      })
    },
    toggleView() {
      if (this.view === 'calendar') this.view = 'list'
      else this.view = 'calendar'
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
