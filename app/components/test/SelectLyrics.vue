<script setup lang="ts">
import type { SongData } from '~/types/song'
const { show } = useToast()

const { currentSong, selected } = defineProps<{
  currentSong: SongData
  selected: {
    start: number
    end: number
  }
}>()

const step = ref<1 | 2>(1)

const emit = defineEmits<{
  (e: 'update', value: { start: number; end: number }): void
}>()

const setTestIndex = (index: number) => {
  // 已經選完了->return
  if (selected.start !== -1 && selected.end !== -1) {
    return
  }

  // 第一次選
  if (selected.start === -1 && selected.end === -1) {
    emit('update', { start: index, end: -1 })

    return
  }
  // 第二次選
  // 不能選比start小的
  if (index <= selected.start) {
    return
  }

  // 選超過五句歌詞 -> return
  if (index - selected.start >= 5) {
    show('不能選超過五句歌詞', 2000)

    return
  }

  if (selected.start !== -1 && selected.end === -1) {
    emit('update', { start: selected.start, end: index })

    return
  }
}

const isSelected = (index: number) => {
  if (selected.start === -1) return false
  if (selected.end === -1) return index === selected.start
  return index >= selected.start && index <= selected.end
}

const reset = (index: number) => {
  if (index === selected.start) {
    emit('update', { start: -1, end: -1 })
    return
  }

  if (index === selected.end) {
    emit('update', { start: selected.start, end: -1 })
    return
  }
}

watch(
  () => [selected.start, selected.end],
  ([start, end]) => {
    if (start !== -1) {
      step.value = 2
    } else {
      step.value = 1
    }
  },
)
</script>

<template>
  <div
    class="flex h-full w-full flex-col overflow-hidden md:h-[calc(100%-40px)] md:flex-row"
  >
    <div
      class="hide-scroll z-10 flex shrink-0 flex-row items-center space-y-0 space-x-2 overflow-x-auto bg-[#f6f6f6]/50 px-2 py-1.5 md:flex-[1] md:flex-col md:items-stretch md:space-y-1 md:space-x-0 md:overflow-y-hidden md:px-3 md:py-2 md:py-4"
    >
      <div
        class="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap md:rounded-md md:px-3 md:py-4 md:text-sm"
        :class="{
          'bg-[#B58C8C]/90 text-white': step === 1,
          'text-[#8F5F5F]': step !== 1,
        }"
      >
        設定開始段落
      </div>
      <div
        class="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium whitespace-nowrap md:rounded-md md:px-3 md:py-4 md:text-sm"
        :class="{
          'bg-[#B58C8C]/90 text-white': step === 2,
          'text-[#8F5F5F]': step !== 2,
        }"
      >
        設定結束段落
      </div>
    </div>

    <div class="hidden w-px self-stretch bg-gray-200 md:block"></div>

    <div
      class="hide-scroll flex-[3] overflow-y-scroll bg-white md:px-4 md:px-6 md:py-6"
    >
      <div
        v-for="(lyric, index) in currentSong?.lyrics"
        :key="lyric.start"
        class="group relative flex flex-col justify-center px-4 py-2 text-sm transition-all md:flex-row md:items-center md:justify-between md:px-3 md:py-2 md:py-3 md:text-base"
        :class="{
          'bg-[#F9595F]/10': isSelected(index),
          'cursor-pointer hover:bg-gray-100':
            !isSelected(index) &&
            (selected.start === -1 || selected.end === -1) &&
            index > selected.start,
        }"
        @click="setTestIndex(index)"
      >
        <div class="flex flex-col pr-12 md:pr-0">
          <div class="flex flex-wrap text-[#8F5F5F]">
            <span
              v-for="(word, wIndex) in lyric[currentSong.language]"
              :key="wIndex"
              class="mr-1 inline-block md:font-medium"
            >
              {{ word }}
            </span>
          </div>
          <span class="mt-1 text-[12px] text-gray-500 md:text-[13px]">
            {{ lyric.zh }}
          </span>
        </div>

        <div
          class="absolute top-2 right-2 flex items-center md:relative md:top-0 md:right-0 md:gap-2"
        >
          <div
            v-if="selected.start === index"
            class="rounded bg-[#F9595F] bg-transparent px-1.5 py-0.5 text-[9px] text-[10px] font-black tracking-tighter tracking-widest text-[#F9595F] uppercase md:p-0"
          >
            Start
          </div>

          <div
            v-if="selected.end === index"
            class="rounded bg-[#B58C8C] bg-transparent px-1.5 py-0.5 text-[9px] text-[10px] font-black tracking-tighter tracking-widest text-[#B58C8C] uppercase md:p-0"
          >
            End
          </div>

          <div
            v-if="selected.start === index || selected.end === index"
            class="flex cursor-pointer items-center justify-center rounded-full border border-[#F9595F] bg-white px-2 py-0.5 text-[10px] font-bold text-[#F9595F] transition-all hover:bg-[#F9595F] hover:text-white md:rounded-md md:px-2 md:py-0.5 md:text-[11px]"
            @click.stop="reset(index)"
          >
            <span class="md:hidden">✕</span>
            <span class="hidden md:inline">重設</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
