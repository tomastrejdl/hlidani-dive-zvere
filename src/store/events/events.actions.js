import GroupEventsDB from '@/firebase/group-events-db'

export default {
  /**
   * Fetch events of current loggedin user
   */
  getActiveGroupEvents: async ({ rootState, commit }) => {
    return new Promise(async resolve => {
      const groupEventDb = new GroupEventsDB(rootState.app.activeGroup)

      const events = await groupEventDb.readAll()
      commit('setEvents', events)
      resolve()
    })
  },

  /**
   * Create a event for current loggedin user
   */
  createEvent: async ({ commit, rootState }, event) => {
    const groupEventsDb = new GroupEventsDB(rootState.app.activeGroup)

    event.isCovered = false

    commit('setEventCreationPending', true)
    const createdEvent = await groupEventsDb.create(event)
    commit('addEvent', createdEvent)
    commit('setEventCreationPending', false)
  },

  /**
   * Delete a user event from its id
   */
  deleteEvent: async ({ rootState, commit, getters }, eventId) => {
    if (getters.isEventDeletionPending(eventId)) return

    const groupEventsDb = new GroupEventsDB(rootState.app.activeGroup)

    commit('addEventDeletionPending', eventId)
    await groupEventsDb.delete(eventId)
    commit('removeEventById', eventId)
    commit('removeEventDeletionPending', eventId)
  },

  /* User {userId} accepts event {eventId} */
  acceptEvent: async ({ commit, rootState }, event) => {
    commit('setEventActionPending', true)
    const userId = rootState.authentication.user.id
    const groupEventsDb = new GroupEventsDB(rootState.app.activeGroup)

    const e = {
      ...event,
      isCovered: true,
      coveredBy: !event.coveredBy ? userId : null,
      answers: { ...event.answers, [userId]: true },
    }

    await groupEventsDb.update(e)
    commit('updateEvent', e)
    commit('setEventActionPending', false)
  },

  /* User {userId} rejects event {eventId} */
  rejectEvent: async ({ commit, rootState }, event) => {
    commit('setEventActionPending', true)
    const userId = rootState.authentication.user.id
    const groupEventsDb = new GroupEventsDB(rootState.app.activeGroup)

    const e = {
      ...event,
      isCovered: false,
      coveredBy: null,
      answers: { ...event.answers, [userId]: false },
    }

    await groupEventsDb.update(e)
    commit('updateEvent', e)
    commit('setEventActionPending', false)
  },
}
