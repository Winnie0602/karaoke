<script setup lang="ts">
import type { SongData } from '~/types/song'

const route = useRoute()

const {
  data: song,
  pending,
  error,
} = await useFetch<SongData>(`/api/song/${route.params.id}`)

const currentTime = ref(0)

// const duration = ref(0)

const handleTimeUpdate = (time: number) => {
  currentTime.value = time
}

const youtubeRef = ref<{
  seekTo: (time: number) => void
} | null>(null)

const goToTime = (time: number) => {
  youtubeRef.value?.seekTo(time)
}

</script>

<template>
  <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-10 lg:space-y-0">
    <!-- 左邊區塊 -->
    <div class="w-full lg:w-2/3">
      <div v-if="pending">Loading…</div>
      <div v-else-if="error">Error</div>

      <div v-else-if="song" class="space-y-5">
        <!-- 影片 -->
        <ClientOnly>
          <YoutubePlayer
            ref="youtubeRef"
            :key="song.id"
            :video-id="song.id"
            @timeupdate="(time: number) => handleTimeUpdate(time)"
          />
        </ClientOnly>

        <!-- 歌詞 -->
        <SongLyrics
          :lyrics="song.lyrics"
          :song-data="{ title: song.title, artist: song.artist }"
          :current-time="currentTime"
          @go-to-time="(time: number) => goToTime(time)"
        />
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
