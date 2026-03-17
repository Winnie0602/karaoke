import type { LangCode } from '~/types/lang'
import type { SongData } from '~/types/song'

export default defineEventHandler(async (event) => {
  const { payload } = (await readBody(event)) as {
    payload: {
      videoId: string
      langsLyrics: Partial<Record<LangCode, string>>
      langs: LangCode[]
    }
  }

  const { videoId, langsLyrics, langs } = payload

  if (!videoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id',
    })
  }

  const { db } = await connectToDatabase()

  const song = await db.collection<SongData>('songs').findOne({ id: videoId })

  if (!song) {
    throw createError({ statusCode: 404, statusMessage: 'Song not found' })
  }

  const updatedLyrics = song.lyrics.map((line, index) => {
    const newLine = { ...line }

    langs.forEach((lang) => {
      const rawText = langsLyrics[lang] || ''
      console.log({ rawText })
      const splitLines = rawText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l)
      console.log({ splitLines })
      if (splitLines[index] !== undefined) {
        newLine[lang] = splitLines[index]
      }
    })

    return newLine
  })

  console.log({ updatedLyrics })

  await db
    .collection('songs')
    .updateOne({ id: videoId }, { $set: { lyrics: updatedLyrics } })

  return { success: true }
})
