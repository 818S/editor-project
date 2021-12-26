import admin from 'firebase-admin'

// Replace this file with your service account key you get when setting up a firestore.
import serviceAccount from './firebase-sak.json'

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount)
})

export default admin.firestore()
