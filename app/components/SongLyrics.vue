<script setup lang="ts">
import type { LyricData } from '~/types/song'

const { lyrics, currentTime } = defineProps<{
  lyrics: LyricData[]
  currentTime: number
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
  <div class="hide-scroll h-[400px] space-y-3 overflow-y-auto">
    <p
      v-for="(lyric, index) in lyrics"
      :key="lyric.start"
      :ref="(el) => (lyricsRefs[index] = el as HTMLElement)"
      class="flex flex-col rounded-md border-[1px] py-2"
      :class="{ 'bg-red-500': index === currentLineIndex }"
      @click="goToTime(lyric.start)"
    >
      <span>
        <span
          v-for="(word, wIndex) in lyric.ja"
          :key="wIndex"
          class="mr-1 inline-block"
        >
          <!-- 有假名 or 有意思的詞 -->
          <span
            v-if="word.meaning"
            class="cursor-pointer rounded border border-transparent px-0.5 hover:border-blue-500"
          >
            <ruby v-if="word.reading">
              {{ word.surface }}
              <rt class="text-xs text-gray-600">
                {{ word.reading }}
              </rt>
            </ruby>

            <span v-else>
              {{ word.surface }}
            </span>

            <!-- tooltip -->
            <span class="relative -top-1 w-full text-xs">
              {{ word.meaning }}
            </span>
          </span>

          <!-- 沒 meaning 的普通字 -->
          <span v-else>
            {{ word.surface }}
          </span>
        </span>
      </span>

      <span class="text-gray-700">{{ lyric.zh }}</span>
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
</style>
