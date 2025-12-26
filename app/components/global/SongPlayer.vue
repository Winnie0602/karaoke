<script setup lang="ts">
import { formatTime, calcProgress } from '~/utils/time'

const route = useRoute()
const store = usePlayerStore()

// 只有 song/[id] 頁顯示影片
const showVideo = computed(() => route.path.startsWith('/song/'))

const { createPlayer, play, pause, seekTo } = useYoutubePlayer(
  toRef(store, 'videoId'),
)

watch(
  () => store.videoId,
  (id) => {
    if (!id) return
    createPlayer('player')
  },
  { immediate: true },
)

watch(
  () => store.seekToTime,
  (time) => {
    if (time == null) return
    seekTo(time)
    store.seekToTime = null // consume
  },
)

onMounted(() => {
  createPlayer('player')
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <!--  影片（只有需要時才顯示） -->
    <ClientOnly>
      <div :class="{ hidden: !showVideo }">
        <div id="player" class="aspect-video w-full bg-black" />
      </div>
    </ClientOnly>

    <!-- 中間頁面內容 -->
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
            <ClientOnly>
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
            </ClientOnly>
          </div>

          <span class="mr-2 text-xs">{{ formatTime(store.duration) }}</span>

          <!-- 右側 icon -->
          <div class="flex items-center space-x-4">
            <!-- 🔊 音量 -->
            <div class="group relative">
              <i
                class="fa-solid fa-volume-low cursor-pointer text-xl text-[#F9595F] transition-transform duration-150 hover:rotate-[10deg] hover:scale-125"
              ></i>

              <!-- 音量調整 UI -->
              <div
                class="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
              >
                <div
                  class="flex h-[120px] w-[40px] items-center justify-center rounded-xl bg-white shadow-lg"
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="60"
                    class="volume-bar"
                    style="
                      --volume: 60%;
                      --active: #f9595f;
                      --inactive: #ffe5e5;
                    "
                  />
                </div>
              </div>
            </div>

            <!-- ⚡ 播放速度 -->
            <div class="group relative">
              <i
                class="fa-solid fa-gauge cursor-pointer text-xl text-[#F9595F] transition-transform duration-150 hover:rotate-[-10deg] hover:scale-125"
              ></i>

              <!-- 速度選單（置中） -->
              <div
                class="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
              >
                <div
                  class="w-[88px] overflow-hidden rounded-xl bg-white text-sm shadow-lg"
                >
                  <div
                    v-for="speed in [
                      '0.5x',
                      '0.75x',
                      '1x',
                      '1.25x',
                      '1.5x',
                      '2x',
                    ]"
                    :key="speed"
                    class="cursor-pointer px-3 py-2 text-center text-[#A66B6B] transition hover:bg-[#FFE5E5] hover:text-[#F9595F]"
                  >
                    {{ speed }}
                  </div>
                </div>
              </div>
            </div>
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

.volume-bar {
  appearance: none;
  writing-mode: vertical-rl;
  direction: rtl;

  width: 6px;
  height: 90px;
  border-radius: 9999px;
  cursor: pointer;

  background: linear-gradient(
    to top,
    var(--active) 0%,
    var(--active) var(--volume),
    var(--inactive) var(--volume),
    var(--inactive) 100%
  );
}

/* 軌道 */
.volume-bar::-webkit-slider-runnable-track {
  width: 6px;
  background: transparent;
}

/* 圓形拖曳點 */
.volume-bar::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  background: #fff;
  border: 3px solid var(--active);
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(249, 89, 95, 0.4);
  margin-right: -4px;
}
</style>
