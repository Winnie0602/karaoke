<script setup lang="ts">
import type TypingComposition from '~/components/test/card/TypingComposition.vue'
import type { LangCode } from '~/types/lang'
import type { SongData, LyricData } from '~/types/song'
import emblaCarouselVue from 'embla-carousel-vue'

const {
  currentSong,
  testLyrics,
  isPlaying,
  translationGameLang,
  selectedQuizType,
} = defineProps<{
  currentSong: SongData
  testLyrics: LyricData[]
  isPlaying: boolean
  translationGameLang: LangCode | null
  selectedQuizType: 'partial' | 'allBlank' | 'translation'
}>()

const emit = defineEmits<{
  (e: 'playSegment', value: { start: number; end: number }): void
  (e: 'setAnswers', value: { cAnswer: string; uAnswer: string }[]): void
}>()

const canSwiperDrag = ref(false)

const [emblaRef, emblaApi] = emblaCarouselVue({
  loop: false,
  watchDrag: () => canSwiperDrag.value,
})

// 現在在寫第幾個題目
const nowIndex = ref(0)

const userAnswers = ref<{ cAnswer: string; uAnswer: string }[]>([])

const lockedQuestionMap = ref<boolean[]>([])

const isAllAnswered = computed(
  () =>
    testLyrics.length > 0 &&
    lockedQuestionMap.value.filter((isLocked) => isLocked).length ===
      testLyrics.length,
)

// 聆聽生命蘋果 共三次機會
const life = ref<0 | 1 | 2 | 3>(3)

const cardRefs = ref<InstanceType<typeof TypingComposition>[]>([])

const playLyric = (eachLyric: LyricData) => {
  if (!isPlaying) {
    // 播放
    emit('playSegment', {
      start: eachLyric.start,
      end: eachLyric.end,
    })
    if (!isAllAnswered.value) {
      life.value--
    }
  }
}

const handlePlay = (lyric: LyricData | undefined, i: number) => {
  if (lyric) {
    playLyric(lyric)
  }

  nextTick(() => {
    cardRefs.value[i]?.focusInput()
  })
}

const setAnswers = (
  ans: { cAnswer: string; uAnswer: string },
  index: number,
) => {
  if (lockedQuestionMap.value[index]) {
    return
  }

  userAnswers.value[index] = { cAnswer: ans.cAnswer, uAnswer: ans.uAnswer }
  lockedQuestionMap.value[index] = true

  // 全部題目都填滿了後再往頁面送
  if (isAllAnswered.value) {
    emit('setAnswers', userAnswers.value)
    // 允許滑動看答案
    canSwiperDrag.value = true
  }
}

const handleNextTest = (index: number) => {
  // 只允許當前題目觸發切題，避免事件競態造成一次跳兩題
  if (index !== nowIndex.value) {
    return
  }

  nowIndex.value = Math.min(index + 1, testLyrics.length - 1)
}

watch(
  () => testLyrics,
  () => {
    userAnswers.value = []
    lockedQuestionMap.value = []
    canSwiperDrag.value = false
    nowIndex.value = 0
  },
)

// 一進來頁面就播放第一句
onMounted(() => {
  cardRefs.value[0]?.focusInput()
  emit('playSegment', {
    start: testLyrics[0]?.start ?? 0,
    end: testLyrics[0]?.end ?? 0,
  })
})

// 一換考試歌詞時就播放
watch(nowIndex, (index) => {
  // 恢復蘋果數量
  life.value = 3

  if (isAllAnswered.value) {
    return
  }

  // 用 jump 模式直接對齊 snap，避免落在兩題中間
  emblaApi.value?.scrollTo(index, true)
  emit('playSegment', {
    start: testLyrics[index]?.start ?? 0,
    end: testLyrics[index]?.end ?? 0,
  })
})

watch(emblaApi, (api, _prevApi, onCleanup) => {
  if (!api) {
    return
  }

  const onSelect = () => {
    // 考試進行中由 next-test 控制題號，避免事件互相踩到而跳題
    if (!isAllAnswered.value) {
      return
    }

    const selected = api.selectedScrollSnap()
    if (selected !== nowIndex.value) {
      nowIndex.value = selected
    }
  }

  api.on('select', onSelect)

  onCleanup(() => {
    api.off('select', onSelect)
  })
})
</script>

