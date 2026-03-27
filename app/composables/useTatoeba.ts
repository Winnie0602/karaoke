import type { DisplayAPIResult } from '~/types/tatoeba'

export function useTatoeba(langFrom: string, langTo: MaybeRefOrGetter<string>) {
  const cache = new Map<string, DisplayAPIResult[]>()
  const loading = ref(false)

  const get = async (query: string) => {
    if (!query) return []

    // 有 cache 直接回傳
    if (cache.has(`${query}-${toValue(langTo)}`)) {
      return cache.get(`${query}-${toValue(langTo)}`)!
    }

    loading.value = true

    try {
      const res = await $fetch<DisplayAPIResult[]>('/api/tatoeba', {
        params: {
          from: langFrom,
          to: toValue(langTo),
          query,
        },
      })

      cache.set(`${query}-${toValue(langTo)}`, res)

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
