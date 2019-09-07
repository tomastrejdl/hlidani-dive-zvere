import GroupEventsDB from '@/firebase/group-events-db'

export default {
  /**
   * Fetch events of current loggedin user
   */
  getActiveGroupEvents: async ({ rootState, commit }) => {
    const groupEventDb = new GroupEventsDB(rootState.app.activeGroup)

    const events = await groupEventDb.readAll()
    commit('setEvents', events)
  },

  /**
   * Create a event for current loggedin user
   */
  createEvent: async ({ commit, rootState }, event) => {
    const groupEventsDb = new GroupEventsDB(rootState.app.activeGroup)

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
}