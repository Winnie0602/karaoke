<script setup lang="ts">
import type { LyricData } from '~/types/song'
import type { LangCode } from '~/types/lang'
const { show } = useToast()


const emit = defineEmits(['goBack'])

const { videoId, lyrics, language } = defineProps<{
  videoId: string
  lyrics: LyricData[]
  language: LangCode
}>()


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



const saveLyricsTime = async () => {
  if (lyricsTimeArr.value.length === 0) {
    show('沒有要更新的資料', 2000)

    return
  }

  await $fetch('/api/song/update-time', {
    method: 'POST',
    body: {
      videoId: videoId,
      lyrics: lyricsTimeArr.value,
    },
  })

  show('更新完成', 2000)

  emit('goBack')
}



</script>

<template>
  <div class="flex flex-col items-center space-y-4 md:space-y-6">
    <!-- 新增單字input -->
    <input
      type="text"
      class="w-[360px] rounded-xl bg-[#FFF9F9] px-4 py-2.5 text-sm text-gray-700 ring-2 ring-red-300/30 outline-none focus:ring-red-400 md:py-3 md:text-base"
      placeholder="按下 Enter 新增單字"
    />

    <!-- 單字顯示Tags -->
    <div class="flex flex-wrap gap-3">
      <button
        v-for="word in ['実は', '言って', 'cheap', 'crazy', 'blind', '盲目的']"
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
    <div
      class="hide-scroll h-[450px] w-full max-w-[1280px] overflow-y-scroll rounded-2xl border border-[#FFE5E5] bg-[#FFE5E5] shadow-inner md:h-[600px]"
    >
      <div class="flex flex-col items-center">
        <div
          v-for="(lyric, index) in lyrics"
          :key="lyric.nanoid"
          class="flex w-full items-center justify-center gap-3 rounded-xl px-2 py-5 md:gap-6 md:px-0"
        >
          <div class="max-w-[450px] flex-1 text-center transition-colors">
            <div
              class="pb-3 text-sm font-black text-[#7A3A3A] transition-all md:text-xl"
            >
              {{ lyric[language] }}
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
</style>
