import { firebaseConfig } from './firebase-config'
import { getApps, initializeApp } from 'firebase/app'
import { getDatabase, ref } from 'firebase/database'
import { DocDatabaseService } from '../services/database'

const initializeFirebase: DocDatabaseService["init"] = () => {
  const apps = getApps()
  if (!apps.length) {
    initializeApp(firebaseConfig)
  }
}

const getFirebaseInstance: DocDatabaseService["getInstance"] = () => {
  const app = getApps()[0]

  if (!app) throw Error("Must initialize firebase first.")

  return getDatabase(app)
}

const getFirebaseRef: DocDatabaseService["getTableRef"] = (tableName: string) =>
  ref(getFirebaseInstance(), tableName)

export const FirebaseDocDatabaseService: DocDatabaseService = {
  init: initializeFirebase,
  getInstance: getFirebaseInstance,
  getTableRef: getFirebaseRef
}


