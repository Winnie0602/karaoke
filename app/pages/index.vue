<script setup lang="ts">
import Pagination from '~/components/global/Pagination.vue'

const { fullPath } = useRoute()

const { data, refresh } = await useFetch('/api/list/songs', {
  query: {
    language: 'all',
  },
})

// v-model
const searchQuery = ref('')

// 建立過濾後的歌曲清單
const filteredSongs = computed(() => {
  const allSongs = data.value?.songs ?? []
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
    <IndexTopCarousel v-if="fullPath === '/'" :songs="data?.songs ?? []" />

    <div
      class="mx-auto my-4 w-full space-y-5 px-4 md:my-8 md:max-w-[1280px] md:space-y-8 md:px-8"
    >
      <div
        class="flex h-[35px] w-full items-center gap-3 rounded-full md:h-[50px]"
      >
        <i class="fa-solid fa-magnifying-glass text-lg text-[#F9595F]"></i>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search ..."
          class="md:text-md h-full w-full rounded-xl border-4 border-[#FFE5E5] bg-white px-4 text-sm text-gray-700 transition-colors outline-none placeholder:text-gray-400 focus:border-[#F9595F]/30"
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

      <Pagination
        :total="50"
        :page="2"
        :total-pages="10"
        class="flex w-full justify-center"
      />
    </div>
  </div>
</template>
