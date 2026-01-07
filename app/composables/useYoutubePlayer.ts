export function useYoutubePlayer(videoId: Ref<string | null>) {
  const store = usePlayerStore()
  const player = ref<YT.Player | null>(null)

  let rafId: number | null = null

  // YouTube API 載入
  function loadYoutubeAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (!import.meta.client) return resolve()

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
      if (!store.isPlaying || store.isSeeking) {
        rafId = requestAnimationFrame(tick)
        return
      }

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

  //  換歌（不重建 player）
  watch(videoId, (id) => {
    if (!player.value || !id) return
    player.value.loadVideoById(id, 0)
  })

  // state的速度變數改變時，call youtube API改變速度
  watch(
    () => store.playbackRate,
    (rate) => {
      if (!player.value) return

      const current = player.value.getPlaybackRate()
      if (current !== rate) {
        player.value.setPlaybackRate(rate)
      }
    },
  )

  // state isPlayinge改變時，call youtube API暫停/播放
  watch(
    () => store.isPlaying,
    (isPlaying) => {
      if (!player.value) return

      const state = player.value.getPlayerState()

      if (isPlaying && state !== YT.PlayerState.PLAYING) {
        player.value.playVideo()
      }

      if (!isPlaying && state === YT.PlayerState.PLAYING) {
        player.value.pauseVideo()
      }
    },
  )

  // state的音量變數改變時，call youtube API改變音量
  watch(
    () => store.volume,
    (vol) => {
      if (!player.value) return

      const current = player.value.getVolume()
      if (current !== vol) {
        player.value.setVolume(vol)
      }
    },
  )

  // 建立播放器
  async function createPlayer(elementId: string) {
    if (!import.meta.client) return
    if (player.value) return
    if (!videoId.value) return

    await loadYoutubeAPI()

    player.value = new YT.Player(elementId, {
      videoId: videoId.value,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: () => {
          store.setDuration(player.value!.getDuration())

          if (store.currentTime > 0) {
            player.value!.seekTo(store.currentTime, true)
          }

          // 取得目前影片速度
          const rate = player.value!.getPlaybackRate()

          store.setPlaybackRate(rate)

          // 將目前音量設至store
          const vol = player.value!.getVolume()

          store.setVolume(vol)

          // 取得可用影片速度
          const rates = player.value!.getAvailablePlaybackRates()
          store.setAvailableRates(rates)

          if (store.isPlaying) {
            player.value!.playVideo()
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            store.play()

            const duration = player.value?.getDuration() ?? 0
            if (duration > 0) {
              store.setDuration(duration)
            }

            store.isSeeking = false
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
    if (!player.value) return
    player.value.seekTo(time, true)
    player.value.playVideo()
  }

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
