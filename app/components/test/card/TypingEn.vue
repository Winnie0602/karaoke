<script lang="ts" setup>
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const { eachLyric, isNowCard, life, selectedQuizType, language } = defineProps<{
  eachLyric: LyricData
  isNowCard: boolean
  life: 0 | 1 | 2 | 3
  selectedQuizType: 'partial' | 'allBlank'
  language: LangCode
}>()

const emit = defineEmits<{
  (e: 'nextTest'): void
  (e: 'setAnswer', value: string): void
}>()

const {
  length,
  displayChars,
  resultStates,
  handleInput,
  isLockedIndex,
  userInput,
} = useTypingMode({
  lyricData: eachLyric,
  mode: selectedQuizType,
  blankCount: 5,
  language,
})

const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({
  focusInput: () => inputRef.value?.focus(),
})

// 使用虛擬鍵盤？
const isFakeKeyboard = ref(false)

// IME 組字狀態
const isComposing = ref(false)

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
  handleInput(e)
}

// 非IME拼打時觸發
const onInput = (e: Event) => {
  if (isFakeKeyboard.value) {
    return
  }
  if (isComposing.value) return

  handleInput(e)
}

// 虛擬鍵盤新增字
// const onKeyboardInput = (char: string) => {
//   if (userInput.value.length >= answer.length) return
//   userInput.value += char
// }

const clickBlock = () => {
  if (isNowCard) inputRef.value?.focus()
}

// 完成答案拼打
watch(userInput, (val) => {
  if (userInput.value.length !== length) {
    return
  }

  // 答案傳到父層
  emit('setAnswer', val)

  emit('nextTest')
})

watch(
  () => isNowCard,
  async (val) => {
    if (!val) return

    await nextTick()

    setTimeout(() => inputRef.value?.focus(), 30)
  },
)
</script>

<template>
  <div
    class="relative flex items-center justify-center border-[3px] transition-all duration-500 md:border-[5px] md:px-8 md:py-10"
    :class="[
      isNowCard
        ? 'z-20 rounded-xl border-[#F9595F]/30 bg-white px-3 py-6 shadow-lg md:rounded-3xl'
        : 'scale-95 border-none opacity-50 blur-[0.5px]',
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

    <div class="relative">
      <!-- 真正打字的地方 -->
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

      <!-- 顯示格子／字的地方 -->
      <div
        class="z-10 flex flex-wrap items-center justify-center gap-2 transition md:gap-4"
      >
        <div
          v-for="(char, i) in displayChars"
          :key="i"
          class="flex flex-col items-center"
        >
          <div
            class="flex h-9 w-7 items-center justify-center rounded-md text-xl font-black transition-all duration-200 md:h-16 md:w-12 md:text-4xl"
            :class="{
              'text-red-500': resultStates?.[i] === 'wrong',
              'ring ring-[#F9595F]/80': i === userInput.length && isNowCard,
            }"
          >
            <span
              v-if="isLockedIndex(i) && i >= userInput.length"
              class="text-[#D1B8B8]/40"
            >
              {{ char }}
            </span>
            <span
              v-else-if="
                isLockedIndex(i) &&
                userInput.length < i + 1 &&
                !isNowCard &&
                resultStates?.length === length
              "
              class="text-[#D1B8B8]"
            >
              {{ char }}
            </span>

            <span v-else class="text-red-800">
              {{ char }}
            </span>
          </div>

          <!-- 底線 -->
          <div
            class="mt-1 h-1 w-full rounded-full transition-all duration-500 md:h-2.5"
            :class="[
              i === userInput.length && isNowCard
                ? 'bg-[#F9595F]/80'
                : resultStates
                  ? resultStates[i] === 'correct'
                    ? 'bg-[#7A3A3A]'
                    : 'bg-[#F9595F]'
                  : 'bg-[#FFE5E5]',
            ]"
          />
        </div>
      </div>
    </div>

    <button
      class="ml-4 hidden cursor-pointer items-center justify-center transition-all duration-500 md:flex"
      :class="[isNowCard ? 'scale-110 opacity-100' : 'scale-50 opacity-0']"
    >
      <div class="keyboard-icon-wrapper">
        <i class="fa-regular fa-keyboard text-xl text-[#F9595F]"></i>
      </div>
    </button>
  </div>
</template>
