// import * as functions from 'firebase-functions'
//
// export const onEventCreate = functions
//   .region('europe-west1')
//   .firestore.document('events/{eventId}')
//   .onCreate(async (snapshot, context) => {
//     if (!snapshot || !context) {
//       console.error('snaphot or context object was undefined')
//       return null
//     }

//     // Get event data
//     const event = snapshot.data()
//     if (!event) {
//       console.error('snapshot.data() was undefined')
//       return null
//     }

//     return snapshot.ref.update({ isCovered: false })
//   })
