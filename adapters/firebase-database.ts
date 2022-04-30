import { firebaseConfig } from './firebase-config'
import { getApps, initializeApp } from 'firebase/app'
import { getDatabase, push, ref, set } from 'firebase/database'
import { DatabaseProviders, DocDatabaseService, TableRefs } from '../services/database'
import { useList } from 'react-firebase-hooks/database'

// Base initializer. Matches the AuthService
// In common usage, this should just do nothing, since auth should be
// instantiated before the DB
const initializeFirebase: DocDatabaseService["init"] = () => {
  const apps = getApps()
  if (!apps.length) {
    initializeApp(firebaseConfig)
  }
}

// DocDatabaseService implementation

const getFirebaseInstance: DocDatabaseService["getInstance"] = () => {
  const app = getApps()[0]

  if (!app) throw Error("Must initialize firebase first.")

  return getDatabase(app)
}

const getFirebaseRef: DocDatabaseService["getTableRef"] = (tableName: string) =>
  ref(getFirebaseInstance(), tableName)

const setFirebaseList: DocDatabaseService["setList"]
  = async <TableValue>(table: string, value: TableValue) => {
    const dbRef = getFirebaseRef(table)
    const newValueRef = await push(dbRef)
    await set(newValueRef, value)
    return value
  }

const setFirebaseRefList: DocDatabaseService["setListFromRef"]
  = async <TableValue>(tableRef: TableRefs, value: TableValue) => {
    const newValueRef = await push(tableRef)
    await set(newValueRef, value)
    return value
  }

export const FirebaseDocDatabaseService: DocDatabaseService = {
  init: initializeFirebase,
  getInstance: getFirebaseInstance,
  getTableRef: getFirebaseRef,
  setList: setFirebaseList,
  setListFromRef: setFirebaseRefList
}


// react-firebase-hooks wrappers

export const useDBServiceList = (tableName: string) => useList(getFirebaseRef(tableName))
// other hooks that could be implemented: useListKeys, useListVals, useObject... and so on.

