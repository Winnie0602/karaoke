<script setup lang="ts">
import type { SongsList } from '~/types/song'

const { data: songs } = await useFetch<SongsList[]>('/api/list/songs')

// v-model
const searchQuery = ref('')

// 建立過濾後的歌曲清單
const filteredSongs = computed(() => {
  const allSongs = songs.value ?? []
  if (!searchQuery.value.trim()) return allSongs

  const query = searchQuery.value.toLowerCase().trim()

  return allSongs.filter((song) => {
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    )
  })
})
</script>

<template>
  <div class="w-full">
    <IndexTopCarousel :songs="songs ?? []" />

    <div
      class="mx-auto my-4 w-full space-y-8 px-4 md:my-8 md:max-w-[1280px] md:px-8"
    >
      <div class="flex h-[50px] w-full items-center gap-3 rounded-full">
        <i class="fa-solid fa-magnifying-glass text-lg text-[#F9595F]"></i>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search ..."
          class="text-md h-full w-full rounded-xl border-4 border-[#FFE5E5] bg-white px-4 text-gray-700 transition-colors outline-none placeholder:text-gray-400 focus:border-[#F9595F]/30"
        />

        <button
          v-if="searchQuery"
          class="text-gray-400 hover:text-[#F9595F]"
          @click="searchQuery = ''"
        >
          <i class="fa-solid fa-circle-xmark"></i>
        </button>
      </div>

      <IndexSongsList :songs="filteredSongs" />

      <div
        v-if="filteredSongs.length === 0"
        class="py-10 text-center text-gray-400"
      >
        找不到與「{{ searchQuery }}」相關的歌曲
      </div>
    </div>
  </div>
</template>
