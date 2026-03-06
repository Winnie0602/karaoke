<script setup lang="ts">
import type { LyricData } from '~/types/song'

const { userAnswers, testLyrics } = defineProps<{
  userAnswers: { cAnswer: string; uAnswer: string }[]
  testLyrics: LyricData[]
}>()

const emit = defineEmits<{
  (e: 'playSegment', value: { start: number; end: number }): void
}>()

const diffCharIndexArr = computed(() =>
  userAnswers.map((e) => {
    const cAnswerArr = Array.from(e.cAnswer)
    const uAnswerArr = Array.from(e.uAnswer)

    return cAnswerArr.reduce<number[]>((acc, char, idx) => {
      if (char !== uAnswerArr[idx]) acc.push(idx)
      return acc
    }, [])
  }),
)

const wordWithComparison = (lyric: LyricData, answerIndex: number) => {
  const wrongIndexes = diffCharIndexArr.value[answerIndex] ?? []

  const wordArr = lyric.ja ?? lyric.en ?? []
  if (!wordArr.length) return []

  let pointer = 0

  return wordArr.map((item, i) => {
    const len = item.reading?.length ?? item.surface.length

    const start = pointer
    const end = pointer + len

    const isWrong = wrongIndexes.some((idx) => idx >= start && idx < end)

    pointer = end

    // 如果是英文 且不是最後一個字 要加一個空白 pointer
    if (lyric.en && i !== wordArr.length - 1) {
      pointer += 1
    }

    return { ...item, isWrong }
  })
}
</script>

<template>
  <div class="flex flex-col items-center p-4 md:p-10">
    <div class="w-full max-w-5xl space-y-12">
      <div
        v-for="(lyric, index) in testLyrics"
        :key="index"
        class="group relative border-b border-[#B58C8C]/20 pb-12 last:border-0"
      >
        <button
          class="absolute top-10 -left-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE5E5] text-[#F9595F] transition-all hover:bg-[#F9595F] hover:text-white active:scale-90 md:h-12 md:w-12"
          @click="emit('playSegment', { start: lyric.start, end: lyric.end })"
        >
          <i class="fa-solid fa-play ml-0.5 text-xs"></i>
        </button>

        <div v-if="userAnswers[index]" class="pl-12 md:pl-16">
          <div class="flex flex-wrap items-end gap-x-3 gap-y-5 md:gap-x-5">
            <!-- <div
              v-for="(word, wIdx) in wordWithComparison(lyric, index)"
              :key="wIdx"
              class="flex flex-col items-center"
            >
              <span class="text-[10px] font-medium text-[#A66B6B] md:text-xs">
                {{ word.reading || '' }}
              </span>
              <span
                class="text-2xl font-black md:text-4xl"
                :class="word.isWrong ? 'text-[#F9595F]' : 'text-[#7A3A3A]'"
              >
                {{ word.surface }}
              </span>
            </div> -->
          </div>

          <p class="mt-4 text-sm font-bold text-[#A66B6B] md:text-lg">
            {{ lyric.zh }}
          </p>

          <div class="mt-6 space-y-2 rounded-lg bg-[#FFE5E5]/20 p-4 md:p-6">
            <div class="flex items-center space-x-4">
              <span class="w-12 shrink-0 text-[10px] font-black text-[#B58C8C]">
                正解
              </span>
              <div class="flex flex-wrap gap-x-0.5 text-base md:text-xl">
                {{ userAnswers[index]?.cAnswer }}
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <span class="w-12 shrink-0 text-[10px] font-black text-[#F9595F]">
                回答
              </span>
              <div class="flex flex-wrap gap-x-0.5">
                <span
                  v-for="(uAns, i) in userAnswers[index].uAnswer"
                  :key="i"
                  class="text-base font-black whitespace-pre md:text-xl"
                  :class="
                    uAns !== userAnswers[index].cAnswer[i]
                      ? 'text-[#F9595F] underline underline-offset-4'
                      : 'text-[#7A3A3A]/40'
                  "
                >
                  {{ uAns }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="h-10"></div>
    </div>
  </div>
</template>

<style scoped>
/* 隱藏捲軸但保留捲動功能 */
.hide-scroll::-webkit-scrollbar {
  display: none;
}
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 針對行動裝置優化 */
@media (max-width: 768px) {
  .tracking-tighter {
    letter-spacing: -0.02em;
  }
}
</style>
