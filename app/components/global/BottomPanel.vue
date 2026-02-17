<script setup lang="ts">
import type { DisplayAPIResult } from '~/types/tatoeba'
import type { LangCode } from '~/types/lang'
import { LANG_CONFIG_MAP } from '~/types/lang'
import { speak } from '~/utils/speak'

const { open, word, songLang } = defineProps<{
  open: boolean
  word: string
  songLang: LangCode | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const tatoebaLoading = ref(false)
const tatoebaSentenses = ref<DisplayAPIResult[]>()

// 朗讀狀態控制
const speakingIndex = ref<number | null>(null)

const currentLangConfig = computed(() => {
  // 預設為日文，若有對應則回傳對應配置
  if (songLang && LANG_CONFIG_MAP[songLang]) {
    return LANG_CONFIG_MAP[songLang]
  }
  return LANG_CONFIG_MAP.ja
})

const handleSpeak = (text: string, index: number) => {
  if (speakingIndex.value !== null) return // 正在播放中 禁止再次點擊

  speakingIndex.value = index
  speak(
    text,
    () => {
      speakingIndex.value = null // 播放結束 重置狀態
    },
    currentLangConfig.value.speech,
  )
}
// -----------------------

watch(
  () => open,
  async (newVal) => {
    if (!newVal) return

    tatoebaSentenses.value = []
    tatoebaLoading.value = true
    try {
      tatoebaSentenses.value = await $fetch<DisplayAPIResult[]>(
        '/api/tatoeba',
        {
          params: {
            from: currentLangConfig.value.api,
            to: 'cmn',
            query: word,
          },
        },
      )
    } finally {
      tatoebaLoading.value = false
    }
  },
)
</script>

<template>
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/30"
      @click="emit('close')"
    />
  </transition>

  <transition name="slide-up">
    <div v-if="open" class="fixed right-0 bottom-0 left-0 z-50 mx-auto w-full">
      <div
        class="bg-[#C63E42]/90 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] backdrop-blur-md"
      >
        <div class="flex justify-center py-2">
          <div class="h-1.5 w-10 rounded-full bg-white/20" />
        </div>

        <div class="flex items-center justify-between px-5 pb-3">
          <div
            class="text-xs font-bold tracking-[0.2em] text-white/50 uppercase"
          >
            Example Sentences
          </div>

          <button
            class="p-1 text-white/40 hover:text-white"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <div
          class="drawer-scroll max-h-[45vh] overflow-y-auto px-6 pb-8 md:max-h-[35vh] md:px-10"
        >
          <div v-if="!tatoebaLoading" class="space-y-3">
            <div
              v-if="tatoebaSentenses?.length === 0"
              class="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center"
            >
              <div class="text-sm text-white/60 md:text-base">
                No example sentences found
              </div>
              <div class="mt-1 text-xs text-white/40">Try another word</div>
            </div>

            <div v-else>
              <div
                v-for="(sentense, i) in tatoebaSentenses"
                :key="i"
                class="relative mt-3 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
              >
                <button
                  class="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full transition-all"
                  :class="[
                    speakingIndex === i
                      ? 'scale-95 bg-white text-[#C63E42] opacity-100'
                      : 'bg-white/10 text-white/80 hover:scale-110 hover:bg-white/20 active:scale-95',
                    speakingIndex !== null && speakingIndex !== i
                      ? 'cursor-not-allowed opacity-30'
                      : '',
                  ]"
                  :disabled="speakingIndex !== null"
                  @click="handleSpeak(sentense.text, i)"
                >
                  <i
                    class="fa-solid"
                    :class="
                      speakingIndex === i
                        ? 'fa-spinner fa-spin'
                        : 'fa-volume-high'
                    "
                  ></i>
                </button>

                <div class="flex-1 space-y-1">
                  <div
                    v-if="songLang === 'ja'"
                    class="text-base leading-relaxed font-medium text-white md:text-lg"
                    v-html="sentense.html"
                  />

                  <div
                    v-else
                    class="text-base leading-relaxed font-medium text-white md:text-lg"
                  >
                    {{ sentense.text }}
                  </div>

                  <div class="text-sm leading-snug text-white/60">
                    {{ sentense.translations }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex animate-pulse gap-4">
              <div class="h-10 w-10 flex-none rounded-full bg-white/10"></div>
              <div class="flex-1 space-y-2 py-1">
                <div class="h-4 w-full rounded bg-white/10"></div>
                <div class="h-3 w-2/3 rounded bg-white/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* 原有的 Style 全部保留 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.28s ease,
    opacity 0.28s ease;
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.drawer-scroll::-webkit-scrollbar {
  width: 8px;
}
.drawer-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.drawer-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}
.drawer-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>
