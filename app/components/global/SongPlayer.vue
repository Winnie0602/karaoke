<script setup lang="ts">
import { formatTime, calcProgress } from '~/utils/time'

const route = useRoute()
const store = usePlayerStore()

// 只有 song/[id] 頁顯示影片
const showVideo = computed(() => route.name === 'song-id')

const { createPlayer, play, pause } = useYoutubePlayer(toRef(store, 'videoId'))

watch(
  () => store.videoId,
  async (id) => {
    if (!id) return
    await nextTick()
    createPlayer('player')
    console.log(store.videoId)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!--  影片（只有需要時才顯示） -->
    <ClientOnly>
      <div v-if="showVideo" id="player" class="aspect-video w-full bg-black" />
    </ClientOnly>

    <!-- 📄 中間頁面內容 -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- 🎵 底部播放器（永遠存在） -->
    <div class="fixed bottom-0 h-[75px] w-full bg-[#ffe5e5]">
      <div class="flex h-full w-full items-center justify-center py-2">
        <div
          class="flex h-full w-full max-w-[1024px] items-center justify-between rounded-xl bg-gradient-to-b from-white to-[#fff0f0] px-3 shadow-lg"
        >
          <!-- 播放鍵 -->
          <button
            class="flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-pink-200 bg-white shadow-md transition-transform duration-150 hover:scale-110 active:scale-95"
            @click="store.isPlaying ? pause() : play()"
          >
            <i
              v-if="!store.isPlaying"
              class="fa-solid fa-play text-lg text-[#F9595F]"
            ></i>
            <i
              v-if="store.isPlaying"
              class="fa-solid fa-pause text-lg text-[#F9595F]"
            ></i>
          </button>
          <span class="ml-2 text-xs">{{ formatTime(store.currentTime) }}</span>
          <div class="relative mx-4 w-[calc(100%-150px)]">
            <span class="absolute bottom-5 line-clamp-1 text-xs text-[#A66B6B]">
              {{ `${store.songArtist} - ${store.songTitle}` }}
            </span>
            <!-- 進度條 -->
            <input
              type="range"
              min="0"
              :max="store.duration"
              :value="store.currentTime"
              class="time-bar w-full cursor-pointer appearance-none rounded-full"
              :style="{
                '--progress': `${calcProgress(store.currentTime, store.duration)}%`,
              }"
            />
          </div>

          <span class="mr-2 text-xs">{{ formatTime(store.duration) }}</span>

          <!-- 右側 icon -->
          <div class="flex items-center space-x-3">
            <i
              class="fa-solid fa-volume-low text-xl text-[#F9595F] transition-transform duration-150 hover:rotate-[10deg] hover:scale-125"
            ></i>
            <i
              class="fa-solid fa-gauge text-xl text-[#F9595F] transition-transform duration-150 hover:rotate-[-10deg] hover:scale-125"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.time-bar {
  height: 6px;
  background: linear-gradient(
    to right,
    #f9595f 0%,
    #f9595f var(--progress),
    #ffe5e5 var(--progress),
    #ffe5e5 100%
  );
  box-shadow: inset 0 1px 3px rgba(249, 89, 95, 0.15);
  border-radius: 9999px;
}

.time-bar::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
}

.time-bar::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 3px solid #f9595f;
  border-radius: 50%;
  margin-top: -6px;
  box-shadow: 0 3px 6px rgba(249, 89, 95, 0.4);
  transition: transform 0.15s ease;
}

.time-bar::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.time-bar:hover {
  height: 8px;
}
</style>
