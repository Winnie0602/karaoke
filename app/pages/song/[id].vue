<script setup lang="ts">
import type { SongData, SongsList } from '~/types/song'

const route = useRoute()

const store = usePlayerStore()

const videoId = computed(() => route.params.id as string)

// 該歌詞
const { data: song, pending } = await useFetch<SongData | null>(
  `/api/song/${videoId.value}`,
)

// 該歌曲資訊
const { data: songListInfo } = await useFetch<SongsList>(
  '/api/list/songs',
  {
    query: { id: videoId.value },
  },
)

watch(
  () => route.params.id,
  (id) => {
    if (typeof id !== 'string') return

    store.loadVideo(id, store.currentTime)

    if (songListInfo.value) {
      store.setSongInfo(songListInfo.value?.title, songListInfo.value.artist)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="my-8 flex w-full flex-col space-y-8 px-8 md:max-w-[1280px] lg:flex-row lg:space-x-10 lg:space-y-0 lg:px-5 xl:px-0"
  >
    <!-- 左邊區塊 -->
    <div class="w-full lg:w-2/3">
      <div v-if="pending">Loading…</div>

      <div v-else-if="!song || song.lyrics.length === 0">目前沒有歌詞</div>

      <div v-else class="space-y-5">
        <ClientOnly>
          <SongLyrics
            :lyrics="song.lyrics"
            :song-data="{ title: song.title, artist: song.artist }"
          />
        </ClientOnly>
      </div>
    </div>
    <!-- 右邊區塊 -->
    <div class="w-full lg:w-1/3 lg:min-w-[402px]">
      <div
        class="mb-4 border-b-4 border-[#A66B6B] text-2xl font-medium text-[#A66B6B]"
      >
        あなたにおすすめ
      </div>

      <div class="space-y-2">
        <VideoCard v-for="i in 8" :key="i" />
      </div>
    </div>
  </div>
</template>
