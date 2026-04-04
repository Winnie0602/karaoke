<script lang="ts" setup>
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const { eachLyric, isNowCard, life, selectedQuizType, language, isLocked } =
  defineProps<{
    eachLyric: LyricData
    isNowCard: boolean
    life: 0 | 1 | 2 | 3
    selectedQuizType: 'partial' | 'allBlank' | 'translation'
    language: LangCode
    isLocked: boolean
    isAllAnswered: boolean
  }>()

const emit = defineEmits<{
  (e: 'nextTest'): void
  (e: 'setAnswer', value: { cAnswer: string; uAnswer: string }): void
}>()

const {
  length,
  displayChars,
  resultStates,
  handleInput,
  isLockedIndex,
  isOriBlank,
  userInput,
  answer,
} = useTypingMode({
  lyricData: eachLyric,
  mode: selectedQuizType,
  blankCountPercent: 50,
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

// 組字中的字
const composingText = ref('')

const onCompositionUpdate = (e: CompositionEvent) => {
  if (isLocked) {
    return
  }
  composingText.value = e.data
}

// IME 處理(開始)
const onCompositionStart = () => {
  if (isFakeKeyboard.value || isLocked) {
    return
  }
  isComposing.value = true
  composingText.value = ''
}

const isDeleting = ref(false)

// 捕捉目前按下的鍵
const onKeydown = (e: KeyboardEvent) => {
  if (isFakeKeyboard.value || isLocked) {
    return
  }

  isDeleting.value = e.key === 'Backspace' || e.key === 'Delete'
}

// IME 處理(結束)
const onCompositionEnd = (e: CompositionEvent) => {
  if (isFakeKeyboard.value || isLocked) {
    return
  }
  isComposing.value = false
  composingText.value = ''

  const target = e.target as HTMLInputElement

  handleInput(target)
}

// 非IME拼打時觸發
const onInput = (e: Event) => {
  if (isFakeKeyboard.value || isLocked) {
    return
  }
  if (isComposing.value) return
  const target = e.target as HTMLInputElement

  // 下一個字是空白的話幫使用者打空白
  if (!isDeleting.value && isOriBlank(target.value.length)) {
    target.value = target.value.concat(' ')
  }

  // 正在按刪除鍵且下一個字為空白，刪除空白
  if (isDeleting.value && target.value[target.value.length - 1] === ' ') {
    target.value = target.value.slice(0, -2)
  }

  handleInput(target)
}

const clickBlock = () => {
  if (isNowCard && !isLocked) inputRef.value?.focus()
}

// 完成答案拼打
watch(userInput, (val) => {
  if (isLocked) {
    return
  }

  if (userInput.value.length !== length) {
    return
  }

  // 答案傳到父層
  emit('setAnswer', { cAnswer: answer, uAnswer: val })

  emit('nextTest')
})

watch(
  () => isNowCard,
  async (val) => {
    if (!val || isLocked) return

    await nextTick()

    setTimeout(() => inputRef.value?.focus(), 30)
  },
)
</script>

<template>
  <div
    class="relative flex items-center justify-center transition-all duration-500 md:px-8 md:py-10"
    :class="[
      isAllAnswered
        ? 'z-20 rounded-xl bg-white px-3 py-6 md:rounded-3xl'
        : isNowCard
          ? 'z-20 rounded-xl border-[3px] border-[#F9595F]/30 bg-white px-3 py-6 shadow-lg md:rounded-3xl md:border-[5px]'
          : 'scale-95 border-none opacity-50 blur-[0.5px]',
    ]"
    @click="clickBlock"
  >
    <div
      v-if="isNowCard && !isAllAnswered"
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

    <div class="relative">
      <!-- 真正打字的地方 -->
      <input
        v-if="!isFakeKeyboard && isNowCard && !isLocked"
        ref="inputRef"
        :value="userInput"
        class="absolute inset-0 z-30 w-full cursor-default opacity-0"
        type="text"
        spellcheck="false"
        autocapitalize="off"
        @input="onInput"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
        @compositionupdate="onCompositionUpdate"
        @keydown="onKeydown"
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
            <div v-if="isOriBlank(i)" class="w-4 md:w-8"></div>

            <span
              v-else-if="i >= userInput.length"
              :class="
                i === userInput.length && isComposing
                  ? 'text-[#F9595F]/80'
                  : 'text-[#D1B8B8]/40'
              "
            >
              {{ i === userInput.length && isComposing ? composingText : char }}
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
          <div v-if="isOriBlank(i)" class="w-4 md:w-8"></div>
          <div
            v-else
            class="mt-1 h-1 w-full rounded-full transition-all duration-500 md:h-2.5"
            :class="[
              i === userInput.length && isNowCard
                ? 'bg-[#F9595F]/80'
                : resultStates
                  ? resultStates[i] === 'correct'
                    ? 'bg-[#7A3A3A]'
                    : 'bg-red-500'
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
