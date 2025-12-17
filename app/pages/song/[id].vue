<script setup lang="ts">
import type { SongData } from '~/types/song'

const route = useRoute()

const {
  data: song,
  pending,
  error,
} = await useFetch<SongData>(`/api/song/${route.params.id}`)
</script>

<template>
  <div class="flex flex-col md:flex-row md:space-x-10">
    <!-- 左邊區塊 -->
    <div class="w-full md:w-2/3">
      <div v-if="pending">Loading…</div>
      <div v-else-if="error">Error</div>

      <div v-else-if="song" class="space-y-5">
        <!-- 影片 -->
        <ClientOnly>
          <YoutubePlayer :video-id="song.id" />
        </ClientOnly>

        <!-- 歌詞 -->
        <SongLyrics :lyrics="song.lyrics" />
      </div>
    </div>
    <!-- 右邊區塊 -->
    <div class="w-full border-[1px] border-black md:w-1/3"></div>
  </div>
</template>
