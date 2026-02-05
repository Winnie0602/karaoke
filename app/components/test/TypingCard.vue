<script lang="ts" setup>
import type { LyricData } from '~/types/song'

const { eachLyric, isNowCard, life } = defineProps<{
  eachLyric: LyricData
  isNowCard: boolean
  life: 0 | 1 | 2 | 3
}>()

const emit = defineEmits<{
  (e: 'nextTest'): void
}>()

// 使用虛擬鍵盤？
const isFakeKeyboard = ref(false)

// 使用者輸入
const userInput = ref('')
const inputRef = ref<HTMLInputElement>()

// IME 組字狀態
const isComposing = ref(false)

// 批改結果（打滿才會有）
const resultStates = ref<string[] | null>(null)

// 錯誤震動控制
const triggerShake = ref(false)

// IME 處理(開始)
const onCompositionStart = () => {
  if (isFakeKeyboard.value) {
    return
  }
  isComposing.value = true
}

// IME 處理(結束)
const onCompositionEnd = (e: CompositionEvent) => {
  if (isFakeKeyboard.value) {
    return
  }
  isComposing.value = false
  userInput.value = (e.target as HTMLInputElement).value.slice(
    0,
    eachLyric.ori.length,
  )
}

// 非IME拼打時觸發
const onInput = (e: Event) => {
  if (isFakeKeyboard.value) {
    return
  }
  if (isComposing.value) return
  userInput.value = (e.target as HTMLInputElement).value.slice(
    0,
    eachLyric.ori.length,
  )
}

// 整句判斷答案對錯
const checkAnswer = () => {
  resultStates.value = eachLyric.ori.split('').map((char, i) => {
    return userInput.value[i] === char ? 'correct' : 'wrong'
  })
}

// 虛擬鍵盤新增字
// const onKeyboardInput = (char: string) => {
//   if (userInput.value.length >= answer.length) return
//   userInput.value += char
// }

const clickBlock = () => {
  if (isNowCard) inputRef.value?.focus()
}

// 監聽輸入長度
watch(userInput, (val) => {
  if (val.length !== eachLyric.ori.length) {
    resultStates.value = null
    return
  }
  checkAnswer()

  emit('nextTest')
})

// 批改後若有錯開啟震動效果
watch(resultStates, (states) => {
  if (!states) return

  const hasWrong = states.includes('wrong')
  if (hasWrong) {
    triggerShake.value = true
    setTimeout(() => (triggerShake.value = false), 400)
  }
})

watch(
  () => isNowCard,
  (isNowCard) => {
    if (isNowCard) {
      inputRef.value?.focus()
    }
  },
)

// 自動 focus
onMounted(() => {
  if (isNowCard) inputRef.value?.focus()
})
</script>

<template>
  <div
    class="relative flex items-center justify-center transition-all duration-500"
    :class="[
      isNowCard
        ? 'z-20 scale-[1.02] rounded-xl border-[3px] border-[#F9595F]/30 bg-white px-3 py-6 shadow-lg md:scale-100 md:rounded-3xl md:border-[5px] md:px-8 md:py-10'
        : 'pointer-events-none scale-95 opacity-40 blur-[0.5px] grayscale',
    ]"
    @click="clickBlock"
  >
    <div
      v-if="isNowCard"
      class="absolute top-0 left-4 -translate-y-1/2 rounded-full bg-[#F9595F] px-2.5 py-1 shadow-md shadow-[#F9595F]/20 md:left-6 md:px-4 md:py-1.5"
    >
      <span
        class="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-white uppercase md:gap-2 md:text-[11px]"
      >
        <span class="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"
          ></span>
          <span
            class="relative inline-flex h-1.5 w-1.5 rounded-full bg-white md:h-2 md:w-2"
          ></span>
        </span>
        <span class="leading-none">Now</span>
        <span class="hidden md:inline">Typing</span>
      </span>
    </div>

    <!-- 生命蘋果 -->
    <div
      v-if="isNowCard"
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

    <div
      class="relative z-10 flex flex-wrap items-center justify-center gap-2 transition md:gap-4"
      :class="{ 'animate-shake': triggerShake }"
    >
      <input
        v-if="!isFakeKeyboard && isNowCard"
        ref="inputRef"
        :value="userInput"
        class="absolute inset-0 z-30 w-full cursor-default opacity-0"
        type="text"
        spellcheck="false"
        autocapitalize="off"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        @input="onInput"
      />

      <div
        v-for="(_, i) in eachLyric.ori.length"
        :key="i"
        class="flex flex-col items-center"
      >
        <div
          class="flex h-9 w-7 items-center justify-center text-xl font-black transition-all duration-200 md:h-16 md:w-12 md:text-4xl"
          :class="[
            resultStates?.[i] === 'correct' && 'text-[#7A3A3A]',
            resultStates?.[i] === 'wrong' && 'text-[#F9595F]',
            !resultStates && (isNowCard ? 'text-stone-700' : 'text-stone-200'),
            userInput.length === i &&
              isNowCard &&
              'scale-110 rounded-md bg-[#FFF9F9] text-[#F9595F] shadow-inner ring-2 ring-[#F9595F]/20 md:ring-4',
          ]"
        >
          {{ userInput[i] || '' }}
        </div>

        <div
          class="mt-1 h-1 w-full rounded-full transition-all duration-500 md:h-2.5"
          :class="[
            resultStates
              ? resultStates[i] === 'correct'
                ? 'bg-[#7A3A3A]'
                : 'bg-[#F9595F]'
              : isNowCard
                ? 'bg-[#FFE5E5]'
                : 'bg-stone-100',
          ]"
        />
      </div>
    </div>

    <button
      class="ml-4 hidden cursor-pointer items-center justify-center transition-all duration-500 md:flex"
      :class="[isNowCard ? 'scale-110 opacity-100' : 'scale-50 opacity-0']"
    >
      <div class="keyboard-icon-wrapper">
        <i class="fa-regular fa-keyboard text-xl text-[#F9595F]"></i>

        <span class="status-dot"></span>
      </div>
    </button>
  </div>
</template>
