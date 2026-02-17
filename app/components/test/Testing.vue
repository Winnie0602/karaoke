<script setup lang="ts">
import type TypingJa from '~/components/test/card/TypingJa.vue'
import type { SongData, LyricData } from '~/types/song'

const { currentSong, testLyrics, isPlaying, selectedQuizType } = defineProps<{
  currentSong: SongData
  testLyrics: LyricData[]
  isPlaying: boolean
  selectedQuizType: 'partial' | 'allBlank'
}>()

const emit = defineEmits<{
  (e: 'playSegment', value: { start: number; end: number }): void
  (e: 'setAnswers', value: { cAnswer: string; uAnswer: string }[]): void
}>()

// 現在在寫第幾個題目
const nowIndex = ref(0)

const userAnswers = ref<{ cAnswer: string; uAnswer: string }[]>([])

// 聆聽生命蘋果 共三次機會
const life = ref<0 | 1 | 2 | 3>(3)

const cardRefs = ref<InstanceType<typeof TypingJa>[]>([])

const playLyric = (eachLyric: LyricData) => {
  if (!isPlaying) {
    // 播放
    emit('playSegment', {
      start: eachLyric.start,
      end: eachLyric.end,
    })
    life.value--
  } else {
    console.log('stop')
  }
}

const handlePlay = (lyric: LyricData, i: number) => {
  playLyric(lyric)

  nextTick(() => {
    cardRefs.value[i]?.focusInput()
  })
}

const setAnswers = (
  ans: { cAnswer: string; uAnswer: string },
  index: number,
) => {
  userAnswers.value[index] = { cAnswer: ans.cAnswer, uAnswer: ans.uAnswer }

  // 全部題目都填滿了後再往頁面送
  if (userAnswers.value.length === testLyrics.length) {
    emit('setAnswers', userAnswers.value)
  }
}

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

  emit('playSegment', {
    start: testLyrics[index]?.start ?? 0,
    end: testLyrics[index]?.end ?? 0,
  })
})
</script>

<template>
  <div class="space-y-4 px-5 py-6 md:px-20 md:py-10">
    <div
      v-for="(eachLyric, i) in testLyrics"
      :key="eachLyric.start"
      class="flex items-center space-y-3 md:space-y-5"
    >
      <button
        class="relative mr-3 h-8 w-8 items-center justify-center rounded-full transition-all"
        :class="[
          i === nowIndex ? 'hidden md:flex' : 'hidden',
          isPlaying
            ? 'cursor-not-allowed bg-[#FFE5E5]/50 opacity-60'
            : 'bg-[#FFE5E5] shadow-sm hover:scale-105',
          life < 1 && !isPlaying && 'pointer-events-none invisible',
        ]"
        :disabled="isPlaying || life < 1"
        @click="handlePlay(eachLyric, i)"
      >
        <i
          class="fa-solid fa-play md:text-lg"
          :class="isPlaying ? 'text-gray-400' : 'text-[#F9595F]'"
        />
      </button>

      <TestCardTypingJa
        v-if="currentSong.language === 'ja'"
        ref="cardRefs"
        :each-lyric="eachLyric"
        :is-now-card="i === nowIndex"
        :life="life"
        :language="currentSong.language"
        :selected-quiz-type="selectedQuizType"
        @next-test="nowIndex = i + 1"
        @set-answer="(ans) => setAnswers(ans, i)"
      />

      <TestCardTypingEn
        v-if="currentSong.language === 'en'"
        ref="cardRefs"
        :each-lyric="eachLyric"
        :is-now-card="i === nowIndex"
        :life="life"
        :language="currentSong.language"
        :selected-quiz-type="selectedQuizType"
        @next-test="nowIndex = i + 1"
        @set-answer="(ans) => setAnswers(ans, i)"
      />
    </div>
  </div>
</template>
