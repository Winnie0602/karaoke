import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) return null

  const filePath = join(process.cwd(), 'server/data/songs', `${id}.json`)

  try {
    const json = await readFile(filePath, 'utf-8')
    return JSON.parse(json)
  } catch (err) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      err.code === 'ENOENT'
    ) {
      return {
        id,
        title: '',
        artist: '',
        lyrics: [],
      }
    }

    throw err
  }
})
