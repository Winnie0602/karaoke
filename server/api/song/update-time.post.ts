import { readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { videoId, lyrics } = body

  const { db } = await connectToDatabase()

  const collection = db.collection('songs')

  const operations = lyrics.map(
    (line: { nanoid: string; start: number; end: number }) => ({
      updateOne: {
        filter: { id: videoId },
        update: {
          $set: {
            'lyrics.$[elem].start': line.start,
            'lyrics.$[elem].end': line.end,
          },
        },
        arrayFilters: [{ 'elem.nanoid': line.nanoid }],
      },
    }),
  )

  await collection.bulkWrite(operations)

  return { success: true }
})
