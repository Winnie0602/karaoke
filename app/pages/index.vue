<script setup lang="ts">
import type { LangCode } from '~/types/lang'
const { fullPath } = useRoute()

const songsPage = ref(1)

const songListLang = ref<LangCode | 'all'>('en')

const videosPage = ref(1)

const videosLang = ref<LangCode | 'all'>('en')

const {
  data: songListData,
  refresh: songListRefresh,
  pending: songListPending,
} = await useFetch('/api/list/songs', {
  query: {
    language: songListLang,
    page: songsPage,
    sort: 'desc',
    limit: 5,
  },
})

const { data: allSongData, pending: allSongPending } = await useFetch(
  '/api/list/songs',
  {
    query: {
      language: 'all',
      sort: 'desc',
    },
  },
)

const {
  data: videosData,
  refresh: videosRefresh,
  pending: videosPending,
} = await useFetch('/api/list/videos', {
  query: {
    language: videosLang,
    page: videosPage,
    sort: 'desc',
    limit: 5,
  },
})

const handler = async (
  component: string,
  payload: { page?: number; lang?: LangCode },
) => {
  if (component === 'songList') {
    if (payload.page !== undefined) {
      songsPage.value = payload.page
    }

    if (payload.lang !== undefined) {
      songListLang.value = payload.lang
      songListRefresh()
    }
  } else if (component === 'videoList') {
    if (payload.page !== undefined) {
      videosPage.value = payload.page
    }

    if (payload.lang !== undefined) {
      videosLang.value = payload.lang
      videosRefresh()
    }
  }
}
</script>

<template>
  <div class="w-full">
    <IndexTopCarousel
      v-if="fullPath === '/' && allSongData?.songs && !allSongPending"
      :songs="allSongData.songs"
    />

    <!-- Song List -->
    <div class="mx-auto my-4 w-full px-4 md:my-8 md:max-w-[1280px] md:px-8">
      <IndexSongsList
        v-if="songListData?.songs"
        :songs="songListData.songs"
        :page="songListData.page"
        :total-pages="songListData.totalPages"
        :total="songListData.total"
        :pending="songListPending"
        @refresh="(payload) => handler('songList', payload)"
      />

      <!-- Grammer -->
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
