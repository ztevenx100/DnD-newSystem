import supabase, {bucket} from '@/services/database/supabase'

const dbConnection = supabase
export const bucketName = bucket

export default dbConnection