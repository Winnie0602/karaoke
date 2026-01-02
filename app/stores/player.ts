export const usePlayerStore = defineStore(
  'player',
  () => {
    const videoId = ref<string | null>(null)
    const currentTime = ref(0)
    const duration = ref(0)
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
      currentTime.value = time
    }

    function setDuration(time: number) {
      duration.value = time
    }

    function setSongInfo(title: string, artist: string) {
      songTitle.value = title
      songArtist.value = artist
    }

    function setPlaybackRate(rate: number) {
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
      seekToTime.value = time
    }

    return {
      // state
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
      toggleMute
    }
  },
  {
    persist: {
      pick: [
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
