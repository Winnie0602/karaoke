<script setup lang="ts">
import type { SongData } from '~/types/song'

const { currentSong, selected, step } = defineProps<{
  currentSong: SongData
  step: 1 | 2 | 3 | 4
  selected: {
    start: number
    end: number
  }
}>()

const emit = defineEmits<{
  (e: 'update', value: { start: number; end: number }): void
}>()

const setTestIndex = (index: number) => {
  // 第一步驟
  if (step === 1) {
    emit('update', { start: index, end: -1 })
    return
  }
  if (step === 2) {
    if (index - selected.start >= 5) {
      console.log(index, selected.start)
      return
    }

    emit('update', { start: selected.start, end: index })
    return
  }
}

const isSelected = (index: number) => {
  if (selected.start === -1) return false
  if (selected.end === -1) return index === selected.start
  return index >= selected.start && index <= selected.end
}
</script>

<template>
  <div
    class="hide-scroll h-[calc(100vh-60px-40px-150px)] space-y-3 overflow-y-scroll rounded-md border-[1px] border-gray-300"
  >
    <div class="top-0 z-10 flex h-[30px] items-center bg-[#e6ebf1] pl-3">
      <div class="flex items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
        <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="h-3 w-3 rounded-full bg-[#28C840]"></div>

        <div class="top-[1px] text-sm text-stone-800">
          {{ currentSong?.title }}
        </div>
      </div>
    </div>

    <div
      v-for="(lyric, index) in currentSong?.lyrics"
      :key="lyric.start"
      class="relative flex cursor-pointer items-center justify-between px-3 py-2 text-sm md:text-base"
      :class="isSelected(index) ? 'bg-[#F9595F]/10' : ''"
      @click="setTestIndex(index)"
    >
      <div class="flex flex-col">
        <span>
          <span
            v-for="(word, wIndex) in lyric.ja"
            :key="wIndex"
            class="mr-1 inline-block"
          >
            <span>
              {{ word.surface }}
            </span>
          </span>
        </span>

        <span class="text-[13px] text-gray-700">{{ lyric.zh }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.hide-scroll::-webkit-scrollbar {
  display: none;
}

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
