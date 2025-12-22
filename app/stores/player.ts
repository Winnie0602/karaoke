export const usePlayerStore = defineStore(
  'player',
  () => {
    const videoId = ref<string | null>(null)
    const currentTime = ref(0)
    const duration = ref(0)
    const isPlaying = ref(false)
    const playbackRate = ref(1)
    const volume = ref(100)
    const player = ref<YT.Player | null>(null)
    const songTitle = ref('')
    const songArtist = ref('')

    function loadVideo(id: string, time = 0) {
      videoId.value = id
      currentTime.value = time
      // isPlaying.value = true
    }

    function setPlayer(p: YT.Player) {
      player.value = p
    }

    function seekTo(time: number) {
      if (!player.value) return
      player.value.seekTo(time, true)
      player.value.playVideo()
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

    return {
      // state
      videoId,
      currentTime,
      duration,
      isPlaying,
      playbackRate,
      volume,
      player,
      songTitle,
      songArtist,

      // actions
      loadVideo,
      play,
      pause,
      setTime,
      setDuration,
      setPlayer,
      seekTo,
      setSongInfo,
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
