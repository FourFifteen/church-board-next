import { getApps, initializeApp } from 'firebase/app'
import { equalTo, get, getDatabase, push, query, ref, set } from 'firebase/database'
import { useList } from 'react-firebase-hooks/database'
import { DocDatabaseService, TableRefs } from '../services/database'
import { firebaseConfig } from './firebase-config'

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

const getFirebaseVal: DocDatabaseService["getVal"] =
  async (tableName: string) => {
    const dbRef = getFirebaseRef(tableName)
    return await get(dbRef)
  }

const getFirebaseValFromRef: DocDatabaseService["getValFromRef"] =
  async (tableRef: TableRefs) => {
    return await get(tableRef)
  }

const setFirebaseVal: DocDatabaseService["setVal"] = async (tableName: string, value) => {
  await set(getFirebaseRef(tableName), value)
  return value
}

const setFirebaseValFromRef: DocDatabaseService["setValFromRef"] =
  async (tableRef: TableRefs, value) => {
    await set(tableRef, value)
    return value
  }

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
  getVal: getFirebaseVal,
  getValFromRef: getFirebaseValFromRef,
  setVal: setFirebaseVal,
  setValFromRef: setFirebaseValFromRef,
  setList: setFirebaseList,
  setListFromRef: setFirebaseRefList
}


// react-firebase-hooks wrappers

export const useDBServiceList = (tableName: string) => useList(getFirebaseRef(tableName))

export const useGetDBListValue =
  <T extends string | number | boolean | null>(tableName: string, keyToSearch: T) => {
    const tableRef = getFirebaseRef(tableName)
    const queryResult = query(tableRef, equalTo(keyToSearch))
    return useList(queryResult)
  }
// other hooks that could be implemented: useListKeys, useListVals, useObject... and so on.

