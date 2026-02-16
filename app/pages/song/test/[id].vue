<script setup lang="ts">
import SelectLyrics from '~/components/test/SelectLyrics.vue'
import SelectTestType from '~/components/test/SelectTestType.vue'
import { useCheckComfirm } from '~/composables/useCheckComfirm'
import type { SongData, LyricData } from '~/types/song'

// definePageMeta({
//   layout: 'test',
// })

const store = usePlayerStore()

const route = useRoute()

const router = useRouter()

const videoId = computed(() => route.params.id as string)

store.setMode('test')
store.setTestVideoId(videoId.value)
store.setPlaybackRate(1)

// 該歌詞
const { data: currentSong, pending } = await useFetch<SongData | null>(
  `/api/song/${videoId.value}`,
)

// 目前在第幾步驟
const step = ref<1 | 2 | 3 | 4>(1)

// 想要考試的index
const selectedLyricsIndex = reactive({
  start: -1,
  end: -1,
})

// 選擇的題型
const selectedQuizType = ref<'partial' | 'allBlank'>('partial')

// 使用者的答案
const userAnswers = ref<{ cAnswer: string; uAnswer: string }[]>([])

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

const setSpeed = (speed: number) => {
  const startIndex = selectedLyricsIndex.start
  if (currentSong.value && startIndex >= 0) {
    store.setPlaybackRate(speed)
    store.playSegmentRequest(
      currentSong.value?.lyrics[selectedLyricsIndex.start]?.start ?? 0,
      currentSong.value?.lyrics[selectedLyricsIndex.end]?.end ?? 0,
    )
  }
}

const handlePlay = (boo: boolean) => {
  if (boo) {
    store.play()
  } else {
    store.pause()
  }
}

// ===== 頁面控制邏輯 =====
const { isModalOpen, title, content, open, confirm, cancel } = useCheckComfirm()

const nextStep = () => {
  if (step.value === 4) {
    router.push('/')

    return
  }
  step.value++
}

const nextLabel = computed(() => {
  if (step.value === 2) return '開始考試'
  if (step.value === 4) return '回首頁'
  return '下一步'
})

const prevStep = async () => {
  if (step.value > 1) {
    if (step.value === 3) {
      const check = await open(
        '確認返回?',
        '返回上一步將會遺失目前輸入的內容。',
      )

      if (!check) return
    }
    step.value--
  }
}

const canNext = computed(() => {
  if (step.value === 1)
    return selectedLyricsIndex.start !== -1 && selectedLyricsIndex.end !== -1
  if (step.value === 2) return true
  if (step.value === 3)
    return userAnswers.value.length === selectedLyrics.value.length
  return true
})

watch(step, (newStep) => {
  if (newStep === 2) {
    store.playSegmentRequest(
      currentSong.value?.lyrics[selectedLyricsIndex.start]?.start ?? 0,
      currentSong.value?.lyrics[selectedLyricsIndex.end]?.end ?? 0,
    )
    store.seekToRequest(seekTime.value ?? 0)
  } else if (newStep === 4) {
    store.setPlaybackRate(1)
  } else {
    store.isPlaying = false
  }
})

onUnmounted(() => {
  store.setMode('normal')
})
</script>

<template>
  <div class="my-6 w-full px-4 md:max-w-[1280px] lg:space-y-0 lg:px-5 xl:px-0">
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
      :is-playing="store.isPlaying"
      :step="step"
      @set-speed="(speed) => setSpeed(speed)"
      @set-playing="(boo) => handlePlay(boo)"
      @set-quize-type="(str) => (selectedQuizType = str)"
    />

    <!-- 第三步驟 開始考試 -->
    <TestTesting
      v-if="currentSong && step === 3"
      :current-song="currentSong"
      :test-lyrics="selectedLyrics"
      :is-playing="store.isPlaying"
      :selected-quiz-type="selectedQuizType"
      @play-segment="
        (e: { start: number; end: number }) =>
          store.playSegmentRequest(e.start, e.end)
      "
      @set-answers="(ans) => (userAnswers = ans)"
    />

    <!-- 第四步驟 複習 -->
    <TestReview
      v-if="currentSong && step === 4"
      :user-answers="userAnswers"
      :test-lyrics="selectedLyrics"
      @play-segment="
        (e: { start: number; end: number }) =>
          store.playSegmentRequest(e.start, e.end)
      "
    />

    <!-- 上／下一步 -->
    <TestControlProgressButton
      :can-prev="step > 1 && step < 4"
      :can-next="canNext"
      :next-label="nextLabel"
      @prev="prevStep"
      @next="nextStep"
    />

    <DailogModal
      :open="isModalOpen"
      :title="title"
      :content="content"
      @confirm="confirm"
      @close="cancel"
    />
  </div>
</template>
