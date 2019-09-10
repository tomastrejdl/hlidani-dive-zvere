import { find, isNil } from 'lodash'

export default {
  /**
   * Check if a event has deletion pending
   */
  isEventDeletionPending: state => eventId =>
    state.eventDeletionPending.includes(eventId),

  /**
   * Get event by id
   */
  getEventById: state => eventId =>
    find(state.events, event => event.id === eventId),

  /* Check if events are loaded */
  eventsLoaded: state => !isNil(state.events),
}
