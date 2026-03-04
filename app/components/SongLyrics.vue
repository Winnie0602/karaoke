<script setup lang="ts">
import type { LyricData, WordData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const { lyrics, songData } = defineProps<{
  lyrics: LyricData[]
  songData: { title: string; artist: string }
}>()

const store = usePlayerStore()

// 底下例句panel
const isPanelOpen = ref(false)

//這首歌的語言
const songLang = computed<LangCode | null>(() => {
  const first = lyrics[0]
  if (!first) return null

  if (first.ja) return 'ja'
  if (first.kr) return 'kr'
  if (first.en) return 'en'
  if (first.hk) return 'hk'
  if (first.tw) return 'tw'

  return null
})

// 每句歌詞dom陣列
const lyricsRefs = ref<HTMLElement[]>([])

const containerRef = ref<HTMLElement | null>(null)

const getWords = (lyric: LyricData) => {
  if (!songLang.value) return []
  return lyric[songLang.value] ?? []
}

// 傳進去tatoeba組件的單字
const tatoebaWord = ref('')

// 打開panel前的音樂播放狀態
const wasListening = ref(false)

// 打開下方panel區塊
const openPanel = async (word: WordData) => {
  // 記住打開前的播放狀態
  wasListening.value = store.isPlaying

  isPanelOpen.value = true
  store.pause()

  tatoebaWord.value = word.surface
}

watch(isPanelOpen, (open) => {
  if (!open && wasListening.value) {
    store.play()
  }
})

// 現在在第幾句歌詞
const currentLineIndex = computed(() => {
  return lyrics.findIndex(
    (l) => store.currentTime >= l.start && store.currentTime < l.end,
  )
})

let lastLineIndex = -1

watch(currentLineIndex, (newLineIndex) => {
  if (newLineIndex === -1) return
  if (newLineIndex === lastLineIndex) return

  lastLineIndex = newLineIndex

  const el = lyricsRefs.value[newLineIndex]
  const container = containerRef.value
  if (!el || !container) return

  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  const elCenterInContainer =
    elRect.top - containerRect.top + container.scrollTop + elRect.height / 2

  const targetScrollTop = elCenterInContainer - container.clientHeight / 2

  container.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth',
  })
})
</script>

<template>
  <div
    ref="containerRef"
    class="hide-scroll relative h-[420px] space-y-3 overflow-y-scroll rounded-md border-[1px] border-gray-300 md:h-[640px]"
  >
    <div
      class="sticky top-0 z-10 flex h-[24px] w-full items-center bg-[#e6ebf1] pl-3 md:h-[30px]"
    >
      <div class="flex items-center space-x-1.5">
        <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
        <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
        <div class="h-3 w-3 rounded-full bg-[#28C840]"></div>

        <div class="relative top-[1px] text-xs text-stone-800 md:text-sm">
          {{ songData.artist }} - {{ songData.title }}
        </div>
      </div>
    </div>

    <div
      v-for="(lyric, index) in lyrics"
      :key="lyric.start"
      :ref="(el) => (lyricsRefs[index] = el as HTMLElement)"
      class="relative flex items-center justify-between px-3 text-sm md:text-base"
      :class="{ 'current-lyric': index === currentLineIndex }"
    >
      <div class="flex flex-col">
        <span>
          <span
            v-for="(word, wIndex) in getWords(lyric)"
            :key="wIndex"
            class="mr-1 inline-block"
          >
            <!-- 有 meaning 的詞 -->
            <span
              v-if="word.meaning"
              class="group relative inline-block cursor-pointer"
              @click="openPanel(word)"
            >
              <!-- 單字本體 -->
              <span
                class="rounded transition-colors group-hover:bg-red-100 group-hover:ring-1 group-hover:ring-red-400"
              >
                <ruby v-if="word.reading">
                  {{ word.surface }}
                  <rt
                    class="text-[11px] text-gray-600 transition-opacity group-hover:opacity-20"
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
                class="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
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

        <span class="text-[11px] text-gray-700 md:text-[13px]">
          {{ lyric.zh }}
        </span>
      </div>

      <div
        class="cursor-pointer text-[#E8D6D6] hover:text-[#A66B6B]"
        :class="{ hidden: index === currentLineIndex }"
        @click="store.seekToRequest(lyric.start)"
      >
        <i class="fa-solid fa-play text-lg"></i>
      </div>
    </div>

    <BottomPanel
      :open="isPanelOpen"
      :word="tatoebaWord"
      :song-lang="songLang"
      @close="isPanelOpen = false"
    />
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
