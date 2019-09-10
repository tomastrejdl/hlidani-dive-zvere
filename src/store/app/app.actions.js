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

  setActiveGroup: async ({ state, commit, dispatch }, groupId) => {
    return new Promise(async resolve => {
      if (state.activeGroup === groupId) {
        resolve()
        return
      }

      commit('setActiveGroup', groupId)
      localStorage.setItem('activeGroupId', groupId)

      await dispatch('members/getActiveGroupMembers', null, { root: true })
      await dispatch('pets/getActiveGroupPets', null, { root: true })
      await dispatch('events/getActiveGroupEvents', null, { root: true })

      resolve()
    })
  },
}
