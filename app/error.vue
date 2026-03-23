<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as () => NuxtError,
    default: undefined,
  },
})

useHead({
  title: '發生錯誤',
})
</script>

<template>
  <NuxtLayout name="no-player">
    <div v-if="error?.statusCode === 404" class="flex flex-col items-center">
      <p class="mt-32 mb-6 text-3xl">404 Page Not Found</p>
      <p class="mb-3 text-xl">{{ error?.statusMessage }}</p>
      <NuxtLink
        to="/"
        class="rounded border border-solid border-gray-400 px-4 py-3 text-xl"
      >
        回首頁
      </NuxtLink>
    </div>
    <div v-else class="flex h-screen flex-col items-center justify-center">
      <p class="mb-3 text-3xl">伺服器發生錯誤請稍後再試</p>
      <p class="mb-3 text-2xl">{{ error?.statusCode }}</p>
      <p class="mb-3 text-xl">{{ error?.statusMessage }}</p>
      <NuxtLink
        to="/"
        class="rounded border border-solid border-gray-400 px-4 py-3 text-xl"
      >
        回首頁
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>
