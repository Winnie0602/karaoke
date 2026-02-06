<script setup lang="ts">
import SelectLyrics from '~/components/test/SelectLyrics.vue'
import SelectTestType from '~/components/test/SelectTestType.vue'
import type { SongData, LyricData } from '~/types/song'

definePageMeta({
  layout: 'test',
})

const route = useRoute()

const videoId = computed(() => route.params.id as string)

// 該歌詞
const { data: currentSong, pending } = await useFetch<SongData | null>(
  `/api/song/${videoId.value}`,
)

const {
  createPlayer,
  play,
  pause,
  seekTo,
  setPlaybackRate,
  playSegment,
  isPlaying,
  switchIsPlaying,
} = useYoutubePlayerLocal(videoId)

// 目前在第幾步驟
const step = ref<1 | 2 | 3 | 4>(1)

// 想要考試的index
const selectedLyricsIndex = reactive({
  start: -1,
  end: -1,
})

// 選擇的題型
const selectedQuizType = ref<'partial' | 'allBlank' | 'organize'>('partial')

// 挖空比例
const blankPercentage = ref(100)

// 使用者的答案
const userAnswers = ref<string[]>([])

// 想要考試的資料陣列
const selectedLyrics = computed<LyricData[]>(() => {
  const start = selectedLyricsIndex.start ?? 0
  const end = selectedLyricsIndex.end ?? 0

  return (
    currentSong.value?.lyrics.filter((_, i) => i >= start && i <= end) ?? []
  )
})

const seekTime = computed(() => {
  if (selectedLyricsIndex.start !== -1) {
    return currentSong.value?.lyrics[selectedLyricsIndex.start]?.start
  } else {
    return 0
  }
})

const nextStep = () => {
  if (step.value < 4) step.value++
}

const prevStep = () => {
  if (step.value > 1) step.value--
}

const canNext = computed(() => {
  if (step.value === 1)
    return selectedLyricsIndex.start !== -1 && selectedLyricsIndex.end !== -1
  if (step.value === 2) return true
  if (step.value === 3)
    return userAnswers.value.length === selectedLyrics.value.length
  return true
})

const setSpeed = (speed: number) => {
  const startIndex = selectedLyricsIndex.start
  if (currentSong.value && startIndex >= 0) {
    setPlaybackRate(speed)

    playSegment(
      currentSong.value?.lyrics[selectedLyricsIndex.start]?.start ?? 0,
      currentSong.value?.lyrics[selectedLyricsIndex.end]?.end ?? 0,
    )
  }
}

watch(isPlaying, (isPlaying) => {
  if (isPlaying) {
    play()
  } else {
    pause()
  }
})

watch(step, (newStep) => {
  if (newStep === 2) {
    playSegment(
      currentSong.value?.lyrics[selectedLyricsIndex.start]?.start ?? 0,
      currentSong.value?.lyrics[selectedLyricsIndex.end]?.end ?? 0,
    )
    seekTo(seekTime.value ?? 0)
  } else {
    switchIsPlaying(false)
  }
})

onMounted(async () => {
  await createPlayer('yt-player')
})

onUnmounted(() => {})
</script>

<template>
  <div class="">
    <div class="mt-4 mb-5">
      <TestStepProgress :step="step" />
    </div>
    <!-- 第一步驟 選取歌詞 -->
    <SelectLyrics
      v-if="currentSong && step === 1"
      :current-song="currentSong"
      :selected="selectedLyricsIndex"
      @update="
        (payload: { start: number; end: number }) => {
          selectedLyricsIndex.start = payload.start
          selectedLyricsIndex.end = payload.end
        }
      "
    />
    <!-- 第二步驟 選取速度／形式 -->
    <SelectTestType
      v-if="currentSong && step === 2"
      :current-song="currentSong"
      :selected="selectedLyricsIndex"
      :is-playing="isPlaying"
      :step="step"
      @set-speed="(speed) => setSpeed(speed)"
      @set-playing="(boo) => switchIsPlaying(boo)"
      @set-quize-type="(str) => (selectedQuizType = str)"
    />

    <!-- 第三步驟 開始考試 -->
    <TestTesting
      v-if="currentSong && step === 3"
      :current-song="currentSong"
      :test-lyrics="selectedLyrics"
      :is-playing="isPlaying"
      :selected-quiz-type="selectedQuizType"
      @play-segment="(e) => playSegment(e.start, e.end)"
      @set-answers="(ans) => (userAnswers = ans)"
    />

    <!-- 上／下一步 -->
    <TestControlProgressButton
      :can-prev="step > 1"
      :can-next="canNext"
      :next-label="step === 2 ? '開始考試' : '下一步'"
      @prev="prevStep"
      @next="nextStep"
    />

    <!-- Youtube實體 -->
    <div id="yt-player" class="hidden" />
  </div>
</template>
