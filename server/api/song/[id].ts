import { readFile } from 'fs/promises'
import { join } from 'path'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id',
    })
  }

  const filePath = join(process.cwd(), 'server/data/songs', `${id}.json`)

  try {
    const json = await readFile(filePath, 'utf-8')
    return JSON.parse(json)
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'code' in err &&
      (err as { code?: string }).code === 'ENOENT'
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Song not found',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Server error',
    })
  }
})
