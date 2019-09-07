import { isNil } from 'lodash'

export default {
  /**
   * Closes "add to home screen" modal for apple
   */
  closeAddToHomeScreenModalForApple: async ({ commit }) => {
    localStorage.setItem('addToHomeIosPromptLastDate', Date.now())
    commit('setShowAddToHomeScreenModalForApple', false)
  },

  /**
   * Trigger service worker skipWating so the new service worker can take over.
   * This will also trigger a window refresh (see /src/misc/register-service-worker.js)
   */
  serviceWorkerSkipWaiting({ state, commit }) {
    if (isNil(state.SWRegistrationForNewContent)) return

    commit('setRefreshingApp', true)
    state.SWRegistrationForNewContent.waiting.postMessage('skipWaiting')
  },

  setActiveGroup: async ({ commit, dispatch }, groupId) => {
    return new Promise(resolve => {
      commit('members/setMembers', null, { root: true })
      commit('pets/setPets', null, { root: true })
      commit('events/setEvents', null, { root: true })

      commit('setActiveGroup', groupId)
      localStorage.setItem('activeGroupId', groupId)

      dispatch('groups/loadActiveGroupData', null, { root: true })
      resolve()
    })
  },
}
