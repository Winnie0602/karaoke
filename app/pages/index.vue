<script setup lang="ts">
import type { LangCode } from '~/types/lang'
const { fullPath } = useRoute()

const songsPage = ref(1)

const songListLang = ref<LangCode | 'all'>('en')

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
      <IndexGrammerList />

      <!-- Reading -->
      <IndexReadingList />
    </div>
  </div>
</template>
