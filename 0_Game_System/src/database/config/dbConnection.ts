import supabase, { bucket } from './supabase'

const dbConnection = supabase
export const bucketName = bucket

export default dbConnection