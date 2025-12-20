<script setup lang="ts">
import type { LyricData } from '~/types/song'

const { lyrics, currentTime } = defineProps<{
  lyrics: LyricData[]
  currentTime: number
  songData: { title: string; artist: string }
}>()

const emit = defineEmits(['goToTime'])

// 每句歌詞dom陣列
const lyricsRefs = ref<HTMLElement[]>([])

const goToTime = (time: number) => {
  emit('goToTime', time)
}

// 現在在第幾句歌詞
const currentLineIndex = computed(() => {
  return lyrics.findIndex((l) => currentTime >= l.start && currentTime < l.end)
})

let lastLineIndex = -1

// 換到新的一列歌詞時，捲動歌詞到畫面中間
watch(currentLineIndex, (newLineIndex) => {
  if (newLineIndex === -1) return
  if (newLineIndex === lastLineIndex) return

  lastLineIndex = newLineIndex

  const el = lyricsRefs.value[newLineIndex]
  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
})
</script>

<template>
  <div
    class="hide-scroll h-[420px] space-y-3 overflow-y-scroll rounded-md border-[1px] border-gray-300"
  >
    <div
      class="sticky top-0 z-10 flex h-[30px] w-full items-center bg-[#e6ebf1] pl-3"
    >
      <div class="flex items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
        <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="h-3 w-3 rounded-full bg-[#28C840]"></div>

        <div class="relative top-[1px] text-sm text-stone-800">
          {{ songData.artist }} - {{ songData.title }}
        </div>
      </div>
    </div>
    <p
      v-for="(lyric, index) in lyrics"
      :key="lyric.start"
      :ref="(el) => (lyricsRefs[index] = el as HTMLElement)"
      class="relative flex cursor-pointer flex-col px-3 py-2"
      :class="{ 'current-lyric': index === currentLineIndex }"
      @click="goToTime(lyric.start)"
    >
      <span>
        <span
          v-for="(word, wIndex) in lyric.ja"
          :key="wIndex"
          class="mr-1 inline-block"
        >
          <!-- 有 meaning 的詞 -->
          <span
            v-if="word.meaning"
            class="group relative inline-block cursor-pointer"
          >
            <!-- 單字本體 -->
            <span
              class="rounded transition-colors group-hover:bg-red-100 group-hover:ring-1 group-hover:ring-red-400"
            >
              <ruby v-if="word.reading">
                {{ word.surface }}
                <rt
                  class="text-xs text-gray-600 transition-opacity group-hover:opacity-20"
                >
                  {{ word.reading }}
                </rt>
              </ruby>

              <span v-else>
                {{ word.surface }}
              </span>
            </span>

            <!-- tooltip -->
            <span
              class="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              {{ word.meaning }}
            </span>
          </span>

          <!-- 沒 meaning 的普通字 -->
          <span v-else>
            {{ word.surface }}
          </span>
        </span>
      </span>

      <span class="text-[13px] text-gray-700">{{ lyric.zh }}</span>
    </p>
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
.current-lyric {
  position: relative;
  background: white;
  border-radius: 12px;
  z-index: 0;
}

/* 極細波浪外框 */
.current-lyric::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  z-index: -1;

  background: #ffd6d6; /* gray-200 */

  /* 用 SVG 波浪線當 mask */
  mask-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='24' height='6' viewBox='0 0 24 6'>\
<path d='M0 3 Q 3 0 6 3 T 12 3 T 18 3 T 24 3' fill='none' stroke='black' stroke-width='2'/>\
</svg>");
  mask-size: 24px 6px;
  mask-repeat: repeat;

  padding: 1px;
  box-sizing: border-box;
}
</style>
