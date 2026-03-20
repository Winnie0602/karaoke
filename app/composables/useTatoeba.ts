import type { DisplayAPIResult } from '~/types/tatoeba'

export function useTatoeba(langFrom: string) {
  const cache = new Map<string, DisplayAPIResult[]>()
  const loading = ref(false)

  const get = async (query: string) => {
    if (!query) return []

    // 有 cache 直接回傳
    if (cache.has(query)) {
      return cache.get(query)!
    }

    loading.value = true

    try {
      const res = await $fetch<DisplayAPIResult[]>('/api/tatoeba', {
        params: {
          from: langFrom,
          to: 'cmn',
          query,
        },
      })

      cache.set(query, res)

      return res
    } finally {
      loading.value = false
    }
  }

  return {
    get,
    loading,
  }
}
