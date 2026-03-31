<script setup lang="ts">
import type { LangCode } from '~/types/lang'

const songsPage = ref(1)

const songListLang = ref<LangCode | 'all'>('en')

const videosPage = ref(1)

const videosLang = ref<LangCode | 'all'>('en')

const { data: songListData, pending: songListPending } = await useFetch(
  '/api/list/songs',
  {
    query: {
      language: songListLang,
      page: songsPage,
      sort: 'desc',
      limit: 6,
    },
  },
)

// 輪播資料用
const { data: allSongData, pending: allSongPending } = await useFetch(
  '/api/list/songs',
  {
    query: {
      language: 'all',
      sort: 'desc',
    },
  },
)

const { data: videosData, pending: videosPending } = await useFetch(
  '/api/list/videos',
  {
    query: {
      language: videosLang,
      page: videosPage,
      sort: 'desc',
      limit: 5,
    },
  },
)

const handler = (
  component: 'songList' | 'videoList',
  payload: { page?: number; lang?: LangCode },
) => {
  const componentMap = {
    songList: {
      page: songsPage,
      lang: songListLang,
    },
    videoList: {
      page: videosPage,
      lang: videosLang,
    },
  }

  const target = componentMap[component]

  if (payload.page !== undefined) {
    target.page.value = payload.page
  }

  if (payload.lang !== undefined) {
    target.lang.value = payload.lang
  }
}
</script>

<template>
  <div class="w-full">
    <IndexTopCarousel
      v-if="allSongData?.songs && !allSongPending"
      :songs="allSongData.songs"
    />

    <div class="mx-auto my-4 w-full px-4 md:my-8 md:max-w-[1280px] md:px-8">
      <!-- Song List -->
      <IndexSongsList
        v-if="songListData?.songs"
        :songs="songListData.songs"
        :page="songListData.page"
        :total-pages="songListData.totalPages"
        :total="songListData.total"
        :pending="songListPending"
        @refresh="(payload) => handler('songList', payload)"
      />

      <!-- Videos -->
      <IndexVideosList
        v-if="videosData?.videos"
        :videos="videosData?.videos"
        :page="videosData.page"
        :total-pages="videosData.totalPages"
        :total="videosData.total"
        :pending="videosPending"
        @refresh="(payload) => handler('videoList', payload)"
      />

      <!-- Reading -->
      <IndexReadingList />
    </div>
  </div>
</template>
