<script setup lang="ts">
import type { SongData, SongsList } from '~/types/song'

const route = useRoute()

const store = usePlayerStore()

const videoId = computed(() => route.params.id as string)

// 該歌詞
const { data: currentSong, pending } = await useFetch<SongData | null>(
  `/api/song/${videoId.value}`,
)

if (!currentSong.value && !pending.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
    message: '找不到這首歌曲，請檢查網址是否正確。',
  })
}
const page = ref(1)

const { data: randomSongs } = await useFetch<{ songs: SongsList[] }>(
  '/api/list/songs',
  {
    query: {
      language: 'all',
      page,
      limit: 8,
    },
  },
)

watch(
  () => route.params.id,
  (id) => {
    if (typeof id !== 'string') return

    store.loadVideo(id, store.currentTime)

    if (currentSong.value) {
      store.setSongInfo(currentSong.value?.title, currentSong.value?.artist)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="mx-auto my-4 w-full px-4 md:my-6 md:max-w-[1280px] lg:px-5 xl:px-0"
  >
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-10">
      <!-- 左邊區塊 -->
      <div class="w-full lg:w-2/3">
        <div v-if="pending">Loading…</div>

        <div v-else-if="!currentSong || currentSong.lyrics.length === 0">
          目前沒有歌詞
        </div>

        <div v-else class="space-y-5">
          <ClientOnly>
            <SongLyrics
              :lyrics="currentSong.lyrics"
              :song-data="{
                title: currentSong.title,
                artist: currentSong.artist,
              }"
            />
          </ClientOnly>
        </div>
      </div>
      <!-- 右邊區塊 -->
      <div class="w-full lg:w-1/3 lg:min-w-[402px]">
        <div
          class="mb-4 border-b-4 border-[#A66B6B] text-xl font-medium text-[#A66B6B] md:text-2xl"
        >
          Recommended Songs
        </div>

        <div v-if="randomSongs?.songs" class="space-y-2">
          <ClientOnly>
            <VideoCard
              v-for="song in randomSongs.songs"
              :key="song.id"
              :song="song"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
    <div class="mt-6 mb-4 flex w-full justify-center md:mt-12 md:mb-8">
      <NuxtLink
        :to="`/song/test/${videoId}`"
        class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F9595F] py-3 font-bold text-white shadow-lg shadow-red-100 transition-all hover:brightness-110 active:scale-[0.98] md:w-[240px] md:py-4"
      >
        <i class="fa-solid fa-pen-to-square mr-2"></i>
        <span class="text-sm tracking-widest md:text-base">Take Exam</span>
      </NuxtLink>
    </div>
  </div>
</template>
