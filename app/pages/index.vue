<script setup lang="ts">
import type { SongsList } from '~/types/song'

const { data: songs } = await useFetch<SongsList[]>('/api/list/songs')
</script>

<template>
  <div class="w-full">
    <!-- 輪播區塊 -->
    <IndexTopCarousel :songs="songs ?? []" />

    <div
      class="mx-auto my-4 w-full space-y-8 px-4 md:my-8 md:max-w-[1280px] md:px-8"
    >
      <!-- 搜尋input框 -->
      <div class="flex h-[50px] w-full items-center gap-2 rounded-full">
        <!-- 放大鏡 icon -->
        <i class="fa-solid fa-magnifying-glass text-lg text-[#F9595F]"></i>

        <!-- input -->
        <input
          type="text"
          placeholder="Search..."
          class="text-md h-full w-full rounded-xl border-4 border-[#FFE5E5] bg-white px-4 text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      <!-- 歌曲清單(語種Tab) -->
      <IndexSongsList :songs="songs ?? []" />
    </div>
  </div>
</template>
