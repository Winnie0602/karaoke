export function useYoutubePlayer() {
  const store = usePlayerStore()
  const player = ref<YT.Player | null>(null)
  const isPlayerReady = ref(false)

  let rafId: number | null = null

  const activeId = computed(() =>
    store.storeMode === 'test' ? store.test_videoId : store.videoId,
  )

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

  watch(
    activeId,
    (newId, oldId) => {
      if (!import.meta.client || !newId) return

      if (!player.value) {
        // 第一次建立實體
        createPlayer('player')
      } else {
        if (store.storeMode === 'normal' && !store.videoId && player.value) {
          // 一般模式沒歌 把考試的歌停掉並清空畫面
          player.value.stopVideo()

          return
        }

        const isSameVideo = newId === oldId

        let targetTime = 0

        // 如果是同一首歌就用之前的currenttime 不是則從頭開始
        if (store.storeMode === 'normal' && isSameVideo) {
          targetTime = store.currentTime
        }
        player.value.loadVideoById(newId, targetTime)
      }
    },
    { immediate: true },
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
    if (!store.test_videoId && !store.videoId) return
    isPlayerReady.value = false

    if (!activeId.value) return

    await loadYoutubeAPI()

    player.value = new YT.Player(elementId, {
      videoId: activeId.value,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: () => {
          isPlayerReady.value = true
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
              statusMessage: 'Oops! Something wrong!',
            })
          }
        },
      },
    })
  }

  // 對外控制方法
  function play() {
    if (isPlayerReady.value) player.value?.playVideo()
  }

  function pause() {
    if (isPlayerReady.value) player.value?.pauseVideo()
  }

  // 跳到該片段(無結束點)
  function seekTo(time: number) {
    if (!player.value || !isPlayerReady.value) return
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
    if (!player.value || !isPlayerReady.value) return
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
    destroy,
    play,
    pause,
    seekTo,
  }
}
