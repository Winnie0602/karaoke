import type { SongsList } from '~/types/song'
import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)

  const filePath = join(process.cwd(), 'server/data/list', 'songs.json')

  try {
    const json = await readFile(filePath, 'utf-8')
    const songs: SongsList[] = JSON.parse(json)

    // 如果沒有帶 id 參數，直接回傳全部內容
    if (!id) {
      return songs
    }

    // 如果有帶 id，則過濾出符合條件的歌曲
    return songs.find((song: SongsList) => song.id === id)
  } catch (err) {
    console.error('API Error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: '無法讀取歌曲列表',
    })
  }
})
