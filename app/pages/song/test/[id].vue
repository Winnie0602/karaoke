<script setup lang="ts">
import SelectLyrics from '~/components/test/SelectLyrics.vue'
import SelectTestType from '~/components/test/SelectTestType.vue'
import type { SongData } from '~/types/song'

definePageMeta({
  layout: 'test',
})

const route = useRoute()

const videoId = computed(() => route.params.id as string)

// 該歌詞
const { data: currentSong, pending } = await useFetch<SongData | null>(
  `/api/song/${videoId.value}`,
)

// 想要考試的index
const selectedLyrics = reactive({
  start: -1,
  end: -1,
})

// 目前在第幾步驟
const step = ref<1 | 2 | 3 | 4>(1)

const nextStep = () => {
  if (step.value < 4) step.value++
}

const prevStep = () => {
  if (step.value > 1) step.value--
}

const canNext = computed(() => {
  if (step.value === 1)
    return selectedLyrics.start !== -1 && selectedLyrics.end !== -1
  if (step.value === 2) return true
  // if (step.value === 3) return questionType !== null
  return true
})

// watch(
//   () => [selectedLyrics.start, selectedLyrics.end],
//   ([start, end]) => {
//     if (start === -1 && end === -1) {
//       step.value = 1
//     }
//   },
// )

// watch(step, (step) => {
//   if (step === 1) {
//     selectedLyrics.end = -1
//   }
// })
</script>

<template>
  <div>
    <div class="mb-5">
      <TestStepProgress :step="step" />
    </div>
    <!-- 第一步驟 選取歌詞 -->
    <SelectLyrics
      v-if="currentSong && step === 1"
      :current-song="currentSong"
      :selected="selectedLyrics"
      @update="
        (payload: { start: number; end: number }) => {
          selectedLyrics.start = payload.start
          selectedLyrics.end = payload.end
        }
      "
    />
    <!-- 第二步驟 選取速度／形式 -->
    <SelectTestType
      v-if="currentSong && step === 2"
      :current-song="currentSong"
      :selected="selectedLyrics"
      :step="step"
    />

    <!-- 第三步驟 開始考試 -->

    <!-- 上／下一步 -->
    <TestControlProgressButton
      :can-prev="step > 1"
      :can-next="canNext"
      :next-label="step === 4 ? '開始考試' : '下一步'"
      @prev="prevStep"
      @next="nextStep"
    />
    <Teleport to="#yt-stage">
      <div id="yt-player" class="aspect-video w-full" />
    </Teleport>
  </div>
</template>
