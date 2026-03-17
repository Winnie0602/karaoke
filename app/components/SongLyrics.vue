<script setup lang="ts">
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const { lyrics, songData, songLang } = defineProps<{
  lyrics: LyricData[]
  songData: { title: string; artist: string }
  songLang: LangCode
}>()

const store = usePlayerStore()

// 底下例句panel
const isPanelOpen = ref(false)

// 每句歌詞dom陣列
const lyricsRefs = ref<HTMLElement[]>([])

const containerRef = ref<HTMLElement | null>(null)

const getLyric = (lyric: LyricData) => {
  if (!songLang) return ''
  // 日文直接給平假名html
  if (songLang === 'ja' && lyric.ruby)
    return lyric.ruby.replace(
      /<rt>/g,
      '<rt class="text-[12px] text-[#A66B6B]">',
    )
  return lyric[songLang] ?? ''
}

// 代辦：加入語言功能後做
const getTranslate = (lyric: LyricData) => {
  if (!songLang) return ''

  return lyric.zh ?? ''
}

// 傳進去tatoeba組件的單字
const tatoebaWord = ref('')

// 打開panel前的音樂播放狀態
const wasListening = ref(false)

// 打開下方panel區塊
// const openPanel = async (word) => {
//   // 記住打開前的播放狀態
//   wasListening.value = store.isPlaying

//   isPanelOpen.value = true
//   store.pause()

//   tatoebaWord.value = word.surface
// }

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
    class="hide-scroll relative h-[420px] space-y-3 overflow-y-scroll rounded-md border-[1px] border-gray-300 md:h-[840px]"
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
      class="relative flex items-center justify-between px-3 py-1.5 text-sm md:py-2 md:text-base"
      :class="{
        'bg-red-300/20 shadow-[0_0_10px_5px_rgba(249,89,95,0.1)]':
          index === currentLineIndex,
      }"
    >
      <div class="flex flex-col">
        <span
          v-if="songLang === 'ja'"
          class="mr-1 inline-block"
          v-html="getLyric(lyric)"
        ></span>
        <span v-else class="mr-1 inline-block">
          {{ getLyric(lyric) }}
        </span>

        <span class="text-[11px] text-gray-700 md:text-[13px]">
          {{ getTranslate(lyric) }}
        </span>
      </div>

      <div
        class="cursor-pointer text-[#E8D6D6] md:hover:text-[#A66B6B]"
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
</style>
