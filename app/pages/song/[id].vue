<script setup lang="ts">
import type { SongData, SongsList } from '~/types/song'
import { languageMapCodeLabel } from '~/types/lang'
import type { LangCode } from '~/types/lang'

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

// 要顯示的翻譯語言
const showTranslations = ref<LangCode[]>([])

// 處理要顯示的翻譯語言
const handleTranslations = (lang: LangCode) => {
  if (showTranslations.value.includes(lang)) {
    showTranslations.value = showTranslations.value.filter((l) => l !== lang)
  } else {
    showTranslations.value.push(lang)
  }
}

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

watch(
  currentSong,
  (song) => {
    if (!song) return
    showTranslations.value = song.translation_langs
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

        <div v-else class="space-y-4">
          <ClientOnly>
            <div
              class="flex flex-wrap items-center justify-between gap-2 border-b border-[#FFE5E5] pb-3"
            >
              <div class="flex items-center gap-1.5 text-[#A66B6B]">
                <i class="fa-solid fa-language text-lg text-[#F9595F]"></i>
                <span>歌詞語言</span>
              </div>

              <div class="flex flex-wrap gap-1.5">
                <div
                  class="flex items-center gap-2 rounded-full bg-[#FFE5E5]/50 px-4 py-1.5 text-xs text-[#F9595F] md:text-sm"
                >
                  <i class="fa-solid fa-circle-check text-sm opacity-70"></i>
                  {{ languageMapCodeLabel[currentSong.language] }} (原文)
                </div>

                <button
                  v-for="lang in currentSong.translation_langs"
                  :key="lang"
                  class="rounded-full border-[1px] px-4 py-1.5 text-xs transition-all duration-300 active:scale-95 md:text-sm"
                  :class="[
                    showTranslations.includes(lang)
                      ? 'bg-[#F9595F] text-white shadow-md shadow-[#F9595F]/20'
                      : 'border-[#FFE5E5] bg-white text-[#A66B6B] hover:border-[#F9595F]/30 hover:bg-[#FFF9F9]',
                  ]"
                  @click="handleTranslations(lang)"
                >
                  {{ languageMapCodeLabel[lang] }}
                </button>
              </div>
            </div>

            <div
              class="animate-in fade-in slide-in-from-bottom-2 mt-4 duration-500"
            >
              <SongLyrics
                :lyrics="currentSong.lyrics"
                :song-data="{
                  title: currentSong.title,
                  artist: currentSong.artist,
                }"
                :song-lang="currentSong.language"
                :show-translations="showTranslations"
              />
            </div>
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
