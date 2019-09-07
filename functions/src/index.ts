import * as functions from 'firebase-functions'
import * as firebase_tools from 'firebase-tools'

// Delete all subcollections of a Group on group delete
export const deleteGroupSubcollections = functions
  .region('europe-west1')
  .firestore.document('groups/{groupId}')
  .onDelete((change, context) => {
    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return firebase_tools.firestore
      .delete(`groups/${context.params.groupId}`, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token,
      })
      .then(() => {
        return {
          path: `groups/${context.params.groupId}`,
        }
      })
  })
