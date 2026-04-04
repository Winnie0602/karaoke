<script lang="ts" setup>
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const { eachLyric, isNowCard, life, translationGameLang, allLyrics, isLocked } =
  defineProps<{
    eachLyric: LyricData // 正確答案
    isNowCard: boolean
    life: 0 | 1 | 2 | 3
    translationGameLang: LangCode // 顯示翻譯答案的語言
    allLyrics: LyricData[] // 其他句歌詞陣列
    isLocked: boolean
    isAllAnswered: boolean
  }>()

const emit = defineEmits<{
  (e: 'nextTest'): void
  (e: 'setAnswer', value: { cAnswer: string; uAnswer: string }): void
}>()

// 答案選項
const answerOptions = computed(() => {
  if (!translationGameLang) {
    return { options: [], correctIndex: -1 }
  }

  const lang = translationGameLang

  const correctText = eachLyric[lang]
  if (!correctText) return { options: [], correctIndex: -1 }

  // 去重
  const uniqueSet = new Set<string>()

  allLyrics.forEach((l) => {
    const text = l[lang]
    if (l.nanoid !== eachLyric.nanoid && text && text !== correctText) {
      uniqueSet.add(text)
    }
  })

  const candidates = Array.from(uniqueSet)

  // 選出字數相近歌詞
  const sorted = [...candidates].sort((a, b) => {
    return (
      Math.abs(a.length - correctText.length) -
      Math.abs(b.length - correctText.length)
    )
  })

  // 隨機挑三個
  const randomThree = sorted.sort(() => Math.random() - 0.5).slice(0, 3)

  // 加上正確答案+打亂
  const options = [...randomThree, correctText]

  const shuffled = [...options].sort(() => Math.random() - 0.5)

  // 正確答案位置
  const correctIndex = shuffled.findIndex((t) => t === correctText)

  return {
    options: shuffled,
    correctIndex,
  }
})

// 是否已作答
const hasAnswered = ref(false)

// 使用者選的答案
const userAnswer = ref<number>(0)

const clickAnswer = (userAns: string, index: number) => {
  if (hasAnswered.value || isLocked || !isNowCard) {
    return
  }

  // 子組件ui呈現設定
  userAnswer.value = index

  hasAnswered.value = true

  // 傳給父組件
  emit('setAnswer', {
    cAnswer:
      answerOptions.value.options[answerOptions.value.correctIndex] ?? '',
    uAnswer: userAns,
  })

  emit('nextTest')
}
</script>

<template>
  <div
    class="relative flex w-full items-center justify-center transition-all duration-500 md:px-8 md:py-10"
    :class="[
      isAllAnswered
        ? 'z-20 rounded-xl bg-white px-3 py-6 md:rounded-3xl'
        : isNowCard
          ? 'z-20 rounded-xl border-[3px] border-[#F9595F]/30 bg-white px-3 py-6 shadow-lg md:rounded-3xl md:border-[5px]'
          : 'scale-95 border-none opacity-90 blur-[0.5px]',
    ]"
  >
    <!-- 生命蘋果 -->
    <div
      v-if="isNowCard && !isAllAnswered"
      class="absolute -top-1 right-4 -translate-y-1/2 md:right-6"
    >
      <div class="flex items-center space-x-1">
        <i
          v-for="i in 3"
          :key="i"
          class="fa-solid fa-apple-whole text-lg transition-all duration-300 md:text-2xl"
          :class="
            i <= life
              ? 'scale-100 text-[#F9595F] opacity-100'
              : 'scale-0 text-[#F9595F]/0 opacity-0'
          "
        />
      </div>
    </div>

    <div class="flex w-full flex-col space-y-3">
      <button
        v-for="(a, index) in answerOptions.options"
        :key="index"
        class="flex w-full items-center rounded-2xl border-2 border-[#FFE5E5] bg-[#FFF9F9] p-3 transition-all duration-200 active:scale-[0.98]"
        :class="{
          'hover:border-[#F9595F] hover:bg-white hover:shadow-md':
            !hasAnswered && !isLocked && isNowCard,
          'border-gray-300 bg-gray-300': hasAnswered && index === userAnswer,
          'border-green-500':
            hasAnswered &&
            index === answerOptions.correctIndex &&
            userAnswer !== answerOptions.correctIndex,
          'cursor-default opacity-80': hasAnswered || isLocked || !isNowCard,
        }"
        @click="clickAnswer(a, index)"
      >
        <div
          class="flex h-5 w-5 flex-none items-center justify-center rounded-full border border-[#7A3A3A] bg-[#7A3A3A] text-white"
        >
          {{ index + 1 }}
        </div>

        <div
          class="ml-4 flex text-start text-sm text-[#7A3A3A]"
          :class="{ 'hover:text-[#F9595F]': !hasAnswered }"
        >
          {{ a }}
        </div>

        <div class="ml-auto">
          <i
            v-if="hasAnswered && index === answerOptions.correctIndex"
            class="fa-solid fa-circle-check text-green-500"
          ></i>
          <i
            v-if="
              hasAnswered &&
              index !== answerOptions.correctIndex &&
              index === userAnswer
            "
            class="fa-solid fa-circle-xmark text-red-600"
          ></i>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-blink {
  animation: blink 1s infinite;
}
</style>
