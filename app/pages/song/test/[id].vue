<script setup lang="ts">
import SelectLyrics from '~/components/test/SelectLyrics.vue'
import SelectTestType from '~/components/test/SelectTestType.vue'
import type { SongData, LyricData } from '~/types/song'

const store = usePlayerStore()

const route = useRoute()

const router = useRouter()

const videoId = computed(() => route.params.id as string)

// 該歌詞
const { data: currentSong, pending } = await useFetch<SongData | null>(
  `/api/song/${videoId.value}`,
)

if (!currentSong.value && !pending.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: '找不到這首歌曲，請檢查網址是否正確。',
  })
}

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
const { open } = useCheckConfirm()

const nextStep = () => {
  if (step.value === 4) {
    router.push('/')

    return
  }
  step.value++
}

const nextLabel = computed(() => {
  if (step.value === 2) return $t('testStart')
  if (step.value === 4) return $t('goHome')
  return $t('prev')
})

const prevStep = async () => {
  if (step.value > 1) {
    if (step.value === 3) {
      const check = await open(
        $t('confirm_back_title'),
        $t('confirm_back_message'),
        'ask',
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
</script>

<template>
  <div class="flex h-full w-full flex-col p-4 md:max-w-[1280px] md:p-6">
    <div class="flex-none pb-4">
      <TestStepProgress :step="step" />
    </div>

    <div v-if="pending" class="flex w-full justify-center text-2xl">
      pending...
    </div>

    <div
      v-else
      class="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#B58C8C]/40 bg-white shadow-sm"
    >
      <div class="flex h-10 flex-none items-center bg-[#B58C8C]/40 px-4">
        <div class="flex items-center space-x-1.5">
          <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
          <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="h-3 w-3 rounded-full bg-[#28C840]"></div>
          <div
            class="ml-2 text-[12px] font-medium tracking-wide text-stone-500"
          >
            {{ currentSong?.title || '未選擇歌曲' }}
          </div>
        </div>
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
        :lang="currentSong.language"
        @play-segment="
          (e: { start: number; end: number }) =>
            store.playSegmentRequest(e.start, e.end)
        "
      />
    </div>

    <!-- 上／下一步 -->
    <TestControlProgressButton
      :can-prev="step > 1 && step < 4"
      :can-next="canNext"
      :next-label="nextLabel"
      @prev="prevStep"
      @next="nextStep"
    />
  </div>
</template>

<style lang="postcss" scoped>
.hide-scroll::-webkit-scrollbar {
  display: none;
}

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
