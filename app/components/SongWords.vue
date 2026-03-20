<script setup lang="ts">
import type { SongData } from '~/types/song'
import type { DisplayAPIResult } from '~/types/tatoeba'
import { LANG_CONFIG_MAP } from '~/types/lang'

const { song } = defineProps<{ song: SongData }>()

const store = usePlayerStore()

// 底下例句panel打開狀態
const isPanelOpen = ref(false)

// 打開panel前的音樂播放狀態
const wasListening = ref(false)

// ********* Tatoeba ************
// 歌曲語言的config
const currentLangConfig = ref(LANG_CONFIG_MAP[song.language || 'en'])

// tatoeba api回傳句子陣列
const tatoebaSentenses = ref<DisplayAPIResult[]>()

const { get: getTatoebaResult, loading: tatoebaLoading } = useTatoeba(
  currentLangConfig.value.tatoeba,
)

const selectedWord = ref('')

// 打開下方panel區塊
const openPanel = async (word: string) => {
  selectedWord.value = word

  // 記住打開前的播放狀態
  wasListening.value = store.isPlaying

  isPanelOpen.value = true
  store.pause()

  tatoebaSentenses.value = await getTatoebaResult(selectedWord.value)
}

watch(isPanelOpen, (open) => {
  if (!open && wasListening.value) {
    store.play()
  }
})
</script>

<template>
  <div
    class="w-full rounded-3xl border border-[#FFE5E5] bg-white p-4 shadow-sm md:p-6"
  >
    <div
      class="mb-6 flex items-center justify-between border-b border-[#FFF9F9] pb-1 md:pb-4"
    >
      <div class="items-center gap-3">
        <h3
          class="flex flex-col text-lg font-black tracking-widest text-[#7A3A3A] md:flex-row md:items-center md:text-xl"
        >
          單字庫 & 例句
          <span
            class="text-xs font-medium text-[#A66B6B] uppercase opacity-60 md:ml-2"
          >
            Vocabulary & Sentences
          </span>
        </h3>
      </div>

      <span
        class="rounded-lg bg-[#FFE5E5] px-2 py-1 text-[10px] font-bold text-[#F9595F]"
      >
        共 {{ song.words?.length || 0 }} 個
      </span>
    </div>

    <div
      v-if="song.words && song?.words.length > 0"
      class="flex flex-wrap gap-3"
    >
      <button
        v-for="(w, index) in song.words"
        :key="index"
        class="group flex items-center overflow-hidden rounded-xl border border-[#FFE5E5] bg-[#FFF9F9] px-3 py-1.5 transition-all hover:border-[#F9595F]/50 hover:bg-white hover:shadow-md active:scale-95 md:px-4 md:py-2"
        @click="openPanel(w.word)"
      >
        <div class="flex items-center">
          <span
            class="text-sm font-bold text-[#7A3A3A] group-hover:text-[#F9595F] md:text-base"
          >
            {{ w.word }}
          </span>
        </div>
      </button>
    </div>

    <div v-else class="pb-2">nooo</div>

    <BottomPanel
      :open="isPanelOpen"
      :word="selectedWord"
      :sentense="tatoebaSentenses"
      :loading="tatoebaLoading"
      :lang="song.language"
      @close="isPanelOpen = false"
    />
  </div>
</template>
