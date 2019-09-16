import * as functions from 'firebase-functions'
import { db } from '..'
import { Invitation } from '../interfaces'

export const onMemberRemove = functions
  .region('europe-west1')
  .firestore.document('groups/{groupId}/members/{memberId}')
  .onDelete(async (snapshot, context) => {
    if (!snapshot || !context) {
      console.error('snaphot or context object was undefined')
      return null
    }
    const memberId = snapshot.id
    const groupId = context.params.groupId

    const userDoc = db.doc(`users/${memberId}`)
    const user = await userDoc.get()
    const userData = user.data()
    if (!userData) {
      console.error(`user.data() was undefined for doc "users/${memberId}"`)
      return null
    }

    return userDoc.update({
      groups: userData.groups.filter((group: string) => group !== groupId),
      invitations: userData.invitations.filter(
        (invitation: Invitation) => invitation.groupId !== groupId,
      ),
    })
  })
