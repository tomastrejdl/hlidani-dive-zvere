import state from './pets.state'
import mutations from './pets.mutations'
import actions from './pets.actions'
import getters from './pets.getters'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
