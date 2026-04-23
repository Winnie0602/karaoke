<script setup lang="ts">
const { isModalOpen, title, content, type, confirm, cancel } = useCheckConfirm()
const { locale } = useI18n()
const config = useRuntimeConfig()
const siteName = 'Karaoke Lab'
const siteUrl = config.public.siteUrl.replace(/\/+$/, '')

useHead(() => ({
  meta: [
    {
      name: 'google-site-verification',
      content: '6RsNwJZO2CDZVdTuNStgFJSVffmaEYMqij35P0UKaps',
    },
  ],
  htmlAttrs: {
    lang: locale.value,
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ${siteName}` : siteName
  },

}))

useSeoMeta({
  ogSiteName: siteName,
  ogImage: `${siteUrl}/og-image.png`,
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/og-image.png`,
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
