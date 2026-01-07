<script setup lang="ts">
import type { DisplayAPIResult } from '~/types/tatoeba'

const { open, word } = defineProps<{
  open: boolean
  word: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const tatoebaLoading = ref(false)

const tatoebaSentenses = ref<DisplayAPIResult[]>()

watch(
  () => open,
  async () => {
    tatoebaSentenses.value = []
    tatoebaLoading.value = true
    try {
      tatoebaSentenses.value = await $fetch<DisplayAPIResult[]>(
        '/api/tatoeba',
        {
          params: {
            from: 'jpn',
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
  <!-- 半透明遮罩 -->
  <transition name="fade">
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-black/30"
      @click="emit('close')"
    />
  </transition>

  <!-- 底部抽屜 -->
  <transition name="slide-up">
    <div v-if="open" class="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full">
      <div class="bg-[#C63E42]/75 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
        <!-- 把手 -->
        <div class="flex justify-center py-2">
          <div class="h-1.5 w-10 rounded-full bg-gray-300" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pb-3">
          <div class="text-md uppercase tracking-widest text-white/60">
            Example Sentences
          </div>

          <button
            class="text-sm text-gray-400 hover:text-gray-600"
            @click="emit('close')"
          >
            ✕
          </button>
        </div>

        <!-- 內容 -->
        <div
          class="drawer-scroll max-h-[45vh] overflow-y-auto px-6 pb-6 md:max-h-[25vh] md:px-10"
        >
          <div v-if="!tatoebaLoading" class="space-y-2">
            <div
              v-if="tatoebaSentenses?.length === 0"
              class="flex flex-col items-start justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-10 text-center"
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
                class="mt-2 space-y-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10"
              >
                <!-- <div class="text-sm text-white">{{ sentense.text }}</div> -->
                <div
                  class="text-base leading-relaxed text-white md:text-lg"
                  v-html="sentense.html"
                />

                <div class="mt-1 text-xs text-white/70">
                  {{ sentense.translations }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-4 w-full rounded bg-white/10"></div>
              <div class="mt-2 h-3 w-2/3 rounded bg-white/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* 淡入背景 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 抽屜滑出 */
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

/* Chrome / Safari / Edge */
.drawer-scroll::-webkit-scrollbar {
  width: 8px;
}

.drawer-scroll::-webkit-scrollbar-track {
  background: transparent; /* 重點 */
}

.drawer-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(120, 113, 108, 0.6); /* stone-ish */
  border-radius: 9999px;
}

.drawer-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(168, 162, 158, 0.85);
}

/* Firefox */
.drawer-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 113, 108, 0.6) transparent;
}
</style>
