import { Database, DatabaseReference } from "firebase/database"
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import { Service } from "./rootService"

export type DatabaseProviders = Database
export type TableRefs = DatabaseReference

export interface DocDatabaseService extends Service {
  getInstance: () => DatabaseProviders
  getTableRef: (tableName: string) => TableRefs
  setList: <T>(table: string, value: T) => Promise<T | null>
  setListFromRef: <T>(tableRef: TableRefs, value: T) => Promise<T | null>
}

// Define a context for React to use in conjunction with the reacr-firebase-hooks library
export type DocDatabaseServiceContext = {
  instance: DatabaseProviders | null
}

// Set up a default context
const DatabaseContext = createContext<DocDatabaseServiceContext>({
  instance: null
})

export const useDatabase = () => useContext(DatabaseContext)

export const makeDatabaseContextProvider = (databaseService: DocDatabaseService) => {
  databaseService.init() // should do nothing if Firebase is already initialized

  const Provider: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
    const [instance, setInstance] = useState<DatabaseProviders | null>(null)

    useEffect(() => {
      const currentInstance = databaseService.getInstance
      setInstance(currentInstance)
    }, [])

    const value: DocDatabaseServiceContext = useMemo(
      () => ({ instance }),
      [instance]
    )

    return (
      <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>
    )
  }

  return Provider
}

