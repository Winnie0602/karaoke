<script setup lang="ts">
const { isModalOpen, title, content, type, confirm, cancel } = useCheckConfirm()
const { locale } = useI18n()
const config = useRuntimeConfig()
const siteName = 'Karaoke Lab'

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${siteName}` : siteName
  },
}))

useSeoMeta({
  ogSiteName: siteName,
  ogImage: `${config.public.siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterImage: `${config.public.siteUrl}/og-image.png`,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Teleport to="body">
    <Toast />
    <ConfirmModal
      :open="isModalOpen"
      :title="title"
      :content="content"
      :type="type"
      @confirm="confirm"
      @close="cancel"
    />
  </Teleport>
</template>
