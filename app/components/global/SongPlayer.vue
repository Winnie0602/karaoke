<script setup lang="ts">
import { formatTime, calcProgress } from '~/utils/time'

const route = useRoute()
const store = usePlayerStore()

const seekingTime = ref(0)

// 只有 song/[id] 頁顯示影片
const showVideo = computed(
  () => store.storeMode === 'normal' && route.path.startsWith('/song/'),
)

const showPlayer = computed(() => store.storeMode === 'normal')

const { createPlayer, play, pause, seekTo } = useYoutubePlayer(
  toRef(store, 'videoId'),
)

const onSeekInput = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  seekingTime.value = value
  store.isSeeking = true
}

const onSeekCommit = async (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)
  seekTo(value)
}

const setRate = (speed: number) => {
  store.setPlaybackRate(speed)
}

watch(
  () => store.videoId,
  (id) => {
    if (!id) return
    createPlayer('player')
  },
  { immediate: true },
)

onMounted(() => {
  createPlayer('player')
})
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <!--  影片（只有需要時才顯示） -->
    <ClientOnly>
      <div :class="{ hidden: !showVideo }">
        <div id="player" class="aspect-video w-full bg-black" />
      </div>
    </ClientOnly>

    <!-- 中間頁面內容 -->
    <main class="relative flex-1 overflow-y-auto bg-[#FFF9F9]">
      <slot />
    </main>

    <!-- 底部播放器 -->
    <div
      class="fixed bottom-0 h-[75px] w-full bg-[#ffe5e5] px-2"
      :class="{ hidden: !showPlayer }"
    >
      <div class="flex h-full w-full items-center justify-center py-2">
        <div
          class="flex h-full w-full max-w-[1024px] items-center justify-between rounded-xl bg-gradient-to-b from-white to-[#fff0f0] px-2 shadow-lg md:px-3"
        >
          <!-- 播放鍵 -->
          <button
            class="flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-pink-200 bg-white shadow-md transition-transform duration-150 hover:scale-110 active:scale-95 md:h-12 md:w-12"
            @click="store.isPlaying ? pause() : play()"
          >
            <i
              class="fa-solid text-[#F9595F] md:text-lg"
              :class="store.isPlaying ? 'fa-pause' : 'fa-play'"
            ></i>
          </button>
          <span class="ml-2 text-xs">{{ formatTime(store.currentTime) }}</span>
          <div class="relative mx-3 w-[calc(100%-150px)] md:mx-4">
            <span class="absolute bottom-5 line-clamp-1 text-xs text-[#A66B6B]">
              {{ `${store.songArtist} - ${store.songTitle}` }}
            </span>
            <!-- 進度條 -->
            <ClientOnly>
              <input
                type="range"
                min="0"
                :max="store.duration"
                :value="store.isSeeking ? seekingTime : store.currentTime"
                class="time-bar w-full cursor-pointer appearance-none rounded-full"
                :style="{
                  '--progress': `${calcProgress(
                    store.isSeeking ? seekingTime : store.currentTime,
                    store.duration,
                  )}%`,
                }"
                @input="onSeekInput"
                @change="onSeekCommit"
              />
            </ClientOnly>
          </div>

          <span class="mr-2 text-xs">{{ formatTime(store.duration) }}</span>

          <!-- 右側 icon -->
          <div class="flex items-center space-x-2 md:space-x-4">
            <!-- 音量 -->
            <div class="group relative flex items-center">
              <!-- 固定寬度 icon 區（避免擠版） -->
              <div
                class="hidden h-6 w-6 items-center justify-center md:flex"
                @click="store.toggleMute"
              >
                <i
                  :class="[
                    'fa-solid cursor-pointer text-xl text-[#F9595F] transition-transform duration-150',
                    store.isMuted ? 'fa-volume-xmark' : 'fa-volume-low',
                  ]"
                />
              </div>

              <!-- 透明區塊 -->
              <div
                class="absolute bottom-6 left-1/2 h-6 w-10 -translate-x-1/2"
              ></div>

              <!-- 音量調整 UI -->
              <div
                class="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
              >
                <div
                  class="flex h-[120px] w-[40px] items-center justify-center rounded-xl bg-[#f9595f] bg-white shadow-lg"
                >
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="store.volume"
                    class="volume-bar"
                    :style="{
                      '--volume': `${store.volume}%`,
                      '--active': '#f9595f',
                      '--inactive': '#ffe5e5',
                    }"
                    @input="
                      store.setVolume(
                        Number(($event.target as HTMLInputElement).value),
                      )
                    "
                  />
                </div>
              </div>
            </div>

            <!-- 播放速度 -->
            <div class="group relative">
              <i
                class="fa-solid fa-gauge cursor-pointer text-xl text-[#F9595F] transition-transform duration-150 hover:scale-125 hover:rotate-[-10deg]"
              ></i>

              <!-- 透明區塊 -->
              <div
                class="absolute bottom-6 left-1/2 h-6 w-10 -translate-x-1/2"
              ></div>

              <!-- 速度選單 -->
              <div
                class="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
              >
                <div
                  class="w-[88px] overflow-hidden rounded-xl bg-white text-sm shadow-lg"
                >
                  <div
                    v-for="speed in store.availableRates"
                    :key="speed"
                    class="cursor-pointer px-3 py-2 text-center text-[#A66B6B] transition hover:bg-[#FFE5E5] hover:text-[#F9595F]"
                    :class="{
                      'bg-[#FFE5E5] text-[#F9595F]':
                        speed === store.playbackRate,
                    }"
                    @click="setRate(speed)"
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
