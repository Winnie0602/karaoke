import { connectToDatabase } from '~~/server/utils/mongodb'

export default defineEventHandler(async () => {
  const { db } = await connectToDatabase()

  const songs = await db.collection('list').find({}).toArray()

  return songs
})
