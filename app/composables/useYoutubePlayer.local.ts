export function useYoutubePlayerLocal(videoId: Ref<string | null>) {
  const player = ref<YT.Player | null>(null)
  const isReady = ref(false)
  const isPlaying = ref(false)

  /* ---------------- YouTube API 載入 ---------------- */

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

  /* ---------------- 建立 Player ---------------- */

  async function createPlayer(elementId: string | HTMLElement) {
    if (!import.meta.client) return
    if (!videoId.value) return
    if (player.value) return

    await loadYoutubeAPI()

    player.value = new YT.Player(elementId, {
      videoId: videoId.value,
      playerVars: {
        autoplay: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          isReady.value = true
        },
      },
    })
  }

  /* ---------------- 基本控制 ---------------- */

  function play() {
    isPlaying.value = true
    player.value?.playVideo()
  }

  function pause() {
    isPlaying.value = false
    player.value?.pauseVideo()
  }

  /* ---------------- 時間 ---------------- */

  function seekTo(seconds: number, allowSeekAhead = true) {
    isPlaying.value = true
    player.value?.seekTo(seconds, allowSeekAhead)
  }

  function getCurrentTime() {
    return player.value?.getCurrentTime() ?? 0
  }

  /* ---------------- 播放速度 ---------------- */

  function setPlaybackRate(rate: number) {
    player.value?.setPlaybackRate(rate)
  }

  function getPlaybackRate() {
    return player.value?.getPlaybackRate() ?? 1
  }

  function getAvailablePlaybackRates(): number[] {
    return player.value?.getAvailablePlaybackRates() ?? []
  }

  /* ---------------- 換影片 ---------------- */

  function loadVideoById(id: string, startSeconds = 0) {
    clearSegmentTimer()

    player.value?.loadVideoById(id, startSeconds)
  }

  let segmentTimer: number | null = null

  function clearSegmentTimer() {
    if (segmentTimer) {
      clearInterval(segmentTimer)
      segmentTimer = null
    }
  }

  /** 播放某段時間區間（歌詞逐句播放用） */
  function playSegment(start: number, end: number) {
    if (!player.value || !isReady.value) return
    if (start >= end) return

    clearSegmentTimer()

    seekTo(start, true)
    play()

    segmentTimer = window.setInterval(() => {
      const current = player.value?.getCurrentTime() ?? 0

      if (current >= end) {
        pause()
        clearSegmentTimer()
      }
    }, 100)
  }

  function destroy() {
    clearSegmentTimer()
    player.value?.destroy()
    player.value = null
    isReady.value = false
  }

  function switchIsPlaying(boo: boolean) {
    isPlaying.value = boo
  }

  return {
    // state
    player,
    isReady,
    isPlaying,

    // lifecycle
    createPlayer,
    destroy,

    // playback
    play,
    pause,
    switchIsPlaying, // local

    // time
    seekTo,
    getCurrentTime,

    // rate
    setPlaybackRate,
    getPlaybackRate,
    getAvailablePlaybackRates,

    // source
    loadVideoById,

    // jump to segment
    playSegment,
  }
}
