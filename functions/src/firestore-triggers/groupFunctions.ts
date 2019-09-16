import * as functions from 'firebase-functions'
import * as firebase_tools from 'firebase-tools'
import { db } from '..'

export const onGroupDelete = functions
  .region('europe-west1')
  .firestore.document('groups/{groupId}')
  .onDelete(async (snapshot, context) => {
    if (!snapshot || !context) {
      console.error('snaphot or context object was undefined')
      return null
    }

    // Get group data
    const deletedGroup = snapshot.data()
    if (!deletedGroup) {
      console.error('snapshot.data() was undefined')
      return null
    }

    // Get group owner
    const user = (await db.doc(`users/${deletedGroup.owner}`).get()).data()
    if (!user) {
      console.error(`user ${deletedGroup.owner} does not exist`)
      return null
    }

    // Remove deleted group from user's groups array
    await db.doc(`users/${deletedGroup.owner}`).update({
      groups: [
        ...user.groups.filter(
          (groupId: string) => groupId !== context.params.groupId,
        ),
      ],
    })

    // Run a recursive delete on all subcollections at groups/{groupId}
    return firebase_tools.firestore.delete(`groups/${context.params.groupId}`, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true,
      token: functions.config().fb.token,
    })
  })

export const onGroupCreate = functions
  .region('europe-west1')
  .firestore.document('groups/{groupId}')
  .onCreate(async (snapshot, context) => {
    if (!snapshot || !context) {
      console.error('snaphot or context object was undefined')
      return null
    }

    // Get group data
    const group = snapshot.data()
    if (!group) {
      console.error('snapshot.data() was undefined')
      return null
    }

    // Add owner as a member to created group
    await db
      .doc(`groups/${context.params.groupId}/members/${group.owner}`)
      .set({
        owner: true,
        accepted: true,
      })

    // Get group owner
    const user = (await db.doc(`users/${group.owner}`).get()).data()
    if (!user) {
      console.error(`user ${group.owner} does not exist`)
      return null
    }

    // Add created group to user's groups array
    return db
      .doc(`users/${group.owner}`)
      .update({ groups: [...user.groups, context.params.groupId] })
  })
