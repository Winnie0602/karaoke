export function useYoutubePlayer(videoId: Ref<string | null>) {
  const store = usePlayerStore()
  const player = ref<YT.Player | null>(null)

  let rafId: number | null = null

  // YouTube API 載入
  function loadYoutubeAPI(): Promise<void> {
    return new Promise((resolve) => {
      if (!import.meta.client) return resolve()

      // 如果已經載入完成，直接 resolve
      if (window.YT && window.YT.Player) {
        resolve()
        return
      }

      const tag = document.createElement('script')
      tag.id = 'youtube-sdk'
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

      const time = player.value?.getCurrentTime() ?? 0

      if (Math.abs(time - store.currentTime) > 0.1) {
        store.setTime(time)
      }

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

  function setPlaybackRate(rate: number) {
    player.value?.setPlaybackRate(rate)
  }

  function setTestPlaybackRate(rate: number) {
    player.value?.setPlaybackRate(rate)
  }

  //  換歌（不重建 player）
  watch(videoId, (id) => {
    if (!player.value || !id) return

    player.value.loadVideoById(id, 0)
  })

  // 更換模式時
  watch(
    () => store.storeMode,
    (mode) => {
      if (!player.value) return

      // 一般頁面
      if (mode === 'normal' && videoId.value) {
        console.log(3)

        player.value.loadVideoById(videoId.value, store.currentTime)
        player.value.setVolume(store.volume)
        // 考試頁面
      } else if (mode === 'test' && store.test_videoId) {
        player.value.cueVideoById(store.test_videoId, 0)
        setTimeout(() => player.value?.setVolume(100), 500)
      } else if (mode === 'admin') {
        console.log(123)
        setTimeout(() => player.value?.stopVideo())
      }
    },
  )

  // state的速度變數改變時，call youtube API改變速度
  watch(
    () => store.finalPlaybackRate,
    (rate) => {
      if (!player.value) return

      const current = player.value.getPlaybackRate()

      if (current !== rate) {
        player.value.setPlaybackRate(rate)
      }
    },
    { immediate: true },
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

  // 歌詞被點 -> 影片跳到該行
  watch(
    () => store.seekToTime,
    (time) => {
      if (time == null) return
      seekTo(time)
      store.seekToTime = null
    },
  )

  // 建立播放器
  async function createPlayer(elementId: string) {
    if (!import.meta.client) return
    if (player.value) return
    if (!videoId.value) return

    const initialId =
      store.storeMode === 'test'
        ? store.test_videoId || videoId.value
        : videoId.value

    if (!initialId) return

    await loadYoutubeAPI()

    player.value = new YT.Player(elementId, {
      videoId: initialId,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: () => {
          store.setDuration(player.value!.getDuration())

          if (store.currentTime > 0) {
            player.value!.seekTo(store.currentTime, true)
          }
          // 取得可用影片速度
          const rates = player.value!.getAvailablePlaybackRates()
          store.setAvailableRates(rates)

          if (store.finalPlaybackRate !== 1) {
            player.value?.setPlaybackRate(store.finalPlaybackRate)
          }

          // 音量設定
          if (store.volume !== 100) {
            player.value?.setVolume(store.volume)
          }

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
        onError: (event) => {
          console.error('YT Error', event.data)

          if ([100, 101, 150, 2, 5].includes(event.data)) {
            showError({
              statusCode: 404,
              statusMessage: '影片不存在或無法播放',
            })
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

  // 跳到該片段(無結束點)
  function seekTo(time: number) {
    if (!player.value) return
    player.value.seekTo(time, true)
    player.value.playVideo()
  }

  function destroy() {
    clearSegmentTimer()
    player.value?.destroy()
    player.value = null
  }

  let segmentTimer: number | null = null

  function clearSegmentTimer() {
    if (segmentTimer) {
      clearInterval(segmentTimer)
      segmentTimer = null
    }
  }

  watch(
    () => store.segmentRequest,
    (seg) => {
      if (!seg) return
      playSegment(seg.start, seg.end)
    },
  )

  /** 播放某段時間區間（歌詞逐句播放用） */
  function playSegment(start: number, end: number) {
    if (!player.value) return
    if (start >= end) return

    clearSegmentTimer()

    seekTo(start)
    play()

    segmentTimer = window.setInterval(() => {
      const current = player.value?.getCurrentTime() ?? 0

      if (current >= end) {
        pause()
        clearSegmentTimer()
      }
    }, 100)
  }

  return {
    // state
    player,

    // methods
    createPlayer,
    destroy,
    play,
    pause,
    seekTo,
    playSegment,
    setPlaybackRate,
    setTestPlaybackRate,
  }
}
