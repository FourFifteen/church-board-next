import { Database, DatabaseReference } from "firebase/database"
import { Service } from "./rootService"

export type DatabaseProviders = Database
export type TableRefs = DatabaseReference

export interface DocDatabaseService extends Service {
  getInstance: () => DatabaseProviders
  getTableRef: (tableName: string) => TableRefs
}

