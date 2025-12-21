<script setup lang="ts">
const props = defineProps<{
  videoId: string
}>()

const { currentTime, isPlaying, createPlayer, seekTo } = useYoutubePlayer(
  props.videoId,
)

const emit = defineEmits<{
  (e: 'timeupdate', time: number): void
  (e: 'playstate', playing: boolean): void
}>()

onMounted(() => {
  createPlayer('player')
})

watch(currentTime, (time) => {
  emit('timeupdate', time)
})

defineExpose({
  seekTo,
})
</script>

<template>
  <ClientOnly>
    <div id="player" class="aspect-video w-full" />
  </ClientOnly>
</template>
