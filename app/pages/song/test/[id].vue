<script setup lang="ts">
import SelectLyrics from '~/components/test/SelectLyrics.vue'
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
  if (step.value === 1) return selectedLyrics.start !== -1
  if (step.value === 2) return selectedLyrics.end !== -1
  // if (step.value === 3) return questionType !== null
  return true
})
</script>

<template>
  <div>
    <div class="mb-5">
      <TestStepProgress :step="step" />
    </div>
    <!-- 第一&二步驟 選取歌詞 -->
    <SelectLyrics
      v-if="currentSong"
      :current-song="currentSong"
      :selected="selectedLyrics"
      :step="step"
      @update="
        (payload: { start: number; end: number }) => {
          selectedLyrics.start = payload.start
          selectedLyrics.end = payload.end
        }
      "
    />
    <TestControlProgressButton
      :can-prev="step > 1"
      :can-next="canNext"
      :next-label="step === 4 ? '開始考試' : '下一步'"
      @prev="prevStep"
      @next="nextStep"
    />
  </div>
</template>
