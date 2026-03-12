<script setup lang="ts">
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'

const props = defineProps<{
  videoId: string
  lyrics: LyricData[]
  language: LangCode
}>()

const { createPlayer, destroy, currentTime } = useYoutubePlayerLocal(
  props.videoId,
)

const lyricsTimeArr = ref<{ nanoid: string; start?: number; end?: number }[]>(
  [],
)

const setTime = (nanoid: string, type: 'start' | 'end') => {
  const time = parseFloat(currentTime.value.toFixed(2))

  const line = lyricsTimeArr.value.find((l) => l.nanoid === nanoid)

  // 已有歌詞，更新該歌詞的開始or結束
  if (line) {
    line[type] = time
  } else {
    // 沒該歌詞，新增該歌詞的開始or結束
    lyricsTimeArr.value.push({
      nanoid,
      [type]: time,
    })
  }
}

const getLyricTime = (nanoid: string, type: 'start' | 'end') => {
  const line = lyricsTimeArr.value.find((l) => l.nanoid === nanoid)
  return line?.[type] ?? null
}

const saveLyricsTime = async () => {
  console.log(lyricsTimeArr.value)
  // 全部歌詞都要填時間才能送出
  // if (lyricsTimeArr.value.length !== props.lyrics.length) {
  //   return
  // }

  // // 歌詞如果只有start或end
  // const isCompleted = lyricsTimeArr.value.every(
  //   (lyric) => lyric.start !== undefined && lyric.end !== undefined,
  // )

  await $fetch('/api/song/update-time', {
    method: 'POST',
    body: {
      videoId: props.videoId,
      lyrics: lyricsTimeArr.value,
    },
  })
}

onMounted(() => {
  createPlayer('admin-player')
})

onBeforeUnmount(() => {
  destroy()
})
</script>

<template>
  <div class="flex flex-col items-center space-y-4 md:space-y-6">
    <div class="sticky top-5 z-10 w-full max-w-[640px]">
      <ClientOnly>
        <div
          id="admin-player"
          class="aspect-video h-[160px] w-full rounded-2xl border-4 border-[#FFE5E5] shadow-sm md:h-[280px]"
        ></div>
      </ClientOnly>

      <div class="mt-2 flex w-full justify-center">
        <div
          class="inline rounded-full bg-red-300 px-4 py-2 text-sm font-black shadow-md md:text-base"
        >
          <i class="fa-solid fa-stopwatch mr-2"></i>
          {{ currentTime.toFixed(2) }}s
        </div>
      </div>
    </div>

    <div class="w-full max-w-3xl pb-10 md:pb-20">
      <div class="flex flex-col items-center">
        <div
          v-for="lyric in lyrics"
          :key="lyric.nanoid"
          class="group flex w-full items-center justify-center gap-3 rounded-md py-3 md:gap-6"
          :class="{
            'bg-gray-100': lyricsTimeArr.find((e) => e.nanoid === lyric.nanoid),
          }"
        >
          <button
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E5] text-sm text-[#F9595F] transition-all hover:bg-[#F9595F] hover:text-white active:scale-90"
            @click="setTime(lyric.nanoid, 'start')"
          >
            開始
          </button>

          <button
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE5E5] text-sm text-[#A66B6B] transition-all hover:bg-[#7A3A3A] hover:text-white active:scale-90"
            @click="setTime(lyric.nanoid, 'end')"
          >
            結束
          </button>

          <div class="max-w-[450px] flex-1 text-center">
            <div
              class="mb-1 text-sm font-bold tracking-widest text-[#A66B6B] uppercase opacity-70"
            >
              {{ lyric.start || getLyricTime(lyric.nanoid, 'start') || '' }}
              -
              {{ lyric.end || getLyricTime(lyric.nanoid, 'end') || '' }}
            </div>
            <div
              class="border-b-2 border-[#FFE5E5] pb-3 text-sm font-black text-[#7A3A3A] md:text-xl"
            >
              {{ lyric[language] }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <button
          class="mt-8 flex w-full max-w-[240px] items-center justify-center gap-2 rounded-2xl bg-[#F9595F]/90 py-4 text-white shadow-lg shadow-red-100 transition-all hover:brightness-110 active:scale-[0.98]"
          @click="saveLyricsTime()"
        >
          <i class="fa-solid fa-cloud-arrow-up"></i>
          儲存
        </button>
      </div>
    </div>
  </div>
</template>
