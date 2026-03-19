<script setup lang="ts">
import type { SongData, SongsList } from '~/types/song'

const { song } = defineProps<{ song: SongData }>()

const store = usePlayerStore()

// 底下例句panel
const isPanelOpen = ref(false)

// 傳進去tatoeba組件的單字
const tatoebaWord = ref('')

// 打開panel前的音樂播放狀態
const wasListening = ref(false)

// 打開下方panel區塊
const openPanel = async (word) => {
  // 記住打開前的播放狀態
  wasListening.value = store.isPlaying

  isPanelOpen.value = true
  store.pause()

  tatoebaWord.value = word
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
      class="mb-6 flex items-center justify-between border-b border-[#FFF9F9] pb-4"
    >
      <div class="flex items-center gap-3">
        <div class="h-6 w-1.5 rounded-full bg-[#F9595F]"></div>
        <h3
          class="text-lg font-black tracking-widest text-[#7A3A3A] md:text-xl"
        >
          單字庫
          <span
            class="ml-2 text-xs font-medium text-[#A66B6B] uppercase opacity-60"
          >
            Vocabulary
          </span>
        </h3>
      </div>

      <span
        class="rounded-lg bg-[#FFE5E5] px-2 py-1 text-[10px] font-bold text-[#F9595F]"
      >
        共 1 個
      </span>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        v-for="word in ['実は', '言って', '못된 ', '없어', '멀리', '盲目的']"
        :key="word"
        class="group flex items-center overflow-hidden rounded-xl border border-[#FFE5E5] bg-[#FFF9F9] px-4 py-2 transition-all hover:border-[#F9595F]/50 hover:bg-white hover:shadow-md active:scale-95"
        @click="openPanel(word)"
      >
        <div class="flex items-center">
          <span
            class="text-sm font-bold text-[#7A3A3A] group-hover:text-[#F9595F] md:text-base"
          >
            {{ word }}
          </span>
        </div>
      </button>
    </div>

    <BottomPanel
      :open="isPanelOpen"
      :word="tatoebaWord"
      :song-lang="'ja'"
      @close="isPanelOpen = false"
    />
  </div>
</template>
