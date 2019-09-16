import { isNil } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  getUserInvitations: state => (state.user ? state.user.invitations : []),
}