<template>
  <div class="py-6 md:px-20 md:py-10">
    <!-- 上方點點 -->
    <div v-if="testLyrics.length > 0" class="flex justify-center gap-2">
      <div
        v-for="(_, i) in testLyrics"
        :key="i"
        class="h-2 w-2 rounded-full transition-all duration-300"
        :class="[i === nowIndex ? 'w-4 bg-[#F9595F]' : 'bg-gray-300']"
      />
    </div>
    <div ref="emblaRef" class="embla md:pt-6">
      <div class="embla__container">
        <div
          v-for="(eachLyric, i) in testLyrics"
          :key="eachLyric.nanoid"
          class="group embla__slide relative flex items-center"
        >
          <!-- 填空題型 -->
          <template v-if="['partial', 'allBlank'].includes(selectedQuizType)">
            <TestCardTypingComposition
              v-if="['ja', 'zh', 'kr'].includes(currentSong.language)"
              ref="cardRefs"
              :each-lyric="eachLyric"
              :is-now-card="i === nowIndex"
              :language="currentSong.language"
              :selected-quiz-type="selectedQuizType"
              :is-locked="Boolean(lockedQuestionMap[i])"
              :is-all-answered="isAllAnswered"
              @next-test="handleNextTest(i)"
              @set-answer="(ans) => setAnswers(ans, i)"
            />

            <TestCardTypingInput
              v-if="['en'].includes(currentSong.language)"
              ref="cardRefs"
              :each-lyric="eachLyric"
              :is-now-card="i === nowIndex"
              :language="currentSong.language"
              :selected-quiz-type="selectedQuizType"
              :is-locked="Boolean(lockedQuestionMap[i])"
              :is-all-answered="isAllAnswered"
              @next-test="handleNextTest(i)"
              @set-answer="(ans) => setAnswers(ans, i)"
            />
          </template>

          <!-- 聽力翻譯題型 -->
          <TestCardListeningTranslation
            v-if="translationGameLang && selectedQuizType === 'translation'"
            :each-lyric="eachLyric"
            :is-now-card="i === nowIndex"
            :translation-game-lang="translationGameLang"
            :all-lyrics="currentSong.lyrics"
            :is-locked="Boolean(lockedQuestionMap[i])"
            :is-all-answered="isAllAnswered"
            @next-test="handleNextTest(i)"
            @set-answer="(ans) => setAnswers(ans, i)"
          />
        </div>
      </div>
    </div>

    <div class="mt-4 flex justify-center px-4 md:mt-8">
      <div
        class="flex w-full max-w-xl items-center justify-between rounded-3xl bg-[#FFF5F5] p-4 md:p-5"
        :class="{ 'opacity-60': isAllAnswered }"
      >
        <div class="flex flex-1 flex-col items-start">
          <span
            class="text-[10px] font-bold tracking-widest text-gray-400 uppercase md:text-xs"
          >
            {{ $t('listening_life') }}
          </span>
          <div class="mt-1 flex gap-1">
            <i
              v-for="n in 3"
              :key="n"
              class="fa-solid fa-apple-whole text-sm transition-colors duration-300"
              :class="n <= life ? 'text-[#F9595F]' : 'text-gray-200'"
            />
          </div>
        </div>

        <div class="relative px-4">
          <button
            class="group flex h-14 w-14 items-center justify-center rounded-full transition-all active:scale-90 md:h-16 md:w-16"
            :class="[
              isPlaying || (!isAllAnswered && life < 1)
                ? 'cursor-not-allowed bg-gray-100'
                : 'bg-[#FFE5E5] shadow-md shadow-red-100 hover:bg-[#ffd9d9]',
            ]"
            :disabled="isPlaying || (!isAllAnswered && life < 1)"
            @click="handlePlay(testLyrics[nowIndex], nowIndex)"
          >
            <i
              class="fa-solid fa-play text-xl transition-transform group-hover:scale-110 md:text-2xl"
              :class="isPlaying ? 'text-gray-300' : 'text-[#F9595F]'"
            />
          </button>
        </div>

        <div class="flex flex-1 flex-col items-end">
          <span
            class="text-[10px] font-bold tracking-widest text-gray-400 uppercase md:text-xs"
          >
            {{ $t('test_progress') }}
          </span>
          <div class="mt-1 flex items-baseline gap-1">
            <span class="text-lg font-bold text-gray-700 md:text-xl">
              {{ nowIndex + 1 }}
            </span>
            <span class="text-xs font-medium text-gray-400">
              / {{ testLyrics.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.embla {
  overflow: hidden;
}
.embla__container {
  display: flex;
}
.embla__slide {
  @apply min-w-0 flex-[0_0_98%];
  margin-left: 4px;
}
</style>
