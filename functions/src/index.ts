import * as admin from 'firebase-admin'

admin.initializeApp()
export const db = admin.firestore()

export * from './firestore-triggers/groupFunctions'
export * from './firestore-triggers/memberFunctions'
// export * from './firestore-triggers/eventFunctions'

export * from './callable'
