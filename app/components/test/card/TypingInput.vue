<script lang="ts" setup>
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const { eachLyric, isNowCard, life, selectedQuizType, language } = defineProps<{
  eachLyric: LyricData
  isNowCard: boolean
  life: 0 | 1 | 2 | 3
  selectedQuizType: 'partial' | 'allBlank' | 'translation'
  language: LangCode
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

const isDeleting = ref(false)

// 捕捉目前按下的鍵
const onKeydown = (e: KeyboardEvent) => {
  if (isFakeKeyboard.value) {
    return
  }

  isDeleting.value = e.key === 'Backspace' || e.key === 'Delete'
}

// 非IME拼打時觸發
const onInput = (e: Event) => {
  if (isFakeKeyboard.value) {
    return
  }

  const target = e.target as HTMLInputElement

  // 下一個字是空白的話幫使用者打空白
  if (!isDeleting.value && isOriBlank(target.value.length)) {
    target.value = target.value.concat(' ')
  }

  // 正在按刪除鍵且下一個字為空白，刪除空白
  if (isDeleting.value && target.value[target.value.length - 1] === ' ') {
    target.value = target.value.slice(0, -1)
  }

  handleInput(target)

  // reset
  isDeleting.value = false
}

const clickBlock = () => {
  if (isNowCard) inputRef.value?.focus()
}

// 完成答案拼打
watch(userInput, (val) => {
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

    <div class="relative w-full">
      <!-- 真正打字的地方 -->
      <input
        v-if="!isFakeKeyboard && isNowCard"
        ref="inputRef"
        :value="userInput"
        class="absolute inset-0 z-30 w-full cursor-default opacity-0"
        type="text"
        spellcheck="false"
        autocapitalize="off"
        @input="onInput"
        @keydown="onKeydown"
      />

      <!-- 顯示格子／字的地方 -->
      <div
        class="z-10 flex w-full flex-wrap items-center justify-center space-x-0.5 transition"
      >
        <div
          v-for="(char, i) in displayChars"
          :key="i"
          class="flex flex-col items-center"
        >
          <div v-if="isOriBlank(i)" class="w-4 md:w-8"></div>

          <div
            v-else
            class="relative flex h-10 w-3 items-center justify-center border-b-[3px] text-2xl font-black transition-all duration-200 md:h-16 md:w-6 md:text-4xl"
            :class="[
              // 錯誤時的文字顏色
              resultStates?.[i] === 'wrong'
                ? 'border-red-500 text-red-500'
                : 'text-[#7A3A3A]',

              // 正在打字的格子：底線顏色加深 + 閃爍動畫
              i === userInput.length && isNowCard
                ? 'animate-blink border-[#F9595F]'
                : 'border-[#FFE5E5]',

              // 已經打過的格子，底線變深色
              i < userInput.length ? 'border-[#7A3A3A]' : 'text-[#D1B8B8]',
            ]"
          >
            {{ char || '' }}

            <div
              v-if="i === userInput.length && isNowCard"
              class="absolute inset-0 -z-10 bg-[#F9595F]/20"
            ></div>
          </div>
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
