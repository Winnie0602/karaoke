import type { DisplayAPIResult } from '~/types/tatoeba'

export function useTatoeba(langFrom: string, langTo: string) {
  const cache = new Map<string, DisplayAPIResult[]>()
  const loading = ref(false)

  const get = async (query: string) => {
    if (!query) return []

    // 有 cache 直接回傳
    if (cache.has(`${query}-${langTo}`)) {
      return cache.get(`${query}-${langTo}`)!
    }

    loading.value = true

    try {
      const res = await $fetch<DisplayAPIResult[]>('/api/tatoeba', {
        params: {
          from: langFrom,
          to: langTo,
          query,
        },
      })

      cache.set(`${query}-${langTo}`, res)

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
