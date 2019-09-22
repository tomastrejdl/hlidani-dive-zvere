export default {
  /* Events */
  setEvents: (state, events) => (state.events = events),
  addEvent: (state, event) => state.events.push(event),
  removeEventById: (state, eventId) => {
    const index = state.events.findIndex(event => event.id === eventId)
    state.events.splice(index, 1)
  },

  /* Events deletion */
  addEventDeletionPending: (state, eventId) =>
    state.eventDeletionPending.push(eventId),
  removeEventDeletionPending: (state, eventId) => {
    const index = state.events.findIndex(event => event.id === eventId)
    state.eventDeletionPending.splice(index, 1)
  },

  /* Event creation */
  setEventCreationPending: (state, value) =>
    (state.eventCreationPending = value),

  setEventActionPending: (state, value) => (state.eventActionPending = value),

  /* Update event */
  updateEvent: (state, event) => {
    const index = state.events.findIndex(e => e.id === event.id)
    state.events[index] = event
  },
}
