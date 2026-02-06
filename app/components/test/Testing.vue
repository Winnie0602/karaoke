<script setup lang="ts">
import type TypingJa from '~/components/test/card/TypingJa.vue'
import type { SongData, LyricData } from '~/types/song'

const { currentSong, testLyrics, isPlaying, selectedQuizType } = defineProps<{
  currentSong: SongData
  testLyrics: LyricData[]
  isPlaying: boolean
  selectedQuizType: 'partial' | 'allBlank' | 'organize'
}>()

const emit = defineEmits<{
  (e: 'playSegment', value: { start: number; end: number }): void
  (e: 'setAnswers', value: string[]): void
}>()

// 現在在寫第幾個題目
const nowIndex = ref(0)

const userAnswers = ref<string[]>([])

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

const setAnswers = (ans: string, index: number) => {
  userAnswers.value[index] = ans

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
  <div
    class="hide-scroll flex h-[calc(100vh-60px-32px-65px-35px)] flex-col overflow-y-scroll rounded-md border-[1px] border-[#B58C8C]/40 bg-white shadow-sm md:block md:h-[calc(100vh-60px-32px-65px-60px)]"
  >
    <!-- 標題列 -->
    <div
      class="sticky top-0 z-20 flex h-[30px] items-center bg-[#B58C8C]/40 pl-3 md:h-[40px]"
    >
      <div class="flex items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
        <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="h-3 w-3 rounded-full bg-[#28C840]"></div>
        <div class="ml-2 text-[12px] font-medium tracking-wide text-stone-500">
          {{ currentSong?.title || '未選擇歌曲' }}
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <div
        class="hide-scroll flex flex-col items-center overflow-y-scroll bg-white px-3 py-3 md:items-start md:px-6 md:py-6"
      >
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
            :selected-quiz-type="selectedQuizType"
            @next-test="nowIndex = i + 1"
            @set-answer="(ans) => setAnswers(ans, i)"
          />

          <!-- <TestCardTypingEn
            v-if="currentSong.language === 'en'"
            ref="cardRefs"
            :each-lyric="eachLyric"
            :is-now-card="i === nowIndex"
            :life="life"
            @next-test="nowIndex = i + 1"
            @set-answer="(ans) => setAnswers(ans, i)"
          /> -->
        </div>

        <!-- <template v-if="isFakeKeyboard">
        <TestKeyboardJa
          v-if="lang === 'ja'"
          @input="(char) => onKeyboardInput(char)"
          @delete="userInput = userInput.slice(0, -1)"
        />
        <TestKeyboardKr
          v-if="lang === 'kr'"
          @input="(char) => onKeyboardInput(char)"
        />
      </template> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scroll::-webkit-scrollbar {
  display: none;
}

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

.animate-shake {
  animation: shake 0.4s ease;
}
</style>
