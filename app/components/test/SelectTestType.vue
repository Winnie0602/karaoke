<script setup lang="ts">
import type { SongData } from '~/types/song'

const { currentSong, isPlaying, selected } = defineProps<{
  currentSong: SongData
  isPlaying: boolean
  selected: {
    start: number
    end: number
  }
}>()

const emit = defineEmits<{
  (e: 'setSpeed', value: number): void
  (e: 'setPlaying', value: boolean): void
  (e: 'setQuizeType', value: 'partial' | 'allBlank'): void
}>()

const currentSpeed = ref(1)

// 控制底下題型預覽的動畫特效
const animationOn = ref(false)

const quizTypes = ['partial', 'allBlank'] as const

const selectedQuizType = ref<'partial' | 'allBlank'>('partial')

// 速度設定
const speedSteps = [0.5, 0.75, 1, 1.25, 1.5]

const handleSliderChange = (e: Event) => {
  const value = Number((e.target as HTMLInputElement).value)

  currentSpeed.value = value
  emit('setSpeed', value)
}

// 題型更換時開啟特效
watch(selectedQuizType, () => {
  emit('setQuizeType', selectedQuizType.value)

  animationOn.value = true

  setTimeout(() => (animationOn.value = false), 300)
})
</script>

<template>
  <div class="overflow-y-auto">
    <div class="px-5 py-6 md:px-20 md:py-10">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div class="space-y-5 lg:col-span-5">
          <div
            class="overflow-hidden rounded-2xl border-2 border-[#FFE5E5] bg-[#FFF9F9] p-1.5 shadow-sm"
          >
            <img
              :src="`https://img.youtube.com/vi/${currentSong.id}/mqdefault.jpg`"
              class="aspect-video w-full rounded-xl object-cover shadow-inner"
            />
            <div class="flex justify-between p-3">
              <div>
                <h2 class="line-clamp-1 text-lg font-bold text-[#7A3A3A]">
                  {{ currentSong.title }}
                </h2>
                <p class="text-xs font-medium text-[#A66B6B]">
                  {{ currentSong.artist }}
                </p>
              </div>
              <button
                class="flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 border-pink-200 bg-white shadow-md"
                @click="emit('setPlaying', !isPlaying)"
              >
                <i
                  class="fa-solid text-lg text-[#F9595F]"
                  :class="isPlaying ? 'fa-pause' : 'fa-play'"
                ></i>
              </button>
            </div>
          </div>

          <div
            class="rounded-2xl border border-dashed border-[#F9595F]/30 bg-[#FFE5E5]/20 p-4"
          >
            <span
              class="text-[10px] font-black tracking-widest text-[#F9595F] uppercase"
            >
              Selected Range
            </span>
            <p class="mt-1 text-xs leading-relaxed text-[#A66B6B]">
              已選取第
              <span class="font-bold text-[#F9595F]">
                {{ selected.start + 1 }}
              </span>
              至
              <span class="font-bold text-[#F9595F]">
                {{ selected.end + 1 }}
              </span>
              句歌詞
            </p>
          </div>
        </div>

        <div class="space-y-10 lg:col-span-7 lg:pt-2">
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-1.5 rounded-full bg-[#F9595F]"></div>
                <span class="text-sm font-bold text-[#7A3A3A]">播放速度</span>
              </div>
              <span
                class="text-2xl font-black tracking-tighter text-[#F9595F] italic"
              >
                {{ currentSpeed.toFixed(2) }}
                <span class="ml-0.5 text-xs text-[#A66B6B] not-italic">x</span>
              </span>
            </div>
            <div class="px-1">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.25"
                :value="currentSpeed"
                class="custom-slider w-full"
                :style="{
                  '--progress': `${((currentSpeed - 0.5) / 1.0) * 100}%`,
                  'background-image': `linear-gradient(to right, #F9595F 0%, #F9595F ${((currentSpeed - 0.5) / 1.0) * 100}%, #FFE5E5 ${((currentSpeed - 0.5) / 1.0) * 100}%, #FFE5E5 100%)`,
                }"
                @input="handleSliderChange"
              />
              <div
                class="mt-4 flex justify-between px-1 text-[10px] font-black text-[#E4BABA]"
              >
                <span
                  v-for="s in speedSteps"
                  :key="s"
                  class="transition-colors duration-200"
                  :class="{
                    'scale-110 text-[#F9595F]': currentSpeed === s,
                  }"
                >
                  {{ s === 1 ? '1.0' : s }}
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <div class="h-1.5 w-1.5 rounded-full bg-[#F9595F]"></div>
              <span class="text-sm font-bold text-[#7A3A3A]">題目型態</span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="t in quizTypes"
                :key="t"
                class="rounded-xl border-2 py-2.5 text-[13px] font-bold transition-all active:scale-95 md:py-3.5"
                :class="
                  selectedQuizType === t
                    ? 'border-[#F9595F] bg-white text-[#F9595F] shadow-[0_3px_0_0_#F9595F15]'
                    : 'border-transparent bg-[#FFE5E5]/40 text-[#A66B6B]'
                "
                @click="selectedQuizType = t"
              >
                {{ t }}
              </button>
            </div>
            <!-- 預覽題型 -->
            <div
              class="origin-top overflow-hidden rounded-2xl border border-dashed border-[#F9595F]/30 bg-[#FFE5E5]/20 p-4 transition-all duration-500 ease-out"
              :class="animationOn ? 'animate-expand' : ''"
            >
              <span
                class="mb-10 text-[12px] font-black tracking-widest text-[#F9595F] uppercase"
              >
                {{ selectedQuizType }}
              </span>
              <div
                class="mb-3 flex items-center text-[14px] font-bold text-[#A66B6B] md:mb-6"
              >
                <span class="mr-2">重新聆聽機會</span>
                <div class="flex items-end space-x-1.5">
                  <i
                    v-for="i in 3"
                    :key="i"
                    class="fa-solid fa-apple-whole text-lg text-[#F9595F] drop-shadow-[0_2px_4px_rgba(249,89,95,0.2)] transition-all duration-300 md:text-2xl"
                  />
                  <span class="ml-4">X3</span>
                </div>
              </div>
              <div
                v-show="selectedQuizType === 'allBlank'"
                class="flex items-center space-x-3 md:space-x-5"
              >
                <div
                  v-for="(_, i) in 10"
                  :key="i"
                  class="flex flex-col items-center"
                >
                  <div
                    class="flex h-7 w-5 items-center justify-center text-xl font-black transition-all duration-200 md:h-11 md:w-8 md:text-4xl"
                    :class="{
                      'rounded-md bg-[#FFF9F9] text-[#F9595F] shadow-inner ring-2 ring-[#F9595F]/20 md:ring-4':
                        i === 0,
                    }"
                  ></div>

                  <div
                    class="mt-1 h-1 w-full rounded-full bg-[#FFE5E5] transition-all duration-500 md:h-2"
                  />
                </div>
              </div>
              <div
                v-show="selectedQuizType === 'partial'"
                class="flex items-center space-x-3 md:space-x-5"
              >
                <div
                  v-for="(_, i) in 10"
                  :key="i"
                  class="flex flex-col items-center"
                >
                  <div
                    class="flex h-7 w-5 items-center justify-center text-xl font-black text-[#A66B6B] transition-all duration-200 md:h-11 md:w-8 md:text-4xl"
                    :class="{
                      'rounded-md bg-[#FFF9F9] text-[#F9595F] shadow-inner ring-2 ring-[#F9595F]/20 md:ring-4':
                        i === 0,
                    }"
                  >
                    {{ i === 4 ? 'A' : '' }}
                    {{ i === 7 ? 'B' : '' }}
                  </div>

                  <div
                    class="mt-1 h-1 w-full rounded-full bg-[#FFE5E5] transition-all duration-500 md:h-2"
                  />
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
.hide-scroll::-webkit-scrollbar {
  display: none;
}
.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.custom-slider {
  appearance: none;
  height: 8px;
  border-radius: 9999px;
  cursor: pointer;
  outline: none;
}

.custom-slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  background: #fff;
  border: 4px solid #f9595f;
  border-radius: 50%;
  box-shadow: 0 3px 8px rgba(249, 89, 95, 0.3);
  transition: transform 0.1s ease;
}

.custom-slider::-webkit-slider-thumb:active {
  transform: scale(0.9);
}

@keyframes expandBlock {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  60% {
    transform: scaleY(1.05);
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
  }
}

.animate-expand {
  animation: expandBlock 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}
</style>
