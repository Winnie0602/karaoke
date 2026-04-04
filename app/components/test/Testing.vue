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

  emit('playSegment', {
    start: testLyrics[index]?.start ?? 0,
    end: testLyrics[index]?.end ?? 0,
  })

  setTimeout(() => {
    emblaApi.value?.scrollTo(index)
  }, 400)
})

watch(emblaApi, (api, _prevApi, onCleanup) => {
  if (!api) {
    return
  }

  const onSelect = () => {
    nowIndex.value = api.selectedScrollSnap()
  }

  api.on('select', onSelect)

  onCleanup(() => {
    api.off('select', onSelect)
  })
})
</script>

<template>
  <div ref="emblaRef" class="embla px-5 py-6 md:px-20 md:py-10">
    <div class="embla__container space-x-1">
      <div
        v-for="(eachLyric, i) in testLyrics"
        :key="eachLyric.nanoid"
        class="group embla__slide relative flex items-center"
      >
        <button
          class="absolute left-0 z-30 -translate-x-1/2 items-center justify-center rounded-full transition-all"
          :class="[
            i === nowIndex ? 'flex' : 'hidden',
            'h-7 w-7 md:h-10 md:w-10',
            isPlaying
              ? 'cursor-not-allowed border-2 border-white bg-[#E5E5E5]'
              : 'border-2 border-transparent bg-[#FFE5E5]',
            life < 1 &&
              !isPlaying &&
              !isAllAnswered &&
              'pointer-events-none invisible',
          ]"
          :disabled="isPlaying || (!isAllAnswered && life < 1)"
          @click="handlePlay(eachLyric, i)"
        >
          <i
            class="fa-solid fa-play md:text-lg"
            :class="isPlaying ? 'text-gray-400' : 'text-[#F9595F]'"
          />
        </button>

        <!-- 填空題型 -->
        <template v-if="['partial', 'allBlank'].includes(selectedQuizType)">
          <TestCardTypingComposition
            v-if="['ja', 'zh', 'kr'].includes(currentSong.language)"
            ref="cardRefs"
            :each-lyric="eachLyric"
            :is-now-card="i === nowIndex"
            :life="life"
            :language="currentSong.language"
            :selected-quiz-type="selectedQuizType"
            :is-locked="Boolean(lockedQuestionMap[i])"
            :is-all-answered="isAllAnswered"
            @next-test="nowIndex = Math.min(i + 1, testLyrics.length - 1)"
            @set-answer="(ans) => setAnswers(ans, i)"
          />

          <TestCardTypingInput
            v-if="['en'].includes(currentSong.language)"
            ref="cardRefs"
            :each-lyric="eachLyric"
            :is-now-card="i === nowIndex"
            :life="life"
            :language="currentSong.language"
            :selected-quiz-type="selectedQuizType"
            :is-locked="Boolean(lockedQuestionMap[i])"
            :is-all-answered="isAllAnswered"
            @next-test="nowIndex = Math.min(i + 1, testLyrics.length - 1)"
            @set-answer="(ans) => setAnswers(ans, i)"
          />
        </template>

        <!-- 聽力翻譯題型 -->
        <TestCardListeningTranslation
          v-if="translationGameLang && selectedQuizType === 'translation'"
          :each-lyric="eachLyric"
          :is-now-card="i === nowIndex"
          :life="life"
          :translation-game-lang="translationGameLang"
          :all-lyrics="currentSong.lyrics"
          :is-locked="Boolean(lockedQuestionMap[i])"
          :is-all-answered="isAllAnswered"
          @next-test="nowIndex = Math.min(i + 1, testLyrics.length - 1)"
          @set-answer="(ans) => setAnswers(ans, i)"
        />
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
