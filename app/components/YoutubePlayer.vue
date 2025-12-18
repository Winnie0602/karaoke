<script setup lang="ts">
const props = defineProps<{
  videoId: string
}>()

const emit = defineEmits<{
  (e: 'timeupdate', time: number): void
  (e: 'ready'): void
}>()

const player = ref<YT.Player | null>(null)

const isPlaying = ref(false) //影片播放狀態

const rafId = ref<number | null>(null) //影片秒數

onMounted(() => {
  if (window.YT && window.YT.Player) {
    createPlayer()
  } else {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)

    window.onYouTubeIframeAPIReady = () => {
      createPlayer()
    }
  }
})

function startTick() {
  if (rafId.value !== null) return

  const tick = () => {
    if (!isPlaying.value) return

    const time = player.value?.getCurrentTime() ?? 0

    emit('timeupdate', time)

    // console.log(time)

    rafId.value = requestAnimationFrame(tick)
  }

  rafId.value = requestAnimationFrame(tick)
}

function stopTick() {
  if (rafId.value !== null) {
    cancelAnimationFrame(rafId.value)
    rafId.value = null
  }
}

function createPlayer() {
  player.value = new YT.Player('player', {
    videoId: props.videoId,
    playerVars: {
      playsinline: 1,
      enablejsapi: 1,
    },
    events: {
      onReady: () => {
        startTick()
      },
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          isPlaying.value = true
          startTick()
        } else {
          isPlaying.value = false
          stopTick()
        }
      },
    },
  })
}
function seekTo(time: number) {
  if (!player.value) return
  player.value.seekTo(time, true)
}

defineExpose({
  seekTo,
})
</script>

<template>
  <ClientOnly>
    <div id="player" class="aspect-video w-full" />
  </ClientOnly>
</template>
