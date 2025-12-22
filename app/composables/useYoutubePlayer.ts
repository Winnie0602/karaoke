export function useYoutubePlayer(videoId: Ref<string | null>) {
  const store = usePlayerStore()

  const player = ref<YT.Player | null>(null)

  let rafId: number | null = null

  // YouTube API 載入
  function loadYoutubeAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve()
        return
      }

      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)

      window.onYouTubeIframeAPIReady = () => {
        resolve()
      }
    })
  }

  // 播放時間追蹤
  function startTick() {
    if (rafId !== null) return

    const tick = () => {
      if (!store.isPlaying) return

      store.setTime(player.value?.getCurrentTime() ?? 0)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
  }

  function stopTick() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  // 建立播放器
  async function createPlayer(elementId: string) {
    if (!videoId.value) return

    await loadYoutubeAPI()

    // 已存在 player → 直接換歌
    if (player.value) {
      player.value.loadVideoById(videoId.value, store.currentTime)
      return
    }

    player.value = new YT.Player(elementId, {
      videoId: videoId.value,
      playerVars: {
        playsinline: 1,
        enablejsapi: 1,
      },
      events: {
        onReady: () => {
          store.setPlayer(player.value!)
          store.setDuration(player.value?.getDuration() ?? 0)

          if (store.currentTime > 0) {
            player.value?.seekTo(store.currentTime, true)
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            store.play()
            startTick()
          } else {
            store.pause()
            stopTick()
          }
        },
      },
    })
  }

  // 對外控制方法
  function play() {
    player.value?.playVideo()
  }

  function pause() {
    player.value?.pauseVideo()
  }

  function seekTo(time: number) {
    console.log(player.value)
    if (!player.value) return
    player.value.seekTo(time, true)
    player.value.playVideo()
  }

  onUnmounted(() => {
    stopTick()
    player.value?.destroy()
  })

  return {
    // state
    player,

    // methods
    createPlayer,
    play,
    pause,
    seekTo,
  }
}
