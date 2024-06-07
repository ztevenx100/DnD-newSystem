import supabase, {bucket} from '@database/supabase'

const dbConnection = supabase
export const bucketName = bucket

export default dbConnection