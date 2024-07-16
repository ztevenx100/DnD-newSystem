import supabase, {bucket} from '@/components/services/database/supabase'

const dbConnection = supabase
export const bucketName = bucket

export default dbConnection