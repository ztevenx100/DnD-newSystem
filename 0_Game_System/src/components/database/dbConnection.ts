import supabase, {databaseName} from '@database/supabase'

const dbConnection = supabase
export const dbName = databaseName

export default dbConnection