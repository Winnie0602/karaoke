import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  // const id = getRouterParam(event, 'id')

  const filePath = join(process.cwd(), 'server/data/list', 'songs.json')

  const json = await readFile(filePath, 'utf-8')

  return JSON.parse(json)
})
