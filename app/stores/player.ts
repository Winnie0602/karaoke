export const usePlayerStore = defineStore(
  'player',
  () => {
    const storeMode = ref<'test' | 'normal'>('normal')
    const testVideoId = ref<string | null>(null) // 考試頁面音樂
    const videoId = ref<string | null>(null) // 一般頁面音樂
    const currentTime = ref(0) // 一般
    const duration = ref(0) // 一般
    const isPlaying = ref(false)
    const playbackRate = ref(1) // 影片播放速度
    const availableRates = ref<number[]>([]) //可用的播放速度

    const volume = ref(100)
    const lastVolume = ref(100) // 靜音前的音量
    const isMuted = computed(() => volume.value === 0)

    const seekToTime = ref<number | null>(null) // 由影片組件監聽，有變動的話影片跳到該段落
    const isSeeking = ref(false) //拖拉bar是否在把拖拉

    const songTitle = ref('')
    const songArtist = ref('')

    function setMode(mode: 'test' | 'normal') {
      storeMode.value = mode
    }

    function setTestVideoId(id: string) {
      testVideoId.value = id
    }

    function loadVideo(id: string, time = 0) {
      videoId.value = id
      currentTime.value = time
      // isPlaying.value = true
    }

    function play() {
      isPlaying.value = true
    }

    function pause() {
      isPlaying.value = false
    }

    function setTime(time: number) {
      if (storeMode.value === 'test') return
      currentTime.value = time
    }

    function setDuration(time: number) {
      if (storeMode.value === 'test') return

      duration.value = time
    }

    function setSongInfo(title: string, artist: string) {
      if (storeMode.value === 'test') return

      songTitle.value = title
      songArtist.value = artist
    }

    function setPlaybackRate(rate: number) {
      if (storeMode.value === 'test') return

      playbackRate.value = rate
    }

    function setAvailableRates(rates: []) {
      availableRates.value = rates
    }

    function setVolume(vol: number) {
      volume.value = vol
    }

    function toggleMute() {
      if (volume.value === 0) {
        volume.value = lastVolume.value || 60
      } else {
        lastVolume.value = volume.value
        volume.value = 0
      }
    }

    // 由歌詞組件呼叫，使影片跳到該段
    function seekToRequest(time: number) {
      if (storeMode.value === 'test') return

      seekToTime.value = time
    }

    return {
      // state
      storeMode,
      testVideoId,
      videoId,
      currentTime,
      duration,
      isPlaying,
      playbackRate,
      availableRates,
      volume,
      lastVolume,
      isMuted,
      songTitle,
      songArtist,
      seekToTime,
      isSeeking,

      // actions
      setMode,
      setTestVideoId,
      loadVideo,
      play,
      pause,
      setTime,
      setDuration,
      setSongInfo,
      seekToRequest,
      setPlaybackRate,
      setAvailableRates,
      setVolume,
      toggleMute,
    }
  },
  {
    persist: {
      pick: [
        'storeMode',
        'testVideoId',
        'videoId',
        'currentTime',
        'duration',
        'isPlaying',
        'songTitle',
        'songArtist',
      ],
    },
  },
)
