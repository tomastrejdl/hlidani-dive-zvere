import * as functions from 'firebase-functions'
import { db } from '.'
import { Invitation } from './interfaces'

/**
 * Expects: data = { userEmail, groupId, groupName, invitedBy }
 */
export const inviteMemberToGroup = functions
  .region('europe-west1')
  .https.onCall(
    async ({ userEmail, groupId, groupName, invitedBy }, context) => {
      console.log(`Called with userEmail: ${userEmail}, groupId: ${groupId}.`)
      // Argument validation
      if (!userEmail || typeof userEmail !== 'string')
        return exitWithError(
          'invalid_argument',
          `Invalid argument ${userEmail} for 'userEmail', expecting a string`,
        )
      if (!groupId || typeof groupId !== 'string')
        return exitWithError(
          'invalid_argument',
          `Invalid argument ${groupId} for 'groupId', expecting a string`,
        )

      // Find user by email
      const users = await db
        .collection('users')
        .where('email', '==', userEmail)
        .get()

      const user: any =
        users.docs.length === 1
          ? { ...users.docs[0].data(), id: users.docs[0].id }
          : null
      console.log(user)

      if (!user)
        return exitWithError(
          'user_does_not_exist',
          `User ${userEmail} does not exist`,
        )

      const member = db.doc(`groups/${groupId}/members/${user.id}`)
      if ((await member.get()).exists)
        return exitWithError(
          'user_already_invited',
          `User ${userEmail} was already invited to group ${groupId}`,
        )

      const setResult = await member.set({
        accepted: false,
        owner: false,
      })

      const userDoc = db.doc(`users/${user.id}`)
      const invitations = user.invitations || []
      const invitation = {
        groupId,
        groupName,
        invitedBy,
      }
      const updateResult = await userDoc.update({
        invitations: [...invitations, invitation],
      })

      if (setResult.writeTime && updateResult.writeTime)
        return exitSuccess(
          `User ${userEmail} was invited to join group ${groupId}`,
        )
      else return exitWithError('database_error', 'Write to firestore failed.')
    },
  )

/**
 * Expects: data = { userId, groupId }
 */
export const acceptInvitationToGroup = functions
  .region('europe-west1')
  .https.onCall(async (data, context) => {
    const user = await db.doc(`users/${data.userId}`).get()
    const userData = user.data()

    if (!user || !userData)
      return exitWithError(
        'user_does_not_exist',
        `User ${data.userId} does not exist`,
      )

    const updateResult1 = await db
      .doc(`groups/${data.groupId}/members/${user.id}`)
      .update({
        accepted: true,
      })

    const updateResult2 = await db.doc(`users/${data.userId}`).update({
      groups: [...userData.groups, data.groupId],
      invitations: userData.invitations.filter(
        (invitation: Invitation) => invitation.groupId !== data.groupId,
      ),
    })

    if (updateResult1.writeTime && updateResult2.writeTime)
      return exitSuccess(
        `User ${userData.displayName} joined group ${data.groupId}`,
      )
    else return exitWithError('database_error', 'Write to firestore failed.')
  })

/**
 * HELPER FUNCTIONS
 */

type ErrorCode =
  | 'user_already_invited'
  | 'user_does_not_exist'
  | 'invalid_argument'
  | 'database_error'

function exitWithError(errorCode: ErrorCode, errorMessage: string) {
  console.error(errorMessage)
  return {
    result: 'error',
    errorCode: errorCode,
    errorMessage,
  }
}

function exitSuccess(successMessage: string) {
  console.log(successMessage)
  return {
    result: 'success',
    successMessage,
  }
}
